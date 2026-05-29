import { cookies } from 'next/headers';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

const messages: Record<string, any> = { en, ar };

export async function getT() {
    const cookieStore = await cookies();
    const lang = cookieStore.get('lang')?.value || 'en';
    const msgs = messages[lang] || messages['en'];

    return function t(key: string): string {
        const parts = key.split('.');
        let val: any = msgs;
        for (const p of parts) val = val?.[p];
        return typeof val === 'string' ? val : key;
    };
}
