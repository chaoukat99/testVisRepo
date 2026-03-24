import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase, DollarSign, Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { FormField, FormTextarea, FormSelect } from "@/components/forms/FormField";
import { TagsInput } from "@/components/forms/TagsInput";
import { RadioGroup } from "@/components/forms/RadioGroup";
import { CheckboxGroup } from "@/components/forms/CheckboxGroup";
import { RangeSlider } from "@/components/forms/RangeSlider";
import { Badge } from "@/components/ui/badge";
import { useTaxonomy } from "@/hooks/useTaxonomy";
import { SenioritySlider } from "@/components/forms/SenioritySlider";
import { CountryCitySelector } from "@/components/forms/CountryCitySelector";
interface ConsultantSearchFormData {
    // Step 1: Need & Skills
    needTitle: string;
    missionType: string;
    missionTypeAutre?: string;
    objective: string;
    technicalSkills?: string[]; // Deprecated but kept for compatibility if needed
    businessSkills?: string[]; // Deprecated
    selectedDomain: string;
    selectedJob: string;
    selectedCoreSkills: string[];
    selectedTools: string[];

    // Step 2: Mission Details
    country: string;
    city: string;
    presence: string[];
    startDate: string;
    duration: string;
    volume: string;

    // Step 3: Budget & Preferences
    dailyRate: number;
    budgetType: string;
    languages: string[];
    minSeniority: number;
    companyType: string[];
}

const steps = [
    { id: 1, name: "Besoin", icon: Search },
    { id: 2, name: "Mission", icon: Briefcase },
    { id: 3, name: "Budget", icon: DollarSign },
];

const MISSION_TYPES = [
    { value: "strategy", label: "Conseil stratégique" },
    { value: "data-ai", label: "Data/IA" },
    { value: " development", label: "Développement" },
    { value: "finance", label: "Finance" },
    { value: "marketing", label: "Marketing" },
    { value: "hr", label: "RH" },
    { value: "other", label: "Autre" },
];

const TECH_SKILLS = [
    "Python", "SQL", "Power BI", "Tableau", "Machine Learning", "React",
    "Node.js", "Django", "Java", "Docker", "Kubernetes", "AWS", "Azure", "GCP"
];

const BUSINESS_SKILLS = [
    "Banque", "Retail", "Industrie", "Santé", "Startups", "E-commerce",
    "Assurance", "Energie", "Télécom", "Secteur Public"
];

const EXPERIENCE_LEVELS = [
    { value: "junior", label: "Junior", description: "0-3 ans" },
    { value: "confirmed", label: "Confirmé", description: "3-7 ans" },
    { value: "senior", label: "Senior", description: "7-15 ans" },
    { value: "expert", label: "Expert", description: "15+ ans" },
];

const PRESENCE_OPTIONS = [
    { value: "remote", label: "Remote" },
    { value: "partial", label: "Présentiel partiel" },
    { value: "full", label: "Présentiel total" },
];

const DURATIONS = [
    { value: "days", label: "Quelques jours" },
    { value: "1-3", label: "1-3 mois" },
    { value: "3-6", label: "3-6 mois" },
    { value: "6+", label: "> 6 mois" },
];

const VOLUMES = [
    { value: "1", label: "1 j/semaine" },
    { value: "2-3", label: "2-3 j/semaine" },
    { value: "4-5", label: "4-5 j/semaine" },
];

const BUDGET_TYPES = [
    { value: "tjm", label: "TJM", description: "Tarif jour/homme" },
    { value: "fixed", label: "Forfait", description: "Prix fixe global" },
    { value: "discuss", label: "À définir", description: "Négociation ouverte" },
];

const LANGUAGES = [
    { value: "french", label: "Français" },
    { value: "english", label: "Anglais" },
    { value: "arabic", label: "Arabe" },
    { value: "spanish", label: "Espagnol" },
    { value: "other", label: "Autres" },
];

const COMPANY_TYPES = [
    { value: "enterprise", label: "Grande entreprise" },
    { value: "startup", label: "Startup" },
];

interface ConsultantSearchFormProps {
    onSearch: (data: ConsultantSearchFormData) => void;
    onCancel?: () => void;
}

