"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { CVData, Experience, Education, Project, Certification, Reference } from "@/lib/types";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  FolderOpen,
  Award,
  Users,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function SectionHeader({
  icon: Icon,
  title,
  isOpen,
  onToggle,
}: {
  icon: React.ElementType;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <span className="font-semibold text-gray-800">{title}</span>
      </div>
      {isOpen ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm resize-none"
      />
    </div>
  );
}

export default function CVForm({ data, onChange }: CVFormProps) {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: false,
    education: false,
    skills: false,
    languages: false,
    projects: false,
    certifications: false,
    references: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updatePersonal = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonal("photo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Experience
  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      jobTitle: "",
      company: "",
      country: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    });
  };

  // Education
  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    });
  };

  // Skills
  const addSkill = () => {
    onChange({ ...data, skills: [...data.skills, ""] });
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = value;
    onChange({ ...data, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    onChange({
      ...data,
      skills: data.skills.filter((_, i) => i !== index),
    });
  };

  // Languages
  const addLanguage = () => {
    onChange({
      ...data,
      languages: [...data.languages, { name: "", level: "intermediate" }],
    });
  };

  const updateLanguage = (index: number, field: string, value: string) => {
    const newLangs = [...data.languages];
    newLangs[index] = { ...newLangs[index], [field]: value };
    onChange({ ...data, languages: newLangs });
  };

  const removeLanguage = (index: number) => {
    onChange({
      ...data,
      languages: data.languages.filter((_, i) => i !== index),
    });
  };

  // Projects
  const addProject = () => {
    const newProj: Project = {
      id: generateId(),
      name: "",
      description: "",
      url: "",
    };
    onChange({ ...data, projects: [...data.projects, newProj] });
  };

  const updateProject = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      projects: data.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  };

  // Certifications
  const addCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
    };
    onChange({ ...data, certifications: [...data.certifications, newCert] });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      certifications: data.certifications.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const removeCertification = (id: string) => {
    onChange({
      ...data,
      certifications: data.certifications.filter((c) => c.id !== id),
    });
  };

  // References
  const addReference = () => {
    const newRef: Reference = {
      id: generateId(),
      name: "",
      position: "",
      company: "",
      email: "",
      phone: "",
    };
    onChange({ ...data, references: [...data.references, newRef] });
  };

  const updateReference = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      references: data.references.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    });
  };

  const removeReference = (id: string) => {
    onChange({
      ...data,
      references: data.references.filter((r) => r.id !== id),
    });
  };

  const sections = [
    { key: "personal", icon: User, title: t("personalInfo"), content: (
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-4">
          {data.personalInfo.photo ? (
            <div className="relative">
              <img
                src={data.personalInfo.photo}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={() => updatePersonal("photo", "")}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                x
              </button>
            </div>
          ) : (
            <label className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
              <User className="w-6 h-6 text-gray-400" />
              <span className="text-[10px] text-gray-400 mt-1 text-center">{t("selectPhoto")}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
          <div className="flex-1">
            <InputField
              label={t("fullName")}
              value={data.personalInfo.fullName}
              onChange={(v) => updatePersonal("fullName", v)}
              placeholder="Juan Pérez"
            />
          </div>
        </div>
        <InputField
          label={t("title")}
          value={data.personalInfo.title}
          onChange={(v) => updatePersonal("title", v)}
          placeholder="Ingeniero de Software"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label={t("email")}
            value={data.personalInfo.email}
            onChange={(v) => updatePersonal("email", v)}
            placeholder="juan@ejemplo.com"
            type="email"
          />
          <InputField
            label={t("phone")}
            value={data.personalInfo.phone}
            onChange={(v) => updatePersonal("phone", v)}
            placeholder="+34 600 000 000"
            type="tel"
          />
        </div>
        <InputField
          label={t("location")}
          value={data.personalInfo.location}
          onChange={(v) => updatePersonal("location", v)}
          placeholder="Madrid, España"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label={t("linkedin")}
            value={data.personalInfo.linkedin}
            onChange={(v) => updatePersonal("linkedin", v)}
            placeholder="linkedin.com/in/tu-perfil"
          />
          <InputField
            label={t("website")}
            value={data.personalInfo.website}
            onChange={(v) => updatePersonal("website", v)}
            placeholder="tu-sitio.com"
          />
        </div>
      </div>
    )},
    { key: "summary", icon: User, title: t("summary"), content: (
      <div className="pt-4">
        <TextAreaField
          label={t("summary")}
          value={data.summary}
          onChange={(v) => onChange({ ...data, summary: v })}
          placeholder={t("summaryPlaceholder")}
        />
      </div>
    )},
    { key: "experience", icon: Briefcase, title: t("experience"), content: (
      <div className="space-y-4 pt-4">
        {data.experience.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">{t("noExperience")}</p>
        )}
        {data.experience.map((exp, idx) => (
          <div key={exp.id} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 relative group">
            <button
              type="button"
              onClick={() => removeExperience(exp.id)}
              className="absolute top-3 right-3 w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="text-xs font-medium text-gray-400 mb-2">#{idx + 1}</div>
            <InputField
              label={t("jobTitle")}
              value={exp.jobTitle}
              onChange={(v) => updateExperience(exp.id, "jobTitle", v)}
            />
            <InputField
              label={t("company")}
              value={exp.company}
              onChange={(v) => updateExperience(exp.id, "company", v)}
            />
            <InputField
              label={t("country")}
              value={exp.country}
              onChange={(v) => updateExperience(exp.id, "country", v)}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label={t("startDate")}
                value={exp.startDate}
                onChange={(v) => updateExperience(exp.id, "startDate", v)}
                type="month"
              />
              <div>
                <InputField
                  label={t("endDate")}
                  value={exp.current ? "" : exp.endDate}
                  onChange={(v) => updateExperience(exp.id, "endDate", v)}
                  type="month"
                  placeholder={exp.current ? t("present") : ""}
                />
                <label className="flex items-center gap-2 mt-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {t("current")}
                </label>
              </div>
            </div>
            <TextAreaField
              label={t("description")}
              value={exp.description}
              onChange={(v) => updateExperience(exp.id, "description", v)}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addExperience}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t("addExperience")}
        </button>
      </div>
    )},
    { key: "education", icon: GraduationCap, title: t("education"), content: (
      <div className="space-y-4 pt-4">
        {data.education.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">{t("noEducation")}</p>
        )}
        {data.education.map((edu, idx) => (
          <div key={edu.id} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 relative group">
            <button
              type="button"
              onClick={() => removeEducation(edu.id)}
              className="absolute top-3 right-3 w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="text-xs font-medium text-gray-400 mb-2">#{idx + 1}</div>
            <InputField
              label={t("institution")}
              value={edu.institution}
              onChange={(v) => updateEducation(edu.id, "institution", v)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label={t("degree")}
                value={edu.degree}
                onChange={(v) => updateEducation(edu.id, "degree", v)}
              />
              <InputField
                label={t("fieldOfStudy")}
                value={edu.fieldOfStudy}
                onChange={(v) => updateEducation(edu.id, "fieldOfStudy", v)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label={t("eduStartDate")}
                value={edu.startDate}
                onChange={(v) => updateEducation(edu.id, "startDate", v)}
                type="month"
              />
              <InputField
                label={t("eduEndDate")}
                value={edu.endDate}
                onChange={(v) => updateEducation(edu.id, "endDate", v)}
                type="month"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t("addEducation")}
        </button>
      </div>
    )},
    { key: "skills", icon: Wrench, title: t("skills"), content: (
      <div className="space-y-3 pt-4">
        {data.skills.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">{t("noSkills")}</p>
        )}
        {data.skills.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(idx, e.target.value)}
              placeholder={t("skillPlaceholder")}
              className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm"
            />
            <button
              type="button"
              onClick={() => removeSkill(idx)}
              className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-all shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSkill}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t("addSkill")}
        </button>
      </div>
    )},
    { key: "languages", icon: Globe, title: t("languages"), content: (
      <div className="space-y-3 pt-4">
        {data.languages.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">{t("noLanguages")}</p>
        )}
        {data.languages.map((lang, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={lang.name}
              onChange={(e) => updateLanguage(idx, "name", e.target.value)}
              placeholder={t("languageName")}
              className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm"
            />
            <select
              value={lang.level}
              onChange={(e) => updateLanguage(idx, "level", e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm"
            >
              <option value="beginner">{t("beginner")}</option>
              <option value="intermediate">{t("intermediate")}</option>
              <option value="advanced">{t("advanced")}</option>
              <option value="fluent">{t("fluent")}</option>
              <option value="native">{t("native")}</option>
            </select>
            <button
              type="button"
              onClick={() => removeLanguage(idx)}
              className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-all shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLanguage}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t("addLanguage")}
        </button>
      </div>
    )},
    { key: "projects", icon: FolderOpen, title: t("projects"), content: (
      <div className="space-y-4 pt-4">
        {data.projects.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">{t("noProjects")}</p>
        )}
        {data.projects.map((proj, idx) => (
          <div key={proj.id} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 relative group">
            <button
              type="button"
              onClick={() => removeProject(proj.id)}
              className="absolute top-3 right-3 w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="text-xs font-medium text-gray-400 mb-2">#{idx + 1}</div>
            <InputField
              label={t("projectName")}
              value={proj.name}
              onChange={(v) => updateProject(proj.id, "name", v)}
            />
            <TextAreaField
              label={t("projectDescription")}
              value={proj.description}
              onChange={(v) => updateProject(proj.id, "description", v)}
            />
            <InputField
              label={t("projectUrl")}
              value={proj.url}
              onChange={(v) => updateProject(proj.id, "url", v)}
              placeholder="https://..."
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addProject}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t("addProject")}
        </button>
      </div>
    )},
    { key: "certifications", icon: Award, title: t("certifications"), content: (
      <div className="space-y-4 pt-4">
        {data.certifications.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">{t("noCertifications")}</p>
        )}
        {data.certifications.map((cert, idx) => (
          <div key={cert.id} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 relative group">
            <button
              type="button"
              onClick={() => removeCertification(cert.id)}
              className="absolute top-3 right-3 w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="text-xs font-medium text-gray-400 mb-2">#{idx + 1}</div>
            <InputField
              label={t("certName")}
              value={cert.name}
              onChange={(v) => updateCertification(cert.id, "name", v)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label={t("certIssuer")}
                value={cert.issuer}
                onChange={(v) => updateCertification(cert.id, "issuer", v)}
              />
              <InputField
                label={t("certDate")}
                value={cert.date}
                onChange={(v) => updateCertification(cert.id, "date", v)}
                type="month"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addCertification}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t("addCertification")}
        </button>
      </div>
    )},
    { key: "references", icon: Users, title: t("references"), content: (
      <div className="space-y-4 pt-4">
        {data.references.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">{t("noReferences")}</p>
        )}
        {data.references.map((ref, idx) => (
          <div key={ref.id} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 relative group">
            <button
              type="button"
              onClick={() => removeReference(ref.id)}
              className="absolute top-3 right-3 w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="text-xs font-medium text-gray-400 mb-2">#{idx + 1}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label={t("refName")}
                value={ref.name}
                onChange={(v) => updateReference(ref.id, "name", v)}
              />
              <InputField
                label={t("refPosition")}
                value={ref.position}
                onChange={(v) => updateReference(ref.id, "position", v)}
              />
            </div>
            <InputField
              label={t("refCompany")}
              value={ref.company}
              onChange={(v) => updateReference(ref.id, "company", v)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label={t("refEmail")}
                value={ref.email}
                onChange={(v) => updateReference(ref.id, "email", v)}
                type="email"
              />
              <InputField
                label={t("refPhone")}
                value={ref.phone}
                onChange={(v) => updateReference(ref.id, "phone", v)}
                type="tel"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addReference}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t("addReference")}
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div key={section.key}>
          <SectionHeader
            icon={section.icon}
            title={section.title}
            isOpen={openSections[section.key]}
            onToggle={() => toggleSection(section.key)}
          />
          {openSections[section.key] && (
            <div className="px-1 pb-2">{section.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
