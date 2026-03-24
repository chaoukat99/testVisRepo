import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, DollarSign, Settings, Save, Send, ArrowRight, ArrowLeft, Check, FileText, Eye } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormField, FormTextarea, FormSelect } from "@/components/forms/FormField";
import { TagsInput } from "@/components/forms/TagsInput";
import { RadioGroup } from "@/components/forms/RadioGroup";
import { CheckboxGroup } from "@/components/forms/CheckboxGroup";
import { useTaxonomy } from "@/hooks/useTaxonomy";
import { SenioritySlider } from "@/components/forms/SenioritySlider";
import { CountryCitySelector } from "@/components/forms/CountryCitySelector";

export interface MissionPostFormData {
    // A. Informations générales
    title: string;
    summary: string;
    description: string;

    // B. Profil recherché
    consultantTypes: string[];
    seniority: number;
    technicalSkills: string[];
    businessSkills: string[];
    minExperience: string;
    selectedDomain: string;
    selectedJob: string;

    // C. Modalités pratiques
    country: string;
    city: string;
    workMode: string;
    startDate: string;
    duration: string;
    workload: string;

    // D. Budget et contrat
    remunerationType: string;
    budgetMin: string;
    budgetMax: string;
    contractType: string;
    billingMode: string;

    // E. Processus de sélection
    numConsultants: string;
    requiredDocs: string[];
    deadline: string;

    // F. Paramètres de visibilité
    visibility: string;
    isCompanyNameVisible: string;
    requireNDA: boolean;

    // "Autre" fields
    selectedDomainAutre?: string;
    selectedJobAutre?: string;
    contractTypeAutre?: string;
}

const steps = [
    { id: 1, name: "Général", icon: Briefcase },
    { id: 2, name: "Profil", icon: Users },
    { id: 3, name: "Modalités", icon: Settings },
    { id: 4, name: "Budget", icon: DollarSign },
    { id: 5, name: "Sélection", icon: FileText },
    { id: 6, name: "Visibilité", icon: Eye },
];

const CONSULTANT_TYPES = [
    { value: "Indépendant", label: "Indépendant" },
    { value: "Cabinet de conseil", label: "Cabinet de conseil" },
    { value: "Peu importe", label: "Peu importe" },
];

const MIN_EXPERIENCES = [
    { value: "0–2 ans", label: "0–2 ans" },
    { value: "2–5 ans", label: "2–5 ans" },
    { value: "5–10 ans", label: "5–10 ans" },
    { value: "10+ ans", label: "10+ ans" },
];

const WORK_MODES = [
    { value: "Remote", label: "Remote" },
    { value: "Hybride", label: "Hybride" },
    { value: "Sur site", label: "Sur site" },
];

const REMUNERATION_TYPES = [
    { value: "TJM", label: "TJM" },
    { value: "Forfait global", label: "Forfait global" },
    { value: "À discuter", label: "À discuter" },
];

const CONTRACT_TYPES = [
    { value: "Prestation de service", label: "Prestation de service" },
    { value: "Portage salarial accepté", label: "Portage salarial accepté" },
    { value: "Autre", label: "Autre" },
];

const BILLING_MODES = [
    { value: "Mensuelle", label: "Mensuelle" },
    { value: "À l’avancement", label: "À l’avancement" },
    { value: "À la livraison", label: "À la livraison" },
];

const NUM_CONSULTANTS = [
    { value: "3", label: "3" },
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20+", label: "20+" },
];

const REQUIRED_DOCS = [
    { value: "CV", label: "CV" },
    { value: "Portfolio", label: "Portfolio" },
    { value: "Références clients", label: "Références clients" },
    { value: "Étude de cas", label: "Étude de cas" },
    { value: "Autre", label: "Autre" },
];

