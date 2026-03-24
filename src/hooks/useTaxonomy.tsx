import { useState, useEffect, createContext, useContext } from 'react';
import api from '@/lib/api';
import { HierarchicalData } from '@/data/hierarchicalData';

interface TaxonomyContextType {
    taxonomy: HierarchicalData;
    loading: boolean;
    error: string | null;
    refreshTaxonomy: () => Promise<void>;
}

const TaxonomyContext = createContext<TaxonomyContextType | undefined>(undefined);

export function TaxonomyProvider({ children }: { children: React.ReactNode }) {
    const [taxonomy, setTaxonomy] = useState<HierarchicalData>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHierarchy = async () => {
        setLoading(true);
        try {
            const response = await api.get('/taxonomy/hierarchy');
            if (response && (response.data || typeof response === 'object')) {
                setTaxonomy((response.data || response) as HierarchicalData);
                setError(null);
            } else {
                throw new Error('Invalid taxonomy data received');
            }
        } catch (err: any) {
            console.error('Failed to fetch taxonomy hierarchy:', err);
            setError(err.message || 'Failed to load taxonomy');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHierarchy();
    }, []);

    return (
        <TaxonomyContext.Provider value={{ taxonomy, loading, error, refreshTaxonomy: fetchHierarchy }}>
            {children}
        </TaxonomyContext.Provider>
    );
}

export function useTaxonomy() {
    const context = useContext(TaxonomyContext);
    if (context === undefined) {
        throw new Error('useTaxonomy must be used within a TaxonomyProvider');
    }
    return context;
}
