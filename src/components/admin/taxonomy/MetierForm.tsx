import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';
import { MultiSelect } from '@/components/forms/MultiSelect';

export default function MetierForm({ mode, data, domaines, competences, outils, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        domaine_id: '',
        competences: [],
        outils: [],
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && data) {
            // Fetch full metier details
            fetchMetierDetails();
        }
    }, [mode, data]);

    const fetchMetierDetails = async () => {
        try {
            const response = await api.get(`/taxonomy/metiers/${data.id}`);
            const metier = response.data;

            setFormData({
                nom: metier.nom || '',
                description: metier.description || '',
                domaine_id: metier.domaine_id || '',
                competences: metier.competences?.map(c => c.id) || [],
                outils: metier.outils?.map(o => o.id) || [],
            });
        } catch (error) {
            console.error('Error fetching metier details:', error);
            toast.error('Erreur lors du chargement des détails');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nom.trim() || !formData.domaine_id) {
            toast.error('Le nom et le domaine sont requis');
            return;
        }

        setLoading(true);

        try {
            if (mode === 'create') {
                await api.post('/taxonomy/metiers', formData);
                toast.success('Métier créé avec succès');
            } else {
                await api.put(`/taxonomy/metiers/${data.id}`, formData);
                toast.success('Métier mis à jour avec succès');
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving metier:', error);
            toast.error(error.response?.data?.error || 'Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    const competenceOptions = competences.map(c => ({
        value: c.id,
        label: c.nom,
    }));

    const outilOptions = outils.map(o => ({
        value: o.id,
        label: o.nom,
    }));

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <Label htmlFor="nom">Nom du Métier *</Label>
                <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Acheteur, Développeur Full-Stack, Chef de Projet..."
                    required
                />
            </div>

            <div>
                <Label htmlFor="domaine">Domaine *</Label>
                <Select
                    value={formData.domaine_id}
                    onValueChange={(value) => setFormData({ ...formData, domaine_id: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un domaine" />
                    </SelectTrigger>
                    <SelectContent>
                        {domaines.map((domaine) => (
                            <SelectItem key={domaine.id} value={domaine.id}>
                                {domaine.nom}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description du métier..."
                    rows={3}
                />
            </div>

            <div>
                <MultiSelect
                    label="Compétences Clés"
                    options={competenceOptions}
                    selected={formData.competences}
                    onChange={(value) => setFormData({ ...formData, competences: value })}
                    placeholder="Sélectionnez les compétences..."
                />
                <p className="text-sm text-slate-500 mt-1">
                    {formData.competences.length} compétence{formData.competences.length > 1 ? 's' : ''} sélectionnée{formData.competences.length > 1 ? 's' : ''}
                </p>
            </div>

            <div>
                <MultiSelect
                    label="Outils"
                    options={outilOptions}
                    selected={formData.outils}
                    onChange={(value) => setFormData({ ...formData, outils: value })}
                    placeholder="Sélectionnez les outils..."
                />
                <p className="text-sm text-slate-500 mt-1">
                    {formData.outils.length} outil{formData.outils.length > 1 ? 's' : ''} sélectionné{formData.outils.length > 1 ? 's' : ''}
                </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white pb-2">
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
