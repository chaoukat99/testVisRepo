import { useState, useEffect } from 'react';

interface Country {
    country: string;
    cities: string[];
}

interface CountriesResponse {
    error: boolean;
    msg: string;
    data: Country[];
}

export function useCountriesAndCities() {
    const [countries, setCountries] = useState<string[]>([]);
    const [citiesByCountry, setCitiesByCountry] = useState<Map<string, string[]>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCountriesAndCities = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('https://countriesnow.space/api/v0.1/countries');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: CountriesResponse = await response.json();

                if (data.error) {
                    throw new Error(data.msg || 'Failed to fetch countries');
                }

                // Extract country names
                const countryNames = data.data.map((item) => item.country).sort();
                setCountries(countryNames);

                // Create a map of countries to their cities
                const citiesMap = new Map<string, string[]>();
                data.data.forEach((item) => {
                    citiesMap.set(item.country, item.cities.sort());
                });
                setCitiesByCountry(citiesMap);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching countries and cities:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        };

        fetchCountriesAndCities();
    }, []);

    const getCitiesForCountry = (country: string): string[] => {
        return citiesByCountry.get(country) || [];
    };

    return {
        countries,
        getCitiesForCountry,
        loading,
        error,
    };
}
