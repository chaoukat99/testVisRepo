import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <Logo size="lg" isFooter={true} />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('footer.brand_desc')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <Github className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* For Companies */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.sections.for_companies.title')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/company-register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.register_company')}
                </Link>
              </li>
              <li>
                <Link to="/search-consultants" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.search_consultants')}
                </Link>
              </li>
              <li>
                <Link to="/post-mission" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.post_mission')}
                </Link>
              </li>
              <li>
                <Link to="/ai-matching-demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.ai_space')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Consultants */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.sections.for_consultants.title')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/consultant-register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.register_profile')}
                </Link>
              </li>
              <li>
                <Link to="/search-consultants" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.browse_missions')}
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.testimonials')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.resources')}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.sections.company.title')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.about')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.contact')}
                </a>
              </li>
              <li>
                <Link to="/admin-login" className="text-sm font-medium text-destructive/80 hover:text-destructive transition-colors flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                  {t('footer.links.admin_portal')}
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.links.terms')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} OpenIn Partners. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
