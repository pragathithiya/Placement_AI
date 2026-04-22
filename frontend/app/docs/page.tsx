"use client";

import { Briefcase, ChevronLeft, BookOpen, Sparkles, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Docs() {
  return (
    <div className="main-content" style={{ overflowY: 'auto' }}>
      <div className="workspace-container">
        <Link href="/" className="flex items-center gap-2 mb-12 text-primary no-underline font-bold">
          <ChevronLeft size={18} /> Back to Dashboard
        </Link>

        <div className="hero-section">
          <div className="hero-badge">
            <BookOpen size={12} /> DOCUMENTATION
          </div>
          <h1 className="hero-title">How PlacementAI Works</h1>
          <p className="hero-subtitle">Learn about our intelligent extraction engine and the specialized "Manvin" automation rules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Llama 3.2 Section */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div className="logo-icon" style={{ marginBottom: '24px' }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '16px' }}>Multimodal Extraction</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Our system uses <strong>Llama 3.2 Vision</strong> via Groq to analyze placement posters, forms, and documents. 
              We now also support direct <strong>Text Paste</strong>, allowing you to extract structured data from raw job descriptions copied from websites or emails.
            </p>
          </div>

          {/* Manvin Section */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div className="logo-icon" style={{ background: '#10b981', marginBottom: '24px' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '16px' }}>The "Manvin" Rules</h3>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              We have specialized logic for Manvin job posts. When a "Full Stack Developer" role is detected:
              <ul style={{ marginTop: '12px', paddingLeft: '20px' }}>
                <li>Company is set to <strong>Manvin</strong></li>
                <li>Duration is locked to <strong>6 Months</strong></li>
                <li>Stipend is set to <strong>Unpaid</strong></li>
                <li>Mode is set to <strong>Hybrid</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass-panel mt-12" style={{ padding: '40px' }}>
          <div className="flex items-center gap-4 mb-6">
            <ShieldCheck className="text-primary" size={32} />
            <h3 style={{ fontSize: '24px', fontWeight: '900' }}>Privacy & Security</h3>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            All images are processed securely. Uploaded files are stored temporarily for extraction and then 
            indexed in your local database for your history records.
          </p>
        </div>
      </div>
    </div>
  );
}
