import { useEffect, useCallback } from 'react';
import { useOnboardingStore } from '@/store/useOnboardingStore';

const tourSteps = [
    {
        element: '#navbar-logo',
        title: '⚡ Bienvenue sur OpenIn',
        description: 'Voici votre centre de contrôle intelligent. Je vais vous guider !'
    },
    {
        element: '#nav-accueil',
        title: '🏠 Accueil',
        description: 'Votre point de départ pour explorer les opportunités de synergie.'
    },
    {
        element: '#nav-talents',
        title: '👤 Nos Talents',
        description: 'Accédez à notre réseau de consultants experts en IA et technologies.'
    },
    {
        element: '#nav-entreprise',
        title: '🏢 Espace Entreprise',
        description: 'Solutions sur mesure pour booster votre transformation digitale.'
    },


    {
        element: '#nav-espace-ia',
        title: '🤖 Espace IA',
        description: 'Découvrez la puissance de nos algorithmes de matching.'
    },
    {
        element: '#navbar-login',
        title: '🔑 Connexion',
        description: 'Accédez à votre compte ou personnalisez votre expérience ici.'
    }
];

export const useNavbarTour = () => {
    const {
        isTourActive,
        currentStepIndex,
        startTour,
        endTour,
        setRobotMessage,
        setRobotPosition,
        setCurrentStepIndex,
        setHighlightedElement,
        setNavHandlers
    } = useOnboardingStore();

    const updateStep = useCallback((index: number) => {
        // Filter steps for mobile
        const isMobile = window.innerWidth < 768;
        const activeSteps = tourSteps.filter(step => {
            if (isMobile && step.element === '#navbar-login') return false;
            return true;
        });

        const step = activeSteps[index];
        if (!step) {
            // If we go out of bounds (e.g. finishing tour), end it
            if (index >= activeSteps.length) {
                endTour();
            }
            return;
        }

        setHighlightedElement(step.element);
        setRobotMessage(step.description);
        setCurrentStepIndex(index);

        // Scroll target element into view (Horizontal support)
        setTimeout(() => {
            const element = document.querySelector(step.element);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }, 100);

        // Setup handlers
        setNavHandlers(
            index < activeSteps.length - 1 ? () => updateStep(index + 1) : null,
            index > 0 ? () => updateStep(index - 1) : null
        );
    }, [setHighlightedElement, setRobotMessage, setCurrentStepIndex, setNavHandlers, endTour]);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenNavbarTour');
        if (!hasSeenTour && !isTourActive) {
            const timer = setTimeout(() => {
                const isMobile = window.innerWidth < 768;
                // Adjust total steps based on mobile filter
                const mobileCount = tourSteps.filter(s => !(isMobile && s.element === '#navbar-login')).length;
                startTour(mobileCount);
                updateStep(0);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isTourActive, startTour, updateStep]);

    // Cleanup on unmount or tour end
    useEffect(() => {
        if (!isTourActive) {
            setHighlightedElement(null);
        }
    }, [isTourActive, setHighlightedElement]);
};

