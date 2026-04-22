"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Briefcase, 
  Globe, 
  Save, 
  Edit3, 
  Loader2, 
  Sparkles,
  Gift,
  Award,
  User,
  Phone,
  BarChart,
  Lightbulb,
  Zap
} from "lucide-react";

interface JobFormProps {
  initialData: any;
  onSave: (updatedData: any) => void;
}

export default function JobForm({ initialData, onSave }: JobFormProps) {
  const [formData, setFormData] = useState({
    company_name: "",
    job_role: "",
    location: "",
    duration: "",
    stipend: "",
    salary: "",
    mode: "",
    benefits: "",
    skills: "",
    hr_name: "",
    hr_phone: "",
    experience: "",
    qualification: ""
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name || initialData.companyName || initialData.company || "",
        job_role: initialData.job_role || initialData.jobRole || initialData.role || "",
        location: initialData.location || "",
        duration: initialData.duration || initialData.time || "",
        stipend: initialData.stipend || "",
        salary: initialData.salary || "",
        mode: initialData.mode || initialData.work_mode || initialData.workMode || "",
        benefits: initialData.benefits || "",
        skills: initialData.skills || "",
        hr_name: initialData.hr_name || "",
        hr_phone: initialData.hr_phone || "",
        experience: initialData.experience || "",
        qualification: initialData.qualification || ""
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="logo-icon" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
          <Edit3 size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1e1b4b' }}>Finalize Job Post</h3>
            {initialData && Object.keys(initialData).length > 0 && (
              <span className="hero-badge" style={{ margin: 0, padding: '2px 8px', fontSize: '10px', background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
                <Sparkles size={10} className="text-primary" /> AI AUTO-FILLED
              </span>
            )}
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Review and refine the auto-filled details below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Info Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div style={{ width: '4px', height: '16px', background: 'var(--primary)', borderRadius: '2px' }}></div>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Information</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="data-label flex items-center gap-2"><Building2 size={14} /> Company Name</label>
              <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="input-field" placeholder="e.g., Manvin" required />
            </div>
            <div className="space-y-2">
              <label className="data-label flex items-center gap-2"><Briefcase size={14} /> Job Role</label>
              <input type="text" name="job_role" value={formData.job_role} onChange={handleChange} className="input-field" placeholder="e.g., Full Stack Developer" required />
            </div>
            <div className="space-y-2">
              <label className="data-label flex items-center gap-2"><MapPin size={14} /> Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" placeholder="e.g., Bangalore, India" />
            </div>
            <div className="space-y-2">
              <label className="data-label flex items-center gap-2"><Globe size={14} /> Work Mode</label>
              <select name="mode" value={formData.mode} onChange={handleChange} className="input-field" style={{ background: 'white' }}>
                <option value="">Select Mode</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Work from Home">Work from Home</option>
              </select>
            </div>
          </div>
        </section>

        {/* Compensation & Duration Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div style={{ width: '4px', height: '16px', background: 'var(--primary)', borderRadius: '2px' }}></div>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Compensation & Timeline</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="data-label flex items-center gap-2"><Clock size={14} /> Duration</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="input-field" placeholder="e.g., 6 Months" />
            </div>
            <div className="space-y-2">
              <label className="data-label flex items-center gap-2"><Zap size={14} /> Stipend</label>
              <input type="text" name="stipend" value={formData.stipend} onChange={handleChange} className="input-field" placeholder="For Internships" />
            </div>
            <div className="space-y-2">
              <label className="data-label flex items-center gap-2"><IndianRupee size={14} /> Full Salary</label>
              <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="input-field" placeholder="For Full-time" />
            </div>
          </div>
        </section>

        {/* Requirements & Benefits Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div style={{ width: '4px', height: '16px', background: 'var(--primary)', borderRadius: '2px' }}></div>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requirements & Perks</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="data-label flex items-center gap-2"><Award size={14} /> Qualification</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="input-field" placeholder="e.g., B.Tech, MCA" />
            </div>
            <div className="space-y-2">
              <label className="data-label flex items-center gap-2"><BarChart size={14} /> Experience</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="input-field" placeholder="e.g., Fresher or 2+ years" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="data-label flex items-center gap-2"><Lightbulb size={14} /> Key Skills</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="input-field" placeholder="e.g., React, Node.js, SQL" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="data-label flex items-center gap-2"><Gift size={14} /> Benefits</label>
              <textarea name="benefits" value={formData.benefits} onChange={handleChange} className="input-field" placeholder="e.g., Free meals, Insurance, Cabs" style={{ height: '80px', resize: 'none' }} />
            </div>
          </div>
        </section>

        {/* HR Contact Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div style={{ width: '4px', height: '16px', background: 'var(--primary)', borderRadius: '2px' }}></div>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>HR Contact Details</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="data-label flex items-center gap-2"><User size={14} /> Contact Person</label>
              <input type="text" name="hr_name" value={formData.hr_name} onChange={handleChange} className="input-field" placeholder="Name of HR" />
            </div>
            <div className="space-y-2">
              <label className="data-label flex items-center gap-2"><Phone size={14} /> Contact Number</label>
              <input type="text" name="hr_phone" value={formData.hr_phone} onChange={handleChange} className="input-field" placeholder="Number for inquiries" />
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-glass-border">
          <button type="submit" disabled={saving} className="btn-primary w-full shadow-lg" style={{ padding: '18px' }}>
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>SAVING POST DATA...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span style={{ letterSpacing: '0.05em' }}>GENERATE & SAVE POST</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
