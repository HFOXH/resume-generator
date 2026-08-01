import jsPDF from "jspdf";
import type { CVData } from "./types";
import type { Locale } from "./translations";
import { translations } from "./translations";

const LETTER_W = 215.9; // mm (8.5 in)
const LETTER_H = 279.4; // mm (11 in)
const MARGIN_L = 20;
const MARGIN_R = 20;
const MARGIN_T = 20;
const MARGIN_B = 18;
const CONTENT_W = LETTER_W - MARGIN_L - MARGIN_R;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(d: string): string {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

export function generatePDF(data: CVData, locale: Locale): void {
  const t = (key: string): string =>
    (translations[locale] as Record<string, string>)[key] || key;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });

  let y = MARGIN_T;

  const addPageIfNeeded = (needed: number) => {
    if (y + needed > LETTER_H - MARGIN_B) {
      doc.addPage();
      y = MARGIN_T;
    }
  };

  const setFont = (style: "normal" | "bold" | "italic" = "normal", size = 10) => {
    if (style === "bold") {
      doc.setFont("times", "bold");
    } else if (style === "italic") {
      doc.setFont("times", "italic");
    } else {
      doc.setFont("times", "normal");
    }
    doc.setFontSize(size);
  };

  const text = (str: string, x: number, yPos: number, opts?: { align?: "left" | "center" | "right"; maxWidth?: number }) => {
    doc.text(str, x, yPos, { align: opts?.align, maxWidth: opts?.maxWidth });
  };

  const drawLine = (x1: number, yPos: number, x2: number) => {
    doc.setDrawColor(34, 34, 34);
    doc.setLineWidth(0.3);
    doc.line(x1, yPos, x2, yPos);
  };

  const splitText = (str: string, maxWidth: number): string[] => {
    setFont("normal", 10);
    return doc.splitTextToSize(str, maxWidth);
  };

  // === PHOTO ===
  let headerOffsetX = MARGIN_L;
  let headerContentW = CONTENT_W;
  if (data.personalInfo.photo) {
    try {
      const imgW = 22;
      const imgH = 22;
      doc.addImage(data.personalInfo.photo, "JPEG", MARGIN_L, y, imgW, imgH);
      doc.setDrawColor(51, 51, 51);
      doc.setLineWidth(0.4);
      doc.circle(MARGIN_L + imgW / 2, y + imgH / 2, imgW / 2);
      headerOffsetX = MARGIN_L + imgW + 8;
      headerContentW = CONTENT_W - imgW - 8;
    } catch {
      // ignore invalid image
    }
  }

  // === NAME ===
  setFont("bold", 22);
  const name = data.personalInfo.fullName || (locale === "es" ? "Tu Nombre" : "Your Name");
  text(name, headerOffsetX + headerContentW / 2, y + 8, { align: "center", maxWidth: headerContentW });

  // === TITLE ===
  if (data.personalInfo.title) {
    setFont("italic", 11);
    text(data.personalInfo.title, headerOffsetX + headerContentW / 2, y + 16, { align: "center", maxWidth: headerContentW });
  }

  // === CONTACT ===
  setFont("normal", 9);
  const contactParts = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.website,
  ].filter(Boolean);
  if (contactParts.length > 0) {
    text(contactParts.join(" | "), headerOffsetX + headerContentW / 2, y + 23, {
      align: "center",
      maxWidth: headerContentW,
    });
  }

  y += 30;

  // === DIVIDER ===
  drawLine(MARGIN_L, y, LETTER_W - MARGIN_R);
  y += 6;

  // === HELPER: Section Title ===
  const sectionTitle = (title: string) => {
    addPageIfNeeded(12);
    setFont("bold", 12);
    text(title.toUpperCase(), MARGIN_L, y);
    y += 1;
    drawLine(MARGIN_L, y, LETTER_W - MARGIN_R);
    y += 5;
  };

  // === SUMMARY ===
  if (data.summary) {
    sectionTitle(t("summary"));
    setFont("normal", 10);
    const lines = splitText(data.summary, CONTENT_W);
    for (const line of lines) {
      addPageIfNeeded(5);
      text(line, MARGIN_L, y, { maxWidth: CONTENT_W });
      y += 4.2;
    }
    y += 3;
  }

  // === EXPERIENCE ===
  if (data.experience.length > 0) {
    sectionTitle(t("experience"));
    for (const exp of data.experience) {
      addPageIfNeeded(20);

      // Job title + dates
      setFont("bold", 11);
      const jobTitle = exp.jobTitle || (locale === "es" ? "Cargo" : "Position");
      text(jobTitle, MARGIN_L, y);

      setFont("italic", 9);
      const dateStr = `${formatDate(exp.startDate)} — ${exp.current ? t("present") : formatDate(exp.endDate)}`;
      text(dateStr, LETTER_W - MARGIN_R, y, { align: "right" });
      y += 5;

      // Company & Country
      if (exp.company || exp.country) {
        setFont("italic", 10);
        const companyParts = [exp.company, exp.country].filter(Boolean);
        text(companyParts.join(" | "), MARGIN_L, y);
        y += 5;
      }

      // Description
      if (exp.description) {
        setFont("normal", 10);
        const descLines = splitText(exp.description, CONTENT_W);
        for (const line of descLines) {
          addPageIfNeeded(5);
          text(line, MARGIN_L, y, { maxWidth: CONTENT_W });
          y += 4.2;
        }
      }
      y += 3;
    }
  }

  // === EDUCATION ===
  if (data.education.length > 0) {
    sectionTitle(t("education"));
    for (const edu of data.education) {
      addPageIfNeeded(14);

      setFont("bold", 11);
      const degreeStr = edu.degree
        ? edu.fieldOfStudy
          ? `${edu.degree}, ${edu.fieldOfStudy}`
          : edu.degree
        : edu.fieldOfStudy || "";
      text(degreeStr || (locale === "es" ? "Título" : "Degree"), MARGIN_L, y);

      setFont("italic", 9);
      const dateStr = `${formatDate(edu.startDate)} — ${formatDate(edu.endDate)}`;
      text(dateStr, LETTER_W - MARGIN_R, y, { align: "right" });
      y += 5;

      if (edu.institution) {
        setFont("italic", 10);
        text(edu.institution, MARGIN_L, y);
        y += 5;
      }
      y += 2;
    }
  }

  // === SKILLS ===
  const validSkills = data.skills.filter((s) => s.trim());
  if (validSkills.length > 0) {
    sectionTitle(t("skills"));
    setFont("normal", 10);
    const skillLine = validSkills.join("  •  ");
    const skillLines = splitText(skillLine, CONTENT_W);
    for (const line of skillLines) {
      addPageIfNeeded(5);
      text(line, MARGIN_L, y, { maxWidth: CONTENT_W });
      y += 4.5;
    }
    y += 3;
  }

  // === LANGUAGES ===
  const validLangs = data.languages.filter((l) => l.name.trim());
  if (validLangs.length > 0) {
    sectionTitle(t("languages"));
    setFont("normal", 10);
    const langStr = validLangs
      .map((l) => {
        const levelText = l.level ? ` — ${t(l.level)}` : "";
        return `${l.name}${levelText}`;
      })
      .join("     ");
    const langLines = splitText(langStr, CONTENT_W);
    for (const line of langLines) {
      addPageIfNeeded(5);
      text(line, MARGIN_L, y, { maxWidth: CONTENT_W });
      y += 4.5;
    }
    y += 3;
  }

  // === PROJECTS ===
  if (data.projects.length > 0) {
    sectionTitle(t("projects"));
    for (const proj of data.projects) {
      addPageIfNeeded(10);
      setFont("bold", 11);
      const projNameWidth = doc.getTextWidth(proj.name || "");
      text(proj.name || "", MARGIN_L, y);
      if (proj.url) {
        setFont("normal", 8);
        doc.setTextColor(0, 102, 204);
        const urlX = MARGIN_L + projNameWidth + 4;
        const maxUrlX = LETTER_W - MARGIN_R;
        if (urlX + doc.getTextWidth(proj.url) <= maxUrlX) {
          text(proj.url, urlX, y);
        } else {
          text(proj.url, MARGIN_L, y + 4, { maxWidth: CONTENT_W });
        }
        doc.setTextColor(0, 0, 0);
      }
      y += 5;

      if (proj.description) {
        setFont("normal", 10);
        const descLines = splitText(proj.description, CONTENT_W);
        for (const line of descLines) {
          addPageIfNeeded(5);
          text(line, MARGIN_L, y, { maxWidth: CONTENT_W });
          y += 4.2;
        }
      }
      y += 3;
    }
  }

  // === CERTIFICATIONS ===
  if (data.certifications.length > 0) {
    sectionTitle(t("certifications"));
    for (const cert of data.certifications) {
      addPageIfNeeded(8);
      setFont("bold", 10);
      const certNameWidth = doc.getTextWidth(cert.name || "");
      const certDateWidth = cert.date ? doc.getTextWidth(formatDate(cert.date)) : 0;
      text(cert.name || "", MARGIN_L, y);
      if (cert.issuer) {
        setFont("normal", 10);
        const issuerText = ` — ${cert.issuer}`;
        const issuerWidth = doc.getTextWidth(issuerText);
        const issuerX = MARGIN_L + certNameWidth;
        const maxIssuerEndX = LETTER_W - MARGIN_R - certDateWidth - 2;
        if (issuerX + issuerWidth <= maxIssuerEndX) {
          text(issuerText, issuerX, y);
        } else if (certNameWidth + doc.getTextWidth(cert.issuer) + 6 <= CONTENT_W) {
          text(` — ${cert.issuer}`, MARGIN_L, y + 4, { maxWidth: CONTENT_W });
        } else {
          text(`— ${cert.issuer}`, MARGIN_L, y + 4, { maxWidth: CONTENT_W });
        }
      }
      if (cert.date) {
        setFont("italic", 9);
        text(formatDate(cert.date), LETTER_W - MARGIN_R, y, { align: "right" });
      }
      y += 5;
    }
    y += 2;
  }

  // === REFERENCES ===
  if (data.references.length > 0) {
    sectionTitle(t("references"));
    const colW = CONTENT_W / 2 - 3;
    let col = 0;
    for (const ref of data.references) {
      addPageIfNeeded(12);
      const x = MARGIN_L + col * (colW + 6);

      setFont("bold", 9.5);
      text(ref.name || "", x, y);
      y += 4;
      if (ref.position) { setFont("normal", 9); text(ref.position, x, y); y += 4; }
      if (ref.company) { setFont("normal", 9); text(ref.company, x, y); y += 4; }
      if (ref.email) { setFont("normal", 9); text(ref.email, x, y); y += 4; }
      if (ref.phone) { setFont("normal", 9); text(ref.phone, x, y); y += 4; }

      col = col === 0 ? 1 : 0;
      if (col === 0) y += 2;
    }
  }

  // Save
  const fileName = data.personalInfo.fullName
    ? `CV_${data.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`
    : locale === "es"
      ? "Mi_CV.pdf"
      : "My_CV.pdf";

  doc.save(fileName);
}
