import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
            <SelectTrigger className="w-[110px] bg-white/5 border-white/10 text-white h-9 rounded-lg gap-2 text-xs font-bold uppercase tracking-wide">
                <Globe className="w-3.5 h-3.5 opacity-70" />
                <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="fr">🇫🇷 FR</SelectItem>
                <SelectItem value="en">🇺🇸 EN</SelectItem>
                <SelectItem value="ar">🇸🇦 AR</SelectItem>
            </SelectContent>
        </Select>
    );
}
