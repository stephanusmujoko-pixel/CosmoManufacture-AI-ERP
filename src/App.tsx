/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, ViewTab } from './components/Sidebar';
import { BlueprintExplorer } from './components/BlueprintExplorer';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { FormulaModule } from './components/FormulaModule';
import { ProductionMesModule } from './components/ProductionMesModule';
import { InventoryModule } from './components/InventoryModule';
import { QualityControlModule } from './components/QualityControlModule';
import { RegulatoryModule } from './components/RegulatoryModule';
import { AiCenterModule } from './components/AiCenterModule';
import { SuperAdminModule } from './components/SuperAdminModule';
import { DesignSystemExplorer } from './components/DesignSystemExplorer';
import { MasterDataModule } from './components/MasterDataModule';
import { ErpSubModules } from './components/ErpSubModules';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SaaSLandingPage } from './components/SaaSLandingPage';
import { AuthPortal } from './components/AuthPortal';
import { TenantOnboardingWizard } from './components/TenantOnboardingWizard';
import { CompanyWebsitePages } from './components/CompanyWebsitePages';
import { LicenseSubscriptionModule } from './components/LicenseSubscriptionModule';
import { UserProfileSettingsModule } from './components/UserProfileSettingsModule';
import { BackendAuthExplorer } from './components/BackendAuthExplorer';
import { SaasEngineExplorer } from './components/SaasEngineExplorer';
import { MasterDataExplorer } from './components/MasterDataExplorer';
import { CrmSalesExplorer } from './components/CrmSalesExplorer';
import { ProcurementExplorer } from './components/ProcurementExplorer';
import { WmsExplorer } from './components/WmsExplorer';
import { InventoryExplorer } from './components/InventoryExplorer';
import { FormulaExplorer } from './components/FormulaExplorer';
import { PpicMrpExplorer } from './components/PpicMrpExplorer';
import { MesExplorer } from './components/MesExplorer';
import { QualityLimsExplorer } from './components/QualityLimsExplorer';
import { RdPlmExplorer } from './components/RdPlmExplorer';
import { EamCmmsExplorer } from './components/EamCmmsExplorer';
import { FinanceExplorer } from './components/FinanceExplorer';
import { HrisExplorer } from './components/HrisExplorer';
import { BiExecutiveExplorer } from './components/BiExecutiveExplorer';

