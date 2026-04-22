"use client";

import { api } from "@/lib/api";
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Target, 
  GraduationCap,
  Briefcase,
  Zap,
  Gift,
  User,
  Phone,
  BarChart,
  Lightbulb,
  CheckCircle2
} from "lucide-react";

interface PlacementCardProps {
  data: {
    company_name?: string;
    location?: string;
    salary?: string;
    stipend?: string;
    deadline?: string;
    eligibility?: string;
    role?: string;
    job_role?: string;
    benefits?: string;
    skills?: string;
    hr_name?: string;
    hr_phone?: string;
    experience?: string;
    qualification?: string;
    duration?: string;
    mode?: string;
  };
  imagePath?: string;
}

export default function PlacementCard({ data, imagePath }: PlacementCardProps) {
  // Map fields to clean UI items
  const mainInfo = [
    { icon: Briefcase, label: "Role", value: data.job_role || data.role || "Not Specified" },
    { icon: MapPin, label: "Location", value: data.location || "Not Specified" },
    { icon: GraduationCap, label: "Qualification", value: data.qualification || data.eligibility || "Not Specified" },
    { icon: BarChart, label: "Experience", value: data.experience || "Not Specified" },
  ];

  const packageInfo = [
    { icon: IndianRupee, label: "Salary", value: data.salary || "Not Specified", color: "#166534", bg: "#dcfce7" },
    { icon: Zap, label: "Stipend", value: data.stipend || "Not Specified", color: "#854d0e", bg: "#fef9c3" },
    { icon: Calendar, label: "Duration", value: data.duration || "Not Specified", color: "#1e40af", bg: "#dbeafe" },
  ];

  return (
    <div className="glass-panel info-card fade-in" style={{ padding: '40px' }}>
      <div className="card-header" style={{ marginBottom: '48px' }}>
        <div className="logo-icon" style={{ width: '80px', height: '80px', borderRadius: '20px' }}>
          <Building2 size={40} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '36px', fontWeight: '900', color: '#1e1b4b', letterSpacing: '-0.02em' }}>
              {data.company_name || "Unknown Company"}
            </h3>
            <span className="status-badge" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '6px 12px' }}>
              <CheckCircle2 size={12} style={{ marginRight: '6px' }} /> Verified
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '16px', fontWeight: '700' }}>
            <Target size={18} />
            <span>{data.mode || "Mode Not Specified"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Requirements */}
        <div className="space-y-8">
          <div className="data-grid" style={{ gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px' }}>
            {mainInfo.map((item, idx) => (
              <div key={idx} className="data-item" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
                <div className="logo-icon" style={{ width: '40px', height: '40px', background: '#f8fafc', color: 'var(--primary)', borderRadius: '12px', boxShadow: 'none' }}>
                  <item.icon size={20} />
                </div>
                <div>
                  <div className="data-label">{item.label}</div>
                  <div className="data-value" style={{ fontSize: '18px' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {(data.hr_name || data.hr_phone) && (
            <div className="data-item" style={{ padding: '24px', background: 'linear-gradient(to right, #f5f3ff, transparent)', border: '1px solid #ddd6fe' }}>
              <div className="data-label" style={{ marginBottom: '16px' }}>Contact Information</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.hr_name && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1e1b4b', fontWeight: '700' }}>
                    <User size={16} className="text-primary" /> {data.hr_name}
                  </div>
                )}
                {data.hr_phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1e1b4b', fontWeight: '700' }}>
                    <Phone size={16} className="text-primary" /> {data.hr_phone}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Compensation & Details */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4">
            {packageInfo.map((item, idx) => (
              <div key={idx} className="data-item" style={{ background: item.bg, border: 'none' }}>
                <div className="flex items-center gap-3 mb-1">
                  <item.icon size={16} style={{ color: item.color }} />
                  <span className="data-label" style={{ color: item.color, opacity: 0.8 }}>{item.label}</span>
                </div>
                <div className="data-value" style={{ color: item.color, fontSize: '24px' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {data.skills && (
            <div className="data-item">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-primary" />
                <span className="data-label">Required Skills</span>
              </div>
              <p style={{ color: '#1e1b4b', fontWeight: '600', lineHeight: '1.6' }}>{data.skills}</p>
            </div>
          )}

          {data.benefits && (
            <div className="data-item">
              <div className="flex items-center gap-2 mb-3">
                <Gift size={16} className="text-primary" />
                <span className="data-label">Perks & Benefits</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>{data.benefits}</p>
            </div>
          )}
        </div>
      </div>

      {imagePath && (
        <div style={{ marginTop: '48px', borderTop: '1px solid var(--sidebar-border)', paddingTop: '48px' }}>
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
            <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1e1b4b' }}>Original Reference Post</h4>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '16px', border: '1px solid var(--sidebar-border)' }}>
            <img 
              src={api.imageUrl(imagePath)} 
              alt="Placement Poster" 
              style={{ width: '100%', borderRadius: '16px', display: 'block', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
