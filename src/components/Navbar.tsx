import React, { useState } from "react";
import {
  Shield,
  Dna,
  Cpu,
  ChevronDown,
  User,
  Activity,
  FileSpreadsheet,
  ScanLine,
  Menu,
  X,
  Database,
  Sliders,
  CheckCircle2,
  KeyRound,
  Building2,
  Sun,
  Moon,
  GraduationCap,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export type NavTabId = "overview" | "dashboard" | "scanner" | "hospital" | "explainer" | "analytics" | "records";

export interface NavbarProps {
  activeTab: string;
  onSelectTab?: (tab: any) => void;
  onTabChange?: (tab: any) => void;
  savedRecordsCount?: number;
  recordsCount?: number;
  aiOnline?: boolean;
  onOpenCodePortal?: () => void;
  onOpenCodeLookup?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onTabChange,
  savedRecordsCount,
  recordsCount,
  aiOnline = true,
  onOpenCodePortal,
  onOpenCodeLookup,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectTab = (tabId: string) => {
    if (typeof onSelectTab === "function") {
      onSelectTab(tabId);
    }
    if (typeof onTabChange === "function") {
      onTabChange(tabId);
    }
  };

  const openCodeModal = onOpenCodePortal || onOpenCodeLookup;
  const totalRecordsCount = savedRecordsCount ?? recordsCount ?? 0;

  const navItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "scanner", label: "Dual Scanner", icon: ScanLine },
    { id: "hospital", label: "Hospital Suite", icon: Building2, highlight: true, highlightBadge: "ICU Lab" },
    { id: "explainer", label: "Host Immunity", icon: GraduationCap },
    { id: "analytics", label: "Lab Analytics", icon: FileSpreadsheet },
    { id: "records", label: "Patient Records", icon: Database, badge: totalRecordsCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => handleSelectTab("overview")}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 group-hover:border-teal-500 transition-all shadow-sm">
              <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <Dna className="w-3 h-3 text-cyan-500 dark:text-cyan-300 absolute" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Pharma<span className="text-teal-600 dark:text-teal-400">Resist</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[10px] tracking-wide text-slate-500 dark:text-teal-400/90 font-medium">
                Anti-Bacterial Resistance (AMR) Suite
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === "overview" && activeTab === "dashboard");
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-teal-500/40 shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                  {"highlightBadge" in item && item.highlightBadge && (
                    <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                      {item.highlightBadge}
                    </span>
                  )}
                  {item.badge !== undefined && (
                    <span className="ml-1 text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-cyan-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Area */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              type="button"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={theme === "dark" ? "Switch to Clean Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Quick Access Code Lookup Button */}
            {openCodeModal && (
              <button
                type="button"
                id="navbar-code-lookup-btn"
                onClick={openCodeModal}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 hover:bg-teal-100 dark:hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40 text-xs font-mono font-semibold transition-all cursor-pointer shadow-xs"
                title="Enter Unique Verification Code to load official report"
              >
                <KeyRound className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Verify Code</span>
              </button>
            )}

            {/* AI Engine Status Badge */}
            <div
              id="ai-engine-status-badge"
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-[11px] tracking-wide">
                {aiOnline ? "AI Active" : "Ready"}
              </span>
            </div>

            {/* User Profile Dropdown (Desktop) */}
            <div className="relative hidden md:block">
              <button
                id="user-profile-button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 p-1.5 pl-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
                aria-expanded={profileOpen}
              >
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  EV
                </div>
                <div className="text-left pr-1">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    Dr. Vance
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileOpen && (
                <div
                  id="profile-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 mb-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">Elena Vance, MD, FACP</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Hospital Antimicrobial Stewardship</p>
                    <div className="mt-1 flex items-center space-x-1 text-[10px] text-teal-600 dark:text-teal-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Certified EUCAST/CLSI Verifier</span>
                    </div>
                  </div>
                  <div className="space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                    <button
                      onClick={() => {
                        handleSelectTab("scanner");
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <ScanLine className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>New Comparative Scan</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSelectTab("records");
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Saved Records Archive</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSelectTab("analytics");
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Antibiogram Reports</span>
                    </button>
                  </div>
                  <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 px-3 py-1 flex justify-between items-center">
                    <span>Build 2.8.4-PRO</span>
                    <span className="text-teal-600 dark:text-teal-400">Active Session</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                title="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick-Tabs Bar */}
      <div className="lg:hidden border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/90 px-2 py-1.5 overflow-x-auto scrollbar-none flex items-center space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === "overview" && activeTab === "dashboard");
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/40 shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`} />
              <span className="whitespace-nowrap">{item.label}</span>
              {"highlightBadge" in item && item.highlightBadge && (
                <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  {item.highlightBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === "overview" && activeTab === "dashboard");
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-teal-50 dark:bg-slate-800 text-teal-900 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-cyan-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          {openCodeModal && (
            <button
              onClick={() => {
                openCodeModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/40 mt-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Verify by Report Code</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
