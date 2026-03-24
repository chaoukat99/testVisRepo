import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, User, Target, Settings, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { FormField, FormSelect, FormTextarea } from "@/components/forms/FormField";
import { CheckboxGroup } from "@/components/forms/CheckboxGroup";
import { RadioGroup } from "@/components/forms/RadioGroup";
import { MultiSelect } from "@/components/forms/MultiSelect";
import { CountryCitySelector } from "@/components/forms/CountryCitySelector";

interface CompanyFormData {
    // Section A: Informations du compte
    companyName: string;
    legalForm: string;
    siret: string;
    mainSector: string;
    companySize: string;
    country: string;
    city: string;
    address: string;

    // Section B: Profil du contact principal
    firstName: string;
    lastName: string;
    position: string;
    email: string;
    phone: string;
    contactPreferences: string[];

    // Section C: Besoins en consulting
    missionTypes: string[];
    frequency: string;
    workMode: string[];
    targetZones: string[];

    // Section D: Paramètres du compte
    password: string;
    confirmPassword: string;
    language: string;
    acceptTerms: boolean;
    // Section "Autre" handlers
    legalFormAutre?: string;
    mainSectorAutre?: string;
    languageAutre?: string;
}

const steps = [
    { id: 1, name: "Info Entreprise", icon: Building2 },
    { id: 2, name: "Contact", icon: User },
    { id: 3, name: "Besoins", icon: Target },
    { id: 4, name: "Paramètres", icon: Settings },
];

const LEGAL_FORMS = [
    { value: "SA", label: "SA" },
    { value: "SARL", label: "SARL" },
    { value: "SAS", label: "SAS" },
    { value: "Auto-entreprise", label: "Auto-entreprise" },
    { value: "Association", label: "Association" },
    { value: "Autre", label: "Autre" },
];

const SECTORS = [
    { value: "Technologie", label: "Technologie" },
    { value: "Finance & Banque", label: "Finance & Banque" },
    { value: "Santé", label: "Santé" },
    { value: "Industrie", label: "Industrie" },
    { value: "Commerce", label: "Commerce / Retail" },
    { value: "Énergie", label: "Énergie" },
    { value: "Services", label: "Services" },
    { value: "Autre", label: "Autre" },
];

const COMPANY_SIZES = [
    { value: "1-10", label: "1–10" },
    { value: "11-50", label: "11–50" },
    { value: "51-200", label: "51–200" },
    { value: "201-1000", label: "201–1000" },
    { value: "1000+", label: "1000+" },
];



const MISSION_TYPES = [
    { value: "Stratégie", label: "Stratégie" },
    { value: "Data/IA", label: "Data/IA" },
    { value: "IT & Dév", label: "IT & Dév" },
    { value: "Finance", label: "Finance" },
    { value: "RH", label: "RH" },
    { value: "Marketing", label: "Marketing" },
    { value: "Opérations", label: "Opérations" },
    { value: "Autre", label: "Autre" },
];

const FREQUENCIES = [
    { value: "Occasionnel", label: "Occasionnel" },
    { value: "Régulier", label: "Régulier" },
    { value: "Programme long terme", label: "Programme long terme" },
];

const WORK_MODES = [
    { value: "100% remote", label: "100% remote" },
    { value: "Hybride", label: "Hybride" },
    { value: "100% sur site", label: "100% sur site" },
];

const CONTACT_PREFERENCES = [
    { value: "Email", label: "Email" },
    { value: "Téléphone", label: "Téléphone" },
    { value: "Visio", label: "Visio" },
    { value: "WhatsApp", label: "WhatsApp" },
];

const TARGET_ZONES = [
    { value: "Maroc", label: "Maroc" },
    { value: "France", label: "France" },
    { value: "Europe", label: "Europe" },
    { value: "MENA", label: "MENA" },
    { value: "Afrique", label: "Afrique" },
    { value: "Monde entier", label: "Monde entier" },
];

