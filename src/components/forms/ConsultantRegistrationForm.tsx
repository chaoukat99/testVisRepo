import { useState } from "react";
import { SkillSelector } from "@/components/forms/SkillSelector";
import { motion } from "framer-motion";
import { User, Briefcase, Award, Calendar, Settings, ArrowRight, ArrowLeft, Check, Plus, X, Sparkles, Trophy } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { FormField, FormTextarea, FormSelect } from "@/components/forms/FormField";
import { RadioGroup } from "@/components/forms/RadioGroup";
import { FileUpload } from "@/components/forms/FileUpload";
import { TagsInput } from "@/components/forms/TagsInput";
import { useTaxonomy } from "@/hooks/useTaxonomy";
import { SenioritySlider } from "@/components/forms/SenioritySlider";
import { CountryCitySelector } from "@/components/forms/CountryCitySelector";

interface Experience {
    titre_mission: string;
    client: string;
    secteur: string;
    description_courte: string;
    resultats_livrables: string;
    competences_utilisees: string;
    date_debut: string;
    date_fin: string;
}

interface ConsultantFormData {
    // Step 1: Personal Information
    profile_type: string;
    prenom: string;
    nom: string;
    email_professionnel: string;
    telephone: string;
    mot_de_passe: string;
    confirm_password: string;
    photo_profil: File[];
    pays_residence: string;
    ville: string;
    adresse_complete: string;

    // Step 2: Professional Status
    statut_professionnel: string;
    annee_debut_activite: string;
    site_web: string;
    linkedin: string;
    identifiant_fiscal: string;
    statut_professionnel_autre?: string;

    // Step 3: Expertise & Experience
    domaine: string;
    metier: string;
    domaine_autre?: string;
    metier_autre?: string;
    outils: string[];
    competences_cles: string[];
    experience_totale: string;
    experiences: Experience[];
    cv: File[];

    // Step 4: Availability & Pricing
    disponibilite_actuelle: string;
    date_disponibilite: string;
    charge_disponible: string;
    mode_travail_prefere: string;
    tjm: string;
    tjm_min: string;
    tjm_max: string;

    // Step 5: Settings
    profil_public: boolean;
    cgu_acceptees: boolean;
    autorisation_matching_ia: boolean;
}

const steps = [
    { id: 1, name: "Profil", icon: User },
    { id: 2, name: "Statut", icon: Briefcase },
    { id: 3, name: "Expertise", icon: Award },
    { id: 4, name: "Tarifs", icon: Calendar },
    { id: 5, name: "Finalisation", icon: Settings },
];

const STATUT_PROFESSIONNEL = [
    { value: "Freelance", label: "Freelance" },
    { value: "Auto-entrepreneur", label: "Auto-entrepreneur" },
    { value: "SASU", label: "SASU" },
    { value: "EURL", label: "EURL" },
    { value: "Portage salarial", label: "Portage salarial" },
    { value: "Cabinet", label: "Cabinet" },
    { value: "Autre", label: "Autre" },
];

const EXPERIENCE_TOTALE = [
    { value: "0-3", label: "0-3 ans", description: "Junior" },
    { value: "3-7", label: "3-7 ans", description: "Confirmé" },
    { value: "7-15", label: "7-15 ans", description: "Senior" },
    { value: "15+", label: "15+ ans", description: "Expert" },
];

const DISPONIBILITE = [
    { value: "Disponible immédiatement", label: "Disponible immédiatement" },
    { value: "Disponible à partir de", label: "Disponible à partir de..." },
    { value: "En mission mais ouvert", label: "En mission mais ouvert aux opportunités" },
];

const CHARGE_DISPONIBLE = [
    { value: "1", label: "1 j/semaine" },
    { value: "2-3", label: "2-3 j/semaine" },
    { value: "4-5", label: "4-5 j/semaine" },
    { value: "Temps plein", label: "Temps plein" },
];

