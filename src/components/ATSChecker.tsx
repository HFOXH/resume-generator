"use client";

import { useLanguage } from "@/context/LanguageContext";
import { type ATSResult, type ATSCheck } from "@/lib/atsChecker";
import type { TranslationKey } from "@/lib/translations";
import { X, CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react";

interface ATSCheckerProps {
  result: ATSResult;
  onClose: () => void;
}

const checkLabels: Record<string, { es: string; en: string }> = {
  full_name: { es: "atsCheckFullName", en: "atsCheckFullName" },
  email: { es: "atsCheckEmail", en: "atsCheckEmail" },
  phone: { es: "atsCheckPhone", en: "atsCheckPhone" },
  location: { es: "atsCheckLocation", en: "atsCheckLocation" },
  title: { es: "atsCheckTitle", en: "atsCheckTitle" },
  summary: { es: "atsCheckSummary", en: "atsCheckSummary" },
  experience: { es: "atsCheckExperience", en: "atsCheckExperience" },
  quantifiable: { es: "atsCheckQuantifiable", en: "atsCheckQuantifiable" },
  education: { es: "atsCheckEducation", en: "atsCheckEducation" },
  skills: { es: "atsCheckSkills", en: "atsCheckSkills" },
  linkedin: { es: "atsCheckLinkedin", en: "atsCheckLinkedin" },
  dates: { es: "atsCheckDates", en: "atsCheckDates" },
};

const categoryLabels: Record<string, string> = {
  contact: "atsCategoryContact",
  content: "atsCategoryContent",
  keywords: "atsCategoryKeywords",
  format: "atsCategoryFormat",
};

const severityIcon: Record<string, React.ReactNode> = {
  critical: <AlertTriangle className="w-3.5 h-3.5" />,
  warning: <AlertTriangle className="w-3.5 h-3.5" />,
  info: <CheckCircle className="w-3.5 h-3.5" />,
};

function ScoreCircle({ score }: { score: number }) {
  const color =
    score >= 80 ? "#16a34a" : score >= 50 ? "#ca8a04" : "#dc2626";
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

function CheckItem({
  check,
  label,
}: {
  check: ATSCheck;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        check.passed
          ? "bg-emerald-50 border-emerald-200"
          : check.severity === "critical"
            ? "bg-red-50 border-red-200"
            : check.severity === "warning"
              ? "bg-amber-50 border-amber-200"
              : "bg-gray-50 border-gray-200"
      }`}
    >
      {check.passed ? (
        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
      ) : (
        <XCircle
          className={`w-5 h-5 shrink-0 ${
            check.severity === "critical"
              ? "text-red-500"
              : check.severity === "warning"
                ? "text-amber-500"
                : "text-gray-400"
          }`}
        />
      )}
      <span
        className={`text-sm font-medium ${
          check.passed ? "text-emerald-700" : "text-gray-700"
        }`}
      >
        {label}
      </span>
      {severityIcon[check.severity] && !check.passed && (
        <span
          className={`ml-auto ${
            check.severity === "critical"
              ? "text-red-400"
              : check.severity === "warning"
                ? "text-amber-400"
                : "text-gray-400"
          }`}
        >
          {severityIcon[check.severity]}
        </span>
      )}
    </div>
  );
}

export default function ATSChecker({ result, onClose }: ATSCheckerProps) {
  const { t } = useLanguage();
  const { score, checks } = result;

  const message =
    score >= 80 ? t("atsGreat") : score >= 50 ? t("atsGood") : t("atsBad");

  const grouped = checks.reduce(
    (acc, check) => {
      if (!acc[check.category]) acc[check.category] = [];
      acc[check.category].push(check);
      return acc;
    },
    {} as Record<string, ATSCheck[]>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {t("atsTitle")}
              </h2>
              <p className="text-xs text-gray-500">{t("atsSubtitle")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center py-6 px-6">
          <ScoreCircle score={score} />
          <p className="mt-4 text-sm font-medium text-gray-700 text-center">
            {message}
          </p>
        </div>

        {/* Checks */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
          {Object.entries(grouped).map(([category, catChecks]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {t(categoryLabels[category] as TranslationKey)}
              </h3>
              <div className="space-y-2">
                {catChecks.map((check) => (
                  <CheckItem
                    key={check.id}
                    check={check}
                    label={t((checkLabels[check.id]?.es || check.id) as TranslationKey)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
