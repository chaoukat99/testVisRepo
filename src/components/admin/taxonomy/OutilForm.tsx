import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function OutilForm({ mode, data, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        categorie: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && data) {
            setFormData({
                nom: data.nom || '',
                description: data.description || '',
                categorie: data.categorie || '',
            });
        }
    }, [mode, data]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nom.trim()) {
            toast.error('Le nom de l\'outil est requis');
            return;
        }

        setLoading(true);

        try {
            if (mode === 'create') {
                await api.post('/taxonomy/outils', formData);
                toast.success('Outil créé avec succès');
            } else {
                await api.put(`/taxonomy/outils/${data.id}`, formData);
                toast.success('Outil mis à jour avec succès');
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving outil:', error);
            toast.error(error.response?.data?.error || 'Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="nom">Nom de l'Outil *</Label>
                <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Excel, SAP, Jira, Python..."
                    required
                />
            </div>

            <div>
                <Label htmlFor="categorie">Catégorie</Label>
                <Input
                    id="categorie"
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    placeholder="Ex: Analytics, Project Management, Development..."
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description de l'outil..."
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
