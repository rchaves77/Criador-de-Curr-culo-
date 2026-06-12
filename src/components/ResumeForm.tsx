import React, { useState } from "react";
import { ResumeData, WorkExperience, Education, Project } from "../types";
import { Plus, Trash2, Sparkles, RefreshCw, Eye, FileText, User, Briefcase, GraduationCap, Code, Globe, Linkedin, ArrowRight } from "lucide-react";

interface ResumeFormProps {
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  activeLanguage: "pt" | "en" | "es";
}

export default function ResumeForm({ resume, setResume, activeLanguage }: ResumeFormProps) {
  const [activeSubTab, setActiveSubTab] = useState<"personal" | "summary" | "experience" | "education" | "skills" | "projects" | "languages">("personal");
  const [linkedinPaste, setLinkedinPaste] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const t = {
    pt: {
      personal: "Dados Pessoais",
      summary: "Resumo",
      experience: "Experiência",
      education: "Educação",
      skills: "Habilidades",
      projects: "Projetos",
      languages: "Idiomas",
      importBtn: "Importar do LinkedIn (IA)",
      importPlaceholder: "Cole o texto bruto do seu perfil do LinkedIn aqui (Ex: experiências, sobre, conexões...)",
      importIntro: "Copie e cole qualquer bloco de texto do seu perfil do LinkedIn. Nossa inteligência artificial mapeará as seções e preencherá o currículo com layout estruturado para Sistemas ATS.",
      parseSuccess: "Perfil importado e estruturado com sucesso!",
      parseError: "Erro ao processar o texto. Tente novamente.",
      addBtn: "Adicionar",
      optimizeSuccess: "Experiência otimizada com métricas de impacto!",
      optimizeLabel: "Otimizar & Gerar Métricas",
      bulletHelper: "Métricas geradas por IA (Aumentam chances em vagas corporativas):",
      tryExample: "Preencher com exemplo do LinkedIn"
    },
    en: {
      personal: "Personal Info",
      summary: "Summary",
      experience: "Work Experience",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
      languages: "Languages",
      importBtn: "Import from LinkedIn (AI)",
      importPlaceholder: "Paste your raw LinkedIn profile text here (about, experience nodes, skills...)",
      importIntro: "Copy and paste any block of text from your LinkedIn profile. Our smart AI will structure the sections and populate candidate sections optimized for ATS ranking.",
      parseSuccess: "Profile parsed and structured successfully!",
      parseError: "Error parsing text. Please try again.",
      addBtn: "Add New",
      optimizeSuccess: "Experience optimized with impact metrics!",
      optimizeLabel: "Optimize & Generate Metrics",
      bulletHelper: "AI-Generated Impact Metrics (Increases corporate ATS chances):",
      tryExample: "Fill with LinkedIn example"
    },
    es: {
      personal: "Datos Personales",
      summary: "Resumen",
      experience: "Experiencia",
      education: "Educación",
      skills: "Habilidades",
      projects: "Proyectos",
      languages: "Idiomas",
      importBtn: "Importar de LinkedIn (IA)",
      importPlaceholder: "Pegue el texto de su perfil de LinkedIn aquí...",
      importIntro: "Copie y pegue cualquier texto de su perfil de LinkedIn. Nuestra IA estructurará las secciones automáticamente de forma ideal para filtros ATS.",
      parseSuccess: "¡Perfil importado y estructurado con éxito!",
      parseError: "Error al procesar el texto.",
      addBtn: "Agregar Nuevo",
      optimizeSuccess: "¡Experiencia optimizada con métricas de impacto!",
      optimizeLabel: "Optimizar y Crear Métricas",
      bulletHelper: "Métricas de Impacto generadas por IA (Aumentan accesibilidad laboral):",
      tryExample: "Rellenar con ejemplo de LinkedIn"
    }
  }[activeLanguage];

  const handlePersonalChange = (field: keyof typeof resume.personal, value: string) => {
    setResume(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const sampleLinkedInTextOutput = `Rômulo Chaves de Alvarenga
Senior Fullstack Software Architect
Contato: romulochaves77@gmail.com | +55 11 98765-4321
São Paulo, Brasil | github.com/romulochaves77

Sobre:
Engenheiro focado em produtos digitais escaláveis com tecnologias Node, React, AWS, Docker e GraphQL.

Experiência:
InnovateTech Corp - Engenheiro Fullstack Principal (2023 - Presente)
Liderança técnica na modernização da plataforma principal de pagamentos. Desenvolvi microsserviços integrados a gateways internacionais. 
Resultados:
- Otimização do tempo de carregamento do app core que reduziu o tempo de checkout em 35%
- Redução expressiva do custo operacional de nuvem

Global Softwares Brasil - Desenvolvedor Sênior TypeScript (2020 - 2023)
Foco em APIs corporativas escaláveis. Cobertura de testes unitários.

Educação:
UERJ (Universidade Estadual do Rio de Janeiro) - Engenharia de Computação (2015 - 2019)`;

  const handleFillSample = () => {
    setLinkedinPaste(sampleLinkedInTextOutput);
  };

  const handleParseLinkedInText = async () => {
    if (!linkedinPaste.trim()) return;
    setIsParsing(true);
    try {
      const response = await fetch("/api/gemini/parse-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: linkedinPaste, language: activeLanguage })
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setResume(data);
      alert(t.parseSuccess);
    } catch (e) {
      console.error(e);
      alert(t.parseError);
    } finally {
      setIsParsing(false);
    }
  };

  // Optimize a specific experience item description and metrics using Gemini
  const handleOptimizeExperience = async (id: string, exp: WorkExperience) => {
    setOptimizingId(id);
    try {
      const response = await fetch("/api/gemini/optimize-bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: exp.role,
          company: exp.company,
          description: exp.description,
          currentMetrics: exp.metrics,
          language: activeLanguage
        })
      });
      if (!response.ok) throw new Error("Optimization failed");
      const result = await response.json();

      setResume(prev => {
        const updatedExp = prev.experience.map(item => {
          if (item.id === id) {
            return {
              ...item,
              description: result.optimizedDescription,
              metrics: result.metrics
            };
          }
          return item;
        });
        return { ...prev, experience: updatedExp };
      });
    } catch (err) {
      console.error(err);
      alert("Falha ao otimizar com IA. Verifique as credenciais.");
    } finally {
      setOptimizingId(null);
    }
  };

  // Add-remove experience helpers
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: "exp_" + Date.now(),
      company: "Empresa",
      role: "Cargo",
      period: "2024 - Presente",
      description: "Descrição de responsabilidades e realizações técnicas.",
      metrics: ["Otimizou performance de carregamento secundário de rota em 20%", "Liderou a padronização de interfaces funcionais escaláveis"]
    };
    setResume(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const removeExperience = (id: string) => {
    setResume(prev => ({ ...prev, experience: prev.experience.filter(item => item.id !== id) }));
  };

  const handleUpdateExperienceValue = (id: string, field: keyof WorkExperience, value: any) => {
    setResume(prev => {
      const list = prev.experience.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, experience: list };
    });
  };

  // Add-remove education
  const addEducation = () => {
    const newEdu: Education = {
      id: "edu_" + Date.now(),
      institution: "Instituição de Ensino",
      degree: "Grau",
      field: "Área de Estudo",
      period: "2020 - 2024"
    };
    setResume(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const removeEducation = (id: string) => {
    setResume(prev => ({ ...prev, education: prev.education.filter(item => item.id !== id) }));
  };

  const handleUpdateEducationValue = (id: string, field: keyof Education, value: string) => {
    setResume(prev => {
      const list = prev.education.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, education: list };
    });
  };

  // Skills handlers
  const [newSkill, setNewSkill] = useState("");
  const addSkill = () => {
    if (newSkill.trim() && !resume.skills.includes(newSkill.trim())) {
      setResume(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };
  const removeSkill = (skillName: string) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillName) }));
  };

  // Add-remove projects
  const addProject = () => {
    const newProj: Project = {
      id: "proj_" + Date.now(),
      name: "Nome do Projeto",
      description: "Explicação breve das funcionalidades, arquitetura e objetivos alcançados no projeto.",
      technologies: "TypeScript, React, Node.js"
    };
    setResume(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const removeProject = (id: string) => {
    setResume(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const handleUpdateProjectValue = (id: string, field: keyof Project, value: string) => {
    setResume(prev => {
      const list = prev.projects.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, projects: list };
    });
  };

  // Languages handlers
  const [newLang, setNewLang] = useState("");
  const addLang = () => {
    if (newLang.trim() && !resume.languages.includes(newLang.trim())) {
      setResume(prev => ({ ...prev, languages: [...prev.languages, newLang.trim()] }));
      setNewLang("");
    }
  };
  const removeLang = (langName: string) => {
    setResume(prev => ({ ...prev, languages: prev.languages.filter(l => l !== langName) }));
  };

  return (
    <div id="resume-form-container" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Auto linkedin parser panel */}
      <div className="p-4 bg-slate-50 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Linkedin className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
            {t.importBtn}
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">AUTOMÁTICO</span>
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          {t.importIntro}
        </p>
        <div className="flex flex-col gap-2">
          <textarea
            id="linkedin-paste-textarea"
            className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white min-h-[90px] font-mono"
            placeholder={t.importPlaceholder}
            value={linkedinPaste}
            onChange={(e) => setLinkedinPaste(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <button
              onClick={handleFillSample}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              {t.tryExample}
            </button>
            <button
              onClick={handleParseLinkedInText}
              disabled={isParsing || !linkedinPaste.trim()}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              {isParsing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {isParsing ? "Processando..." : "Importar"}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Sub Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto text-xs bg-slate-50 scrollbar-none">
        {[
          { key: "personal", label: t.personal, icon: User },
          { key: "summary", label: t.summary, icon: FileText },
          { key: "experience", label: t.experience, icon: Briefcase },
          { key: "education", label: t.education, icon: GraduationCap },
          { key: "skills", label: t.skills, icon: Code },
          { key: "projects", label: t.projects, icon: Globe },
          { key: "languages", label: t.languages, icon: Globe }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setActiveSubTab(item.key as any)}
            className={`px-4 py-3 flex items-center gap-1.5 whitespace-nowrap font-medium border-b-2 cursor-pointer transition-colors ${
              activeSubTab === item.key
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Segment Workspace */}
      <div className="p-5 flex-1 overflow-y-auto max-h-[480px]">
        {/* Personal details editor */}
        {activeSubTab === "personal" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nome Completo</label>
              <input
                type="text"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={resume.personal.name}
                onChange={(e) => handlePersonalChange("name", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Título Profissional</label>
              <input
                type="text"
                placeholder="Ex. Engenheiro de Software Fullstack"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={resume.personal.title}
                onChange={(e) => handlePersonalChange("title", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">E-mail</label>
              <input
                type="email"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={resume.personal.email}
                onChange={(e) => handlePersonalChange("email", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Telefone</label>
              <input
                type="text"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={resume.personal.phone}
                onChange={(e) => handlePersonalChange("phone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Localização</label>
              <input
                type="text"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={resume.personal.location}
                onChange={(e) => handlePersonalChange("location", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">LinkedIn URL</label>
              <input
                type="text"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={resume.personal.linkedin}
                onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Portfolio (Website)</label>
              <input
                type="text"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={resume.personal.website}
                onChange={(e) => handlePersonalChange("website", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">GitHub URL</label>
              <input
                type="text"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={resume.personal.github}
                onChange={(e) => handlePersonalChange("github", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Summary editor */}
        {activeSubTab === "summary" && (
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Resumo Executivo Profissional (Parágrafo inicial)</label>
            <textarea
              className="w-full text-xs p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white min-h-[160px] leading-relaxed"
              value={resume.summary}
              onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
            />
          </div>
        )}

        {/* Experience List editor card */}
        {activeSubTab === "experience" && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Cargos Desempenhados</h4>
              <button
                onClick={addExperience}
                className="px-3 py-1 bg-slate-800 text-white text-xs font-medium rounded hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.addBtn}
              </button>
            </div>

            {resume.experience.map((exp, idx) => (
              <div key={exp.id} className="p-4 border border-gray-100 bg-slate-50 rounded-xl relative group">
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight block mb-2">XP #{idx + 1}</span>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Empresa</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperienceValue(exp.id, "company", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Cargo</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white"
                      value={exp.role}
                      onChange={(e) => handleUpdateExperienceValue(exp.id, "role", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Período de Atuação</label>
                    <input
                      type="text"
                      placeholder="Ex: Abr 2021 - Presente"
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white"
                      value={exp.period}
                      onChange={(e) => handleUpdateExperienceValue(exp.id, "period", e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Responsabilidades Gerais</label>
                  <textarea
                    className="w-full text-xs p-2 border border-gray-200 rounded bg-white h-20"
                    value={exp.description}
                    onChange={(e) => handleUpdateExperienceValue(exp.id, "description", e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-indigo-700 flex items-center gap-1 mb-1.5">
                    {t.bulletHelper}
                  </label>
                  <div className="space-y-1.5">
                    {exp.metrics.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} className="flex gap-2">
                        <span className="text-indigo-500 text-xs mt-1.5">•</span>
                        <input
                          type="text"
                          className="w-full text-[11px] p-1.5 border border-gray-150 rounded bg-indigo-50/20 text-slate-700"
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...exp.metrics];
                            newBullets[bulletIdx] = e.target.value;
                            handleUpdateExperienceValue(exp.id, "metrics", newBullets);
                          }}
                        />
                        <button
                          onClick={() => {
                            const newBullets = exp.metrics.filter((_, km) => km !== bulletIdx);
                            handleUpdateExperienceValue(exp.id, "metrics", newBullets);
                          }}
                          className="text-gray-300 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newBullets = [...exp.metrics, "Nova conquista quantificável gerada."];
                        handleUpdateExperienceValue(exp.id, "metrics", newBullets);
                      }}
                      className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-1 font-medium bg-transparent border-0 cursor-pointer"
                    >
                      + Nova linha de impacto
                    </button>
                  </div>
                </div>

                {/* Optimize experience item with IA */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleOptimizeExperience(exp.id, exp)}
                    disabled={optimizingId === exp.id}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-lg hover:shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${optimizingId === exp.id ? "animate-spin" : ""}`} />
                    {optimizingId === exp.id ? "Reescrevendo..." : t.optimizeLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education lists */}
        {activeSubTab === "education" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Histórico Acadêmico</h4>
              <button
                onClick={addEducation}
                className="px-3 py-1 bg-slate-800 text-white text-xs font-medium rounded hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.addBtn}
              </button>
            </div>

            {resume.education.map((edu, idx) => (
              <div key={edu.id} className="p-4 border border-gray-100 bg-slate-50 rounded-xl relative">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight block mb-2">Curso #{idx + 1}</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Instituição</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducationValue(edu.id, "institution", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Grau Acadêmico</label>
                    <input
                      type="text"
                      placeholder="Ex: Bacharelado, Licenciatura"
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducationValue(edu.id, "degree", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Área / Curso</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white"
                      value={edu.field}
                      onChange={(e) => handleUpdateEducationValue(edu.id, "field", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Período</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white"
                      value={edu.period}
                      onChange={(e) => handleUpdateEducationValue(edu.id, "period", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Tag Area */}
        {activeSubTab === "skills" && (
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Hard & Soft Skills</h4>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="Ex. Kubernetes, REST APIs, Design Patterns"
                className="flex-1 text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-550"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-700"
              >
                {t.addBtn}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-slate-400 hover:text-slate-800 p-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects block */}
        {activeSubTab === "projects" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Principais Projetos</h4>
              <button
                onClick={addProject}
                className="px-3 py-1 bg-slate-800 text-white text-xs font-medium rounded hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.addBtn}
              </button>
            </div>

            {resume.projects.map((proj, idx) => (
              <div key={proj.id} className="p-4 border border-gray-100 bg-slate-50 rounded-xl relative">
                <button
                  onClick={() => removeProject(proj.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight block mb-2">Projeto #{idx + 1}</span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Nome do Projeto</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white"
                      value={proj.name}
                      onChange={(e) => handleUpdateProjectValue(proj.id, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Descrição Técnica</label>
                    <textarea
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white h-20"
                      value={proj.description}
                      onChange={(e) => handleUpdateProjectValue(proj.id, "description", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Tecnologias Utilizadas (Separadas por vírgulas)</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white"
                      value={proj.technologies}
                      onChange={(e) => handleUpdateProjectValue(proj.id, "technologies", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages area */}
        {activeSubTab === "languages" && (
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Idiomas</h4>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newLang}
                onChange={(e) => setNewLang(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLang()}
                placeholder="Ex. Inglês (Fluente), Espanhol (Fluente)"
                className="flex-1 text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-550"
              />
              <button
                onClick={addLang}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-700"
              >
                {t.addBtn}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.languages.map(lang => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                >
                  {lang}
                  <button
                    onClick={() => removeLang(lang)}
                    className="text-blue-400 hover:text-blue-800 p-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
