"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { CVData } from "@/lib/types";
import { forwardRef } from "react";

interface CVPreviewProps {
  data: CVData;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function formatMonthYear(dateStr: string): string {
  if (!dateStr) return "";
  return formatDate(dateStr);
}

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ data }, ref) => {
  const { t, locale } = useLanguage();
  const { personalInfo, summary, experience, education, skills, languages, projects, certifications, references } = data;

  const hasContent = personalInfo.fullName || summary || experience.length > 0 || education.length > 0 || skills.length > 0;

  return (
    <div
      ref={ref}
      className="bg-white shadow-2xl rounded-lg overflow-hidden"
      style={{
        width: "216mm",
        minHeight: "279mm",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: "10.5pt",
        lineHeight: "1.4",
        color: "#222",
        padding: "0",
      }}
    >
      {/* Harvard-style CV */}
      <div style={{ padding: "25mm 20mm 20mm 20mm" }}>
        {/* Header with photo */}
        <div style={{ display: "flex", gap: "20px", alignItems: personalInfo.photo ? "flex-start" : "center", marginBottom: "8mm" }}>
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName || "Profile"}
              style={{
                width: "75pt",
                height: "75pt",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2pt solid #333",
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            {/* Name - centered like Harvard */}
            <h1
              style={{
                fontSize: "22pt",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "2mm",
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: "0.5pt",
                color: "#111",
              }}
            >
              {personalInfo.fullName || (locale === "es" ? "Tu Nombre" : "Your Name")}
            </h1>

            {/* Professional title */}
            {personalInfo.title && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "11pt",
                  color: "#444",
                  fontStyle: "italic",
                  marginBottom: "3mm",
                }}
              >
                {personalInfo.title}
              </p>
            )}

            {/* Contact info line */}
            <div
              style={{
                textAlign: "center",
                fontSize: "9pt",
                color: "#555",
                lineHeight: "1.6",
              }}
            >
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.email && personalInfo.phone && <span> | </span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {(personalInfo.email || personalInfo.phone) && personalInfo.location && <span> | </span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.linkedin && (personalInfo.email || personalInfo.phone || personalInfo.location) && <span> | </span>}
              {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
              {personalInfo.website && personalInfo.linkedin && <span> | </span>}
              {personalInfo.website && <span>{personalInfo.website}</span>}
            </div>
          </div>
        </div>

        {/* Horizontal rule - Harvard style */}
        <hr
          style={{
            border: "none",
            borderTop: "1pt solid #222",
            marginBottom: "5mm",
          }}
        />

        {/* Summary */}
        {summary && (
          <Section title={t("summary")}>
            <p style={{ textAlign: "justify" }}>{summary}</p>
          </Section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <Section title={t("experience")}>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "4mm" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "11pt" }}>{exp.jobTitle || (locale === "es" ? "Cargo" : "Position")}</strong>
                  <span style={{ fontSize: "9pt", color: "#555", fontStyle: "italic", whiteSpace: "nowrap" }}>
                    {formatMonthYear(exp.startDate)} — {exp.current ? t("present") : formatMonthYear(exp.endDate)}
                  </span>
                </div>
                <div style={{ fontSize: "10pt", color: "#333", marginBottom: "1mm" }}>
                  {exp.company && <em>{exp.company}</em>}
                  {exp.company && exp.country && <span style={{ color: "#555" }}> | </span>}
                  {exp.country && <span style={{ color: "#555" }}>{exp.country}</span>}
                </div>
                {exp.description && (
                  <div style={{ fontSize: "10pt", textAlign: "justify", lineHeight: "1.5" }}>
                    {exp.description.split("\n").map((line, i) => (
                      <p key={i} style={{ margin: "0.5mm 0" }}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title={t("education")}>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "4mm" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "11pt" }}>
                    {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                  </strong>
                  <span style={{ fontSize: "9pt", color: "#555", fontStyle: "italic", whiteSpace: "nowrap" }}>
                    {formatMonthYear(edu.startDate)} — {formatMonthYear(edu.endDate)}
                  </span>
                </div>
                <div style={{ fontSize: "10pt", color: "#333" }}>
                  <em>{edu.institution}</em>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && skills.some((s) => s.trim()) && (
          <Section title={t("skills")}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2mm" }}>
              {skills.filter((s) => s.trim()).map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "9.5pt",
                    background: "#f0f0f0",
                    padding: "1mm 3mm",
                    borderRadius: "2mm",
                    border: "0.5pt solid #ddd",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Languages */}
        {languages.length > 0 && languages.some((l) => l.name.trim()) && (
          <Section title={t("languages")}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5mm" }}>
              {languages.filter((l) => l.name.trim()).map((lang, idx) => (
                <span key={idx} style={{ fontSize: "10pt" }}>
                  <strong>{lang.name}</strong>
                  {lang.level && (
                    <span style={{ color: "#555" }}> — {t(lang.level as "beginner" | "intermediate" | "advanced" | "fluent" | "native")}</span>
                  )}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title={t("projects")}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: "3mm" }}>
                <strong style={{ fontSize: "11pt" }}>{proj.name}</strong>
                {proj.url && (
                  <span style={{ fontSize: "9pt", color: "#0066cc", marginLeft: "2mm" }}>
                    {proj.url}
                  </span>
                )}
                {proj.description && (
                  <p style={{ fontSize: "10pt", textAlign: "justify", margin: "1mm 0" }}>
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title={t("certifications")}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: "2mm" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>
                    <strong>{cert.name}</strong>
                    {cert.issuer && <span style={{ color: "#555" }}> — {cert.issuer}</span>}
                  </span>
                  {cert.date && (
                    <span style={{ fontSize: "9pt", color: "#555", fontStyle: "italic" }}>
                      {formatDate(cert.date)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* References */}
        {references.length > 0 && (
          <Section title={t("references")}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4mm" }}>
              {references.map((ref) => (
                <div key={ref.id} style={{ fontSize: "9.5pt" }}>
                  <strong>{ref.name}</strong>
                  {ref.position && <div>{ref.position}</div>}
                  {ref.company && <div>{ref.company}</div>}
                  {ref.email && <div>{ref.email}</div>}
                  {ref.phone && <div>{ref.phone}</div>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Empty state */}
        {!hasContent && (
          <div style={{ textAlign: "center", padding: "40mm 0", color: "#999" }}>
            <p style={{ fontSize: "12pt" }}>
              {locale === "es"
                ? "Completa el formulario para ver tu CV aquí"
                : "Fill out the form to see your CV here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "5mm" }}>
      <h2
        style={{
          fontSize: "13pt",
          fontWeight: "bold",
          textTransform: "uppercase",
          borderBottom: "0.8pt solid #333",
          paddingBottom: "1.5mm",
          marginBottom: "3mm",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          letterSpacing: "0.5pt",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

CVPreview.displayName = "CVPreview";

export default CVPreview;