const MODE_TRAVAIL = [
    { value: "Remote", label: "Remote", description: "100% à distance" },
    { value: "Hybride", label: "Hybride", description: "Mix présentiel/distance" },
    { value: "Sur site", label: "Sur site", description: "Présentiel uniquement" },
];

interface ConsultantRegistrationFormProps {
    onSubmit: (data: ConsultantFormData) => void;
    onCancel?: () => void;
}

export function ConsultantRegistrationForm({
    onSubmit,
    onCancel,
}: ConsultantRegistrationFormProps) {
    const { taxonomy } = useTaxonomy();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ConsultantFormData>({
        profile_type: "",
        prenom: "",
        nom: "",
        email_professionnel: "",
        telephone: "",
        mot_de_passe: "",
        confirm_password: "",
        photo_profil: [],
        pays_residence: "",
        ville: "",
        adresse_complete: "",
        statut_professionnel: "",
        annee_debut_activite: "",
        site_web: "",
        linkedin: "",
        identifiant_fiscal: "",
        statut_professionnel_autre: "",
        domaine: "",
        metier: "",
        domaine_autre: "",
        metier_autre: "",
        outils: [],
        competences_cles: [],
        experience_totale: "",
        experiences: [],
        cv: [],
        disponibilite_actuelle: "",
        date_disponibilite: "",
        charge_disponible: "",
        mode_travail_prefere: "",
        tjm: "",
        tjm_min: "",
        tjm_max: "",
        profil_public: true,
        cgu_acceptees: false,
        autorisation_matching_ia: false,
    });

    const [yearsExp, setYearsExp] = useState(5);

    const handleChange = (field: keyof ConsultantFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSeniorityChange = (years: number) => {
        setYearsExp(years);
        handleChange("experience_totale", years.toString());
    };

    const handleDomainChange = (domain: string) => {
        setFormData(prev => ({
            ...prev,
            domaine: domain,
            metier: "",
            outils: [],
            competences_cles: [],
            domaine_autre: ""
        }));
    };

    const handleJobChange = (job: string) => {
        setFormData(prev => ({
            ...prev,
            metier: job,
            metier_autre: job === "Autre" ? prev.metier_autre : "",
            outils: [],
            competences_cles: []
        }));
    };

    const addExperience = () => {
        setFormData((prev) => ({
            ...prev,
            experiences: [
                ...prev.experiences,
                {
                    titre_mission: "",
                    client: "",
                    secteur: "",
                    description_courte: "",
                    resultats_livrables: "",
                    competences_utilisees: "",
                    date_debut: "",
                    date_fin: "",
                },
            ],
        }));
    };

    const removeExperience = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index),
        }));
    };

    const updateExperience = (index: number, field: keyof Experience, value: string) => {
        setFormData((prev) => ({
            ...prev,
            experiences: prev.experiences.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            ),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        } else {
            // If "Autre" is selected, use the custom value for the backend
            const dataToSubmit = { ...formData };
            if (dataToSubmit.statut_professionnel === "Autre" && dataToSubmit.statut_professionnel_autre) {
                dataToSubmit.statut_professionnel = dataToSubmit.statut_professionnel_autre;
            }
            onSubmit(dataToSubmit);
        }
    };

    const progress = (currentStep / steps.length) * 100;

    return (
        <GlassCard className="max-w-4xl mx-auto" hover={false}>
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${isActive
                                            ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-primary-foreground"
                                            : isCompleted
                                                ? "bg-purple-500/20 text-purple-500"
                                                : "bg-secondary/50 text-muted-foreground"
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-6 h-6" />
                                        ) : (
                                            <StepIcon className="w-6 h-6" />
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs font-medium hidden sm:block ${isActive ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground"
                                            }`}
                                    >
                                        {step.name}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 rounded-full transition-all ${currentStep > step.id ? "bg-purple-500" : "bg-secondary/50"
                                            }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Informations personnelles
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Commencez par vos informations de base
                            </p>
                        </div>

                        <RadioGroup
                            label="Type de profil"
                            options={[
                                { value: "Consultant", label: "Consultant", description: "Expert conseil en mission" },
                                { value: "Freelance", label: "Freelance", description: "Travailleur indépendant" },
                                { value: "Manager de Transit", label: "Manager de Transit", description: "Manager de transition" },
                            ]}
                            value={formData.profile_type}
                            onChange={(value) => handleChange("profile_type", value)}
                            layout="horizontal"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Prénom"
                                name="prenom"
                                value={formData.prenom}
                                onChange={(e) => handleChange("prenom", e.target.value)}
                                placeholder="Votre prénom"
                                required
                            />

                            <FormField
                                label="Nom"
                                name="nom"
                                value={formData.nom}
                                onChange={(e) => handleChange("nom", e.target.value)}
                                placeholder="Votre nom"
                                required
                            />
                        </div>

                        <FormField
                            label="Email professionnel"
                            name="email_professionnel"
                            type="email"
                            value={formData.email_professionnel}
                            onChange={(e) => handleChange("email_professionnel", e.target.value)}
                            placeholder="votre.email@exemple.com"
                            required
                        />

                        <FormField
                            label="Téléphone"
                            name="telephone"
                            value={formData.telephone}
                            onChange={(e) => handleChange("telephone", e.target.value)}
                            placeholder="+33 6 12 34 56 78"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Mot de passe"
                                name="mot_de_passe"
                                type="password"
                                value={formData.mot_de_passe}
                                onChange={(e) => handleChange("mot_de_passe", e.target.value)}
                                placeholder="••••••••"
                                required
                            />

                            <FormField
                                label="Confirmer le mot de passe"
                                name="confirm_password"
                                type="password"
                                value={formData.confirm_password}
                                onChange={(e) => handleChange("confirm_password", e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <FileUpload
                            label="Photo de profil (optionnel)"
                            accept="image/*"
                            files={formData.photo_profil}
                            onFilesChange={(files) => handleChange("photo_profil", files)}
                            maxSize={5}
                        />

                        <div className="pt-4 border-t border-border">
                            <h4 className="font-semibold text-foreground mb-4">Localisation</h4>

                            <div className="space-y-6">
                                <CountryCitySelector
                                    countryLabel="Pays de résidence"
                                    cityLabel="Ville"
                                    countryName="pays_residence"
                                    cityName="ville"
                                    selectedCountry={formData.pays_residence}
                                    selectedCity={formData.ville}
                                    onCountryChange={(value) => handleChange("pays_residence", value)}
                                    onCityChange={(value) => handleChange("ville", value)}
                                    grid
                                />

                                <FormField
                                    label="Adresse complète (optionnel)"
                                    name="adresse_complete"
                                    value={formData.adresse_complete}
                                    onChange={(e) => handleChange("adresse_complete", e.target.value)}
                                    placeholder="123 Rue de Exemple, 75001 Paris"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Professional Status */}
                {currentStep === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Statut professionnel
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Précisez votre statut et vos informations professionnelles
                            </p>
                        </div>

                        <FormSelect
                            label="Statut professionnel"
                            name="statut_professionnel"
                            value={formData.statut_professionnel}
                            onChange={(e) => handleChange("statut_professionnel", e.target.value)}
                            options={STATUT_PROFESSIONNEL}
                            required
                        />

                        {formData.statut_professionnel === "Autre" && (
                            <FormField
                                label="Précisez votre statut"
                                name="statut_professionnel_autre"
                                value={formData.statut_professionnel_autre}
                                onChange={(e) => handleChange("statut_professionnel_autre", e.target.value)}
                                placeholder="Votre statut professionnel"
                                required
                            />
                        )}

                        <FormField
                            label="Année de début d'activité"
                            name="annee_debut_activite"
                            type="number"
                            value={formData.annee_debut_activite}
                            onChange={(e) => handleChange("annee_debut_activite", e.target.value)}
                            placeholder="2020"
                            min="1950"
                            max={new Date().getFullYear().toString()}
                        />

                        <FormField
                            label="Site web / Portfolio (optionnel)"
                            name="site_web"
                            value={formData.site_web}
                            onChange={(e) => handleChange("site_web", e.target.value)}
                            placeholder="https://monportfolio.com"
                        />

                        <FormField
                            label="LinkedIn (optionnel)"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={(e) => handleChange("linkedin", e.target.value)}
                            placeholder="https://linkedin.com/in/votreprofil"
                        />

                        <FormField
                            label="Identifiant fiscal (SIRET/SIREN)"
                            name="identifiant_fiscal"
                            value={formData.identifiant_fiscal}
                            onChange={(e) => handleChange("identifiant_fiscal", e.target.value)}
                            placeholder="12345678901234"
                        />
                    </motion.div>
                )}

                {/* Step 3: Expertise & Experience */}
                {currentStep === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Expertise et expériences
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Partagez votre domaine d'expertise et vos expériences
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-secondary/10 rounded-xl border border-border/50">
                            <FormSelect
                                label="Domaine d'expertise"
                                name="domaine"
                                value={formData.domaine}
                                onChange={(e) => handleDomainChange(e.target.value)}
                                options={[...Object.keys(taxonomy).map(d => ({ value: d, label: d })), { value: "Autre", label: "Autre" }]}
                                required
                            />

                            {formData.domaine && formData.domaine !== "Autre" && (
                                <FormSelect
                                    label="Métier / Spécialité"
                                    name="metier"
                                    value={formData.metier}
                                    onChange={(e) => handleJobChange(e.target.value)}
                                    options={[...Object.keys(taxonomy[formData.domaine]?.jobs || {}).map(j => ({ value: j, label: j })), { value: "Autre", label: "Autre" }]}
                                    required
                                />
                            )}
                        </div>

                        {formData.domaine === "Autre" && (
                            <FormField
                                label="Précisez votre domaine"
                                name="domaine_autre"
                                value={formData.domaine_autre}
                                onChange={(e) => handleChange("domaine_autre", e.target.value)}
                                placeholder="Votre domaine d'expertise"
                                required
                            />
                        )}

                        {(formData.metier === "Autre" || formData.domaine === "Autre") && (
                            <FormField
                                label="Précisez votre métier / spécialité"
                                name="metier_autre"
                                value={formData.metier_autre}
                                onChange={(e) => handleChange("metier_autre", e.target.value)}
                                placeholder="ex: Ghostwriter, Prompt Engineer..."
                                required
                            />
                        )}

                        {formData.metier && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-8">
                                    <div className="bg-secondary/5 rounded-xl border border-border/50 p-6 space-y-6">
                                        <div className="flex items-center gap-2 text-primary mb-2">
                                            <Sparkles className="w-4 h-4" />
                                            <h4 className="font-semibold text-sm uppercase tracking-wider">
                                                Profil Technique & Métier
                                            </h4>
                                        </div>

                                        <SkillSelector
                                            label="Compétences techniques & Outils"
                                            selectedSkills={formData.outils}
                                            onSkillsChange={(val) => handleChange("outils", val)}
                                            suggestions={taxonomy[formData.domaine]?.jobs?.[formData.metier]?.tools || []}
                                            placeholder="Ajouter un outil (ex: Figma, Jira...)"
                                        />

                                        <div className="h-px bg-border/50" />

                                        <SkillSelector
                                            label="Compétences métiers & Savoir-faire"
                                            selectedSkills={formData.competences_cles}
                                            onSkillsChange={(val) => handleChange("competences_cles", val)}
                                            suggestions={taxonomy[formData.domaine]?.jobs?.[formData.metier]?.skills || []}
                                            placeholder="Ajouter une compétence (ex: Gestion de projet...)"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="p-6 rounded-xl border border-border bg-secondary/5">
                            <SenioritySlider
                                label="Expérience Globale"
                                value={yearsExp}
                                onChange={handleSeniorityChange}
                            />
                        </div>

                        <FileUpload
                            label="CV / Curriculum Vitae (optionnel)"
                            accept=".pdf,.doc,.docx"
                            files={formData.cv}
                            onFilesChange={(files) => handleChange("cv", files)}
                            maxSize={10}
                        />

                        <div className="pt-4 border-t border-border">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-foreground">
                                    Expériences professionnelles (optionnel)
                                </h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addExperience}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter une expérience
                                </Button>
                            </div>

                            {formData.experiences.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-6 rounded-lg border border-border bg-secondary/20"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h5 className="font-medium text-foreground">
                                            Expérience #{index + 1}
                                        </h5>
                                        <button
                                            type="button"
                                            onClick={() => removeExperience(index)}
                                            className="text-destructive hover:text-destructive/80"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <FormField
                                            label="Titre de la mission"
                                            value={exp.titre_mission}
                                            onChange={(e) =>
                                                updateExperience(index, "titre_mission", e.target.value)
                                            }
                                            placeholder="Ex: Consultant Data chez XYZ"
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                label="Client"
                                                value={exp.client}
                                                onChange={(e) =>
                                                    updateExperience(index, "client", e.target.value)
                                                }
                                                placeholder="Nom du client"
                                            />

                                            <FormField
                                                label="Secteur"
                                                value={exp.secteur}
                                                onChange={(e) =>
                                                    updateExperience(index, "secteur", e.target.value)
                                                }
                                                placeholder="Ex: Banque, Retail..."
                                            />
                                        </div>

                                        <FormTextarea
                                            label="Description courte"
                                            value={exp.description_courte}
                                            onChange={(e) =>
                                                updateExperience(index, "description_courte", e.target.value)
                                            }
                                            placeholder="Brève description de la mission..."
                                            rows={2}
                                        />

                                        <FormTextarea
                                            label="Résultats & livrables"
                                            value={exp.resultats_livrables}
                                            onChange={(e) =>
                                                updateExperience(index, "resultats_livrables", e.target.value)
                                            }
                                            placeholder="Quels résultats avez-vous obtenus ?"
                                            rows={2}
                                        />

                                        <FormTextarea
                                            label="Compétences utilisées"
                                            value={exp.competences_utilisees}
                                            onChange={(e) =>
                                                updateExperience(index, "competences_utilisees", e.target.value)
                                            }
                                            placeholder="Ex: Python, SQL, Power BI..."
                                            rows={2}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                label="Date de début"
                                                type="date"
                                                value={exp.date_debut}
                                                onChange={(e) =>
                                                    updateExperience(index, "date_debut", e.target.value)
                                                }
                                            />

                                            <FormField
                                                label="Date de fin"
                                                type="date"
                                                value={exp.date_fin}
                                                onChange={(e) =>
                                                    updateExperience(index, "date_fin", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {formData.experiences.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Aucune expérience ajoutée. Cliquez sur "Ajouter une expérience" pour commencer.
                                </p>
                            )}
                        </div>
                    </motion.div >
                )
                }

                {/* Step 4: Availability & Pricing */}
                {
                    currentStep === 4 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-2">
                                    Disponibilité et tarifs
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Indiquez votre disponibilité et vos conditions tarifaires
                                </p>
                            </div>

                            <RadioGroup
                                label="Disponibilité actuelle"
                                options={DISPONIBILITE.map((d) => ({
                                    value: d.value,
                                    label: d.label,
                                }))}
                                value={formData.disponibilite_actuelle}
                                onChange={(value) => handleChange("disponibilite_actuelle", value)}
                                layout="vertical"
                            />

                            {formData.disponibilite_actuelle === "Disponible à partir de" && (
                                <FormField
                                    label="Date de disponibilité"
                                    name="date_disponibilite"
                                    type="date"
                                    value={formData.date_disponibilite}
                                    onChange={(e) => handleChange("date_disponibilite", e.target.value)}
                                />
                            )}

                            <FormSelect
                                label="Charge disponible"
                                name="charge_disponible"
                                value={formData.charge_disponible}
                                onChange={(e) => handleChange("charge_disponible", e.target.value)}
                                options={CHARGE_DISPONIBLE}
                            />

                            <RadioGroup
                                label="Mode de travail préféré"
                                options={MODE_TRAVAIL}
                                value={formData.mode_travail_prefere}
                                onChange={(value) => handleChange("mode_travail_prefere", value)}
                                layout="horizontal"
                            />

                            <div className="pt-4 border-t border-border">
                                <h4 className="font-semibold text-foreground mb-4">Tarification</h4>

                                <div className="space-y-6">
                                    <FormField
                                        label="TJM (Tarif Journalier Moyen)"
                                        name="tjm"
                                        type="number"
                                        value={formData.tjm}
                                        onChange={(e) => handleChange("tjm", e.target.value)}
                                        placeholder="600"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            label="TJM Minimum"
                                            name="tjm_min"
                                            type="number"
                                            value={formData.tjm_min}
                                            onChange={(e) => handleChange("tjm_min", e.target.value)}
                                            placeholder="500"
                                        />

                                        <FormField
                                            label="TJM Maximum"
                                            name="tjm_max"
                                            type="number"
                                            value={formData.tjm_max}
                                            onChange={(e) => handleChange("tjm_max", e.target.value)}
                                            placeholder="800"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                }

                {/* Step 5: Settings & Finalization */}
                {
                    currentStep === 5 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-2">
                                    Paramètres et finalisation
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Dernières étapes avant de créer votre compte
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 border-2 border-border rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="profil_public"
                                        checked={formData.profil_public}
                                        onChange={(e) => handleChange("profil_public", e.target.checked)}
                                        className="w-5 h-5 rounded bg-secondary border-border text-primary focus:ring-primary mt-0.5"
                                    />
                                    <label htmlFor="profil_public" className="text-sm text-foreground flex-1">
                                        <span className="font-medium">Profil public</span>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Rendre mon profil visible dans les recherches publiques
                                        </p>
                                    </label>
                                </div>

                                <div className="flex items-start gap-3 p-4 border-2 border-border rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="autorisation_matching_ia"
                                        checked={formData.autorisation_matching_ia}
                                        onChange={(e) =>
                                            handleChange("autorisation_matching_ia", e.target.checked)
                                        }
                                        className="w-5 h-5 rounded bg-secondary border-border text-primary focus:ring-primary mt-0.5"
                                    />
                                    <label
                                        htmlFor="autorisation_matching_ia"
                                        className="text-sm text-foreground flex-1"
                                    >
                                        <span className="font-medium">Autorisation matching IA</span>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            J'autorise l'utilisation de mes données par l'IA pour le matching intelligent avec les missions
                                        </p>
                                    </label>
                                </div>

                                <div className="flex items-start gap-3 p-4 border-2 border-primary/50 rounded-lg bg-primary/5">
                                    <input
                                        type="checkbox"
                                        id="cgu_acceptees"
                                        checked={formData.cgu_acceptees}
                                        onChange={(e) => handleChange("cgu_acceptees", e.target.checked)}
                                        className="w-5 h-5 rounded bg-secondary border-border text-primary focus:ring-primary mt-0.5"
                                        required
                                    />
                                    <label htmlFor="cgu_acceptees" className="text-sm text-foreground flex-1">
                                        <span className="font-medium">
                                            J'accepte les Conditions Générales d'Utilisation *
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            J'ai lu et j'accepte les{" "}
                                            <a href="#" className="text-primary hover:underline">
                                                CGU
                                            </a>{" "}
                                            et la{" "}
                                            <a href="#" className="text-primary hover:underline">
                                                Politique de confidentialité
                                            </a>
                                        </p>
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )
                }

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            if (currentStep > 1) {
                                setCurrentStep(currentStep - 1);
                                window.scrollTo(0, 0);
                            } else {
                                onCancel?.();
                            }
                        }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {currentStep === 1 ? "Annuler" : "Précédent"}
                    </Button>

                    <Button type="submit" variant="hero">
                        {currentStep === steps.length ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Créer mon compte
                            </>
                        ) : (
                            <>
                                Suivant
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </form >
        </GlassCard >
    );
}
