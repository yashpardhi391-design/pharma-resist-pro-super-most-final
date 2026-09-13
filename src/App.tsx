import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Navbar } from "./components/Navbar";
import { HeroStats } from "./components/HeroStats";
import { PharmaShieldRadarScanner } from "./components/PharmaShieldRadarScanner";
import { DualReportComparator } from "./components/DualReportComparator";
import { HostSusceptibilityExplainer } from "./components/HostSusceptibilityExplainer";
import { LabAnalyticsView } from "./components/LabAnalyticsView";
import { PatientRecordsView } from "./components/PatientRecordsView";
import { HospitalReportComparisonSuite } from "./components/HospitalReportComparisonSuite";
import { CodeLookupModal } from "./components/CodeLookupModal";
import { ReportModal } from "./components/ReportModal";
import {
  SAMPLE_PATIENT_RECORDS,
  SAMPLE_SAVED_RECORDS,
  computeComparativeAnalysis,
  buildComparativeRows,
} from "./data/mockData";
import {
  SavedComparativeRecord,
  ComparativeRecord,
  AnalysisOutput,
  ComparativeDrugRow,
  PatientData,
} from "./types";
import {
  GitCompare,
  GraduationCap,
  FileSpreadsheet,
  Database,
  ArrowRight,
  Shield,
  Dna,
  Zap,
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Layers,
} from "lucide-react";

