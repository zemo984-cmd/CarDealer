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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{var e=localStorage.getItem("theme");if("light"===e){document.documentElement.setAttribute("data-theme","light")}else{document.documentElement.setAttribute("data-theme","dark")}}catch(e){}}();`,
          }}
        />
        <TranslationProvider>
          <ThemeProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar user={undefined} />
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