export function ConsultantSearchForm({
    onSearch,
    onCancel,
}: ConsultantSearchFormProps) {
    const { taxonomy } = useTaxonomy();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ConsultantSearchFormData>({
        needTitle: "",
        missionType: "",
        missionTypeAutre: "",
        objective: "",
        selectedDomain: "",
        selectedJob: "",
        selectedCoreSkills: [],
        selectedTools: [],
        country: "",
        city: "",
        presence: [],
        startDate: "",
        duration: "",
        volume: "",
        dailyRate: 500,
        budgetType: "",
        languages: [],
        minSeniority: 5,
        companyType: [],
    });

    const handleChange = (field: keyof ConsultantSearchFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDomainChange = (domain: string) => {
        setFormData(prev => ({
            ...prev,
            selectedDomain: domain,
            selectedJob: "",
            selectedCoreSkills: [],
            selectedTools: []
        }));
    };

    const handleJobChange = (job: string) => {
        setFormData(prev => ({
            ...prev,
            selectedJob: job,
            selectedCoreSkills: [],
            selectedTools: []
        }));
    };

    const toggleArrayItem = (field: "selectedCoreSkills" | "selectedTools", item: string) => {
        setFormData(prev => {
            const current = (prev[field] as string[]);
            const updated = current.includes(item)
                ? current.filter(i => i !== item)
                : [...current, item];
            return { ...prev, [field]: updated };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        } else {
            onSearch(formData);
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
                                            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                                            : isCompleted
                                                ? "bg-primary/20 text-primary"
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
                                        className={`text-xs font-medium hidden sm:block ${isActive ? "text-primary" : "text-muted-foreground"
                                            }`}
                                    >
                                        {step.name}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 rounded-full transition-all ${currentStep > step.id ? "bg-primary" : "bg-secondary/50"
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
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Need & Skills */}
                {currentStep === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Définissez votre besoin
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Décrivez le type de consultant que vous recherchez
                            </p>
                        </div>

                        <FormField
                            label="Intitulé du besoin"
                            name="needTitle"
                            value={formData.needTitle}
                            onChange={(e) => handleChange("needTitle", e.target.value)}
                            placeholder="Ex: Consultant data pour dashboard Power BI"
                            required
                        />

                        <FormSelect
                            label="Type de mission"
                            name="missionType"
                            value={formData.missionType}
                            onChange={(e) => handleChange("missionType", e.target.value)}
                            options={MISSION_TYPES}
                            required
                        />

                        {formData.missionType === "other" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <FormField
                                    label="Précisez le type de mission"
                                    name="missionTypeAutre"
                                    value={formData.missionTypeAutre || ""}
                                    onChange={(e) => handleChange("missionTypeAutre", e.target.value)}
                                    placeholder="Ex: Architecture Navale..."
                                    required
                                />
                            </motion.div>
                        )}

                        <FormTextarea
                            label="Objectif principal"
                            name="objective"
                            value={formData.objective}
                            onChange={(e) => handleChange("objective", e.target.value)}
                            placeholder="Décrivez brièvement l'objectif de cette mission (1 à 3 phrases)..."
                            required
                        />

                        {/* Hierarchical Skills Selection */}
                        <div className="space-y-6 pt-4 border-t border-border">
                            <h4 className="font-semibold text-foreground">Compétences et Outils</h4>

                            <FormSelect
                                label="Domaine Global"
                                name="selectedDomain"
                                value={formData.selectedDomain}
                                onChange={(e) => handleDomainChange(e.target.value)}
                                options={Object.keys(taxonomy).map(d => ({ value: d, label: d }))}
                            />

                            {formData.selectedDomain && taxonomy[formData.selectedDomain] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <FormSelect
                                        label="Métier / Job Title"
                                        name="selectedJob"
                                        value={formData.selectedJob}
                                        onChange={(e) => handleJobChange(e.target.value)}
                                        options={Object.keys(taxonomy[formData.selectedDomain].jobs).map(j => ({ value: j, label: j }))}
                                    />
                                </motion.div>
                            )}

                            {formData.selectedJob && formData.selectedDomain && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Core Skills */}
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-foreground block">
                                                Compétences Clés
                                            </label>
                                            <p className="text-[10px] text-muted-foreground italic">
                                                (Sélectionnez parmi les propositions)
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {taxonomy[formData.selectedDomain]?.jobs?.[formData.selectedJob]?.skills?.map(skill => (
                                                <Badge
                                                    key={skill}
                                                    variant={formData.selectedCoreSkills.includes(skill) ? "default" : "outline"}
                                                    className={`cursor-pointer transition-all hover:scale-105 ${formData.selectedCoreSkills.includes(skill)
                                                        ? "bg-primary hover:bg-primary/90"
                                                        : "hover:bg-accent/50"
                                                        }`}
                                                    onClick={() => toggleArrayItem("selectedCoreSkills", skill)}
                                                >
                                                    {skill}
                                                    {formData.selectedCoreSkills.includes(skill) && <Check className="w-3 h-3 ml-1.5 inline" />}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tools */}
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-foreground block">
                                                Outils Maîtrisés
                                            </label>
                                            <p className="text-[10px] text-muted-foreground italic">
                                                (Sélectionnez parmi les propositions)
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {taxonomy[formData.selectedDomain]?.jobs?.[formData.selectedJob]?.tools?.map(tool => (
                                                <Badge
                                                    key={tool}
                                                    variant={formData.selectedTools.includes(tool) ? "secondary" : "outline"}
                                                    className={`cursor-pointer transition-all hover:scale-105 ${formData.selectedTools.includes(tool)
                                                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                        : "hover:bg-accent/50"
                                                        }`}
                                                    onClick={() => toggleArrayItem("selectedTools", tool)}
                                                >
                                                    {tool}
                                                    {formData.selectedTools.includes(tool) && <Check className="w-3 h-3 ml-1.5 inline" />}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Mission Details */}
                {currentStep === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Détails de la mission
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Précisez les modalités pratiques de la mission
                            </p>
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

                        <CheckboxGroup
                            label="Présence requise"
                            options={PRESENCE_OPTIONS}
                            selected={formData.presence}
                            onChange={(selected) => handleChange("presence", selected)}
                            layout="horizontal"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                label="Date de démarrage"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleChange("startDate", e.target.value)}
                                required
                            />

                            <FormSelect
                                label="Durée estimée"
                                name="duration"
                                value={formData.duration}
                                onChange={(e) => handleChange("duration", e.target.value)}
                                options={DURATIONS}
                                required
                            />

                            <FormSelect
                                label="Volume (j/semaine)"
                                name="volume"
                                value={formData.volume}
                                onChange={(e) => handleChange("volume", e.target.value)}
                                options={VOLUMES}
                                required
                            />
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Budget & Preferences */}
                {currentStep === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Budget et préférences
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Définissez vos contraintes budgétaires et préférences
                            </p>
                        </div>

                        <RangeSlider
                            label="Budget estimé / jour"
                            min={200}
                            max={2000}
                            step={50}
                            value={formData.dailyRate}
                            onChange={(value) => handleChange("dailyRate", value)}
                            unit="€/jour"
                            marks={[
                                { value: 200, label: "200€" },
                                { value: 500, label: "500€" },
                                { value: 1000, label: "1000€" },
                                { value: 2000, label: "2000€" },
                            ]}
                        />

                        <RadioGroup
                            label="Type de tarification"
                            options={BUDGET_TYPES}
                            value={formData.budgetType}
                            onChange={(value) => handleChange("budgetType", value)}
                            layout="horizontal"
                        />

                        <CheckboxGroup
                            label="Langues de travail"
                            options={LANGUAGES}
                            selected={formData.languages}
                            onChange={(selected) => handleChange("languages", selected)}
                            layout="horizontal"
                        />

                        <SenioritySlider
                            label="Niveau de séniorité minimum"
                            value={formData.minSeniority}
                            onChange={(value) => handleChange("minSeniority", value)}
                        />

                        <CheckboxGroup
                            label="Expérience en..."
                            options={COMPANY_TYPES}
                            selected={formData.companyType}
                            onChange={(selected) => handleChange("companyType", selected)}
                            layout="horizontal"
                        />
                    </motion.div>
                )}

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
                                <Sparkles className="w-4 h-4 mr-2" />
                                Voir les profils
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
        </GlassCard >
    );
}
