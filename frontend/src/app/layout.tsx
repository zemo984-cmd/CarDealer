import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/ui/Navbar/Navbar";
import Footer from "@/components/ui/Footer/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoMotive - Premium Car Dealership",
  description: "Find your dream car with us.",
};

import { TranslationProvider } from "@/context/TranslationContext";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  let dbUser = null;
  if (session?.user?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
  }

  // Combine session user with db fields
  const user = dbUser ? { ...session?.user, image: dbUser.profileImage, colorBlindMode: dbUser.colorBlindMode } : session?.user;

  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} ${dbUser?.colorBlindMode ? 'color-blind-mode' : ''}`} 
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{var e=localStorage.getItem("theme");if("light"===e){document.documentElement.setAttribute("data-theme","light")}else{document.documentElement.setAttribute("data-theme","dark")}}catch(e){}}();`,
          }}
        />
        <TranslationProvider>
          <ThemeProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar user={user} />
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