import {
  INITIAL_TENANT,
  INITIAL_LICENSE,
  MOCK_FORMULAS,
  MOCK_BATCHES,
  MOCK_BPOM_SUBMISSIONS,
} from './data/mockErpData';
import { Formula, ThemeMode, UserProfilePersona, PRESET_USER_PERSONAS } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [appMode, setAppMode] = useState<'landing' | 'workspace' | 'auth' | 'onboarding' | 'company_page'>('landing');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [activeCompanyPage, setActiveCompanyPage] = useState('about');
  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<UserProfilePersona>(PRESET_USER_PERSONAS[2]); // Default Apt. Clara

  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [tenant] = useState(INITIAL_TENANT);
  const [license] = useState(INITIAL_LICENSE);
  const [formulas] = useState<Formula[]>(MOCK_FORMULAS);
  const [batches] = useState(MOCK_BATCHES);
  const [bpoms] = useState(MOCK_BPOM_SUBMISSIONS);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAnalyzeFormula = (formula: Formula) => {
    setCurrentTab('ai-center');
  };

  const handleSelectUserPersona = (persona: UserProfilePersona) => {
    setCurrentUser(persona);
    if (persona.allowedTabs && persona.allowedTabs.length > 0 && !persona.allowedTabs.includes(currentTab)) {
      setCurrentTab(persona.allowedTabs[0] as ViewTab);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthInitialMode(mode);
    setAppMode('auth');
  };

  const handleOpenCompanyPage = (pageName: string) => {
    setActiveCompanyPage(pageName);
    setAppMode('company_page');
  };

  const handleAuthSuccess = (info?: any) => {
    setTenantInfo(info);
    setAppMode('onboarding');
  };

  const handleOnboardingComplete = (configuredTenantData: any) => {
    setAppMode('workspace');
    setCurrentTab('dashboard');
  };

  const handleSelectTabWithModeSwitch = (tab: ViewTab) => {
    if (tab === 'landing') {
      setAppMode('landing');
    } else {
      setAppMode('workspace');
      setCurrentTab(tab);
    }
  };

  const getTabTitle = (tab: ViewTab): string => {
    switch (tab) {
      case 'landing':
        return 'SaaS Marketing Website & Tenant Portal';
      case 'blueprint':
        return 'Master Blueprint & System Architecture (Prompt 1)';
      case 'dashboard':
        return 'Executive Realtime Dashboard';
      case 'design-system':
        return 'Design System & UI Tokens Framework (Prompt 2)';
      case 'formula':
        return 'R&D Cosmetic Formula & Recipe Lab';
      case 'production':
        return 'MES Batch Production & Control';
      case 'inventory':
        return 'Raw Materials & FEFO Inventory';
      case 'quality':
        return 'Quality Assurance & Micro Lab';
      case 'regulatory':
        return 'e-BPOM NA & CPKB ISO 22716';
      case 'master-data':
        return 'Master Data Directory';
      case 'crm':
        return 'Sales & CRM Maklon';
      case 'purchasing':
        return 'Purchasing & Procurement';
      case 'ppic':
        return 'PPIC Master Schedule';
      case 'finance':
        return 'Finance & COGM Costing';
      case 'hr':
        return 'HR & Cleanroom Staff';
      case 'maintenance':
        return 'Maintenance & Machine OEE';
      case 'backend-auth':
        return 'Backend Auth, Security, RBAC & Multi-Tenant Engine (Prompt 4)';
      case 'saas-engine':
        return 'Multi-Tenant SaaS, License, Subscription & Payment Engine (Prompt 5)';
      case 'license-sub':
        return 'License & SaaS Subscription Management';
      case 'user-settings':
        return 'User Profile & Security Settings';
      case 'ai-center':
        return 'AI Center (16 ERP Assistants)';
      case 'super-admin':
        return 'SaaS Super Admin & License Portal';
      default:
        return 'CosmoManufacture AI ERP';
    }
  };

  // Render Independent App Modes
  if (appMode === 'landing') {
    return (
      <SaaSLandingPage
        onOpenLogin={() => handleOpenAuth('login')}
        onOpenRegister={() => handleOpenAuth('register')}
        onOpenDemoWorkspace={() => {
          setAppMode('workspace');
          setCurrentTab('dashboard');
        }}
        onNavigateCompanyPage={handleOpenCompanyPage}
      />
    );
  }

  if (appMode === 'auth') {
    return (
      <AuthPortal
        initialMode={authInitialMode}
        onSuccessAuth={handleAuthSuccess}
        onBackToLanding={() => {
          setAppMode('landing');
        }}
      />
    );
  }

  if (appMode === 'onboarding') {
    return (
      <TenantOnboardingWizard
        initialTenantData={tenantInfo}
        onCompleteOnboarding={handleOnboardingComplete}
      />
    );
  }

  if (appMode === 'company_page') {
    return (
      <CompanyWebsitePages
        page={activeCompanyPage}
        onBackToLanding={() => {
          setAppMode('landing');
        }}
        onGoToRegister={() => handleOpenAuth('register')}
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans antialiased selection:bg-emerald-500 selection:text-white`}>
      {/* Top Navbar */}
      <Navbar
        tenant={tenant}
        license={license}
        theme={theme}
        currentUser={currentUser}
        onToggleTheme={toggleTheme}
        onOpenAiCenter={() => setCurrentTab('ai-center')}
        onOpenBlueprint={() => setCurrentTab('blueprint')}
        onOpenSearch={() => setIsSearchOpen(true)}
        onGoToLanding={() => setAppMode('landing')}
        onSelectUserPersona={handleSelectUserPersona}
        onOpenAuthPortal={handleOpenAuth}
        onOpenUserSettings={() => {
          setAppMode('workspace');
          setCurrentTab('user-settings');
        }}
        onLogout={() => {
          setAppMode('auth');
          setAuthInitialMode('login');
        }}
        activeViewTitle={getTabTitle(currentTab)}
      />

      {/* Main Container Layout */}
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar currentTab={currentTab} onSelectTab={handleSelectTabWithModeSwitch} currentUser={currentUser} />

        {/* Right Main Content Panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-slate-950/90 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl space-y-6">
            {currentTab === 'landing' && (
              <SaaSLandingPage
                onOpenLogin={() => handleOpenAuth('login')}
                onOpenRegister={() => handleOpenAuth('register')}
                onOpenDemoWorkspace={() => handleSelectTabWithModeSwitch('dashboard')}
                onNavigateCompanyPage={handleOpenCompanyPage}
              />
            )}
            {currentTab === 'blueprint' && <BlueprintExplorer />}
            {(currentTab === 'dashboard' || currentTab === 'bi' || currentTab === 'executive') && (
              <BiExecutiveExplorer />
            )}
            {currentTab === 'design-system' && <DesignSystemExplorer />}
            {currentTab === 'rd' && <RdPlmExplorer />}
            {currentTab === 'formula' && <FormulaExplorer />}
            {currentTab === 'production' && <MesExplorer />}
            {currentTab === 'inventory' && <InventoryExplorer />}
            {currentTab === 'quality' && <QualityLimsExplorer />}
            {currentTab === 'regulatory' && <RegulatoryModule />}
            {currentTab === 'master-data' && <MasterDataExplorer />}
            {currentTab === 'crm' && <CrmSalesExplorer />}
            {currentTab === 'purchasing' && <ProcurementExplorer />}
            {currentTab === 'wms' && <WmsExplorer />}
            {currentTab === 'ppic' && <PpicMrpExplorer />}
            {(currentTab === 'eam' || currentTab === 'maintenance') && <EamCmmsExplorer />}
            {currentTab === 'finance' && <FinanceExplorer />}
            {(currentTab === 'hr' || currentTab === 'hris') && <HrisExplorer />}
            {currentTab === 'backend-auth' && <BackendAuthExplorer />}
            {currentTab === 'saas-engine' && <SaasEngineExplorer />}
            {currentTab === 'license-sub' && <LicenseSubscriptionModule />}
            {currentTab === 'user-settings' && <UserProfileSettingsModule />}
            {currentTab === 'ai-center' && <AiCenterModule />}
            {currentTab === 'super-admin' && <SuperAdminModule />}
          </div>
        </main>
      </div>

      {/* Floating AI Assistant Drawer */}
      <FloatingAiAssistant onOpenFullAiCenter={() => setCurrentTab('ai-center')} />

      {/* Global Search Modal (Cmd + K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={handleSelectTabWithModeSwitch}
      />
    </div>
  );
}
