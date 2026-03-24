import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Briefcase, Target, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import api from '@/lib/api';
import DomaineForm from '@/components/admin/taxonomy/DomaineForm';
import MetierForm from '@/components/admin/taxonomy/MetierForm';
import CompetenceForm from '@/components/admin/taxonomy/CompetenceForm';
import OutilForm from '@/components/admin/taxonomy/OutilForm';

export default function AdminTaxonomy() {
    const [activeTab, setActiveTab] = useState('domaines');
    const [searchQuery, setSearchQuery] = useState('');

    // Data states
    const [domaines, setDomaines] = useState([]);
    const [metiers, setMetiers] = useState([]);
    const [competences, setCompetences] = useState([]);
    const [outils, setOutils] = useState([]);

    // Loading states
    const [loading, setLoading] = useState(false);

    // Dialog states
    const [domaineDialog, setDomaineDialog] = useState({ open: false, mode: 'create', data: null });
    const [metierDialog, setMetierDialog] = useState({ open: false, mode: 'create', data: null });
    const [competenceDialog, setCompetenceDialog] = useState({ open: false, mode: 'create', data: null });
    const [outilDialog, setOutilDialog] = useState({ open: false, mode: 'create', data: null });

    // Fetch data
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [domainesRes, metiersRes, competencesRes, outilsRes] = await Promise.all([
                api.get('/taxonomy/domaines'),
                api.get('/taxonomy/metiers'),
                api.get('/taxonomy/competences'),
                api.get('/taxonomy/outils'),
            ]);

            const dData = domainesRes.data || domainesRes;
            const mData = metiersRes.data || metiersRes;
            const cData = competencesRes.data || competencesRes;
            const oData = outilsRes.data || outilsRes;

            setDomaines(Array.isArray(dData) ? dData : []);
            setMetiers(Array.isArray(mData) ? mData : []);
            setCompetences(Array.isArray(cData) ? cData : []);
            setOutils(Array.isArray(oData) ? oData : []);
        } catch (error) {
            console.error('Error fetching taxonomy data:', error);
            toast.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    // Delete handlers
    const handleDeleteDomaine = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce domaine ? Tous les métiers associés seront également supprimés.')) {
            return;
        }

        try {
            await api.delete(`/taxonomy/domaines/${id}`);
            toast.success('Domaine supprimé avec succès');
            fetchAllData();
        } catch (error) {
            console.error('Error deleting domaine:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleDeleteMetier = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce métier ?')) {
            return;
        }

        try {
            await api.delete(`/taxonomy/metiers/${id}`);
            toast.success('Métier supprimé avec succès');
            fetchAllData();
        } catch (error) {
            console.error('Error deleting métier:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleDeleteCompetence = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
            return;
        }

        try {
            await api.delete(`/taxonomy/competences/${id}`);
            toast.success('Compétence supprimée avec succès');
            fetchAllData();
        } catch (error) {
            console.error('Error deleting competence:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleDeleteOutil = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet outil ?')) {
            return;
        }

        try {
            await api.delete(`/taxonomy/outils/${id}`);
            toast.success('Outil supprimé avec succès');
            fetchAllData();
        } catch (error) {
            console.error('Error deleting outil:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    // Filter data based on search with safety checks
    const filteredDomaines = Array.isArray(domaines) ? domaines.filter(d =>
        d?.nom?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const filteredMetiers = Array.isArray(metiers) ? metiers.filter(m =>
        m?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m?.domaine_nom?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const filteredCompetences = Array.isArray(competences) ? competences.filter(c =>
        c?.nom?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const filteredOutils = Array.isArray(outils) ? outils.filter(o =>
        o?.nom?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Gestion de la Taxonomie Professionnelle
                    </h1>
                    <p className="text-slate-600">
                        Gérez les domaines, métiers, compétences et outils de votre plateforme
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <Input
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
                        <TabsTrigger value="domaines" className="flex items-center gap-2">
                            <Target size={16} />
                            Domaines ({domaines.length})
                        </TabsTrigger>
                        <TabsTrigger value="metiers" className="flex items-center gap-2">
                            <Briefcase size={16} />
                            Métiers ({metiers.length})
                        </TabsTrigger>
                        <TabsTrigger value="competences" className="flex items-center gap-2">
                            <Target size={16} />
                            Compétences ({competences.length})
                        </TabsTrigger>
                        <TabsTrigger value="outils" className="flex items-center gap-2">
                            <Wrench size={16} />
                            Outils ({outils.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Domaines Tab */}
                    <TabsContent value="domaines">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">Domaines Professionnels</h2>
                                <Button
                                    onClick={() => setDomaineDialog({ open: true, mode: 'create', data: null })}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Nouveau Domaine
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Métiers</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDomaines.map((domaine) => (
                                        <TableRow key={domaine.id}>
                                            <TableCell className="font-medium">{domaine.nom}</TableCell>
                                            <TableCell className="text-slate-600">{domaine.description || '-'}</TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                    {domaine.metiers_count} métier{domaine.metiers_count > 1 ? 's' : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setDomaineDialog({ open: true, mode: 'edit', data: domaine })}
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteDomaine(domaine.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Métiers Tab */}
                    <TabsContent value="metiers">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">Métiers</h2>
                                <Button
                                    onClick={() => setMetierDialog({ open: true, mode: 'create', data: null })}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Nouveau Métier
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Domaine</TableHead>
                                        <TableHead>Compétences</TableHead>
                                        <TableHead>Outils</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMetiers.map((metier) => (
                                        <TableRow key={metier.id}>
                                            <TableCell className="font-medium">{metier.nom}</TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                                                    {metier.domaine_nom}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-slate-600">
                                                    {metier.competences_count} compétence{metier.competences_count > 1 ? 's' : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-slate-600">
                                                    {metier.outils_count} outil{metier.outils_count > 1 ? 's' : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setMetierDialog({ open: true, mode: 'edit', data: metier })}
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteMetier(metier.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Compétences Tab */}
                    <TabsContent value="competences">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">Compétences Clés</h2>
                                <Button
                                    onClick={() => setCompetenceDialog({ open: true, mode: 'create', data: null })}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Nouvelle Compétence
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Métiers Associés</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCompetences.map((competence) => (
                                        <TableRow key={competence.id}>
                                            <TableCell className="font-medium">{competence.nom}</TableCell>
                                            <TableCell className="text-slate-600">{competence.description || '-'}</TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                    {competence.metiers_count} métier{competence.metiers_count > 1 ? 's' : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setCompetenceDialog({ open: true, mode: 'edit', data: competence })}
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteCompetence(competence.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Outils Tab */}
                    <TabsContent value="outils">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">Outils</h2>
                                <Button
                                    onClick={() => setOutilDialog({ open: true, mode: 'create', data: null })}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Nouvel Outil
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Catégorie</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Métiers Associés</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOutils.map((outil) => (
                                        <TableRow key={outil.id}>
                                            <TableCell className="font-medium">{outil.nom}</TableCell>
                                            <TableCell>
                                                {outil.categorie && (
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                        {outil.categorie}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-slate-600">{outil.description || '-'}</TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                                    {outil.metiers_count} métier{outil.metiers_count > 1 ? 's' : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setOutilDialog({ open: true, mode: 'edit', data: outil })}
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteOutil(outil.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Dialogs */}
                <Dialog open={domaineDialog.open} onOpenChange={(open) => setDomaineDialog({ ...domaineDialog, open })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {domaineDialog.mode === 'create' ? 'Nouveau Domaine' : 'Modifier le Domaine'}
                            </DialogTitle>
                            <DialogDescription>
                                {domaineDialog.mode === 'create'
                                    ? 'Créez un nouveau domaine professionnel'
                                    : 'Modifiez les informations du domaine'}
                            </DialogDescription>
                        </DialogHeader>
                        <DomaineForm
                            mode={domaineDialog.mode}
                            data={domaineDialog.data}
                            onSuccess={() => {
                                setDomaineDialog({ open: false, mode: 'create', data: null });
                                fetchAllData();
                            }}
                            onCancel={() => setDomaineDialog({ open: false, mode: 'create', data: null })}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={metierDialog.open} onOpenChange={(open) => setMetierDialog({ ...metierDialog, open })}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {metierDialog.mode === 'create' ? 'Nouveau Métier' : 'Modifier le Métier'}
                            </DialogTitle>
                            <DialogDescription>
                                {metierDialog.mode === 'create'
                                    ? 'Créez un nouveau métier avec ses compétences et outils'
                                    : 'Modifiez les informations du métier'}
                            </DialogDescription>
                        </DialogHeader>
                        <MetierForm
                            mode={metierDialog.mode}
                            data={metierDialog.data}
                            domaines={domaines}
                            competences={competences}
                            outils={outils}
                            onSuccess={() => {
                                setMetierDialog({ open: false, mode: 'create', data: null });
                                fetchAllData();
                            }}
                            onCancel={() => setMetierDialog({ open: false, mode: 'create', data: null })}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={competenceDialog.open} onOpenChange={(open) => setCompetenceDialog({ ...competenceDialog, open })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {competenceDialog.mode === 'create' ? 'Nouvelle Compétence' : 'Modifier la Compétence'}
                            </DialogTitle>
                            <DialogDescription>
                                {competenceDialog.mode === 'create'
                                    ? 'Créez une nouvelle compétence clé'
                                    : 'Modifiez les informations de la compétence'}
                            </DialogDescription>
                        </DialogHeader>
                        <CompetenceForm
                            mode={competenceDialog.mode}
                            data={competenceDialog.data}
                            onSuccess={() => {
                                setCompetenceDialog({ open: false, mode: 'create', data: null });
                                fetchAllData();
                            }}
                            onCancel={() => setCompetenceDialog({ open: false, mode: 'create', data: null })}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={outilDialog.open} onOpenChange={(open) => setOutilDialog({ ...outilDialog, open })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {outilDialog.mode === 'create' ? 'Nouvel Outil' : 'Modifier l\'Outil'}
                            </DialogTitle>
                            <DialogDescription>
                                {outilDialog.mode === 'create'
                                    ? 'Créez un nouvel outil professionnel'
                                    : 'Modifiez les informations de l\'outil'}
                            </DialogDescription>
                        </DialogHeader>
                        <OutilForm
                            mode={outilDialog.mode}
                            data={outilDialog.data}
                            onSuccess={() => {
                                setOutilDialog({ open: false, mode: 'create', data: null });
                                fetchAllData();
                            }}
                            onCancel={() => setOutilDialog({ open: false, mode: 'create', data: null })}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
