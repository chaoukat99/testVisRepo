import { useEffect, useState } from 'react';
import { FormSelect } from '@/components/forms/FormField';
import { useCountriesAndCities } from '@/hooks/useCountriesAndCities';
import { Loader2 } from 'lucide-react';

interface CountryCitySelectorProps {
    countryLabel?: string;
    cityLabel?: string;
    countryName: string;
    cityName: string;
    selectedCountry: string;
    selectedCity: string;
    onCountryChange: (value: string) => void;
    onCityChange: (value: string) => void;
    required?: boolean;
    grid?: boolean;
}

export function CountryCitySelector({
    countryLabel = "Pays",
    cityLabel = "Ville",
    countryName,
    cityName,
    selectedCountry,
    selectedCity,
    onCountryChange,
    onCityChange,
    required = false,
    grid = true,
}: CountryCitySelectorProps) {
    const { countries, getCitiesForCountry, loading, error } = useCountriesAndCities();
    const [cities, setCities] = useState<string[]>([]);

    // Update cities when country changes
    useEffect(() => {
        if (selectedCountry) {
            const countryCities = getCitiesForCountry(selectedCountry);
            setCities(countryCities);

            // Reset city if it's not in the new country's cities
            if (selectedCity && !countryCities.includes(selectedCity)) {
                onCityChange('');
            }
        } else {
            setCities([]);
            onCityChange('');
        }
    }, [selectedCountry, getCitiesForCountry]);

    // Convert string arrays to select options
    const countryOptions = countries.map(country => ({
        value: country,
        label: country,
    }));

    const cityOptions = cities.map(city => ({
        value: city,
        label: city,
    }));

    if (error) {
        return (
            <div className="p-4 border border-red-300 bg-red-50 rounded-lg text-red-700 text-sm">
                <strong>Erreur:</strong> Impossible de charger les pays. {error}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 space-x-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Chargement des pays...</span>
            </div>
        );
    }

    const content = (
        <>
            <FormSelect
                label={countryLabel}
                name={countryName}
                value={selectedCountry}
                onChange={(e) => {
                    onCountryChange(e.target.value);
                }}
                options={countryOptions}
                required={required}
            />

            {selectedCountry && (
                <FormSelect
                    label={cityLabel}
                    name={cityName}
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    options={cityOptions}
                    required={required}
                />
            )}
        </>
    );

    return grid ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content}
        </div>
    ) : (
        <>{content}</>
    );
}
