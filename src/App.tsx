import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Index from "./pages/Index";
import CompanyRegister from "./pages/CompanyRegister";
import ConsultantRegister from "./pages/ConsultantRegister";
import ConsultantRegisterAI from "./pages/ConsultantRegisterAI";
import SearchConsultants from "./pages/SearchConsultants";
import PostMission from "./pages/PostMission";
import AIMatchingDemo from "./pages/AIMatchingDemo";
import CompanyLogin from "./pages/CompanyLogin";
import ConsultantLogin from "./pages/ConsultantLogin";
import CompanyLanding from "./pages/CompanyLanding";
import ConsultantLanding from "./pages/ConsultantLanding";
import FreelancerLanding from "./pages/FreelancerLanding";
import ResourcesLanding from "./pages/ResourcesLanding";
import NotFound from "./pages/NotFound";
import ConsultantDashboardLayout from "./pages/consultant/DashboardLayout";
import DashboardOverview from "./pages/consultant/DashboardOverview";
import DashboardProfile from "./pages/consultant/DashboardProfile";
import DashboardMissions from "./pages/consultant/DashboardMissions";
import DashboardSettings from "./pages/consultant/DashboardSettings";
import DashboardJobSearch from "./pages/consultant/DashboardJobSearch";
import CompanyDashboardLayout from "./pages/company/DashboardLayout";
import CompanyDashboardOverview from "./pages/company/DashboardOverview";
import CompanyDashboardMissions from "./pages/company/DashboardMissions";
import CompanyDashboardProfile from "./pages/company/DashboardProfile";
import CompanyDashboardSettings from "./pages/company/DashboardSettings";
import DashboardSearchTalents from "./pages/company/DashboardSearchTalents";
import DashboardPostMission from "./pages/company/DashboardPostMission";
import DashboardAIInterview from "./pages/company/DashboardAIInterview";
import DashboardConversations from "./pages/company/DashboardConversations";
import DashboardContacted from "./pages/company/DashboardContacted";
import DashboardATS from "./pages/consultant/DashboardATS";
import ConsultantDashboardConversations from "./pages/consultant/DashboardConversations";
import LyaAgenceAi from "./pages/LyaAgenceAi";
import CabinetConseil from "./pages/CabinetConseil";
import BibliothequePage from "./pages/BibliothequePage";

import AdminDashboardLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminConsultants from "./pages/admin/AdminConsultants";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminMissions from "./pages/admin/AdminMissions";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminTaxonomy from "./pages/admin/AdminTaxonomy";
import AdminConversations from "./pages/admin/AdminConversations";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { AIAvatar } from "@/components/ui/AIAvatar";
import { ScrollToTop } from "@/components/utils/ScrollToTop";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { OpenInnovationLoader } from "@/components/ui/OpenInnovationLoader";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ChatProvider } from "@/context/ChatContext";
import { ChatManager } from "@/components/chat/ChatManager";
import { TaxonomyProvider } from "./hooks/useTaxonomy";

const queryClient = new QueryClient();

// Admin Route Guard
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const role = user.role?.toLowerCase();

  if (!token || role !== 'admin') {
    if (role === 'company') return <Navigate to="/company/dashboard" replace />;
    if (role === 'consultant') return <Navigate to="/consultant/dashboard" replace />;
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

// Company Route Guard
const CompanyGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};

  const role = user.role?.toLowerCase();

  if (!token || role !== 'company') {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'consultant') return <Navigate to="/consultant/dashboard" replace />;
    return <Navigate to="/company-login" replace />;
  }

  return <>{children}</>;
};

