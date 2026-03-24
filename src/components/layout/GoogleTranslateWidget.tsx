import { useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export function GoogleTranslateWidget() {
    const isScriptLoaded = useRef(false);

    useEffect(() => {
        if (isScriptLoaded.current) return;

        // Define the callback function that Google Translate API will call
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'fr',
                    includedLanguages: 'fr,en,ar', // Only French, English, Arabic
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };

        // Load the Google Translate script
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);

        isScriptLoaded.current = true;

        // Observer to remove the annoying Google Top Bar if it gets injected
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                // Find the iframe banner or specific skiptranslate divs that are NOT our widget's dropdown
                // We usually want to target the top banner frame
                const bannerFrame = document.querySelector('.goog-te-banner-frame');
                if (bannerFrame) {
                    bannerFrame.remove();
                    document.body.style.top = '0px';
                }

                // Also unwanted styling on body
                if (document.body.style.position === 'relative') {
                    // Google adds position: relative and top: 40px
                    document.body.style.top = '0px';
                }
            });
        });

        observer.observe(document.body, { childList: true, attributes: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative flex items-center">
            {/* Icon for visual consistency */}
            <Globe className="absolute left-2.5 z-10 w-3.5 h-3.5 text-white/70 pointer-events-none" />

            {/* The Container Requirement for Google Translate */}
            <div
                id="google_translate_element"
                className="google-translate-custom"
            />

            {/* Custom Styles to make Google Widget look like our Shadcn theme */}
            <style>{`
        .google-translate-custom {
            display: inline-block;
        }
        
        /* Hide the "Powered by Google" branding if desired for cleaner UI, 
           though Google TOS usually requires it visible somewhere. 
           We'll just style the dropdown to match our theme. */
           
        .goog-te-gadget-simple {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            padding: 6px 10px 6px 30px !important; /* Left padding for our Globe icon */
            border-radius: 8px !important;
            font-size: 10px !important;
            line-height: 1 !important;
            display: inline-block;
            cursor: pointer;
            transition: all 0.2s;
        }

        .goog-te-gadget-simple:hover {
             background-color: rgba(255, 255, 255, 0.1) !important;
        }

        .goog-te-gadget-simple img {
            display: none !important; /* Hide Google Icon */
        }

        .goog-te-menu-value {
            color: #ffffff !important;
            font-family: inherit !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            font-size: 10px !important;
            margin: 0 !important;
        }

        .goog-te-menu-value span {
            color: #ffffff !important;
            border-left: none !important; /* Remove separator */
        }
        
        /* Hide the weird down arrow if it clashes, or style it */
        .goog-te-menu-value span:last-child {
            display: none !important; /* Hides default arrow */
        }

        /* START: Hide Google Top Bar */
        body {
            top: 0 !important;
        }
        .goog-te-banner-frame {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
        }
        .goog-te-banner-frame.skiptranslate {
            display: none !important;
        }
        /* END: Hide Google Top Bar */

        /* START: Hide Google Tooltip on Text Selection */
        .goog-tooltip, 
        .goog-tooltip:hover,
        .goog-text-highlight {
            display: none !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
        }

        #goog-gt-tt, 
        .goog-te-balloon-frame {
            display: none !important;
            visibility: hidden !important;
        }

        /* Remove highlighting on translated text */
        font {
            background-color: transparent !important;
            box-shadow: none !important;
        }
        /* END: Hide Google Tooltip */
      `}</style>
        </div>
    );
}
