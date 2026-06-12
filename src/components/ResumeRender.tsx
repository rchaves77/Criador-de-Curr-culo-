import React from "react";
import { ResumeData } from "../types";

// Define the shape of our localized dictionary for resume labels
interface ResumeLabels {
  languages: string;
  skills: string;
  projects: string;
  experience: string;
  education: string;
}

interface ResumeRenderProps {
  resume: ResumeData;
  selectedTemplate: string;
  dict: ResumeLabels;
}

// Interface for template parameters to drive the styles
interface TemplateConfig {
  id: string;
  name: string;
  category: "classic" | "modern" | "creative" | "tech" | "brutalist";
  fontFamily: string; // serif, sans, mono
  bgClass: string;
  textClass: string;
  accentText: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  bulletColor: string;
  layout: "single" | "sidebar" | "grid" | "brutalist" | "console";
  headerCentered?: boolean;
  dividerStyle?: "solid" | "double" | "dashed" | "none";
}

// Configs for all 30 models
export const TEMPLATE_CONFIGS: TemplateConfig[] = [
  {
    id: "elegant",
    name: "Elegante Sênior (Serif)",
    category: "classic",
    fontFamily: "font-serif",
    bgClass: "bg-white",
    textClass: "text-slate-800",
    accentText: "text-indigo-900",
    accentBorder: "border-indigo-900",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-900 border border-indigo-150",
    bulletColor: "text-indigo-800",
    layout: "single",
    headerCentered: true,
    dividerStyle: "solid"
  },
  {
    id: "modern",
    name: "Moderno Sidebar",
    category: "modern",
    fontFamily: "font-sans",
    bgClass: "bg-white",
    textClass: "text-slate-700",
    accentText: "text-slate-900",
    accentBorder: "border-slate-250",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-800 border border-slate-200",
    bulletColor: "text-indigo-650",
    layout: "sidebar",
    dividerStyle: "solid"
  },
  {
    id: "minimal",
    name: "Mínimo Compacto",
    category: "classic",
    fontFamily: "font-sans",
    bgClass: "bg-white",
    textClass: "text-slate-800",
    accentText: "text-slate-950",
    accentBorder: "border-slate-300",
    badgeBg: "bg-slate-50",
    badgeText: "text-slate-800 border border-slate-200",
    bulletColor: "text-slate-700",
    layout: "single",
    headerCentered: false,
    dividerStyle: "solid"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Terminal",
    category: "tech",
    fontFamily: "font-mono",
    bgClass: "bg-slate-950",
    textClass: "text-emerald-400",
    accentText: "text-amber-400",
    accentBorder: "border-emerald-500",
    badgeBg: "bg-emerald-950",
    badgeText: "text-emerald-300 border border-emerald-500",
    bulletColor: "text-amber-300",
    layout: "console",
    dividerStyle: "dashed"
  },
  {
    id: "royal_gold",
    name: "Prestigio Azul & Ouro",
    category: "classic",
    fontFamily: "font-serif",
    bgClass: "bg-slate-50",
    textClass: "text-slate-800",
    accentText: "text-sky-950",
    accentBorder: "border-amber-600",
    badgeBg: "bg-amber-100/30",
    badgeText: "text-amber-900 border border-amber-600/40",
    bulletColor: "text-amber-700",
    layout: "single",
    headerCentered: true,
    dividerStyle: "double"
  },
  {
    id: "creative_teal",
    name: "Menta Criativa",
    category: "creative",
    fontFamily: "font-sans",
    bgClass: "bg-[#fbfbf8]",
    textClass: "text-slate-700",
    accentText: "text-teal-900",
    accentBorder: "border-teal-500",
    badgeBg: "bg-teal-50",
    badgeText: "text-teal-955 border border-teal-200",
    bulletColor: "text-teal-700",
    layout: "sidebar",
    dividerStyle: "solid"
  },
  {
    id: "metro_grid",
    name: "Metro Geométrico",
    category: "modern",
    fontFamily: "font-sans",
    bgClass: "bg-white",
    textClass: "text-slate-800",
    accentText: "text-blue-900",
    accentBorder: "border-blue-900",
    badgeBg: "bg-blue-50/50",
    badgeText: "text-blue-950 border border-blue-200",
    bulletColor: "text-blue-700",
    layout: "grid",
    dividerStyle: "solid"
  },
  {
    id: "art_editorial",
    name: "Editorial Universitário",
    category: "classic",
    fontFamily: "font-serif",
    bgClass: "bg-[#faf9f6]",
    textClass: "text-zinc-800",
    accentText: "text-zinc-950",
    accentBorder: "border-zinc-400",
    badgeBg: "bg-zinc-150/50",
    badgeText: "text-zinc-900 border border-zinc-300",
    bulletColor: "text-neutral-700",
    layout: "single",
    headerCentered: true,
    dividerStyle: "double"
  },
  {
    id: "startup_vibes",
    name: "Startup Pitcher",
    category: "creative",
    fontFamily: "font-sans",
    bgClass: "bg-white",
    textClass: "text-slate-700",
    accentText: "text-orange-600",
    accentBorder: "border-orange-550",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-950 border border-orange-200",
    bulletColor: "text-orange-600",
    layout: "single",
    headerCentered: false,
    dividerStyle: "solid"
  },
  {
    id: "swiss_stark",
    name: "Minimalista Suíço",
    category: "brutalist",
    fontFamily: "font-sans",
    bgClass: "bg-white",
    textClass: "text-neutral-900",
    accentText: "text-black",
    accentBorder: "border-black",
    badgeBg: "bg-neutral-900",
    badgeText: "text-white",
    bulletColor: "text-black",
    layout: "brutalist",
    dividerStyle: "solid"
  },
  {
    id: "terracotta_warm",
    name: "Argila & Terracota",
    category: "creative",
    fontFamily: "font-sans",
    bgClass: "bg-[#fdfbf7]",
    textClass: "text-stone-700",
    accentText: "text-amber-850",
    accentBorder: "border-amber-700",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-900 border border-amber-200",
    bulletColor: "text-amber-700",
    layout: "sidebar",
    dividerStyle: "solid"
  },
  {
    id: "platinum_slate",
    name: "Executivo Platina",
    category: "classic",
    fontFamily: "font-sans",
    bgClass: "bg-white",
    textClass: "text-slate-700",
    accentText: "text-slate-900",
    accentBorder: "border-slate-500",
    badgeBg: "bg-slate-50",
    badgeText: "text-slate-800 border border-slate-350",
    bulletColor: "text-slate-650",
    layout: "single",
    headerCentered: true,
    dividerStyle: "double"
  },
  {
    id: "neon_purple",
    name: "Púrpura Avançado",
    category: "tech",
    fontFamily: "font-sans",
    bgClass: "bg-slate-950",
    textClass: "text-slate-300",
    accentText: "text-violet-400",
    accentBorder: "border-violet-500",
    badgeBg: "bg-violet-950/40",
    badgeText: "text-violet-300 border border-violet-500/30",
    bulletColor: "text-violet-400",
    layout: "single",
    headerCentered: false,
    dividerStyle: "dashed"
  },
  {
    id: "botanical_sage",
    name: "Jardim de Sálvia",
    category: "creative",
    fontFamily: "font-sans",
    bgClass: "bg-stone-50/50",
    textClass: "text-[#2e3c30]",
    accentText: "text-[#1d4123]",
    accentBorder: "border-[#1d4123]/35",
    badgeBg: "bg-[#e8ece9]",
    badgeText: "text-[#1d4123] border border-[#cbd4ce]",
    bulletColor: "text-[#1d4123]",
    layout: "sidebar",
    dividerStyle: "solid"
  },
  {
    id: "midnight_premium",
    name: "Noite Carbono",
    category: "modern",
    fontFamily: "font-sans",
    bgClass: "bg-slate-900",
    textClass: "text-slate-200",
    accentText: "text-indigo-400",
    accentBorder: "border-slate-700",
    badgeBg: "bg-slate-800",
    badgeText: "text-slate-200 border border-slate-700",
    bulletColor: "text-indigo-400",
    layout: "single",
    headerCentered: true,
    dividerStyle: "solid"
  },
  {
    id: "classic_scholar",
    name: "Acadêmico Centrado",
    category: "classic",
    fontFamily: "font-serif",
    bgClass: "bg-white",
    textClass: "text-stone-850",
    accentText: "text-stone-950",
    accentBorder: "border-stone-800",
    badgeBg: "bg-stone-100",
    badgeText: "text-stone-800 border border-stone-300",
    bulletColor: "text-stone-900",
    layout: "single",
    headerCentered: true,
    dividerStyle: "double"
  },
  {
    id: "retro_amber",
    name: "Vintage Amber Terminal",
    category: "tech",
    fontFamily: "font-mono",
    bgClass: "bg-amber-950/90",
    textClass: "text-amber-400",
    accentText: "text-white",
    accentBorder: "border-amber-400",
    badgeBg: "bg-amber-950",
    badgeText: "text-amber-300 border border-amber-450",
    bulletColor: "text-amber-400",
    layout: "console",
    dividerStyle: "dashed"
  },
  {
    id: "chic_lavender",
    name: "Chic Lavanda",
    category: "creative",
    fontFamily: "font-serif",
    bgClass: "bg-white",
    textClass: "text-slate-755",
    accentText: "text-purple-950",
    accentBorder: "border-purple-200",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-900 border border-purple-150",
    bulletColor: "text-purple-750",
    layout: "sidebar",
    dividerStyle: "solid"
  },
  {
    id: "brass_navy",
    name: "Liderança Azul & Bronze",
    category: "classic",
    fontFamily: "font-sans",
    bgClass: "bg-white",
    textClass: "text-slate-700",
    accentText: "text-slate-900",
    accentBorder: "border-amber-700",
    badgeBg: "bg-slate-50",
    badgeText: "text-slate-800 border border-slate-200",
    bulletColor: "text-amber-750",
    layout: "sidebar",
    dividerStyle: "solid"
  },
  {
    id: "brutalist_flat",
    name: "Neo Brutalista Pop",
    category: "brutalist",
    fontFamily: "font-mono",
    bgClass: "bg-[#ffffeb]",
    textClass: "text-black",
    accentText: "text-red-650",
    accentBorder: "border-4 border-black",
    badgeBg: "bg-yellow-250",
    badgeText: "text-black font-extrabold border-2 border-black",
    bulletColor: "text-black",
    layout: "brutalist",
    dividerStyle: "solid"
  },
  {
    id: "ocean_breeze",
    name: "Brisa Marinha",
    category: "creative",
    fontFamily: "font-sans",
    bgClass: "bg-cyan-50/10",
    textClass: "text-slate-700",
    accentText: "text-cyan-900",
    accentBorder: "border-cyan-400",
    badgeBg: "bg-cyan-50/80",
    badgeText: "text-cyan-950 border border-cyan-200",
    bulletColor: "text-cyan-600",
    layout: "sidebar",
    dividerStyle: "solid"
  },
  {
    id: "recruiter_radar",
    name: "Foco Analista ATS Pro",
    category: "modern",
    fontFamily: "font-sans",
    bgClass: "bg-white",
    textClass: "text-slate-800",
    accentText: "text-rose-900",
    accentBorder: "border-rose-450",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-950 border border-rose-200",
    bulletColor: "text-rose-700",
    layout: "grid",
    dividerStyle: "solid"
  },
  {
    id: "crimson_luxe",
    name: "Carmesim Nobre",
    category: "classic",
    fontFamily: "font-serif",
    bgClass: "bg-white",
    textClass: "text-stone-800",
    accentText: "text-rose-955",
    accentBorder: "border-rose-700",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-950 border border-rose-150",
    bulletColor: "text-rose-800",
    layout: "single",
    headerCentered: true,
    dividerStyle: "solid"
  },
  {
    id: "deco_charcoal",
    name: "Linha Fina Art Deco",
    category: "creative",
    fontFamily: "font-sans",
    bgClass: "bg-stone-50",
    textClass: "text-neutral-700",
    accentText: "text-neutral-900 font-black",
    accentBorder: "border-neutral-800",
    badgeBg: "bg-neutral-200/60",
    badgeText: "text-neutral-950 border border-neutral-400",
    bulletColor: "text-neutral-900",
    layout: "single",
    headerCentered: true,
    dividerStyle: "double"
  },
  {
    id: "clean_slate",
    name: "Asfalto & Neblina",
    category: "modern",
    fontFamily: "font-sans",
    bgClass: "bg-[#f5f5f7]",
    textClass: "text-slate-700",
    accentText: "text-slate-900",
    accentBorder: "border-slate-500",
    badgeBg: "bg-white",
    badgeText: "text-slate-800 border border-slate-300",
    bulletColor: "text-indigo-650",
    layout: "sidebar",
    dividerStyle: "solid"
  },
  {
    id: "corp_trust",
    name: "Corporativo Standard",
    category: "classic",
    fontFamily: "font-sans",
    bgClass: "bg-white",
    textClass: "text-slate-750",
    accentText: "text-blue-900",
    accentBorder: "border-blue-800",
    badgeBg: "bg-blue-50/80",
    badgeText: "text-blue-900 border border-blue-200",
    bulletColor: "text-blue-800",
    layout: "single",
    headerCentered: false,
    dividerStyle: "solid"
  },
  {
    id: "future_mono",
    name: "Futuro Monospace Intel",
    category: "tech",
    fontFamily: "font-mono",
    bgClass: "bg-stone-900",
    textClass: "text-orange-350",
    accentText: "text-white",
    accentBorder: "border-orange-500",
    badgeBg: "bg-stone-850",
    badgeText: "text-orange-300 border border-stone-700",
    bulletColor: "text-orange-400",
    layout: "console",
    dividerStyle: "solid"
  },
  {
    id: "nordic_pine",
    name: "Nordic Pine Florestal",
    category: "creative",
    fontFamily: "font-sans",
    bgClass: "bg-slate-50/40",
    textClass: "text-stone-800",
    accentText: "text-emerald-950",
    accentBorder: "border-emerald-850",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-900 border border-emerald-200",
    bulletColor: "text-emerald-800",
    layout: "sidebar",
    dividerStyle: "solid"
  },
  {
    id: "royal_bronze",
    name: "Pátina Imperial",
    category: "classic",
    fontFamily: "font-serif",
    bgClass: "bg-stone-100/30",
    textClass: "text-stone-800",
    accentText: "text-[#3d2a1c]",
    accentBorder: "border-[#b08d57]",
    badgeBg: "bg-stone-50",
    badgeText: "text-stone-900 border border-stone-300",
    bulletColor: "text-[#b08d57]",
    layout: "single",
    headerCentered: true,
    dividerStyle: "solid"
  },
  {
    id: "compact_impact",
    name: "Compacto de Impacto",
    category: "modern",
    fontFamily: "font-sans",
    bgClass: "bg-white",
    textClass: "text-slate-800",
    accentText: "text-violet-950",
    accentBorder: "border-violet-300",
    badgeBg: "bg-violet-50/50",
    badgeText: "text-violet-950 border border-violet-150",
    bulletColor: "text-violet-700",
    layout: "grid",
    dividerStyle: "double"
  }
];

