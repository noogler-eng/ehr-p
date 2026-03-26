/**
 * Secure EHR System - Main Application Component
 *
 * Root component managing authentication, routing, and role-based access control.
 * Features: MetaMask wallet auth, sidebar navigation, dashboard, blockchain explorer,
 * access control, and smart contract viewer.
 */

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { Shield, Plus, User as UserIcon, LogOut, Menu } from "lucide-react";

// Component Imports
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Timeline } from "./components/Dashboard/Timeline";
import { DiscoveryList } from "./components/Dashboard/DiscoveryList.tsx";
import { DashboardStats } from "./components/Dashboard/DashboardStats";
import { EmergencyAlert } from "./components/EmergencyAlert";
import { AuditTrail } from "./components/Dashboard/AuditTrail";
import { NetworkStatus } from "./components/NetworkStatus";
import { ToastContainer, showToast } from "./components/Toast";
import OnboardingModal from "./components/Modals/OnboardingModal";
import AddRecordModal from "./components/Modals/AddRecordModal";
import PatientUpdateModal from "./components/Modals/PatientUpdateModal";
import EditRecordModal from "./components/Modals/EditRecordModal";
import AboutModal from "./components/AboutModal";

// Page Imports
import { BlockchainExplorer } from "./pages/BlockchainExplorer";
import { AccessControl } from "./pages/AccessControl";
import { SmartContract } from "./pages/SmartContract";
import { ChatSystem } from "./pages/ChatSystem";
import { VitalsChart } from "./pages/VitalsChart";
import { FollowUps } from "./pages/FollowUps";
import { MedicationTracker } from "./pages/MedicationTracker";

const API_BASE = "http://localhost:8080/api";