export function AppContent() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [savedRecords, setSavedRecords] = useState<SavedComparativeRecord[]>(() => {
    try {
      const stored = localStorage.getItem("pharma_resist_records");
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return SAMPLE_SAVED_RECORDS;
  });

  // Current working comparative analysis for modals
  const [currentAnalysisResult, setCurrentAnalysisResult] = useState<{
    analysis: AnalysisOutput;
    rows: ComparativeDrugRow[];
  }>(() => ({
    analysis: computeComparativeAnalysis(SAMPLE_PATIENT_RECORDS[0], SAMPLE_PATIENT_RECORDS[1]),
    rows: buildComparativeRows(SAMPLE_PATIENT_RECORDS[0], SAMPLE_PATIENT_RECORDS[1]),
  }));

  const [p1, setP1] = useState<PatientData>(SAMPLE_PATIENT_RECORDS[0]);
  const [p2, setP2] = useState<PatientData>(SAMPLE_PATIENT_RECORDS[1]);

  // Modals state
  const [isCodeLookupOpen, setIsCodeLookupOpen] = useState(false);
  const [codeLookupInitialValue, setCodeLookupInitialValue] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeReportData, setActiveReportData] = useState<{
    analysis: AnalysisOutput;
    rows: ComparativeDrugRow[];
    patient1: PatientData;
    patient2: PatientData;
  }>({
    analysis: currentAnalysisResult.analysis,
    rows: currentAnalysisResult.rows,
    patient1: p1,
    patient2: p2,
  });

  // Automatically synchronize comparative analysis whenever p1 or p2 update
  useEffect(() => {
    const analysis = computeComparativeAnalysis(p1, p2);
    const rows = buildComparativeRows(p1, p2);
    setCurrentAnalysisResult({ analysis, rows });
    setActiveReportData({
      analysis,
      rows,
      patient1: p1,
      patient2: p2,
    });
  }, [p1, p2]);

  // Sync saved records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pharma_resist_records", JSON.stringify(savedRecords));
    } catch {
      // ignore
    }
  }, [savedRecords]);

  const handleSaveRecord = (newRec: ComparativeRecord) => {
    setSavedRecords((prev) => [newRec as SavedComparativeRecord, ...prev]);
  };

  const handleDeleteRecord = (id: string) => {
    setSavedRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleOpenCodeLookup = (code?: string) => {
    setCodeLookupInitialValue(code || currentAnalysisResult.analysis.uniqueAccessCode || "PRP-9021-8842-8801");
    setIsCodeLookupOpen(true);
  };

  const handleViewRecordModal = (record: SavedComparativeRecord) => {
    // Generate complete analysis & rows from record data
    const analysis = computeComparativeAnalysis(record.patient1, record.patient2);
    const rows = buildComparativeRows(record.patient1, record.patient2);
    setActiveReportData({
      analysis,
      rows,
      patient1: record.patient1,
      patient2: record.patient2,
    });
    setIsReportModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060B14] text-slate-900 dark:text-slate-100 selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Sticky Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onTabChange={setActiveTab}
        onOpenCodeLookup={() => handleOpenCodeLookup()}
        onOpenCodePortal={() => handleOpenCodeLookup()}
        savedRecordsCount={savedRecords.length}
        recordsCount={savedRecords.length}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full pb-16">
        {/* VIEW 1: DASHBOARD / OVERVIEW */}
        {(activeTab === "overview" || activeTab === "dashboard") && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Stat Summary */}
            <HeroStats />

            {/* Featured Interactive Hero Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Live Radar Scanner Widget */}
                <div className="lg:col-span-5 space-y-6">
                  <PharmaShieldRadarScanner
                    onScanClick={() => setActiveTab("scanner")}
                    riskLevel={currentAnalysisResult.analysis.riskLevel}
                    riskScore={currentAnalysisResult.analysis.riskScore}
                  />

                  {/* Clinical Directives Quick Card */}
                  <div className="rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase">
                      <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>ICU Infection Control Alert</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Cross-resistance detected between ICU Bed 04 and Bed 12 (blaKPC-3 carbapenemase). Shared invalidation of Meropenem &amp; Ciprofloxacin confirmed.
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-bold">
                        Spatial Isolation Required
                      </span>
                      <button
                        onClick={() => handleOpenCodeLookup(currentAnalysisResult.analysis.uniqueAccessCode)}
                        className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-semibold cursor-pointer"
                      >
                        Verify Report Code &rarr;
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Platform Capabilities & Module Jumpers */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Master Banner: Academic Host Defense Highlight */}
                  <div className="rounded-2xl border border-teal-200 dark:border-teal-500/30 bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-slate-900 dark:via-teal-950/30 dark:to-slate-900 p-6 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 text-xs font-mono text-teal-700 dark:text-teal-400 font-bold uppercase">
                        <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>Core Immunological Principle</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-500/40 text-[10px] font-mono font-bold">
                        Host vs Pathogen
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Why Does Bacteria Harm Person 1, But NOT Person 2?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      Microbial infection depends equally on the host terrain: intact mucosal barriers, neutrophil oxidative burst capacity, blood group epithelial receptor density, and hydrodynamic renal washout (eGFR).
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab("explainer")}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        <span>Open Host Susceptibility Explainer &amp; Simulator</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveTab("scanner")}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>Launch Comparative AST Scanner</span>
                      </button>
                    </div>
                  </div>

                  {/* 3 Interactive Exploration Bento Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Card 1: Comparative Scanner */}
                    <div
                      onClick={() => setActiveTab("scanner")}
                      className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-teal-500/50 hover:shadow-md dark:hover:shadow-teal-500/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                          <GitCompare className="w-4 h-4" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Dual Antibiogram Cross-Analysis
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Compare isolates from two patients to identify shared multi-drug resistance and get salvage regimens.
                      </p>
                    </div>

                    {/* Card 2: Hospital Report Suite */}
                    <div
                      onClick={() => {
                        setActiveTab("hospital");
                      }}
                      className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-cyan-500/50 hover:shadow-md dark:hover:shadow-cyan-500/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Hospital Pathology Slips &amp; Simulation
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Authentic laboratory culture slips, doctor/patient view switcher, and missed dose risk simulation.
                      </p>
                    </div>

                    {/* Card 3: Institutional Analytics */}
                    <div
                      onClick={() => setActiveTab("analytics")}
                      className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-amber-500/50 hover:shadow-md dark:hover:shadow-amber-500/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Microbiology Antibiogram Surveillance
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Hospital-wide AST trend graphs, MDR prevalence curves, and active antimicrobial restriction guidelines.
                      </p>
                    </div>

                    {/* Card 4: Verified Archive Records */}
                    <div
                      onClick={() => setActiveTab("records")}
                      className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-teal-500/50 hover:shadow-md dark:hover:shadow-teal-500/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                          <Database className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                          {savedRecords.length} Saved
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Comparative Audit Records
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Search and review stored AST comparisons, export audit logs, and retrieve verified medical dossiers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SCANNER & COMPARATOR */}
        {activeTab === "scanner" && (
          <DualReportComparator
            patient1={p1}
            patient2={p2}
            onUpdatePatient1={setP1}
            onUpdatePatient2={setP2}
            onSaveRecord={handleSaveRecord}
            onOpenCodeLookupModal={handleOpenCodeLookup}
          />
        )}

        {/* VIEW 3: HOSPITAL PATHOLOGY SUITE */}
        {activeTab === "hospital" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <HospitalReportComparisonSuite
              patient1={p1}
              patient2={p2}
              comparativeRows={currentAnalysisResult.rows}
              analysis={currentAnalysisResult.analysis}
              onOpenCodeLookup={(code) => handleOpenCodeLookup(code)}
            />
          </div>
        )}

        {/* VIEW 4: HOST SUSCEPTIBILITY EXPLAINER */}
        {activeTab === "explainer" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <HostSusceptibilityExplainer patient1={p1} patient2={p2} />
          </div>
        )}

        {/* VIEW 4: LAB ANALYTICS */}
        {activeTab === "analytics" && <LabAnalyticsView />}

        {/* VIEW 5: PATIENT RECORDS ARCHIVE */}
        {activeTab === "records" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <PatientRecordsView
              records={savedRecords}
              onDeleteRecord={handleDeleteRecord}
              onNewScan={() => setActiveTab("scanner")}
              onViewRecord={handleViewRecordModal}
            />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <CodeLookupModal
        isOpen={isCodeLookupOpen}
        onClose={() => setIsCodeLookupOpen(false)}
        savedRecords={savedRecords}
        currentAnalysis={currentAnalysisResult.analysis}
        patient1={p1}
        patient2={p2}
        initialCode={codeLookupInitialValue}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        analysis={activeReportData.analysis}
        rows={activeReportData.rows}
        patient1={activeReportData.patient1}
        patient2={activeReportData.patient2}
      />

      {/* Clinical Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Pharma Resist Pro &bull; Clinical Antimicrobial Resistance Surveillance System
            </span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span>CLSI M100-Ed34 Compliant</span>
            <span>&bull;</span>
            <span>EUCAST AST v14.0</span>
            <span>&bull;</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">Encrypted Audit Logs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
