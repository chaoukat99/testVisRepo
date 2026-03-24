import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageLoading() {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Only trigger loading for the home page
        if (location.pathname === "/") {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 2500);
            return () => clearTimeout(timer);
        } else {
            setIsLoading(false);
        }
    }, [location.pathname]);

    return isLoading;
}
