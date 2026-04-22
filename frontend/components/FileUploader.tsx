"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon, FileText, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

interface FileUploaderProps {
  onUploadSuccess: (data: any) => void;
}

export default function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (mode === "upload" && !file) return;
    if (mode === "paste" && !text.trim()) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    if (mode === "upload" && file) {
      formData.append("file", file);
    } else {
      formData.append("text", text);
    }

    try {
      const res = await api.upload("/api/analyze", formData);

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      onUploadSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setText("");
    setError(null);
  };

  return (
    <div className="glass-panel uploader-root">
      <div className="uploader-tabs">
        <button 
          onClick={() => { setMode("upload"); clear(); }}
          className={`uploader-tab ${mode === "upload" ? "active" : ""}`}
        >
          <ImageIcon size={16} />
          <span>Image Upload</span>
        </button>
        <button 
          onClick={() => { setMode("paste"); clear(); }}
          className={`uploader-tab ${mode === "paste" ? "active" : ""}`}
        >
          <FileText size={16} />
          <span>Paste Job Description</span>
        </button>
      </div>

      <div style={{ padding: '32px' }}>
        {mode === "upload" ? (
          !file ? (
            <label className="uploader-dropzone">
              <div className="logo-icon" style={{ width: '80px', height: '80px', marginBottom: '24px' }}>
                <Upload size={32} />
              </div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' }}>Click to upload poster</p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>PNG, JPG, or WEBP (Max 10MB)</p>
              </div>
              <input
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="preview-box">
                <div className="preview-img-container">
                  <img
                    src={preview!}
                    alt="Preview"
                    className="preview-img"
                  />
                </div>
                <button
                  onClick={clear}
                  className="logo-icon"
                  style={{ position: 'absolute', top: '24px', right: '24px', background: 'white', color: '#ef4444', width: '40px', height: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', border: 'none' }}
                >
                  <X size={20} />
                </button>
                
                <div className="preview-info-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <ImageIcon size={16} className="text-primary" />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e1b4b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="btn-primary w-full"
                  style={{ padding: '16px' }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>ANALYZING DATA...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      <span style={{ letterSpacing: '0.05em' }}>START EXTRACTION</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={clear}
                  disabled={loading}
                  style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                >
                  Discard Image
                </button>
              </div>
            </div>
          )
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="space-y-2">
              <label className="data-label">Paste Copy/Text here</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the job description details, company info, eligibility, etc..."
                className="input-field"
                style={{ height: '250px', resize: 'none', padding: '20px', lineHeight: '1.6' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleUpload}
                disabled={loading || !text.trim()}
                className="btn-primary w-full"
                style={{ padding: '16px' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>PARSING TEXT...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span style={{ letterSpacing: '0.05em' }}>EXTRACT FROM TEXT</span>
                  </>
                )}
              </button>
              
              <button
                onClick={clear}
                disabled={loading}
                style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
              >
                Clear Text
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="fade-in" style={{ padding: '16px', background: '#fff1f2', borderRadius: '12px', border: '1px solid #ffe4e6', color: '#e11d48', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <X size={18} />
                <p style={{ fontSize: '14px', fontWeight: '700' }}>An error occurred</p>
              </div>
              <p style={{ fontSize: '12px', marginLeft: '30px', opacity: 0.8 }}>{error}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', paddingLeft: '30px' }}>
              <button 
                onClick={handleUpload}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '12px', height: 'auto', flex: 1 }}
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .uploader-tabs {
          display: flex;
          border-bottom: 1px solid var(--sidebar-border);
          background: rgba(248, 250, 252, 0.5);
        }
        .uploader-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px;
          border: none;
          background: none;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .uploader-tab.active {
          color: var(--primary);
          background: white;
          box-shadow: inset 0 -2px 0 var(--primary);
        }
        .uploader-tab:hover:not(.active) {
          background: rgba(248, 250, 252, 0.8);
        }
      `}</style>
    </div>
  );
}