export const ResumeRender: React.FC<ResumeRenderProps> = ({
  resume,
  selectedTemplate,
  dict
}) => {
  // Find current config, default to selectedTemplate or fallback to elegant
  const c = TEMPLATE_CONFIGS.find(cfg => cfg.id === selectedTemplate) || TEMPLATE_CONFIGS[0];

  // Helper styles
  const textFont = `${c.fontFamily} ${c.textClass} ${c.bgClass} transition-all duration-300`;
  const hrDivider = () => {
    if (c.dividerStyle === "none") return null;
    if (c.dividerStyle === "double") {
      return (
        <div className={`border-b-4 border-double ${c.accentBorder} my-3`}></div>
      );
    }
    return (
      <div className={`border-b ${c.dividerStyle === "dashed" ? "border-dashed" : "border-solid"} ${c.accentBorder} my-3`}></div>
    );
  };

  // Safe checks for empty values
  const hasExp = resume.experience && resume.experience.length > 0;
  const hasEdu = resume.education && resume.education.length > 0;
  const hasSkills = resume.skills && resume.skills.length > 0;
  const hasLanguages = resume.languages && resume.languages.length > 0;
  const hasProjects = resume.projects && resume.projects.length > 0;

  // Render components according to layout style
  if (c.layout === "console") {
    // Elegant Monospace / Cyberpunk Console Styles
    return (
      <div id={`${c.id}-resume-view`} className={`p-7 rounded ${textFont} border-2 ${c.accentBorder} relative overflow-hidden`}>
        <div className={`border-b-2 ${c.accentBorder} pb-3 mb-4`}>
          <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest mb-1">
            // METRIC SYSTEM MODULE: {c.name.toUpperCase()} / SYSPREOP: ONLINE
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
            {resume.personal.name}
          </h2>
          <p className="text-sm font-bold uppercase mb-2 text-amber-300">
            &gt; {resume.personal.title}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
            <p><span className="text-slate-500 font-bold">[LOC]</span> {resume.personal.location}</p>
            <p><span className="text-slate-500 font-bold">[TEL]</span> {resume.personal.phone}</p>
            <p><span className="text-slate-500 font-bold">[EML]</span> {resume.personal.email}</p>
            {resume.personal.linkedin && (
              <p><span className="text-slate-500 font-bold">[LNK]</span> {resume.personal.linkedin}</p>
            )}
            {resume.personal.github && (
              <p><span className="text-slate-500 font-bold">[GIT]</span> {resume.personal.github}</p>
            )}
          </div>
        </div>

        {resume.summary && (
          <div className="mb-5">
            <p className="text-amber-500 font-extrabold text-[10px] uppercase mb-1"># SUMMARY PROFILES</p>
            <p className="text-[11px] leading-relaxed text-justify">{resume.summary}</p>
          </div>
        )}

        {hasExp && (
          <div className="mb-5">
            <p className="text-amber-500 font-extrabold text-[10px] uppercase mb-2"># CORES_OPERATIONS</p>
            <div className="space-y-4">
              {resume.experience.map(exp => (
                <div key={exp.id} className={`border-l-2 ${c.accentBorder} pl-3`}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-baseline font-bold text-white text-[11px]">
                    <span>{exp.role.toUpperCase()} @ {exp.company.toUpperCase()}</span>
                    <span className="text-amber-300 text-[10px]">{exp.period}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] my-1 text-justify">{exp.description}</p>
                  {exp.metrics && exp.metrics.length > 0 && (
                    <div className="space-y-1.5 mt-1">
                      {exp.metrics.map((bullet, idx) => (
                        <p key={idx} className="text-[10px] italic">
                          <span className={`${c.bulletColor} font-black`}>&gt;&gt; [METRIC_GEN_{idx + 1}]:</span> {bullet}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {hasEdu && (
            <div>
              <p className="text-amber-500 font-extrabold text-[10px] uppercase mb-1"># EDUCATION UNITS</p>
              {resume.education.map(edu => (
                <div key={edu.id} className="text-[10px] mb-2 border-b border-stone-800 pb-1">
                  <p className="text-white font-bold">{edu.degree}</p>
                  <p className="text-slate-400">{edu.field}</p>
                  <p className="text-slate-500">{edu.institution} | {edu.period}</p>
                </div>
              ))}
            </div>
          )}

          <div>
            {hasSkills && (
              <div className="mb-4">
                <p className="text-amber-500 font-extrabold text-[10px] uppercase mb-1.5"># CORE CAPABILITIES</p>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map(skill => (
                    <span key={skill} className={`px-1.5 py-0.5 text-[9px] font-bold ${c.badgeBg} ${c.badgeText}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasLanguages && (
              <div>
                <p className="text-amber-500 font-extrabold text-[10px] uppercase mb-1"># DIALECT GLOBALS</p>
                <p className="text-[10px] text-slate-300 italic">{resume.languages.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sidebar Layout Mode (e.g. Modern, Teal, Lavender, Clay, Botanical)
  if (c.layout === "sidebar") {
    const isDarkBg = c.bgClass.includes("bg-slate") || c.bgClass.includes("bg-zinc") || c.bgClass.includes("bg-stone-900") || c.bgClass.includes("bg-neutral-900");
    const labelColor = isDarkBg ? "text-white" : c.accentText;
    const bodyText = isDarkBg ? "text-slate-300" : c.textClass;
    
    return (
      <div id={`${c.id}-resume-view`} className={`p-8 ${textFont}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Side Column */}
          <div className="md:col-span-4 border-r border-slate-200/60 pr-5 flex flex-col gap-5">
            <div>
              <h2 className={`text-2xl font-black ${labelColor} leading-tight`}>{resume.personal.name}</h2>
              <p className={`text-xs font-semibold ${c.accentText} uppercase tracking-widest mt-1`}>{resume.personal.title}</p>
            </div>

            <div className="text-xs space-y-2 border-b border-slate-200/40 pb-4">
              <p className="text-slate-500 text-[11px] leading-snug">
                <strong className={`block uppercase ${c.accentText} tracking-wider font-extrabold text-[9px]`}>📍 Localização</strong>
                {resume.personal.location}
              </p>
              <p className="text-slate-500 text-[11px] leading-snug">
                <strong className={`block uppercase ${c.accentText} tracking-wider font-extrabold text-[9px]`}>📧 E-mail</strong>
                {resume.personal.email}
              </p>
              <p className="text-slate-500 text-[11px] leading-snug">
                <strong className={`block uppercase ${c.accentText} tracking-wider font-extrabold text-[9px]`}>📞 Telefone</strong>
                {resume.personal.phone}
              </p>
              {resume.personal.linkedin && (
                <p className="text-slate-500 text-[11px] leading-snug truncate">
                  <strong className={`block uppercase ${c.accentText} tracking-wider font-extrabold text-[9px]`}>🔗 LinkedIn</strong>
                  <span className="underline">{resume.personal.linkedin}</span>
                </p>
              )}
              {resume.personal.github && (
                <p className="text-slate-500 text-[11px] leading-snug truncate">
                  <strong className={`block uppercase ${c.accentText} tracking-wider font-extrabold text-[9px]`}>💻 GitHub</strong>
                  <span className="underline">{resume.personal.github}</span>
                </p>
              )}
            </div>

            {hasSkills && (
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider mb-2.5 pb-1 border-b ${c.accentBorder} ${labelColor}`}>
                  {dict.skills}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {resume.skills.map(skill => (
                    <span key={skill} className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-tight ${c.badgeBg} ${c.badgeText}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasLanguages && (
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider mb-1.5 pb-1 border-b ${c.accentBorder} ${labelColor}`}>
                  {dict.languages}
                </h3>
                <p className="text-xs leading-relaxed italic">{resume.languages.join(", ")}</p>
              </div>
            )}
          </div>

          {/* Right Main Body */}
          <div className="md:col-span-8 flex flex-col gap-6">
            {resume.summary && (
              <div>
                <h3 className={`text-xs font-black uppercase tracking-widest ${labelColor} mb-2`}>Resumo Executivo</h3>
                <p className={`text-xs leading-relaxed text-justify ${bodyText}`}>{resume.summary}</p>
              </div>
            )}

            {hasExp && (
              <div>
                <h3 className={`text-xs font-black uppercase tracking-widest ${labelColor} mb-3.5 pb-1 border-b ${c.accentBorder}`}>
                  {dict.experience}
                </h3>
                <div className="space-y-4">
                  {resume.experience.map(exp => (
                    <div key={exp.id}>
                      <div className="flex flex-wrap justify-between items-baseline mb-0.5">
                        <h4 className="font-extrabold text-xs text-slate-900 font-sans">
                          {exp.role} <span className="text-slate-500 font-medium text-[11px]">at {exp.company}</span>
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium">{exp.period}</span>
                      </div>
                      <p className={`text-xs leading-relaxed mb-2 text-justify ${bodyText}`}>{exp.description}</p>
                      {exp.metrics && exp.metrics.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-800 pl-1.5">
                          {exp.metrics.map((metric, mi) => (
                            <li key={mi} className="leading-snug">
                              <span className={`font-bold ${c.bulletColor}`}>[ATS COMPLIANT]</span> {metric}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasEdu && (
              <div>
                <h3 className={`text-xs font-black uppercase tracking-widest ${labelColor} mb-2.5 pb-1 border-b ${c.accentBorder}`}>
                  {dict.education}
                </h3>
                <div className="space-y-2">
                  {resume.education.map(edu => (
                    <div key={edu.id} className="text-xs leading-snug">
                      <p className="font-extrabold text-slate-900">{edu.degree} em {edu.field}</p>
                      <p className="text-slate-500 text-[11px]">{edu.institution} | {edu.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasProjects && (
              <div>
                <h3 className={`text-xs font-black uppercase tracking-widest ${labelColor} mb-2.5 pb-1 border-b ${c.accentBorder}`}>
                  {dict.projects}
                </h3>
                <div className="space-y-2">
                  {resume.projects.map(proj => (
                    <div key={proj.id} className="text-xs leading-snug">
                      <p className="font-bold text-slate-900">{proj.name}</p>
                      <p className="text-slate-500 text-[11px]">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Geometric grid based cards layout (e.g. Metro, Recruiter special, Compact layout)
  if (c.layout === "grid") {
    return (
      <div id={`${c.id}-resume-view`} className={`p-6 ${textFont} space-y-5 bg-[#fafafa]`}>
        {/* Sleek Top Banner Header */}
        <div className={`p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
          <div>
            <h2 className={`text-2xl font-black tracking-tight ${c.accentText}`}>{resume.personal.name}</h2>
            <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">{resume.personal.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 md:text-right">
            <span>{resume.personal.location}</span>
            <span>{resume.personal.phone}</span>
            <span>{resume.personal.email}</span>
            {resume.personal.linkedin && <span className="underline">{resume.personal.linkedin}</span>}
          </div>
        </div>

        {/* Dashboard Grid blocks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Summary Box */}
          {resume.summary && (
            <div className="md:col-span-12 p-4 bg-white border border-slate-150 rounded-xl leading-relaxed">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">
                📌 PERFIL E RESUMO CONCISO
              </span>
              <p className="text-xs text-slate-700 text-justify">{resume.summary}</p>
            </div>
          )}

          {/* Left Large Column: Experience */}
          <div className="md:col-span-8 space-y-4">
            {hasExp && (
              <div className="p-4 bg-white border border-slate-150 rounded-xl">
                <span className={`text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3`}>
                  💼 {dict.experience.toUpperCase()}
                </span>
                <div className="space-y-4">
                  {resume.experience.map((exp, xi) => (
                    <div key={exp.id} className={xi > 0 ? "border-t border-slate-100 pt-3" : ""}>
                      <div className="flex justify-between items-baseline flex-wrap">
                        <span className="text-xs font-black text-slate-900">{exp.role}</span>
                        <span className="text-[10px] text-slate-500">{exp.period}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">{exp.company}</span>
                      <p className="text-xs text-slate-600 mb-2">{exp.description}</p>
                      {exp.metrics && exp.metrics.length > 0 && (
                        <div className="space-y-1 bg-slate-50/50 p-2 rounded border border-slate-100">
                          {exp.metrics.map((bullet, idx) => (
                            <p key={idx} className="text-[11px] text-slate-700 leading-snug">
                              <span className={`${c.bulletColor} font-bold mr-1`}>✔</span> {bullet}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Smaller Column: Skills, Education, languages */}
          <div className="md:col-span-4 space-y-4">
            {hasSkills && (
              <div className="p-4 bg-white border border-slate-150 rounded-xl">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2.5">
                  🛠 {dict.skills.toUpperCase()}
                </span>
                <div className="flex flex-wrap gap-1">
                  {resume.skills.map(skill => (
                    <span key={skill} className={`px-2 py-0.5 text-[10px] font-bold rounded ${c.badgeBg} ${c.badgeText}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasEdu && (
              <div className="p-4 bg-white border border-slate-150 rounded-xl">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">
                  🎓 {dict.education.toUpperCase()}
                </span>
                <div className="space-y-2">
                  {resume.education.map(edu => (
                    <div key={edu.id} className="text-[11px] leading-snug border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                      <p className="font-black text-slate-900">{edu.degree}</p>
                      <p className="text-slate-500 text-[10px]">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasLanguages && (
              <div className="p-4 bg-white border border-slate-150 rounded-xl">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">
                  🌐 IDIOMAS
                </span>
                <p className="text-xs text-slate-600 font-semibold">{resume.languages.join(", ")}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // Brutalist Flat Bold Borders Layout Mode (Stark Swiss, Pop Brutalist)
  if (c.layout === "brutalist") {
    return (
      <div id={`${c.id}-resume-view`} className={`p-6 ${textFont} border-4 border-black space-y-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
        {/* Header Block with high contrast borders */}
        <div className="border-b-4 border-black pb-5">
          <h2 className="text-3xl font-black uppercase tracking-tight text-black mb-1">
            {resume.personal.name}
          </h2>
          <p className="text-xs font-black uppercase bg-black text-white px-2.5 py-1 inline-block">
            {resume.personal.title}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-bold text-black mt-3 pt-3 border-t border-black/10">
            <p>📍 {resume.personal.location}</p>
            <p>📧 {resume.personal.email}</p>
            <p>📞 {resume.personal.phone}</p>
            {resume.personal.linkedin && <p className="underline">🔗 {resume.personal.linkedin}</p>}
          </div>
        </div>

        {/* Executive Summary */}
        {resume.summary && (
          <div className="border-b-2 border-black pb-4">
            <h3 className="text-sm font-black uppercase tracking-wider mb-2 text-black">&gt; RESUMO CURRICULAR</h3>
            <p className="text-xs leading-relaxed text-black/80 text-justify">{resume.summary}</p>
          </div>
        )}

        {/* Experience with thick block layout */}
        {hasExp && (
          <div className="border-b-2 border-black pb-4">
            <h3 className="text-sm font-black uppercase mb-4 text-black">
              &gt; HISTÓRICO DE REALIZAÇÕES
            </h3>
            <div className="space-y-4">
              {resume.experience.map(exp => (
                <div key={exp.id} className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center border-b border-black/10 pb-1.5 mb-2 font-black text-xs">
                    <span>{exp.role.toUpperCase()} / {exp.company.toUpperCase()}</span>
                    <span className="bg-black/10 text-black px-1 text-[10px]">{exp.period}</span>
                  </div>
                  <p className="text-xs text-black/80 mb-2 leading-relaxed text-justify">{exp.description}</p>
                  {exp.metrics && exp.metrics.length > 0 && (
                    <div className="pl-2 border-l-2 border-black space-y-1 mt-2">
                      {exp.metrics.map((bullet, idx) => (
                        <p key={idx} className="text-[11px] font-bold text-black font-mono">
                          ★ [MTR-{idx + 1}]: {bullet}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          {hasEdu && (
            <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xs font-black uppercase mb-2">&gt; FORMAÇÃO ACADÊMICA</h3>
              {resume.education.map(edu => (
                <div key={edu.id} className="text-xs mb-2 leading-snug last:mb-0">
                  <p className="font-extrabold text-black">{edu.degree}</p>
                  <p className="text-black/60 text-[11px]">{edu.institution} | {edu.period}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills and languages */}
          <div className="space-y-4">
            {hasSkills && (
              <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xs font-black uppercase mb-2">&gt; COMPETÊNCIAS HARD</h3>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map(skill => (
                    <span key={skill} className={`px-1.5 py-0.5 text-[9px] ${c.badgeBg} ${c.badgeText}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT Classic Single Column layout (e.g. Elegant, Minimal, Scholar, Royal)
  return (
    <div id={`${c.id}-resume-view`} className={`p-8 ${textFont} border border-slate-100`}>
      {/* Header */}
      <div className={`${c.headerCentered ? "text-center" : "text-left"} pb-4 mb-4`}>
        <h2 className={`text-3xl font-black uppercase tracking-wide ${c.accentText} mb-1`}>
          {resume.personal.name}
        </h2>
        <p className={`text-xs font-bold ${c.accentText} tracking-widest uppercase mb-3`}>
          {resume.personal.title}
        </p>
        <div className={`flex flex-wrap ${c.headerCentered ? "justify-center" : "justify-start"} gap-x-4 gap-y-1 text-xs text-slate-500 font-sans`}>
          <span>{resume.personal.location}</span>
          <span>•</span>
          <span>{resume.personal.email}</span>
          <span>•</span>
          <span>{resume.personal.phone}</span>
          {resume.personal.linkedin && (
            <>
              <span>•</span>
              <span className="underline">{resume.personal.linkedin}</span>
            </>
          )}
          {resume.personal.github && (
            <>
              <span>•</span>
              <span className="underline">{resume.personal.github}</span>
            </>
          )}
        </div>
      </div>

      {hrDivider()}

      {/* Summary */}
      {resume.summary && (
        <div className="mb-6">
          <h3 className={`text-xs font-bold uppercase tracking-widest ${c.accentText} mb-2 font-sans`}>Resumo Profissional</h3>
          <p className="text-slate-700 text-xs leading-relaxed text-justify">{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {hasExp && (
        <div className="mb-6">
          <h3 className={`text-xs font-bold uppercase tracking-widest ${c.accentText} mb-3 font-sans`}>
            {dict.experience}
          </h3>
          <div className="space-y-4">
            {resume.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-slate-900 font-sans text-xs">
                    {exp.role} <span className="text-slate-500 font-medium">at {exp.company}</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-sans">{exp.period}</span>
                </div>
                <p className="text-slate-600 text-xs mb-2 text-justify leading-relaxed">{exp.description}</p>
                {exp.metrics && exp.metrics.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-850 pl-2">
                    {exp.metrics.map((metric, mi) => (
                      <li key={mi} className="leading-snug">
                        <span className={`font-semibold ${c.bulletColor}`}>[Conquista ATS]</span> {metric}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flex container or Grid for Education / Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Education & Languages */}
        {hasEdu && (
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-widest ${c.accentText} border-b border-slate-100 pb-1 mb-3 font-sans`}>
              {dict.education}
            </h3>
            <div className="space-y-2.5">
              {resume.education.map(edu => (
                <div key={edu.id} className="text-xs">
                  <p className="font-bold text-slate-900">{edu.degree} em {edu.field}</p>
                  <p className="text-slate-500 text-[11px]">{edu.institution} | {edu.period}</p>
                </div>
              ))}
            </div>

            {hasLanguages && (
              <div className="mt-4">
                <h3 className={`text-xs font-bold uppercase tracking-widest ${c.accentText} border-b border-slate-100 pb-1 mb-2 font-sans`}>
                  {dict.languages}
                </h3>
                <p className="text-xs text-slate-700 italic">{resume.languages.join(", ")}</p>
              </div>
            )}
          </div>
        )}

        {/* Skills Tag block & Projects */}
        <div>
          {hasSkills && (
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest ${c.accentText} border-b border-slate-100 pb-1 mb-3 font-sans`}>
                {dict.skills}
              </h3>
              <div className="flex flex-wrap gap-1">
                {resume.skills.map(skill => (
                  <span key={skill} className={`px-2 py-0.5 rounded font-sans text-[11px] font-semibold ${c.badgeBg} ${c.badgeText}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hasProjects && (
            <div className="mt-4">
              <h3 className={`text-xs font-bold uppercase tracking-widest ${c.accentText} border-b border-slate-100 pb-1 mb-2 font-sans`}>
                {dict.projects}
              </h3>
              <div className="space-y-2">
                {resume.projects.map(proj => (
                  <div key={proj.id} className="text-xs leading-snug">
                    <p className="font-bold text-slate-800">{proj.name}</p>
                    <p className="text-slate-600 text-[11px]">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