export function CompanyRegistrationForm({
    onSubmit,
    onCancel,
}: {
    onSubmit: (data: CompanyFormData) => void;
    onCancel?: () => void;
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<CompanyFormData>({
        companyName: "",
        legalForm: "",
        siret: "",
        mainSector: "",
        companySize: "",
        country: "",
        city: "",
        address: "",
        firstName: "",
        lastName: "",
        position: "",
        email: "",
        phone: "",
        contactPreferences: [],
        missionTypes: [],
        frequency: "",
        workMode: [],
        targetZones: [],
        password: "",
        confirmPassword: "",
        language: "FR",
        acceptTerms: false,
        legalFormAutre: "",
        mainSectorAutre: "",
        languageAutre: "",
    });

    const handleChange = (field: keyof CompanyFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        } else {
            onSubmit(formData);
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
                {/* Step 1: Informations du compte */}
                {currentStep === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                A. Informations du compte
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Parlez-nous de votre entreprise
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Nom de l’entreprise"
                                name="companyName"
                                value={formData.companyName}
                                onChange={(e) => handleChange("companyName", e.target.value)}
                                placeholder="Nom officiel"
                                required
                            />

                            <FormSelect
                                label="Forme juridique"
                                name="legalForm"
                                value={formData.legalForm}
                                onChange={(e) => handleChange("legalForm", e.target.value)}
                                options={LEGAL_FORMS}
                                required
                            />
                        </div>

                        {formData.legalForm === "Autre" && (
                            <FormField
                                label="Précisez la forme juridique"
                                name="legalFormAutre"
                                value={formData.legalFormAutre}
                                onChange={(e) => handleChange("legalFormAutre", e.target.value)}
                                placeholder="ex: Coopérative, etc."
                                required
                            />
                        )}

                        <FormField
                            label="SIRET / Identifiant fiscal"
                            name="siret"
                            value={formData.siret}
                            onChange={(e) => handleChange("siret", e.target.value)}
                            placeholder="Optionnel au début"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormSelect
                                label="Secteur d’activité principal"
                                name="mainSector"
                                value={formData.mainSector}
                                onChange={(e) => handleChange("mainSector", e.target.value)}
                                options={SECTORS}
                                required
                            />

                            {formData.mainSector === "Autre" && (
                                <FormField
                                    label="Précisez le secteur"
                                    name="mainSectorAutre"
                                    value={formData.mainSectorAutre}
                                    onChange={(e) => handleChange("mainSectorAutre", e.target.value)}
                                    placeholder="Votre secteur industriel"
                                    required
                                />
                            )}

                            <FormSelect
                                label="Taille de l’entreprise"
                                name="companySize"
                                value={formData.companySize}
                                onChange={(e) => handleChange("companySize", e.target.value)}
                                options={COMPANY_SIZES}
                                required
                            />
                        </div>

                        <CountryCitySelector
                            countryName="country"
                            cityName="city"
                            selectedCountry={formData.country}
                            selectedCity={formData.city}
                            onCountryChange={(value) => handleChange("country", value)}
                            onCityChange={(value) => handleChange("city", value)}
                            required
                            grid
                        />

                        <FormTextarea
                            label="Adresse complète (optionnel)"
                            name="address"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            placeholder="Rue, numéro, code postal..."
                            rows={3}
                        />
                    </motion.div>
                )}

                {/* Step 2: Profil du contact principal */}
                {currentStep === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                B. Profil du contact principal
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Coordonnées de la personne responsable
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Prénom"
                                name="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                placeholder="Prénom"
                                required
                            />

                            <FormField
                                label="Nom"
                                name="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                placeholder="Nom de famille"
                                required
                            />
                        </div>

                        <FormField
                            label="Fonction / Poste"
                            name="position"
                            value={formData.position}
                            onChange={(e) => handleChange("position", e.target.value)}
                            placeholder="Ex: Responsable Digital"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Email professionnel"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="email@entreprise.com"
                                required
                            />

                            <FormField
                                label="Numéro de téléphone"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                placeholder="+212 | +33 ..."
                                required
                            />
                        </div>

                        <CheckboxGroup
                            label="Préférence de contact"
                            options={CONTACT_PREFERENCES}
                            selected={formData.contactPreferences}
                            onChange={(selected) => handleChange("contactPreferences", selected)}
                            layout="horizontal"
                        />
                    </motion.div>
                )}

                {/* Step 3: Besoins en consulting */}
                {currentStep === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                C. Besoins en consulting (pour le matching)
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Identifiez vos besoins en expertise
                            </p>
                        </div>

                        <CheckboxGroup
                            label="Types de missions recherchées"
                            options={MISSION_TYPES}
                            selected={formData.missionTypes}
                            onChange={(selected) => handleChange("missionTypes", selected)}
                            layout="grid"
                        />

                        <RadioGroup
                            label="Fréquence de recours aux consultants"
                            options={FREQUENCIES}
                            value={formData.frequency}
                            onChange={(value) => handleChange("frequency", value)}
                            layout="vertical"
                        />

                        <CheckboxGroup
                            label="Mode de travail préféré"
                            options={WORK_MODES}
                            selected={formData.workMode}
                            onChange={(selected) => handleChange("workMode", selected)}
                            layout="horizontal"
                        />

                        <MultiSelect
                            label="Zones géographiques cibles pour les consultants"
                            options={TARGET_ZONES}
                            selected={formData.targetZones}
                            onChange={(selected) => handleChange("targetZones", selected)}
                            placeholder="Plusieurs sélections possibles"
                        />
                    </motion.div>
                )}

                {/* Step 4: Paramètres du compte */}
                {currentStep === 4 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                D. Paramètres du compte
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Sécurisez votre accès à la plateforme
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Mot de passe"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                placeholder="••••••••"
                                required
                            />

                            <FormField
                                label="Confirmation du mot de passe"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <FormSelect
                            label="Langue du compte"
                            name="language"
                            value={formData.language}
                            onChange={(e) => handleChange("language", e.target.value)}
                            options={[
                                { value: "FR", label: "Français" },
                                { value: "EN", label: "English" },
                                { value: "Autre", label: "Autre" },
                            ]}
                            required
                        />

                        {formData.language === "Autre" && (
                            <FormField
                                label="Précisez la langue"
                                name="languageAutre"
                                value={formData.languageAutre}
                                onChange={(e) => handleChange("languageAutre", e.target.value)}
                                placeholder="ex: Espagnol, Arabe..."
                                required
                            />
                        )}

                        <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-secondary/20">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={(e) => handleChange("acceptTerms", e.target.checked)}
                                className="w-5 h-5 rounded bg-secondary border-border text-primary focus:ring-primary mt-0.5"
                                required
                            />
                            <label htmlFor="acceptTerms" className="text-sm text-foreground">
                                J’accepte les{" "}
                                <a href="#" className="font-semibold text-primary hover:underline">
                                    CGU
                                </a>{" "}
                                et la{" "}
                                <a href="#" className="font-semibold text-primary hover:underline">
                                    politique de confidentialité
                                </a>
                            </label>
                        </div>
                    </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            currentStep > 1 ? setCurrentStep(currentStep - 1) : onCancel?.()
                        }
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
            </form>
        </GlassCard>
    );
}
