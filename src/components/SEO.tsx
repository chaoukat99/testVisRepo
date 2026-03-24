
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    type?: string;
    name?: string;
}

export function SEO({ title, description, keywords, type = 'website', name = 'OpenIn Partners' }: SEOProps) {
    const { language } = useLanguage();

    const seoData = {
        fr: {
            title: title || "OpenIn Partners | Plateforme de Recrutement IA & Matching de Talents",
            description: description || "Connectez les meilleurs consultants aux entreprises leaders grâce au matching par Intelligence Artificielle. Trouvez votre talent idéal ou votre prochaine mission avec OpenIn.",
            keywords: keywords || "recrutement IA, talent matching, consultant freelance, plateforme RH, OpenIn, innovation RH"
        },
        en: {
            title: title || "OpenIn Partners | AI-Powered HR Recruiting & Talent Matching Platform",
            description: description || "Connect top consultants with leading companies using AI-powered matching. Find your perfect talent or next mission with OpenIn Partners.",
            keywords: keywords || "AI recruiting, talent matching, freelance consultants, HR platform, OpenIn, HR innovation"
        },
        ar: {
            title: title || "OpenIn Partners | منصة التوظيف بالذكاء الاصطناعي ومطابقة المواهب",
            description: description || "تواصل مع أفضل المستشارين والشركات الرائدة من خلال المطابقة المدعومة بالذكاء الاصطناعي. ابحث عن موهبتك المثالية أو مهمتك القادمة مع OpenIn Partners.",
            keywords: keywords || "توظيف بالذكاء الاصطناعي, مطابقة المواهب, مستشارون مستقلون, منصة موارد بشرية, OpenIn, ابتكار الموارد البشرية"
        }
    };

    const currentSEO = seoData[language] || seoData.en;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{currentSEO.title}</title>
            <meta name='description' content={currentSEO.description} />
            <meta name='keywords' content={currentSEO.keywords} />
            <html lang={language} />

            {/* Open Graph Tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={currentSEO.title} />
            <meta property="og:description" content={currentSEO.description} />
            <meta property="og:site_name" content={name} />

            {/* Twitter Tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={currentSEO.title} />
            <meta name="twitter:description" content={currentSEO.description} />

            {/* Canonical Link */}
            <link rel="canonical" href={window.location.href} />
        </Helmet>
    );
}
