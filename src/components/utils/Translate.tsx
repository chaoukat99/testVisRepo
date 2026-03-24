import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Translate = ({ text, className }: { text: string, className?: string }) => {
    const { language, translateText } = useLanguage();
    const [translated, setTranslated] = useState(text);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (language === 'fr') {
            setTranslated(text);
            return;
        }

        setIsLoading(true);
        translateText(text).then(res => {
            if (isMounted) {
                setTranslated(res);
                setIsLoading(false);
            }
        });

        return () => { isMounted = false; };
    }, [text, language]); // Removed translateText from dependency to avoid loop if instance changes

    // Optional: Add a subtle loading effect or fade
    return <span className={className}>{translated}</span>;
};
