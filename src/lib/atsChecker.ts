import type { CVData } from "./types";

export interface ATSCheck {
  id: string;
  category: "contact" | "format" | "content" | "keywords" | "language";
  passed: boolean;
  severity: "critical" | "warning" | "info";
}

export interface ATSResult {
  score: number;
  checks: ATSCheck[];
}

function emailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasNumbers(text: string): boolean {
  return /\d/.test(text);
}

function hasPercentOrDollar(text: string): boolean {
  return /[%$]|porcentaje|percent/i.test(text);
}

function datesConsistent(data: CVData): boolean {
  const dates: string[] = [];
  data.experience.forEach((e) => {
    if (e.startDate) dates.push(e.startDate);
    if (e.endDate && !e.current) dates.push(e.endDate);
  });
  data.education.forEach((e) => {
    if (e.startDate) dates.push(e.startDate);
    if (e.endDate) dates.push(e.endDate);
  });
  if (dates.length === 0) return true;
  return dates.every((d) => /^\d{4}-\d{2}$/.test(d));
}

export function checkATS(data: CVData): ATSResult {
  const checks: ATSCheck[] = [];

  checks.push({
    id: "full_name",
    category: "contact",
    passed: data.personalInfo.fullName.trim().length > 0,
    severity: "critical",
  });

  checks.push({
    id: "email",
    category: "contact",
    passed: emailValid(data.personalInfo.email),
    severity: "critical",
  });

  checks.push({
    id: "phone",
    category: "contact",
    passed: data.personalInfo.phone.trim().length > 0,
    severity: "critical",
  });

  checks.push({
    id: "location",
    category: "contact",
    passed: data.personalInfo.location.trim().length > 0,
    severity: "warning",
  });

  checks.push({
    id: "title",
    category: "content",
    passed: data.personalInfo.title.trim().length > 0,
    severity: "warning",
  });

  checks.push({
    id: "summary",
    category: "content",
    passed: data.summary.trim().length >= 50,
    severity: "warning",
  });

  checks.push({
    id: "experience",
    category: "content",
    passed: data.experience.length > 0,
    severity: "critical",
  });

  const hasQuantifiable = data.experience.some(
    (e) =>
      e.description.trim().length > 0 &&
      (hasNumbers(e.description) || hasPercentOrDollar(e.description))
  );
  checks.push({
    id: "quantifiable",
    category: "keywords",
    passed: hasQuantifiable,
    severity: "info",
  });

  checks.push({
    id: "education",
    category: "content",
    passed: data.education.length > 0,
    severity: "critical",
  });

  const validSkills = data.skills.filter((s) => s.trim().length > 0);
  checks.push({
    id: "skills",
    category: "keywords",
    passed: validSkills.length >= 3,
    severity: "warning",
  });

  checks.push({
    id: "linkedin",
    category: "format",
    passed: data.personalInfo.linkedin.trim().length > 0,
    severity: "info",
  });

  checks.push({
    id: "dates",
    category: "format",
    passed: datesConsistent(data),
    severity: "warning",
  });

  const weights: Record<string, number> = {
    full_name: 12,
    email: 12,
    phone: 10,
    location: 5,
    title: 6,
    summary: 10,
    experience: 12,
    quantifiable: 8,
    education: 10,
    skills: 8,
    linkedin: 4,
    dates: 3,
  };

  let totalWeight = 0;
  let earnedWeight = 0;

  for (const check of checks) {
    const w = weights[check.id] || 5;
    totalWeight += w;
    if (check.passed) earnedWeight += w;
  }

  const score = Math.round((earnedWeight / totalWeight) * 100);

  return { score, checks };
}
