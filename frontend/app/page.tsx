"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FileUploader from "@/components/FileUploader";
import PlacementCard from "@/components/PlacementCard";
import ChatInterface from "@/components/ChatInterface";
import JobForm from "@/components/JobForm";
import { api } from "@/lib/api";
import { 
  Sparkles, 
  History, 
  Briefcase, 
  PlusCircle, 
  LayoutDashboard,
  Bot,
  ChevronRight,
  Clock,
  Search,
  FileText,
  Edit3
} from "lucide-react";

export default function Home() {
  const [currentPlacement, setCurrentPlacement] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [view, setView] = useState<"upload" | "details" | "history">("upload");

  const fetchHistory = async () => {
    try {
      const res = await api.get("/api/placements");
      if (!res.ok) {
        console.error(`API Error: ${res.status} ${res.statusText}`);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setHistory(data);
      } else {
        console.error("API returned non-JSON response");
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUploadSuccess = (data: any) => {
    setCurrentPlacement(data);
    setView("details");
    fetchHistory();
  };

  const handleSavePost = async (updatedData: any) => {
    if (!currentPlacement?.id) return;
    
    try {
      const isManual = currentPlacement.id.startsWith("manual-");
      const url = isManual ? "/api/placements" : `/api/placements/${currentPlacement.id}`;
      const method = isManual ? "POST" : "PATCH";

      const res = await (isManual 
        ? api.post("/api/placements", {
            id: currentPlacement.id,
            company_name: updatedData.company_name,
            extraction: updatedData
          })
        : api.patch(`/api/placements/${currentPlacement.id}`, {
            company_name: updatedData.company_name,
            extraction: updatedData
          })
      );

      if (!res.ok) throw new Error("Failed to save to database");

      setCurrentPlacement((prev: any) => ({
        ...prev,
        extraction: updatedData,
        companyName: updatedData.company_name
      }));
      
      fetchHistory(); // Refresh sidebar history
      console.log("Post saved successfully");
    } catch (err) {
      console.error("Failed to save post:", err);
      alert("Error saving post. please try again.");
    }
  };

  const selectFromHistory = async (id: string) => {
    try {
      const res = await api.get(`/api/placements/${id}`);
      const data = await res.json();
      
      if (!res.ok || !data.placement) {
        throw new Error(data.error || "Placement not found");
      }

      setCurrentPlacement({
        id: data.placement.id,
        extraction: JSON.parse(data.placement.extracted_data),
        imagePath: api.imageUrl(data.placement.image_path),
        companyName: data.placement.company_name
      });
      setView("details");
    } catch (err) {
      console.error("Failed to fetch detail:", err);
    }
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="nav-logo">
          <div className="logo-icon">
            <Briefcase size={22} />
          </div>
          <h1 className="logo-text">PlacementAI</h1>
        </div>

        <nav className="nav-menu">
          <button 
            onClick={() => setView("upload")}
            className={`nav-link ${view === "upload" || view === "details" ? "active" : ""}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setView("history")}
            className={`nav-link ${view === "history" ? "active" : ""}`}
          >
            <History size={20} />
            <span>History</span>
          </button>
        </nav>

        <div className="sidebar-promo">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">New</span>
          </div>
          <p className="text-xs text-text-muted mb-4">
            Scan a new placement poster to get instant insights.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => setView("upload")}
              className="btn-primary w-full"
              style={{ padding: '10px', fontSize: '13px' }}
            >
              <PlusCircle size={16} />
              <span>New Scan</span>
            </button>
            <button 
              onClick={() => {
                setCurrentPlacement({
                  id: "manual-" + Date.now(),
                  extraction: {},
                  imagePath: "",
                  companyName: ""
                });
                setView("details");
              }}
              style={{ width: '100%', padding: '10px', background: 'white', border: '1px solid var(--sidebar-border)', borderRadius: '12px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Edit3 size={16} />
              <span>Manual Input</span>
            </button>
          </div>
        </div>

        <div className="mt-auto" style={{ opacity: 0.3, padding: '20px 0' }}>
          <div className="flex items-center gap-3">
            <div className="logo-icon" style={{ width: '32px', height: '32px', background: '#e2e8f0' }} />
            <div className="flex flex-col gap-1">
              <div style={{ width: '60px', height: '8px', background: '#e2e8f0', borderRadius: '4px' }} />
              <div style={{ width: '40px', height: '6px', background: '#f1f5f9', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden glass m-4 p-4 flex items-center justify-between sticky top-4 z-50">
          <div className="flex items-center gap-2">
            <Briefcase className="text-primary" size={20} />
            <span className="font-bold">PlacementAI</span>
          </div>
          <button onClick={() => setView(view === 'history' ? 'upload' : 'history')}>
            {view === 'history' ? <LayoutDashboard size={22} /> : <History size={22} />}
          </button>
        </div>

        <div className="workspace-container">
          {view === "upload" && (
            <div className="fade-in">
              <div className="hero-section">
                <div className="hero-badge">
                  <Sparkles size={12} /> INTELLIGENT OCR SYSTEM
                </div>
                <h2 className="hero-title">
                  Turn posters into <br />
                  <span className="text-primary" style={{ fontStyle: 'italic' }}>structured data.</span>
                </h2>
                <p className="hero-subtitle">
                  Stop manually typing details. Upload any placement image and let our AI extract company details, CTC, and eligibility in seconds.
                </p>
              </div>
              
              <FileUploader onUploadSuccess={handleUploadSuccess} />
              
              <div className="feature-cards">
                {[
                  { icon: Search, color: "#3b82f6", title: "Llama 4 OCR", desc: "Advanced vision extraction." },
                  { icon: Sparkles, color: "#8b5cf6", title: "Job Auto-fill", desc: "Forms filled in 1-click." },
                  { icon: Clock, color: "#6366f1", title: "Manvin Rules", desc: "Automatic internship logic." }
                ].map((item, i) => (
                  <div key={i} className="feature-card">
                    <div className="logo-icon" style={{ background: `${item.color}15`, color: item.color, marginBottom: '20px' }}>
                      <item.icon size={22} />
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{item.title}</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "details" && currentPlacement && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setView("upload")}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  ← Start New Scan
                </button>
                <div className="hero-badge" style={{ margin: 0 }}>
                  <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }} /> Verified Extraction
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <JobForm 
                    initialData={currentPlacement.extraction} 
                    onSave={handleSavePost} 
                  />
                  <PlacementCard 
                    data={currentPlacement.extraction} 
                    imagePath={currentPlacement.imagePath} 
                  />
                </div>
                <div>
                  <ChatInterface placementId={currentPlacement.id} />
                </div>
              </div>
            </div>
          )}

          {view === "history" && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="hero-title" style={{ fontSize: '40px', margin: 0 }}>History</h2>
                  <p className="hero-subtitle">You have processed {history.length} placement posters</p>
                </div>
                <button 
                  onClick={() => setView("upload")}
                  className="btn-primary"
                >
                  <PlusCircle size={18} /> New Analysis
                </button>
              </div>
              
              {history.length === 0 ? (
                <div className="glass-panel" style={{ padding: '80px', textAlign: 'center' }}>
                  <div className="logo-icon" style={{ width: '80px', height: '80px', margin: '0 auto 24px', background: '#eef2ff', color: 'var(--primary)' }}>
                    <History size={40} />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Your library is empty</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Upload your first placement poster to start your records.</p>
                  <button onClick={() => setView("upload")} className="btn-primary">Scan Now</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => selectFromHistory(item.id)}
                      className="glass-panel" 
                      style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <div style={{ height: '200px', background: '#f8fafc', borderRadius: '16px', marginBottom: '20px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.image_path ? (
                          <img 
                            src={api.imageUrl(item.image_path)} 
                            alt={item.company_name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                          />
                        ) : (
                          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            <FileText size={48} opacity={0.2} style={{ marginBottom: '12px' }} />
                            <p style={{ fontSize: '12px', fontWeight: '700' }}>Text Extraction</p>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <h4 style={{ fontSize: '20px', fontWeight: '900', color: '#1e1b4b', marginBottom: '4px' }}>{item.company_name}</h4>
                          <div className="flex items-center gap-2" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            <Clock size={12} />
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="logo-icon" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ marginTop: 'auto', padding: '60px 24px', borderTop: '1px solid var(--sidebar-border)' }}>
          <div className="workspace-container" style={{ padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="flex items-center gap-3">
              <div className="logo-icon" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
                <Briefcase size={16} />
              </div>
              <span style={{ fontWeight: '800' }}>PlacementAI</span>
            </div>
            
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Intelligence by <span style={{ color: '#1e1b4b', fontWeight: '700' }}>Gemma & OpenRouter</span>
            </p>

            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: '700' }}>
              <Link href="/docs" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Docs</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