// Consultant Route Guard
const ConsultantGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};

  const role = user.role?.toLowerCase();

  if (!token || role !== 'consultant') {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'company') return <Navigate to="/company/dashboard" replace />;
    return <Navigate to="/consultant-login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/company-solutions" element={<CompanyLanding />} />
          <Route path="/consultant-opportunities" element={<ConsultantLanding />} />
          <Route path="/freelancer-space" element={<FreelancerLanding />} />
          <Route path="/resources" element={<ResourcesLanding />} />
          <Route path="/company-register" element={<CompanyRegister />} />
          <Route path="/consultant-register" element={<ConsultantRegister />} />
          <Route path="/consultant-register-ai" element={<ConsultantRegisterAI />} />
          <Route path="/search-consultants" element={<CompanyGuard><SearchConsultants /></CompanyGuard>} />
          <Route path="/post-mission" element={<CompanyGuard><PostMission /></CompanyGuard>} />
          <Route path="/ai-matching-demo" element={<CompanyGuard><AIMatchingDemo /></CompanyGuard>} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/company-login" element={<CompanyLogin />} />
          <Route path="/consultant-login" element={<ConsultantLogin />} />

          {/* Consultant Dashboard Routes */}
          <Route path="/consultant" element={<ConsultantGuard><ConsultantDashboardLayout /></ConsultantGuard>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="missions" element={<DashboardMissions />} />
            <Route path="settings" element={<DashboardSettings />} />
            <Route path="search-missions" element={<DashboardJobSearch />} />
            <Route path="conversations" element={<ConsultantDashboardConversations />} />
            <Route path="ats-checker" element={<DashboardATS />} />
          </Route>


          {/* Company Dashboard Routes */}
          <Route path="/company" element={<CompanyGuard><CompanyDashboardLayout /></CompanyGuard>}>
            <Route path="dashboard" element={<CompanyDashboardOverview />} />
            <Route index element={<CompanyDashboardOverview />} />
            <Route path="search-talents" element={<DashboardSearchTalents />} />
            <Route path="missions" element={<CompanyDashboardMissions />} />
            <Route path="post-mission" element={<DashboardPostMission />} />
            <Route path="profile" element={<CompanyDashboardProfile />} />
            <Route path="settings" element={<CompanyDashboardSettings />} />
            <Route path="ai-interview" element={<DashboardAIInterview />} />
            <Route path="conversations" element={<DashboardConversations />} />
            <Route path="contacted" element={<DashboardContacted />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminGuard><AdminDashboardLayout /></AdminGuard>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="consultants" element={<AdminConsultants />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="missions" element={<AdminMissions />} />
            <Route path="taxonomy" element={<AdminTaxonomy />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="conversations" element={<AdminConversations />} />
            {/* Placeholders for other admin routes if needed */}
            <Route path="reports" element={<AdminOverview />} />
            <Route path="logs" element={<AdminOverview />} />
            <Route path="analytics" element={<AdminOverview />} />
          </Route>

          {/* ... inside AppRoutes ... */}
          <Route path="/loader-demo" element={<OpenInnovationLoader />} />
          <Route path="/Ghaya-agence-ai" element={<LyaAgenceAi />} />
          <Route path="/cabinet-conseil" element={<CabinetConseil />} />
          <Route path="/bibliotheque" element={<BibliothequePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      {(location.pathname.startsWith('/company') || location.pathname.startsWith('/consultant')) && <ChatManager />}
    </>
  );
}


const App = () => {
  const {
    robotMessage,
    robotPosition,
    onNextStep,
    onPrevStep,
    endTour,
    currentStepIndex,
    totalSteps,
    isIntroActive
  } = useOnboardingStore();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TaxonomyProvider>
          <ChatProvider>
            <TooltipProvider>
              {!isIntroActive && (
                <AIAvatar
                  message={robotMessage}
                  position={robotPosition}
                  onNext={onNextStep || undefined}
                  onPrev={onPrevStep || undefined}
                  onClose={endTour}
                  currentStep={currentStepIndex}
                  totalSteps={totalSteps}
                />
              )}
              <Toaster />
              <Sonner />
              <div className="flex justify-end p-4 hidden">
                <ThemeSwitcher />
              </div>
              <BrowserRouter>
                <ScrollToTop />
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </ChatProvider>
        </TaxonomyProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
