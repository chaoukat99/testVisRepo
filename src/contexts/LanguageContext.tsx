import React, { createContext, useContext, useState, useEffect } from 'react';
import homeTranslations from '@/locales/home.json';

export type Language = 'fr' | 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

interface LanguageProviderProps {
    children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('fr');

    useEffect(() => {
        // Set HTML dir attribute for Arabic
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    // Helper to get nested value from JSON
    const getNestedValue = (obj: any, path: string): string => {
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : null;
        }, obj);
    };

    const t = (path: string): string => {
        try {
            const translationObj = getNestedValue(homeTranslations, path);
            if (translationObj && typeof translationObj === 'object') {
                const values = translationObj as Record<string, string>;
                if (language in values) {
                    return values[language];
                }
            }
            console.warn(`Translation missing for key: ${path} in language: ${language}`);
            return path; // Fallback to key
        } catch (error) {
            console.error(`Error translating path: ${path}`, error);
            return path;
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
