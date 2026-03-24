import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function DomaineForm({ mode, data, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && data) {
            setFormData({
                nom: data.nom || '',
                description: data.description || '',
            });
        }
    }, [mode, data]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nom.trim()) {
            toast.error('Le nom du domaine est requis');
            return;
        }

        setLoading(true);

        try {
            if (mode === 'create') {
                await api.post('/taxonomy/domaines', formData);
                toast.success('Domaine créé avec succès');
            } else {
                await api.put(`/taxonomy/domaines/${data.id}`, formData);
                toast.success('Domaine mis à jour avec succès');
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving domaine:', error);
            toast.error(error.response?.data?.error || 'Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="nom">Nom du Domaine *</Label>
                <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Achats, IT & Développement, Marketing..."
                    required
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description du domaine professionnel..."
                    rows={3}
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Mettre à jour'}
                </Button>
            </div>
        </form>
    );
}