const App = () => {
  // ==================== STATE ====================
  const [account, setAccount] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [discoveryList, setDiscoveryList] = useState<any[]>([]);
  const [authLoading, setAuthLoading] = useState(false);
  const [modals, setModals] = useState({ onboarding: false, addRecord: false, patientUpdate: false, editRecord: false, about: false });
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [viewingAddress, setViewingAddress] = useState<string>("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState<string>("");

  // ==================== EFFECTS ====================

  useEffect(() => {
    const savedAddress = localStorage.getItem("userAddress");
    // @ts-ignore
    if (savedAddress && window.ethereum) {
      reconnectSession(savedAddress);
    }
  }, []);

  useEffect(() => {
    if (user && account) {
      fetchDiscoveryData();
    }
  }, [user, account]);

  // ==================== DATA FETCHING ====================

  const fetchDiscoveryData = async () => {
    let endpoint = "";
    if (user.role === 'Doctor') {
      endpoint = `/doctor/my-patients/${account}`;
    } else if (user.role === 'Pharmacist') {
      endpoint = `/pharmacist/registry`;
    } else if (user.role === 'Admin') {
      endpoint = `/pharmacist/registry`;
    }

    if (endpoint) {
      try {
        const { data } = await axios.get(`${API_BASE}${endpoint}`);
        const list = data.patients || data.registry || [];
        setDiscoveryList(list);
      } catch (err) {
        console.error("Discovery API Error:", err);
      }
    }
  };

  const fetchPatientHistory = async (targetAddress: string) => {
    try {
      const hist = await axios.get(`${API_BASE}/records/history/${targetAddress}`);
      setHistory(hist.data.history);
      setViewingAddress(targetAddress);
      showToast({ type: "blockchain", title: "Records Loaded", message: `Fetched ${hist.data.history.length} blockchain-verified records` });
    } catch (err) {
      console.error("Failed to fetch history");
      showToast({ type: "error", title: "Fetch Failed", message: "Could not load patient records" });
    }
  };

  const reconnectSession = async (address: string) => {
    setAccount(address);
    setAuthLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { walletAddress: address });
      if (data.user && data.user.name) {
        setUser(data.user);
        if (data.user.role === "Patient") {
          const hist = await axios.get(`${API_BASE}/records/history/${address}`);
          setHistory(hist.data.history);
          setViewingAddress(address);
        }
      } else {
        setModals((prev) => ({ ...prev, onboarding: true }));
      }
    } catch (err) {
      console.error("Session restoration failed");
    } finally {
      setAuthLoading(false);
    }
  };

  // ==================== AUTH ====================

  const connectAndAuth = async () => {
    // @ts-ignore
    if (!window.ethereum) {
      alert("Please install MetaMask to use this application");
      return;
    }
    try {
      setAuthLoading(true);
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      localStorage.setItem("userAddress", address);

      const { data } = await axios.post(`${API_BASE}/auth/login`, { walletAddress: address });
      if (data.user && data.user.name) {
        setUser(data.user);
        if (data.user.role === "Patient") {
          const hist = await axios.get(`${API_BASE}/records/history/${address}`);
          setHistory(hist.data.history);
          setViewingAddress(address);
        }
      } else {
        setModals((prev) => ({ ...prev, onboarding: true }));
      }
    } catch (err) {
      console.error("Authentication Error:", err);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // ==================== HANDLERS ====================

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    setModals((prev) => ({ ...prev, editRecord: true }));
  };

  const handlePatientUpdate = (record: any) => {
    setSelectedRecord(record);
    setModals((prev) => ({ ...prev, patientUpdate: true }));
  };

  const handleReanalyze = async (record: any) => {
    if (!confirm('Re-run AI analysis with the latest patient data? This will update the risk assessment.')) return;
    try {
      await axios.post(`${API_BASE}/records/reanalyze/${record._id}`, { doctorAddress: account });
      showToast({ type: "success", title: "AI Analysis Complete", message: "Risk assessment has been updated with latest data" });
      reconnectSession(account);
    } catch (err: any) {
      console.error('Re-analysis error:', err);
      showToast({ type: "error", title: "Re-analysis Failed", message: err.response?.data?.message || err.message });
    }
  };

  const handleOpenChat = (targetAddress: string) => {
    setChatTarget(targetAddress);
    setCurrentPage("chat");
  };

  const handleLogout = () => {
    localStorage.removeItem("userAddress");
    setAccount("");
    setUser(null);
    setHistory([]);
    setDiscoveryList([]);
    setViewingAddress("");
    setSelectedRecord(null);
    setCurrentPage("dashboard");
    setModals({ onboarding: false, addRecord: false, patientUpdate: false, editRecord: false, about: false });
  };

  // ==================== PAGE RENDERER ====================

  const renderPage = () => {
    switch (currentPage) {
      case "blockchain":
        return <BlockchainExplorer />;
      case "access":
        return <AccessControl account={account} userRole={user?.role || ""} />;
      case "contract":
        return <SmartContract />;
      case "chat":
        return <ChatSystem account={account} userRole={user?.role || ""} userName={user?.name || ""} initialTarget={chatTarget} />;
      case "vitals":
        return <VitalsChart patientAddress={viewingAddress || (user?.role === "Patient" ? account : "")} userRole={user?.role || ""} />;
      case "followups":
        return <FollowUps account={account} userRole={user?.role || ""} />;
      case "medications":
        return <MedicationTracker account={account} userRole={user?.role || ""} />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div>
      {/* Emergency Alert for critical conditions */}
      <EmergencyAlert history={history} userRole={user?.role || ""} />

      {/* Dashboard Stats */}
      <DashboardStats userRole={user?.role || ""} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: Profile, Discovery, Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-md">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-zinc-800 p-3 rounded-2xl">
                <UserIcon size={24} className="text-zinc-400" />
              </div>
              <button onClick={handleLogout} className="text-zinc-600 hover:text-white transition-colors" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Master Profile</h3>
            <h2 className="text-2xl font-bold tracking-tighter italic">{user.name}</h2>
            <p className="text-[9px] font-mono text-zinc-600 truncate mt-1">{account}</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-3 rounded-xl border border-zinc-800/50">
                <p className="text-[9px] font-bold text-zinc-600 uppercase">Age / Gender</p>
                <p className="text-sm font-semibold">{user.age} • {user.gender}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-zinc-800/50">
                <p className="text-[9px] font-bold text-zinc-600 uppercase">Blood Group</p>
                <p className="text-sm font-semibold">{user.bloodGroup}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-zinc-800/50 col-span-2">
                <p className="text-[9px] font-bold text-zinc-600 uppercase">Role</p>
                <p className="text-sm font-semibold">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Discovery List (not for patients) */}
          {user.role !== "Patient" && (
            <DiscoveryList
              role={user.role}
              data={discoveryList}
              onItemClick={(addr: string) => fetchPatientHistory(addr)}
            />
          )}

          {/* Doctor: New Clinical Entry Button */}
          {user.role === "Doctor" && (
            <button
              onClick={() => setModals((prev) => ({ ...prev, addRecord: true }))}
              className="group w-full bg-white text-black p-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-2xl shadow-white/5 active:scale-95"
            >
              <Plus size={20} /> NEW CLINICAL ENTRY
            </button>
          )}

          {/* Blockchain Network Status */}
          <NetworkStatus />
        </div>

        {/* RIGHT COLUMN: Audit Trail + Medical Timeline */}
        <div className="lg:col-span-8">
          {/* Audit Trail (Doctor/Admin only) */}
          <AuditTrail history={history} userRole={user?.role || ""} />

          <Timeline
            history={history}
            userRole={user?.role}
            isOwner={account === viewingAddress}
            currentUserAddress={account}
            onEditRecord={user?.role === "Doctor" ? handleEditRecord : undefined}
            onPatientUpdate={user?.role === "Patient" ? handlePatientUpdate : undefined}
            onReanalyze={user?.role === "Doctor" ? handleReanalyze : undefined}
            onMessageDoctor={user?.role === "Patient" ? handleOpenChat : undefined}
            onMessagePatient={user?.role === "Doctor" ? handleOpenChat : undefined}
          />
        </div>
      </div>
    </div>
  );

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-white selection:text-black">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation Bar */}
      <Navbar
        account={account}
        user={user}
        onConnect={connectAndAuth}
        authLoading={authLoading}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showMenu={!!user}
      />

      {account && user ? (
        <>
          {/* Sidebar */}
          <Sidebar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            userRole={user.role}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main Content (offset by sidebar) */}
          <main className="lg:ml-64 pt-[73px]">
            <div className="max-w-7xl mx-auto p-8">
              {renderPage()}
            </div>
          </main>
        </>
      ) : (
        /* Landing Page */
        <main className="max-w-7xl mx-auto p-8 pt-24">
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full"></div>
              <div className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                <Shield size={48} className="text-zinc-700" />
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">
              Secure EHR Network
            </h1>
            <p className="text-zinc-500 max-w-sm mx-auto text-sm font-medium leading-relaxed">
              Connect your authorized medical wallet to access decentralized health records with
              AI-powered diagnostics using XGBoost ML and Gemini AI.
            </p>
            <button
              onClick={() => setModals((prev) => ({ ...prev, about: true }))}
              className="mt-8 px-8 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 rounded-[2rem] font-black uppercase tracking-widest transition-all hover:bg-zinc-800"
            >
              About Project & ML Model
            </button>
          </div>
        </main>
      )}

      {/* ==================== MODALS ==================== */}

      {modals.onboarding && (
        <OnboardingModal
          account={account}
          onComplete={(updatedUser: any) => {
            setUser(updatedUser);
            setModals((prev) => ({ ...prev, onboarding: false }));
            reconnectSession(account);
          }}
        />
      )}

      {modals.addRecord && (
        <AddRecordModal
          account={account}
          onClose={() => setModals((prev) => ({ ...prev, addRecord: false }))}
          onSuccess={() => reconnectSession(account)}
        />
      )}

      {modals.patientUpdate && selectedRecord && (
        <PatientUpdateModal
          record={selectedRecord}
          patientAddress={account}
          onClose={() => {
            setModals((prev) => ({ ...prev, patientUpdate: false }));
            setSelectedRecord(null);
          }}
          onSuccess={() => {
            reconnectSession(account);
            setSelectedRecord(null);
          }}
        />
      )}

      {modals.editRecord && selectedRecord && (
        <EditRecordModal
          record={selectedRecord}
          doctorAddress={account}
          onClose={() => {
            setModals((prev) => ({ ...prev, editRecord: false }));
            setSelectedRecord(null);
          }}
          onSuccess={() => {
            reconnectSession(account);
            setSelectedRecord(null);
          }}
        />
      )}

      {modals.about && (
        <AboutModal
          onClose={() => setModals((prev) => ({ ...prev, about: false }))}
        />
      )}
    </div>
  );
};

export default App;