export function MissionPostForm({
    onSubmit,
    onCancel,
}: {
    onSubmit: (data: MissionPostFormData, isDraft: boolean) => void;
    onCancel?: () => void;
}) {
    const { taxonomy } = useTaxonomy();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<MissionPostFormData>({
        title: "",
        summary: "",
        description: "",
        consultantTypes: [],
        seniority: 5,
        technicalSkills: [],
        businessSkills: [],
        minExperience: "",
        selectedDomain: "",
        selectedJob: "",
        country: "",
        city: "",
        workMode: "",
        startDate: "",
        duration: "",
        workload: "",
        remunerationType: "",
        budgetMin: "",
        budgetMax: "",
        contractType: "",
        billingMode: "",
        numConsultants: "",
        requiredDocs: [],
        deadline: "",
        visibility: "Publique",
        isCompanyNameVisible: "Oui",
        requireNDA: false,
        selectedDomainAutre: "",
        selectedJobAutre: "",
        contractTypeAutre: "",
    });

    const handleChange = (field: keyof MissionPostFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleSkillSelection = (field: "technicalSkills" | "businessSkills", skill: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(skill)
                ? prev[field].filter(s => s !== skill)
                : [...prev[field], skill]
        }));
    };

    const handleDomainChange = (domain: string) => {
        setFormData(prev => ({
            ...prev,
            selectedDomain: domain,
            selectedDomainAutre: domain === "Autre" ? prev.selectedDomainAutre : "",
            selectedJob: "",
            technicalSkills: [],
            businessSkills: []
        }));
    };

    const handleJobChange = (job: string) => {
        setFormData(prev => ({
            ...prev,
            selectedJob: job,
            selectedJobAutre: job === "Autre" ? prev.selectedJobAutre : "",
            technicalSkills: [],
            businessSkills: []
        }));
    };

    const handleSubmit = (e: React.FormEvent, isDraft = false) => {
        e.preventDefault();
        if (!isDraft && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        } else {
            onSubmit(formData, isDraft);
        }
    };

    const progress = (currentStep / steps.length) * 100;

    const techSuggestions = formData.selectedJob
        ? taxonomy[formData.selectedDomain]?.jobs?.[formData.selectedJob]?.tools || []
        : [];

    const businessSuggestions = formData.selectedJob
        ? taxonomy[formData.selectedDomain]?.jobs?.[formData.selectedJob]?.skills || []
        : [];

    return (
        <GlassCard className="max-w-4xl mx-auto" hover={false}>
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
                                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${isActive
                                            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                                            : isCompleted
                                                ? "bg-primary/20 text-primary"
                                                : "bg-secondary/50 text-muted-foreground"
                                            }`}
                                    >
                                        {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                                    </div>
                                    <span className={`text-[10px] font-medium hidden md:block ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                        {step.name}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-[2px] mx-1 rounded-full ${currentStep > step.id ? "bg-primary" : "bg-secondary/50"}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="w-full h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
                {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">A. Informations générales</h3>
                            <p className="text-sm text-muted-foreground">Présentez votre mission aux consultants</p>
                        </div>

                        <FormField
                            label="Titre de la mission"
                            name="title"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            placeholder="ex: Mise en place d’un data warehouse pour une banque"
                            required
                        />

                        <FormField
                            label="Résumé de la mission"
                            name="summary"
                            value={formData.summary}
                            onChange={(e) => handleChange("summary", e.target.value)}
                            placeholder="Résumé en 2/3 lignes"
                            required
                        />

                        <FormTextarea
                            label="Description détaillée"
                            name="description"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Contexte, Objectifs, Livrables attendus, Enjeux business..."
                            rows={8}
                            required
                        />
                    </motion.div>
                )}

                {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">B. Profil recherché</h3>
                            <p className="text-sm text-muted-foreground">Définissez l'expertise nécessaire</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-secondary/10 rounded-xl border border-border/50">
                            <FormSelect
                                label="Domaine d'activité"
                                name="selectedDomain"
                                value={formData.selectedDomain}
                                onChange={(e) => handleDomainChange(e.target.value)}
                                options={[...Object.keys(taxonomy).map(d => ({ value: d, label: d })), { value: "Autre", label: "Autre" }]}
                            />

                            {formData.selectedDomain && formData.selectedDomain !== "Autre" && (
                                <FormSelect
                                    label="Métier recherché"
                                    name="selectedJob"
                                    value={formData.selectedJob}
                                    onChange={(e) => handleJobChange(e.target.value)}
                                    options={[...Object.keys(taxonomy[formData.selectedDomain]?.jobs || {}).map(j => ({ value: j, label: j })), { value: "Autre", label: "Autre" }]}
                                />
                            )}
                        </div>

                        {formData.selectedDomain === "Autre" && (
                            <FormField
                                label="Précisez le domaine d'activité"
                                name="selectedDomainAutre"
                                value={formData.selectedDomainAutre}
                                onChange={(e) => handleChange("selectedDomainAutre", e.target.value)}
                                placeholder="Votre secteur d'activité"
                                required
                            />
                        )}

                        {(formData.selectedJob === "Autre" || formData.selectedDomain === "Autre") && (
                            <FormField
                                label="Précisez le métier / titre du poste"
                                name="selectedJobAutre"
                                value={formData.selectedJobAutre}
                                onChange={(e) => handleChange("selectedJobAutre", e.target.value)}
                                placeholder="ex: Responsable R&D, Consultant Cybersécurité..."
                                required
                            />
                        )}

                        <CheckboxGroup
                            label="Type de consultant"
                            options={CONSULTANT_TYPES}
                            selected={formData.consultantTypes}
                            onChange={(val) => handleChange("consultantTypes", val)}
                            layout="horizontal"
                        />

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-foreground block">
                                        Compétences techniques clés (Outils)
                                    </label>
                                    <p className="text-[10px] text-muted-foreground italic">
                                        (Sélectionnez parmi les propositions ou ajoutez-en de nouvelles)
                                    </p>
                                </div>
                                <TagsInput
                                    label=""
                                    tags={formData.technicalSkills}
                                    onTagsChange={(val) => handleChange("technicalSkills", val)}
                                    suggestions={techSuggestions}
                                    placeholder="Tapez une compétence et appuyez sur Entrée"
                                />
                                {techSuggestions.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {techSuggestions.map(tool => (
                                            <Badge
                                                key={tool}
                                                variant={formData.technicalSkills.includes(tool) ? "secondary" : "outline"}
                                                className={`cursor-pointer transition-all hover:scale-105 ${formData.technicalSkills.includes(tool)
                                                    ? "bg-secondary text-secondary-foreground"
                                                    : "bg-background/20 text-muted-foreground"
                                                    }`}
                                                onClick={() => toggleSkillSelection("technicalSkills", tool)}
                                            >
                                                {tool}
                                                {formData.technicalSkills.includes(tool) && <Check className="w-3 h-3 ml-1.5" />}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-foreground block">
                                        Compétences métiers / sectorielles
                                    </label>
                                    <p className="text-[10px] text-muted-foreground italic">
                                        (Sélectionnez parmi les propositions ou ajoutez-en de nouvelles)
                                    </p>
                                </div>
                                <TagsInput
                                    label=""
                                    tags={formData.businessSkills}
                                    onTagsChange={(val) => handleChange("businessSkills", val)}
                                    suggestions={businessSuggestions}
                                    placeholder="ex: Banque, Assurance, Retail..."
                                />
                                {businessSuggestions.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {businessSuggestions.map(skill => (
                                            <Badge
                                                key={skill}
                                                variant={formData.businessSkills.includes(skill) ? "default" : "outline"}
                                                className={`cursor-pointer transition-all hover:scale-105 ${formData.businessSkills.includes(skill)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-background/20 text-muted-foreground"
                                                    }`}
                                                onClick={() => toggleSkillSelection("businessSkills", skill)}
                                            >
                                                {skill}
                                                {formData.businessSkills.includes(skill) && <Check className="w-3 h-3 ml-1.5" />}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <SenioritySlider
                            label="Niveau de séniorité requis"
                            value={formData.seniority}
                            onChange={(val) => handleChange("seniority", val)}
                        />

                        <FormSelect
                            label="Expérience minimale (rappel)"
                            name="minExperience"
                            value={formData.minExperience}
                            onChange={(e) => handleChange("minExperience", e.target.value)}
                            options={MIN_EXPERIENCES}
                            required
                        />
                    </motion.div>
                )}

                {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">C. Modalités pratiques</h3>
                            <p className="text-sm text-muted-foreground">Logistique et planning</p>
                        </div>

                        <CountryCitySelector
                            countryLabel="Pays de la mission"
                            cityLabel="Ville"
                            countryName="country"
                            cityName="city"
                            selectedCountry={formData.country}
                            selectedCity={formData.city}
                            onCountryChange={(value) => handleChange("country", value)}
                            onCityChange={(value) => handleChange("city", value)}
                            required
                            grid
                        />

                        <RadioGroup
                            label="Mode de travail"
                            options={WORK_MODES}
                            value={formData.workMode}
                            onChange={(val) => handleChange("workMode", val)}
                            layout="horizontal"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Date de démarrage souhaitée"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleChange("startDate", e.target.value)}
                                required
                            />

                            <FormField
                                label="Durée estimée"
                                name="duration"
                                value={formData.duration}
                                onChange={(e) => handleChange("duration", e.target.value)}
                                placeholder="ex: 6 mois"
                                required
                            />
                        </div>

                        <FormField
                            label="Charge estimée (Nb de jours / semaine ou total)"
                            name="workload"
                            value={formData.workload}
                            onChange={(e) => handleChange("workload", e.target.value)}
                            placeholder="ex: 3 jours par semaine"
                            required
                        />
                    </motion.div>
                )}

                {currentStep === 4 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">D. Budget et contrat</h3>
                            <p className="text-sm text-muted-foreground">Conditions financières et contractuelles</p>
                        </div>

                        <RadioGroup
                            label="Type de rémunération"
                            options={REMUNERATION_TYPES}
                            value={formData.remunerationType}
                            onChange={(val) => handleChange("remunerationType", val)}
                            layout="horizontal"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Budget Min"
                                name="budgetMin"
                                type="text"
                                value={formData.budgetMin}
                                onChange={(e) => handleChange("budgetMin", e.target.value)}
                                placeholder="ex: 500"
                            />
                            <FormField
                                label="Budget Max"
                                name="budgetMax"
                                type="text"
                                value={formData.budgetMax}
                                onChange={(e) => handleChange("budgetMax", e.target.value)}
                                placeholder="ex: 800"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormSelect
                                label="Type de contrat"
                                name="contractType"
                                value={formData.contractType}
                                onChange={(e) => handleChange("contractType", e.target.value)}
                                options={CONTRACT_TYPES}
                                required
                            />

                            {formData.contractType === "Autre" && (
                                <FormField
                                    label="Précisez le type de contrat"
                                    name="contractTypeAutre"
                                    value={formData.contractTypeAutre}
                                    onChange={(e) => handleChange("contractTypeAutre", e.target.value)}
                                    placeholder="ex: Contrat de collaboration, etc."
                                    required
                                />
                            )}
                            <FormSelect
                                label="Mode de facturation"
                                name="billingMode"
                                value={formData.billingMode}
                                onChange={(e) => handleChange("billingMode", e.target.value)}
                                options={BILLING_MODES}
                                required
                            />
                        </div>
                    </motion.div>
                )}

                {currentStep === 5 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">E. Processus de sélection</h3>
                            <p className="text-sm text-muted-foreground">Organisation du recrutement</p>
                        </div>

                        <FormSelect
                            label="Nombre de consultants à présélectionner"
                            name="numConsultants"
                            value={formData.numConsultants}
                            onChange={(e) => handleChange("numConsultants", e.target.value)}
                            options={NUM_CONSULTANTS}
                            required
                        />

                        <CheckboxGroup
                            label="Documents à fournir par le consultant"
                            options={REQUIRED_DOCS}
                            selected={formData.requiredDocs}
                            onChange={(val) => handleChange("requiredDocs", val)}
                            layout="grid"
                        />

                        <FormField
                            label="Date limite de candidature"
                            name="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => handleChange("deadline", e.target.value)}
                            required
                        />
                    </motion.div>
                )}

                {currentStep === 6 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">F. Paramètres de visibilité</h3>
                            <p className="text-sm text-muted-foreground">Confidentialité et exposition</p>
                        </div>

                        <RadioGroup
                            label="Visibilité de l’offre"
                            options={[
                                { value: "Publique", label: "Publique (visible par tous)" },
                                { value: "Privée", label: "Privée (uniquement sur invitation / matching IA)" },
                            ]}
                            value={formData.visibility}
                            onChange={(val) => handleChange("visibility", val)}
                            layout="vertical"
                        />

                        <RadioGroup
                            label="Nom de l’entreprise visible ?"
                            options={[
                                { value: "Oui", label: "Oui" },
                                { value: "Non", label: "Non (Offre confidentielle)" },
                            ]}
                            value={formData.isCompanyNameVisible}
                            onChange={(val) => handleChange("isCompanyNameVisible", val)}
                            layout="horizontal"
                        />

                        <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-secondary/20">
                            <input
                                type="checkbox"
                                id="requireNDA"
                                checked={formData.requireNDA}
                                onChange={(e) => handleChange("requireNDA", e.target.checked)}
                                className="w-5 h-5 rounded bg-secondary border-border text-primary focus:ring-primary mt-0.5"
                            />
                            <label htmlFor="requireNDA" className="text-sm text-foreground">
                                Confidentialité / NDA requis ?
                            </label>
                        </div>
                    </motion.div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : onCancel?.())}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {currentStep === 1 ? "Annuler" : "Précédent"}
                        </Button>

                        {currentStep === steps.length && (
                            <Button type="button" variant="outline" onClick={(e: any) => handleSubmit(e, true)}>
                                <Save className="w-4 h-4 mr-2" />
                                Enregistrer comme brouillon
                            </Button>
                        )}
                    </div>

                    <Button type="submit" variant="hero">
                        {currentStep === steps.length ? (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Publier la mission
                            </>
                        ) : (
                            <>
                                Suivant
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </GlassCard>
    );
}
