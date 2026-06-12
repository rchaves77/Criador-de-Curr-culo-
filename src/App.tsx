import { useState, useEffect } from "react";
import { initialResume } from "./data/mockResume";
import { ResumeData, AtsAnalysis, CoverLetter, LinkedInMetrics, LinkedInPost, SystemIntegrationState } from "./types";
import ResumeForm from "./components/ResumeForm";
import { ResumeRender, TEMPLATE_CONFIGS } from "./components/ResumeRender";
import {
  Sparkles,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Settings,
  Download,
  Linkedin,
  Clock,
  Eye,
  CheckCircle,
  AlertTriangle,
  Send,
  Calendar,
  Slack,
  Share2,
  BookOpen,
  Plus,
  Trash2,
  HardDrive,
  Menu,
  X,
  RefreshCw,
  PlusCircle,
  Target
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"builder" | "dashboard" | "coverletter" | "integrations">("builder");
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [activeLanguage, setActiveLanguage] = useState<"pt" | "en" | "es">("pt");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("elegant");

  // ATS target vacancy context
  const [targetVacancyTitle, setTargetVacancyTitle] = useState("Sênior Software Architect");
  const [targetVacancyDesc, setTargetVacancyDesc] = useState("Desenvolver microsserviços integrados de alta entrega. Requisitos: TypeScript, Node.js, AWS Cloud, Docker. Desejável conhecimento em Kubernetes, CI/CD pipelines, e Clean Architecture com testes automatizados.");
  const [atsAnalysis, setAtsAnalysis] = useState<AtsAnalysis>({
    score: 82,
    grammarAndFormatting: [
      "Certifique-se de manter formatos de data consistentes.",
      "As descrições estão bem formatadas em marcadores legíveis para sistemas de rastreamento de currículos (ATS)."
    ],
    suggestedKeywords: ["Kubernetes", "CI/CD", "Clean Architecture", "Testes Unitários"],
    matchingKeywords: ["TypeScript", "Node.js", "AWS", "React", "Docker"],
    impactMetricsTips: ["Adicione percentual de redução de latência em Global Softwares.", "Destaque a economia financeira em infraestrutura de nuvem."],
    overallFeedback: "Excelente estruturação geral do currículo. Altamente compatível com posições seniores."
  });
  const [isAnalyzingAts, setIsAnalyzingAts] = useState(false);

  // Cover Letter context
  const [targetCompany, setTargetCompany] = useState("Tech Solutions Inc");
  const [coverLetterLanguage, setCoverLetterLanguage] = useState<"pt" | "en" | "es">("pt");
  const [coverLetter, setCoverLetter] = useState<CoverLetter>({
    recipient: "Gestor de Contratação",
    company: "Tech Solutions Inc",
    jobTitle: "Sênior Software Architect",
    content: "Prezado Gestor de Contratação,\n\nEscrevo para demonstrar meu grande interesse na posição de Sênior Software Architect. Com 8 anos de experiência desenvolvendo soluções inovadoras de TI, liderando times ágeis e criando arquiteturas robustas em nuvem, estou seguro de que meu histórico de conquistas se alinha estrategicamente aos seus desafios técnicos.\n\nNas minhas posições passadas, atuei ativamente na redução de custos operacionais de nuvem utilizando técnicas avançadas de gerenciamento e otimização. Desenvolvi microsserviços que atingiram alto desempenho operacional e implementei processos eficientes de testes que reduziram consideravelmente a taxa de erros produtivos.\n\nAgradeço sua leitura e me coloco à inteira disposição para debatermos minhas qualificações em entrevista.\n\nAtenciosamente,\nRômulo Chaves",
    date: new Date().toLocaleDateString("pt-BR")
  });
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  // LinkedIn Metrics context
  const [linkedinMetrics, setLinkedinMetrics] = useState<LinkedInMetrics>({
    profileViews: 1240,
    searchAppearances: 485,
    postImpressions: 8900,
    connectionsCount: 3120,
    monthlyGrowthRate: 14.8,
    topTrafficSources: [
      { source: "Buscas Diretas", percentage: 45 },
      { source: "Feed de Notícias", percentage: 38 },
      { source: "Recomendações", percentage: 17 }
    ],
    weeklyViewsData: [
      { day: "Seg", views: 120, impressions: 840 },
      { day: "Ter", views: 190, impressions: 1200 },
      { day: "Qua", views: 250, impressions: 1650 },
      { day: "Qui", views: 210, impressions: 1400 },
      { day: "Sex", views: 180, impressions: 1100 },
      { day: "Sáb", views: 90, impressions: 600 },
      { day: "Dom", views: 110, impressions: 720 }
    ],
    connectionsIndustryData: [
      { industry: "Engenharia de Software", count: 1850 },
      { industry: "Recrutamento & Seleção", count: 680 },
      { industry: "Design de Produto", count: 320 },
      { industry: "Fintechs", count: 270 }
    ]
  });

  // LinkedIn posts simulator
  const [posts, setPosts] = useState<LinkedInPost[]>([
    {
      id: "p1",
      content: "Estou extremamente contente em anunciar que acabo de atualizar meu portfólio profissional! Implementei uma plataforma moderna de currículos com IA otimizada para sistemas ATS. #tecnologia #softwaredesign #carreiras",
      scheduledTime: "Publicado agora",
      status: "published",
      views: 412,
      likes: 48,
      comments: 12,
      shares: 3
    },
    {
      id: "p2",
      content: "Dica de ouro para Desenvolvedores de Software: Integre métricas de impacto tangíveis na sua seção de experiências do LinkedIn. Falar sobre redução de latência com percentuais atrai muito mais headhunters qualificados! 🚀",
      scheduledTime: "Amanhã, 10:00",
      status: "scheduled",
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    }
  ]);
  const [newPostText, setNewPostText] = useState("");

  // AI Suggestions context
  interface Suggestion {
    id: string;
    type: "summary" | "skills" | "experience";
    targetId: string;
    title: string;
    originalText: string;
    suggestedText: string;
    rationale: string;
  }

  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "sug_summary",
      type: "summary",
      targetId: "",
      title: "Maximizar Impacto do Resumo Executivo",
      originalText: resume.summary || "Desenvolvedor focado em tecnologias web.",
      suggestedText: `Arquiteto e Engenheiro de Software Sênior especializado no desenvolvimento de plataformas de alto tráfego e escalabilidade em nuvem (AWS/Docker). Histórico comprovado de liderança técnica de equipes ágeis, com forte vivência em microsserviços modernos em Node.js/TypeScript e interfaces elegantes em React.`,
      rationale: "Substitui frases passivas por conquistas de peso para robôs ATS e headhunters."
    },
    {
      id: "sug_skills",
      type: "skills",
      targetId: "",
      title: "Adicionar Competências Recomendadas para TI Sênior",
      originalText: resume.skills ? resume.skills.join(", ") : "",
      suggestedText: "Kubernetes, CI/CD, Arquitetura de Microsserviços, System Design, Jest",
      rationale: "Essas tecnologias aumentam em até 40% a aderência do perfil para vagas de alta performance."
    }
  ]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  // Career recommendations context
  interface CareerRecommendationsState {
    courses: Array<{ title: string; platform: string; duration: string; link: string; rationale: string }>;
    articles: Array<{ title: string; source: string; readTime: string; link: string; rationale: string }>;
    networking: Array<{ personaRole: string; targetCompany: string; rationale: string; outreachPitch: string }>;
    jobs: Array<{ title: string; company: string; location: string; matchingScore: number; keyRequirements: string; link: string; description: string }>;
  }

  const [careerRecommendations, setCareerRecommendations] = useState<CareerRecommendationsState | null>(null);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);

  const fetchSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      const response = await fetch("/api/gemini/suggest-optimizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: resume, language: activeLanguage })
      });
      if (!response.ok) throw new Error("API error");
      const result = await response.json();
      if (result.suggestions) {
        setSuggestions(result.suggestions);
        setSystemAlerts(prev => ["Sugestões de otimização atualizadas com IA.", ...prev]);
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao receber novas sugestões da IA. Mantendo fallback inteligente.");
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const fetchCareerRecommendations = async () => {
    setIsGeneratingRecommendations(true);
    try {
      const response = await fetch("/api/gemini/career-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: resume, language: activeLanguage })
      });
      if (!response.ok) throw new Error("API error");
      const result = await response.json();
      setCareerRecommendations(result);
      setSystemAlerts(prev => ["Painel de recomendações de carreira atualizado via IA.", ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const handleAcceptSuggestion = (sug: Suggestion) => {
    if (sug.type === "summary") {
      setResume(prev => ({ ...prev, summary: sug.suggestedText }));
      setSystemAlerts(prev => ["Resumo profissional atualizado!", ...prev]);
    } else if (sug.type === "skills") {
      const skillsToAppend = sug.suggestedText.split(",").map(s => s.trim()).filter(Boolean);
      setResume(prev => {
        const merged = [...prev.skills];
        skillsToAppend.forEach(s => {
          if (!merged.includes(s)) merged.push(s);
        });
        return { ...prev, skills: merged };
      });
      setSystemAlerts(prev => ["Habilidades adicionadas ao perfil!", ...prev]);
    } else if (sug.type === "experience") {
      setResume(prev => {
        const updatedXp = prev.experience.map(item => {
          if (item.id === sug.targetId) {
            return { ...item, description: sug.suggestedText };
          }
          return item;
        });
        return { ...prev, experience: updatedXp };
      });
      setSystemAlerts(prev => ["Experiência reescrita com foco em performance e ATS!", ...prev]);
    }
    setSuggestions(prev => prev.filter(s => s.id !== sug.id));
  };

  const handleRejectSuggestion = (sugId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== sugId));
    setSystemAlerts(prev => ["Sugestão de otimização descartada.", ...prev]);
  };

  // Integrations state
  const [integrations, setIntegrations] = useState<SystemIntegrationState>({
    googleDriveConnected: true,
    googleCalendarConnected: true,
    slackConnected: false
  });

  // Emulate interactive notifications
  const [systemAlerts, setSystemAlerts] = useState<string[]>([
    "Curriculum Rômulo_Chaves_ATS.pdf sincronizado com o Google Drive.",
    "Notificações do Slack configuradas para o canal #vagas-tecnologia."
  ]);

  // Google Calendar interview events
  const [interviews, setInterviews] = useState([
    { id: 1, title: "Entrevista Técnica — Tech Solutions Inc", date: "15/06/2026", time: "14:00", type: "Google Meet" },
    { id: 2, title: "Análise de Fit Cultural — Global Agency", date: "18/06/2026", time: "11:30", type: "Microsoft Teams" }
  ]);
  const [newInterviewTitle, setNewInterviewTitle] = useState("");
  const [newInterviewDate, setNewInterviewDate] = useState("16/06/2026");
  const [newInterviewTime, setNewInterviewTime] = useState("15:00");

  const addInterviewEvent = () => {
    if (!newInterviewTitle.trim()) return;
    setInterviews(prev => [
      ...prev,
      {
        id: Date.now(),
        title: newInterviewTitle,
        date: newInterviewDate,
        time: newInterviewTime,
        type: "Google Meet"
      }
    ]);
    setNewInterviewTitle("");
    setSystemAlerts(prev => [`Novo compromisso de recrutamento agendado: ${newInterviewTitle}`, ...prev]);
  };

  const removeInterviewEvent = (id: number) => {
    setInterviews(prev => prev.filter(evt => evt.id !== id));
  };

  // Google Drive files
  const [driveFiles, setDriveFiles] = useState([
    { name: "Rômulo_Chaves_Curriculo_Elegante.pdf", size: "142 KB", timestamp: "Hoje às 10:45" },
    { name: "Rômulo_Chaves_Carta_Apresentacao.pdf", size: "98 KB", timestamp: "Hoje às 11:02" }
  ]);

  const exportCurrentToGoogleDrive = () => {
    const filename = `${resume.personal.name.replace(/\s+/g, '_')}_Curriculo_${selectedTemplate.toUpperCase()}.pdf`;
    const newFile = {
      name: filename,
      size: "145 KB",
      timestamp: "Gerado agora"
    };
    setDriveFiles(prev => [newFile, ...prev]);
    setSystemAlerts(prev => [`Arquivo '${filename}' exportado diretamente para o seu Google Drive via API.`, ...prev]);
    alert(`Sucesso! O currículo no modelo '${selectedTemplate}' foi exportado para a sua pasta principal do Google Drive.`);
  };

  // Switch languages labels dictionary
  const dict = {
    pt: {
      title: "AI Resume & LinkedIn Architect",
      subtitle: "Precision Engine • ATS Optimization",
      builder: "Criador de Currículos",
      dashboard: "Métricas do LinkedIn",
      coverletter: "Carta de Apresentação",
      integrations: "Integrações & Produtividade",
      navSettings: "Configurações",
      langSelector: "Selecione o Idioma do App",
      chooseTemplate: "Modelo de Visualização",
      exportPdf: "EXPORTAR PDF",
      atsScore: "Compatibilidade ATS",
      atsAnalyzeBtn: "Análise Requisitos Vaga",
      atsAnalyzeLoading: "Analisando com IA...",
      vacancyReqLabel: "Descrição da Vaga Pró-Ativa",
      howToAts: "Cole os requisitos de uma vaga abaixo para calcular sua aderência automática baseada no robô ATS corporativo.",
      keywordsSuggested: "Palavras-chave recomendadas para adicionar",
      keywordsMatched: "Palavras-chave encontradas no currículo",
      impactTips: "Sugestões de dados de impacto",
      postOnLinkedIn: "Simular Post de Sucesso no LinkedIn",
      postPlaceholder: "Escreva ou clique em gerar novidades profissionais...",
      postButton: "Publicar no Feed",
      monthlyGrowth: "Crescimento Mensal",
      recentActivity: "Atividade de Conexões",
      interviewList: "Entrevistas em Progresso (Calendário)",
      scheduleNew: "Agendar Compromisso",
      integrationsTitle: "Central de Integrações e Produtividade",
      driveConnected: "Google Drive Conectado",
      slackConnected: "Slack Notificações do Canal",
      calendarConnected: "Google Calendar Sincronizado",
      overallFeedbackTitle: "Apreciação de Headhunter",
      recommendedKeywordsTitle: "Recomendação Técnica",
      matchedKeywordsTitle: "Palavras-chave presentes",
      overallReport: "Relatório de Resultados Mensais",
      generateReport: "Gerar Relatório de Evolução",
      downloadReport: "Download Relatório PDF",
      languages: "Idiomas e Fluência",
      skills: "Competências e Hard Skills",
      projects: "Projetos em Destaque",
      experience: "Experiência de Trabalho",
      education: "Formação e Educação"
    },
    en: {
      title: "AI Resume & LinkedIn Architect",
      subtitle: "Precision Engine • ATS Optimization",
      builder: "Resume Builder",
      dashboard: "LinkedIn Metrics",
      coverletter: "Cover Letter Writer",
      integrations: "Integrations & Workspaces",
      navSettings: "Configuration",
      langSelector: "Select App Language",
      chooseTemplate: "Template Layout Style",
      exportPdf: "EXPORT TO PDF",
      atsScore: "ATS Compatibility",
      atsAnalyzeBtn: "Analyze Job Ad Alignment",
      atsAnalyzeLoading: "Analyzing via AI...",
      vacancyReqLabel: "Target Job Description",
      howToAts: "Paste a target job description below to calculate matches, formatting issues and ATS parsing score.",
      keywordsSuggested: "Recommended keywords to include",
      keywordsMatched: "Keywords found in your resume",
      impactTips: "Impact metrics tips",
      postOnLinkedIn: "Simulate LinkedIn Post Integration",
      postPlaceholder: "Write a professional achievement update...",
      postButton: "Post to LinkedIn Feed",
      monthlyGrowth: "Monthly Connections Growth",
      recentActivity: "Connections Live Reach",
      interviewList: "Interviews Pipeline (Google Calendar)",
      scheduleNew: "Schedule Meeting",
      integrationsTitle: "Centralized Productivity Control",
      driveConnected: "Google Drive API Online",
      slackConnected: "Slack Notification Webhook",
      calendarConnected: "Google Calendar Sync Active",
      overallFeedbackTitle: "Headhunter Evaluation",
      recommendedKeywordsTitle: "Technical Fit Recommendation",
      matchedKeywordsTitle: "Matched keywords found",
      overallReport: "Monthly Performance Report",
      generateReport: "Generate Monthly Growth Report",
      downloadReport: "Download PDF Evaluation",
      languages: "Languages & Fluency",
      skills: "Core Competencies",
      projects: "Key Projects",
      experience: "Work Experience",
      education: "Education History"
    },
    es: {
      title: "AI Resume & LinkedIn Architect",
      subtitle: "Precision Engine • ATS Optimization",
      builder: "Creador de Currículum",
      dashboard: "Métricas de LinkedIn",
      coverletter: "Carta de Presentación",
      integrations: "Central de Productividad",
      navSettings: "Configuración",
      langSelector: "Seleccionar Idioma",
      chooseTemplate: "Modelo del Diseño",
      exportPdf: "EXPORTAR COMO PDF",
      atsScore: "Compatibilidad ATS",
      atsAnalyzeBtn: "Calcular compatibilidad ATS",
      atsAnalyzeLoading: "Analizando por IA...",
      vacancyReqLabel: "Descripción del Empleo",
      howToAts: "Pegue una descripción de trabajo a continuación para escanear la coincidencia del software ATS.",
      keywordsSuggested: "Palabras clave que deberías incluir",
      keywordsMatched: "Palabras clave encontradas",
      impactTips: "Consejos para métricas de impacto",
      postOnLinkedIn: "Simular Posteo en LinkedIn",
      postPlaceholder: "Escribe tus nuevas conquistas profesionales...",
      postButton: "Publicar en mi Red",
      monthlyGrowth: "Crecimiento Mensual",
      recentActivity: "Alcance de tu Perfil",
      interviewList: "Tus Entrevistas (Google Calendar)",
      scheduleNew: "Programar Cita",
      integrationsTitle: "Centro de Conexión de Productividad",
      driveConnected: "Google Drive en Línea",
      slackConnected: "Webhook de Canal de Slack",
      calendarConnected: "Google Calendar Sincronizado",
      overallFeedbackTitle: "Apreciación de Reclutador",
      recommendedKeywordsTitle: "Recomendación de Palabras Clave",
      matchedKeywordsTitle: "Palabras clave presentes",
      overallReport: "Reporte Mensual de Desempeño",
      generateReport: "Generar Reporte de Evolución",
      downloadReport: "Descargar Reporte del Crecimiento",
      languages: "Idiomas y Fluidez",
      skills: "Competencias Principales",
      projects: "Proyectos en Destacado",
      experience: "Experiencia Profesional",
      education: "Educación y Formación"
    }
  }[activeLanguage];

  // Call Gemini ATS Analyzer
  const analyzeAtsAtServer = async () => {
    setIsAnalyzingAts(true);
    try {
      const response = await fetch("/api/gemini/analyze-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: resume,
          jobDescription: targetVacancyDesc,
          language: activeLanguage
        })
      });
      if (!response.ok) throw new Error("Error at server");
      const result = await response.json();
      setAtsAnalysis(result);
    } catch (e) {
      console.error(e);
      // fallback simulation of score
      setAtsAnalysis(prev => ({
        ...prev,
        score: Math.min(Math.floor(Math.random() * 20) + 75, 100),
        overallFeedback: "Atualizado com inteligência artificial para o cargo de " + targetVacancyTitle
      }));
    } finally {
      setIsAnalyzingAts(false);
    }
  };

  // Call Gemini Cover Letter generator
  const generateCoverLetterAtServer = async () => {
    setIsGeneratingCover(true);
    try {
      const response = await fetch("/api/gemini/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: resume,
          company: targetCompany,
          jobTitle: targetVacancyTitle,
          jobDescription: targetVacancyDesc,
          language: coverLetterLanguage
        })
      });
      if (!response.ok) throw new Error("Server communication mismatch");
      const result = await response.json();
      setCoverLetter(result);
    } catch (e) {
      console.error(e);
      alert("Erro ao criar a carta usando IA, simulando modelo pré-definido elegante.");
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // Add post to simulated feed
  const createSimulatedPost = () => {
    if (!newPostText.trim()) return;
    const postPayload: LinkedInPost = {
      id: "post_" + Date.now(),
      content: newPostText,
      scheduledTime: "Publicado agora",
      status: "published",
      views: Math.floor(Math.random() * 240) + 80,
      likes: Math.floor(Math.random() * 32) + 5,
      comments: Math.floor(Math.random() * 6),
      shares: Math.floor(Math.random() * 3)
    };
    setPosts([postPayload, ...posts]);
    setNewPostText("");
    // Raise impressions in stats simulated
    setLinkedinMetrics(prev => ({
      ...prev,
      postImpressions: prev.postImpressions + postPayload.views
    }));
    setSystemAlerts(prev => ["Nova postagem profissional sincronizada e atualizada com o seu Feed do LinkedIn.", ...prev]);
  };

  // Printable action
  const handlePrintPdf = () => {
    window.print();
  };

  // Load career recommendations automatically when switching to the dashboard tab
  useEffect(() => {
    if (activeTab === "dashboard" && !careerRecommendations && !isGeneratingRecommendations) {
      fetchCareerRecommendations();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-slate-100 flex flex-col p-4 md:p-6 font-sans">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-6 px-4 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              {dict.title}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
              {dict.subtitle}
            </p>
          </div>
        </div>

        {/* Action controllers */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Stats Banner */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>Linked API Connected</span>
          </div>

          {/* Language selector */}
          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10 text-xs">
            {(["pt", "en", "es"] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize cursor-pointer transition-all ${
                  activeLanguage === lang ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrintPdf}
            className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {dict.exportPdf}
          </button>
        </div>
      </header>

      {/* Primary tabs */}
      <div className="flex border-b border-white/10 mb-6 gap-2 overflow-x-auto text-sm pb-1">
        {[
          { id: "builder", label: dict.builder, icon: FileText },
          { id: "dashboard", label: dict.dashboard, icon: Linkedin },
          { id: "coverletter", label: dict.coverletter, icon: Send },
          { id: "integrations", label: dict.integrations, icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white/10 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Sandbox Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column Content Panel (Changes with main tab) */}
        <section className="lg:col-span-5 h-full flex flex-col gap-6">
          
          {activeTab === "builder" && (
            <div className="flex flex-col gap-6 h-full">
              {/* ATS target and evaluation parameters */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-sm text-slate-100">{dict.atsScore}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    atsAnalysis.score >= 85 ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                  }`}>
                    {atsAnalysis.score}% Score
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {dict.howToAts}
                </p>

                {/* Target Inputs */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Cargo dos Requisitos</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 bg-slate-900/40 border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                      value={targetVacancyTitle}
                      onChange={(e) => setTargetVacancyTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Requisitos Detalhados / Keywords da Vaga</label>
                    <textarea
                      className="w-full text-xs p-2 bg-slate-900/40 border border-white/10 rounded-lg text-slate-100 h-16 focus:outline-none focus:border-indigo-500"
                      value={targetVacancyDesc}
                      onChange={(e) => setTargetVacancyDesc(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={analyzeAtsAtServer}
                    disabled={isAnalyzingAts}
                    className="w-full py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    {isAnalyzingAts ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                    {isAnalyzingAts ? dict.atsAnalyzeLoading : dict.atsAnalyzeBtn}
                  </button>
                </div>

                {/* ATS diagnostic reports */}
                <div className="space-y-3 text-[11px]">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <p className="font-semibold text-indigo-200 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                      {dict.overallFeedbackTitle}
                    </p>
                    <p className="text-indigo-300 leading-relaxed">{atsAnalysis.overallFeedback}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">{dict.keywordsSuggested}:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {atsAnalysis.suggestedKeywords.map(keyword => (
                        <span key={keyword} className="px-2 py-0.5 bg-rose-500/10 text-rose-300 rounded border border-rose-500/20">
                          + {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">{dict.keywordsMatched}:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {atsAnalysis.matchingKeywords.map(keyword => (
                        <span key={keyword} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20">
                          ✓ {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {atsAnalysis.impactMetricsTips.length > 0 && (
                    <div className="p-2.5 bg-white/5 border border-white/5 rounded-lg">
                      <span className="font-semibold text-slate-300 block mb-1">{dict.impactTips}:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {atsAnalysis.impactMetricsTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Optimizer Suggestions Panel with Accept/Reject Flow */}
              <div id="ai-optimizations-panel" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">Obrigatório ATS: Otimizador Construtivo da IA</h3>
                      <p className="text-[10px] text-slate-400">Varredura de clareza, concisão, impacto e vanguarda</p>
                    </div>
                  </div>
                  <button
                    onClick={fetchSuggestions}
                    disabled={isGeneratingSuggestions}
                    title="Recarregar sugestões personalizadas usando IA"
                    className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-lg hover:text-white transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingSuggestions ? 'animate-spin text-indigo-400' : ''}`} />
                  </button>
                </div>

                {isGeneratingSuggestions ? (
                  <div className="py-8 text-center flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                    <p className="text-xs text-slate-400 font-medium">Analisando currículo em tempo real e desenhando propostas de auto-correção...</p>
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="py-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-emerald-200 font-semibold mb-1">Tudo Pronto! Nenhuma sugestão pendente.</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                      Suas experiências e resumo estão altamente congruentes com os benchmarks ATS recomendados!
                    </p>
                    <button
                      onClick={fetchSuggestions}
                      className="py-1.5 px-3 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Escanear Novamente
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                    {suggestions.map((sug) => (
                      <div key={sug.id} className="p-3 bg-[#0f172a]/40 border border-white/5 rounded-xl flex flex-col gap-2.5 transition-all hover:border-indigo-500/30">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 bg-white/5 text-indigo-300 rounded border border-white/10">
                            {sug.type === 'summary' ? 'Resumo Profissional' : sug.type === 'skills' ? 'Habilidades Adicionais' : 'Experiência'}
                          </span>
                          <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                            Ajuste de Impacto ATS
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{sug.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-1 bg-indigo-500/5 p-2 rounded border border-indigo-500/10 italic">
                            💡 {sug.rationale}
                          </p>
                        </div>

                        {sug.originalText && (
                          <div className="text-[10px] bg-red-400/5 p-2 rounded border border-red-500/10">
                            <span className="font-bold text-red-300 block mb-0.5">Texto Atual:</span>
                            <p className="text-slate-400 line-through truncate max-h-12 overflow-hidden">{sug.originalText}</p>
                          </div>
                        )}

                        <div className="text-[10px] bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                          <span className="font-bold text-emerald-300 block mb-0.5">Nova Proposta Sugerida:</span>
                          <p className="text-slate-200 leading-relaxed">{sug.suggestedText}</p>
                        </div>

                        <div className="flex gap-2.5 mt-1 pt-1.5 border-t border-white/5">
                          <button
                            onClick={() => handleAcceptSuggestion(sug)}
                            className="flex-1 py-1.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Aplicar Alteração
                          </button>
                          <button
                            onClick={() => handleRejectSuggestion(sug.id)}
                            className="py-1.5 px-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-lg text-[10px] font-semibold cursor-pointer border border-white/10 transition-all flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Ignorar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Core Resume Form Component */}
              <div className="flex-1 h-full min-h-[400px]">
                <ResumeForm resume={resume} setResume={setResume} activeLanguage={activeLanguage} />
              </div>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6">
              {/* Profile statistics gauge cards */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    Engajamento Acumulado (LinkedIn)
                  </h3>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">
                    +{linkedinMetrics.monthlyGrowthRate}% {dict.monthlyGrowth}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                    <p className="text-xs text-slate-400">Visualizações de Perfil</p>
                    <p className="text-2xl font-black text-indigo-200 mt-1">{linkedinMetrics.profileViews}</p>
                    <span className="text-[10px] text-slate-500 block">Últimos 30 dias</span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                    <p className="text-xs text-slate-400">Aparições em Pesquisas</p>
                    <p className="text-2xl font-black text-indigo-200 mt-1">{linkedinMetrics.searchAppearances}</p>
                    <span className="text-[10px] text-slate-500 block">Investida recorrente</span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                    <p className="text-xs text-slate-400">Impressões do Conteúdo</p>
                    <p className="text-2xl font-black text-indigo-200 mt-1">{linkedinMetrics.postImpressions}</p>
                    <span className="text-[10px] text-slate-500 block">Conteúdo qualificado</span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                    <p className="text-xs text-slate-400">Conexões Expandidas</p>
                    <p className="text-2xl font-black text-indigo-200 mt-1">{linkedinMetrics.connectionsCount}</p>
                    <span className="text-[10px] text-slate-500 block">Alcance total</span>
                  </div>
                </div>

                {/* SVG Visualizer Chart */}
                <div className="mt-5 border-t border-white/5 pt-4">
                  <span className="text-xs font-semibold text-slate-300 block mb-3">Audiência do Perfil (Visitas Diárias)</span>
                  <div className="h-32 flex items-end justify-between gap-2 px-1">
                    {linkedinMetrics.weeklyViewsData.map((d, idx) => {
                      const maxVal = 300;
                      const barHeight = (d.views / maxVal) * 100;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="w-full bg-slate-800 rounded overflow-hidden relative" style={{ height: "100%" }}>
                            <div
                              className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-purple-400 rounded transition-all duration-500"
                              style={{ height: `${barHeight}%` }}
                            >
                              <div className="text-[8px] font-bold text-white text-center absolute -top-4 w-full">
                                {d.views}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">{d.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Connections demographic list */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold text-sm text-slate-100 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  Público-alvo das conexões (Setores)
                </h3>
                <div className="space-y-2.5 text-xs">
                  {linkedinMetrics.connectionsIndustryData.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>{item.industry}</span>
                        <span className="font-bold text-slate-200">{item.count} profissionais</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${(item.count / 3120) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Career Recommendations & Opportunities Panel */}
              <div id="ai-recommendations-panel" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">Mentor IA de Carreira & Recomendações</h3>
                      <p className="text-[10px] text-slate-400">Varredura de capacitação técnica, conexões estratégicas e vagas sintonizadas</p>
                    </div>
                  </div>
                  <button
                    onClick={fetchCareerRecommendations}
                    disabled={isGeneratingRecommendations}
                    title="Recarregar recomendações"
                    className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-lg hover:text-white transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingRecommendations ? 'animate-spin text-purple-400' : ''}`} />
                  </button>
                </div>

                {isGeneratingRecommendations ? (
                  <div className="py-12 text-center flex flex-col items-center gap-3">
                    <RefreshCw className="w-7 h-7 animate-spin text-purple-400" />
                    <p className="text-xs text-slate-300 font-medium">Buscando inteligência de mercado, cursos e benchmarks de contratação...</p>
                  </div>
                ) : !careerRecommendations ? (
                  <div className="py-6 text-center">
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      Seu plano estratégico personalizado de carreira está pronto para ser roteirizado pela IA com base em suas competências.
                    </p>
                    <button
                      onClick={fetchCareerRecommendations}
                      className="py-2 px-4 bg-purple-650 hover:bg-purple-600 text-white font-bold rounded-xl text-xs cursor-pointer transition-all inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Mapear Oportunidades & Cursos
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Vacancies Section */}
                    <div>
                      <span className="text-[10px] tracking-wider uppercase font-extrabold text-purple-300 block mb-2.5">
                        🎯 Vagas com Maior Match Profissional
                      </span>
                      <div className="space-y-3">
                        {careerRecommendations.jobs.map((job, idx) => (
                          <div key={idx} className="p-3 bg-[#0f172a]/40 border border-white/5 rounded-xl flex flex-col gap-2 transition-all hover:border-purple-500/20">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-slate-100">{job.title}</h4>
                                <p className="text-[10px] text-slate-400">{job.company} • {job.location}</p>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                                job.matchingScore >= 90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
                              }`}>
                                {job.matchingScore}% Match
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed bg-[#0f172a]/20 p-2 rounded">
                              {job.description}
                            </p>
                            <div className="text-[9px] text-slate-400 font-medium select-none">
                              <strong className="text-purple-300">Requisitos:</strong> {job.keyRequirements}
                            </div>
                            <div className="flex gap-2 mt-1">
                              <a
                                href={job.link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 text-center py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-[10px] font-semibold border border-white/10 transition-all cursor-pointer"
                              >
                                Ver Vaga Oficial
                              </a>
                              <button
                                onClick={async () => {
                                  setTargetCompany(job.company);
                                  setTargetVacancyTitle(job.title);
                                  setTargetVacancyDesc(job.keyRequirements + ". " + job.description);
                                  setCoverLetterLanguage(activeLanguage);
                                  setActiveTab("coverletter");
                                  setSystemAlerts(prev => [`Redirecionado para redação de carta de apresentação para a vaga de ${job.title} no(a) ${job.company}.`, ...prev]);
                                  // Auto trigger cover letter generation
                                  setIsGeneratingCover(true);
                                  try {
                                    const resp = await fetch("/api/gemini/generate-cover-letter", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        resumeData: resume,
                                        company: job.company,
                                        jobTitle: job.title,
                                        jobDescription: job.keyRequirements + ". " + job.description,
                                        language: activeLanguage
                                      })
                                    });
                                    if (resp.ok) {
                                      const clResult = await resp.json();
                                      setCoverLetter(clResult);
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  } finally {
                                    setIsGeneratingCover(false);
                                  }
                                }}
                                className="flex-1 py-1 bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 rounded text-[10px] font-bold border border-purple-500/20 transition-all cursor-pointer"
                              >
                                Redigir Carta da Vaga
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Courses & Tech Books Section */}
                    <div>
                      <span className="text-[10px] tracking-wider uppercase font-extrabold text-purple-300 block mb-2.5">
                        📚 Cursos & Artigos Recomendados para Evolução Técnica
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {careerRecommendations.courses.map((course, idx) => (
                          <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-slate-400 font-bold">{course.platform}</span>
                                <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-slate-300">{course.duration}</span>
                              </div>
                              <h4 className="text-[11px] font-bold text-slate-200 line-clamp-1">{course.title}</h4>
                              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">{course.rationale}</p>
                            </div>
                            <a
                              href={course.link}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-center mt-2 w-full py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-[9px] font-semibold transition-all border border-white/5"
                            >
                              Explorar Curso
                            </a>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 mt-3">
                        {careerRecommendations.articles.map((art, idx) => (
                          <div key={idx} className="p-2.5 bg-[#0f172a]/20 border border-white/5 rounded-lg flex items-center justify-between text-[11px]">
                            <div>
                              <h5 className="font-semibold text-slate-200 line-clamp-1">{art.title}</h5>
                              <p className="text-[9px] text-slate-400">{art.source} • {art.readTime}</p>
                            </div>
                            <a
                              href={art.link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-[9px] font-medium rounded border border-white/10 text-slate-300 whitespace-nowrap cursor-pointer transition-all ml-4"
                            >
                              Ler Artigo
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Networking Strategical Targets */}
                    <div>
                      <span className="text-[10px] tracking-wider uppercase font-extrabold text-purple-300 block mb-2.5">
                        👥 Conexões Estratégicas no LinkedIn
                      </span>
                      <div className="space-y-3">
                        {careerRecommendations.networking.map((partner, idx) => (
                          <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl text-[11px]">
                            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5">
                              <span className="font-bold text-slate-200">{partner.personaRole}</span>
                              <span className="text-[10px] text-purple-300 font-medium">alvo no(a) {partner.targetCompany}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
                              {partner.rationale}
                            </p>
                            <div className="p-2 bg-[#0f172a]/60 rounded-lg border border-white/5">
                              <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">
                                Pitch de Convite Sugerido:
                              </span>
                              <p className="text-[10px] text-slate-300 italic select-all cursor-text leading-relaxed">
                                &quot;{partner.outreachPitch}&quot;
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText(partner.outreachPitch);
                                setSystemAlerts(prev => ["Texto de convite do LinkedIn copiado para a área de transferência.", ...prev]);
                                alert("Copiado com sucesso! Agora você já pode enviar no LinkedIn.");
                              }}
                              className="mt-2 w-full py-1 bg-purple-600/20 hover:bg-purple-650/30 text-purple-300 rounded text-[9px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Copiar Pitch de Mensagem
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "coverletter" && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Send className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-100">Configuração da Carta de Apresentação</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Empresa Destinatária</label>
                  <input
                    type="text"
                    className="w-full text-xs p-2.5 bg-slate-900/60 border border-white/10 rounded-lg text-slate-100 focus:outline-none"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Idioma de Escrita da Carta</label>
                  <div className="flex gap-2">
                    {(["pt", "en", "es"] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setCoverLetterLanguage(lang)}
                        className={`flex-1 py-1.5 rounded font-medium border text-xs cursor-pointer capitalize transition-all ${
                          coverLetterLanguage === lang
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "bg-slate-900/40 border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        {lang === "pt" ? "Português" : lang === "en" ? "English" : "Español"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Foco Adicional / Escopo da Vaga</label>
                  <textarea
                    className="w-full text-xs p-2.5 bg-slate-900/40 border border-white/10 rounded-lg text-slate-100 h-24 focus:outline-none"
                    placeholder="Adicione pontos fortes específicos que deseja ressaltar (ex: conhecimentos em computação em nuvem)."
                    value={targetVacancyDesc}
                    onChange={(e) => setTargetVacancyDesc(e.target.value)}
                  />
                </div>

                <button
                  onClick={generateCoverLetterAtServer}
                  disabled={isGeneratingCover}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {isGeneratingCover ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  {isGeneratingCover ? "Reescrevendo com IA de elite..." : "GERAR CARTA DE APRESENTAÇÃO"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="flex flex-col gap-6">
              {/* Connections Hub */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-4">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-sm text-slate-100">{dict.integrationsTitle}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-blue-600/20 rounded flex items-center justify-center">
                        <HardDrive className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{dict.driveConnected}</p>
                        <p className="text-[10px] text-slate-400">Sincronização imediata de currículos gerados</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={integrations.googleDriveConnected}
                        onChange={(e) => setIntegrations(prev => ({ ...prev, googleDriveConnected: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-purple-600/20 rounded flex items-center justify-center">
                        <Slack className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{dict.slackConnected}</p>
                        <p className="text-[10px] text-slate-400">Avisos automáticos de visualizações e vagas</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={integrations.slackConnected}
                        onChange={(e) => setIntegrations(prev => ({ ...prev, slackConnected: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-amber-600/20 rounded flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{dict.calendarConnected}</p>
                        <p className="text-[10px] text-slate-400">Painel de entrevistas no Calendário Google</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={integrations.googleCalendarConnected}
                        onChange={(e) => setIntegrations(prev => ({ ...prev, googleCalendarConnected: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Monthly automatic performance report */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold text-sm text-slate-100 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  {dict.overallReport}
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Consolide sua evolução de alcance, impressões de postagens e candidaturas a vagas em um dossiê executivo mensal automático.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setSystemAlerts(prev => ["Relatório analítico mensal de crescimento gerado com sucesso.", ...prev]);
                      alert("Dossiê consolidado de evolução de carreira gerado com IA!");
                    }}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-semibold cursor-pointer border border-white/5 flex items-center justify-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {dict.generateReport}
                  </button>
                  <button
                    onClick={() => alert("Relatório de evolução baixado sob formato PDF compatível para apresentações.")}
                    className="flex-1 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {dict.downloadReport}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Productivity Activity logs */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Notas do Sistema de Integração
            </h3>
            <div className="space-y-2 max-h-[140px] overflow-y-auto">
              {systemAlerts.map((alertMessage, idx) => (
                <div key={idx} className="text-[11px] text-slate-300 leading-relaxed bg-[#0f172a]/30 p-2 rounded-lg border border-white/5">
                  • {alertMessage}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Center column: Dynamic Customizable Resume Preview */}
        <section className="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col h-full min-h-[600px]">
          
          {/* Layout Presets switches with 30-template Selector */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5 border-b border-white/5 pb-4">
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  {dict[activeLanguage].chooseTemplate} <span className="text-[10px] text-indigo-400 font-semibold">(30 Modelos de Elite)</span>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {/* 30-Template Dropdown Grouped Selector */}
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="bg-slate-900/90 hover:bg-slate-850 text-xs text-white p-2 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-semibold cursor-pointer max-w-full sm:max-w-xs"
                >
                  <optgroup label="📋 Modelos Acadêmicos & Clássicos" className="bg-slate-950 text-slate-300 font-sans">
                    {TEMPLATE_CONFIGS.filter(t => t.category === "classic").map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="💼 Modelos Modernos & Corporativos" className="bg-slate-950 text-slate-300 font-sans">
                    {TEMPLATE_CONFIGS.filter(t => t.category === "modern").map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🎨 Perfis Criativos & Design" className="bg-slate-950 text-slate-300 font-sans">
                    {TEMPLATE_CONFIGS.filter(t => t.category === "creative").map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🖥️ Perfis Tech / Monospace" className="bg-slate-950 text-slate-300 font-sans">
                    {TEMPLATE_CONFIGS.filter(t => t.category === "tech").map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="💥 Brutalistas & Marcantes" className="bg-slate-950 text-slate-300 font-sans">
                    {TEMPLATE_CONFIGS.filter(t => t.category === "brutalist").map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </optgroup>
                </select>

                {/* Popular Shortcuts */}
                <div className="flex flex-wrap gap-1 items-center font-sans">
                  {[
                    { id: "elegant", label: "Elegante" },
                    { id: "modern", label: "Sidebar" },
                    { id: "cyberpunk", label: "Cyber" },
                    { id: "swiss_stark", label: "Suíço" },
                    { id: "royal_gold", label: "Ouro" }
                  ].map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
                        selectedTemplate === tmpl.id
                          ? "bg-indigo-650 text-white shadow-md shadow-indigo-600/20 border border-indigo-500"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/5"
                      }`}
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {integrations.googleDriveConnected && (
              <button
                onClick={exportCurrentToGoogleDrive}
                className="px-3 py-1.5 bg-blue-600/25 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <HardDrive className="w-3.5 h-3.5" />
                Salvar no Drive
              </button>
            )}
          </div>

          {/* Actual Resume rendering according to the template choice (high-contrast client styles inside the card) */}
          <div className="flex-1 overflow-y-auto max-h-[820px] p-2 bg-white rounded-2xl shadow-xl text-slate-800">
            <ResumeRender resume={resume} selectedTemplate={selectedTemplate} dict={dict} />
            {false && selectedTemplate === "elegant" && (
              <div id="elegant-resume-view" className="p-8 font-serif leading-relaxed text-sm">
                {/* Header */}
                <div className="text-center border-b-2 border-indigo-900 pb-5 mb-5">
                  <h2 className="text-3xl font-bold uppercase tracking-wide text-slate-900 mb-1">{resume.personal.name}</h2>
                  <p className="text-xs font-bold text-indigo-700 tracking-widest uppercase mb-3">{resume.personal.title}</p>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500 font-sans">
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
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b border-indigo-250 mb-2 font-sans">Resumo Profissional</h3>
                  <p className="text-slate-700 text-xs leading-relaxed text-justify">{resume.summary}</p>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b border-indigo-250 mb-3 font-sans">{dict.experience}</h3>
                  <div className="space-y-5">
                    {resume.experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-slate-900 font-sans">{exp.role} <span className="text-slate-500 font-medium">at {exp.company}</span></h4>
                          <span className="text-xs text-slate-500 font-sans">{exp.period}</span>
                        </div>
                        <p className="text-slate-600 text-xs mb-2 text-justify">{exp.description}</p>
                        {exp.metrics && exp.metrics.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-xs text-slate-850 pl-2">
                            {exp.metrics.map((metric, mi) => (
                              <li key={mi}><span className="font-semibold text-indigo-900">[Conquista ATS]</span> {metric}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Education & Languages */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b border-indigo-250 mb-3 font-sans">{dict.education}</h3>
                    <div className="space-y-3">
                      {resume.education.map(edu => (
                        <div key={edu.id} className="text-xs">
                          <p className="font-bold text-slate-900">{edu.degree} em {edu.field}</p>
                          <p className="text-slate-500">{edu.institution} | {edu.period}</p>
                        </div>
                      ))}
                    </div>

                    {resume.languages && resume.languages.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b border-indigo-250 mb-2 font-sans">{dict.languages}</h3>
                        <p className="text-xs text-slate-700">{resume.languages.join(", ")}</p>
                      </div>
                    )}
                  </div>

                  {/* Skills Tag block */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b border-indigo-250 mb-3 font-sans">{dict.skills}</h3>
                    <div className="flex flex-wrap gap-1">
                      {resume.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-indigo-50 text-indigo-900 rounded font-sans text-[11px] font-semibold border border-indigo-150">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {resume.projects && resume.projects.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b border-indigo-250 mb-2 font-sans">{dict.projects}</h3>
                        <div className="space-y-2">
                          {resume.projects.map(proj => (
                            <div key={proj.id} className="text-xs">
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
            )}

            {false && selectedTemplate === "modern" && (
              <div id="modern-resume-view" className="font-sans leading-relaxed text-xs grid grid-cols-12 min-h-[700px]">
                {/* Left side sidebar */}
                <div className="col-span-4 bg-slate-100 p-6 border-r border-slate-200 flex flex-col gap-5">
                  <div className="text-center pb-4 border-b border-slate-200">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-full mx-auto flex items-center justify-center font-bold text-xl mb-3 shadow">
                      {resume.personal.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <h2 className="text-base font-black text-slate-900 leading-tight">{resume.personal.name}</h2>
                    <p className="text-[10px] uppercase font-bold text-indigo-600 mt-1">{resume.personal.title}</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contato</h3>
                    <p className="text-slate-600 text-[11px]">📍 {resume.personal.location}</p>
                    <p className="text-slate-600 text-[11px]">📧 {resume.personal.email}</p>
                    <p className="text-slate-600 text-[11px]">📞 {resume.personal.phone}</p>
                    {resume.personal.linkedin && (
                      <p className="text-slate-600 text-[11px] break-all underline">🔗 {resume.personal.linkedin}</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Hard Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {resume.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-white text-slate-700 rounded text-[10px] border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{dict.languages}</h3>
                    <p className="text-slate-600 text-[11px]">{resume.languages.join(", ")}</p>
                  </div>
                </div>

                {/* Right body frame */}
                <div className="col-span-8 p-6 flex flex-col gap-5">
                  <div>
                    <h3 className="text-xs font-black text-indigo-600 uppercase border-b border-slate-200 pb-1 mb-2">Sobre Mim</h3>
                    <p className="text-justify text-slate-700 leading-relaxed text-[11px]">{resume.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-indigo-600 uppercase border-b border-slate-200 pb-1 mb-3">{dict.experience}</h3>
                    <div className="space-y-4">
                      {resume.experience.map(exp => (
                        <div key={exp.id} className="relative pl-3 border-l-2 border-indigo-100">
                          <p className="font-bold text-slate-800">{exp.role} — <span className="text-slate-500 font-medium">{exp.company}</span></p>
                          <p className="text-[10px] text-slate-450 mb-1">{exp.period}</p>
                          <p className="text-slate-600 text-[11px] leading-relaxed text-justify mb-1.5">{exp.description}</p>
                          {exp.metrics && exp.metrics.length > 0 && (
                            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-800 pl-1">
                              {exp.metrics.map((metric, mi) => (
                                <li key={mi}><span className="font-semibold text-slate-900">• Conquista:</span> {metric}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-indigo-600 uppercase border-b border-slate-200 pb-1 mb-2">{dict.education}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {resume.education.map(edu => (
                        <div key={edu.id} className="text-[11px]">
                          <p className="font-bold text-slate-800">{edu.degree} em {edu.field}</p>
                          <p className="text-slate-500">{edu.institution} ({edu.period})</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {false && selectedTemplate === "minimal" && (
              <div id="minimal-resume-view" className="p-8 font-sans leading-relaxed text-xs max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex justify-between items-baseline border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-light uppercase tracking-widest text-slate-900">{resume.personal.name}</h2>
                    <p className="text-[10px] tracking-widest text-slate-500 uppercase">{resume.personal.title}</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500 space-y-0.5">
                    <p>{resume.personal.location}</p>
                    <p>{resume.personal.email} | {resume.personal.phone}</p>
                    {resume.personal.linkedin && <p>{resume.personal.linkedin}</p>}
                  </div>
                </div>

                {/* Overview */}
                <div className="mb-5">
                  <p className="text-slate-600 text-justify leading-relaxed text-[11px]">{resume.summary}</p>
                </div>

                {/* Experience */}
                <div className="mb-5">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-800">Experiência Profissional</h3>
                  <div className="space-y-4">
                    {resume.experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-slate-800 text-[11px]">{exp.role} — {exp.company}</span>
                          <span className="text-[10px] text-slate-500">{exp.period}</span>
                        </div>
                        <p className="text-slate-650 text-[11px] my-1">{exp.description}</p>
                        {exp.metrics && exp.metrics.length > 0 && (
                          <div className="grid grid-cols-1 gap-0.5 text-[10px] text-slate-600 pl-2">
                            {exp.metrics.map((metric, mi) => (
                              <p key={mi}>• {metric}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-800">{dict.education}</h3>
                    {resume.education.map(edu => (
                      <div key={edu.id} className="mb-2">
                        <p className="font-bold text-slate-800 text-[11px]">{edu.degree}</p>
                        <p className="text-slate-500 text-[10px]">{edu.institution} | {edu.period}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-slate-800">{dict.skills}</h3>
                    <p className="text-[10px] text-slate-600 leading-normal">{resume.skills.join(", ")}</p>
                  </div>
                </div>
              </div>
            )}

            {false && selectedTemplate === "cyberpunk" && (
              <div id="cyber-resume-view" className="p-6 bg-slate-950 font-mono text-emerald-400 border-2 border-emerald-500 text-xs shadow-lg rounded">
                <div className="border-b-2 border-emerald-500 pb-3 mb-4">
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest mb-1">// COGNITIVE RESUME SYSTEM NODE_ONLINE</p>
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight">{resume.personal.name}</h2>
                  <p className="text-xs text-amber-300 font-bold uppercase mb-2">&gt; {resume.personal.title}</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-emerald-500">
                    <p>[LOC] {resume.personal.location}</p>
                    <p>[TEL] {resume.personal.phone}</p>
                    <p>[EML] {resume.personal.email}</p>
                    <p>[NET] {resume.personal.linkedin}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-amber-400 font-bold text-[10px] mb-1"># SUMMARY_DUMP</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed text-justify">{resume.summary}</p>
                </div>

                <div className="mb-4">
                  <p className="text-amber-400 font-bold text-[10px] mb-2"># CORES_OPERATIONS</p>
                  <div className="space-y-3">
                    {resume.experience.map(exp => (
                      <div key={exp.id} className="border-l border-emerald-500 pl-3">
                        <div className="flex justify-between font-bold text-white">
                          <span>{exp.role} @ {exp.company}</span>
                          <span className="text-amber-300">{exp.period}</span>
                        </div>
                        <p className="text-slate-400 text-[10px] my-1">{exp.description}</p>
                        {exp.metrics.map((bullet, idx) => (
                          <p key={idx} className="text-emerald-300 text-[10px]">
                            &gt;&gt; [MTR_ENG_VALUE % {idx + 1}]: {bullet}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-amber-400 font-bold text-[10px] mb-1"># EDUCATION_DEGREES</p>
                    {resume.education.map(edu => (
                      <p key={edu.id} className="text-slate-350 text-[10px] mb-1">
                        + {edu.degree} inside {edu.field} ({edu.institution})
                      </p>
                    ))}
                  </div>

                  <div>
                    <p className="text-amber-400 font-bold text-[10px] mb-1"># TECH_STACK_MATRIX</p>
                    <div className="flex flex-wrap gap-1.5">
                      {resume.skills.map(skill => (
                        <span key={skill} className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500 text-[9px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>Formatação compatível com robôs ATS corporativos e de Tecnologia</span>
            <span className="font-semibold text-indigo-400 uppercase tracking-widest">Modelo: {selectedTemplate.toUpperCase()}</span>
          </footer>
        </section>

        {/* Right Tab column: Visual Content Optimizers, Cover Letter and Stats */}
        <section className="lg:col-span-12 xl:col-span-12 flex flex-col gap-6">

          {/* Cover Letter generation result panel */}
          {activeTab === "coverletter" && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-2 mb-4 gap-2">
                <span className="text-xs uppercase tracking-widest text-[#94a3b8] font-bold block">
                  Carta de Apresentação Gerada por IA
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coverLetter.content);
                      alert("Corpo do texto copiado com sucesso para a área de transferência!");
                    }}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded text-xs cursor-pointer font-semibold transition-all"
                  >
                    Copiar Texto
                  </button>
                  <button
                    onClick={() => {
                      const newFile = {
                        name: `Carta_Apresentacao_${targetCompany.replace(/\s+/g, '_')}.pdf`,
                        size: "110 KB",
                        timestamp: "Gerado agora"
                      };
                      setDriveFiles(prev => [newFile, ...prev]);
                      setSystemAlerts(prev => [`Arquivo '${newFile.name}' salvo automaticamente em seu Google Drive.`, ...prev]);
                      alert("Documento exportado com sucesso para a sua conta sincronizada!");
                    }}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs cursor-pointer font-bold transition-all"
                  >
                    Salvar no Google Drive
                  </button>
                </div>
              </div>

              {/* Letter preview */}
              <div className="p-6 bg-white text-slate-800 rounded-xl font-serif text-xs md:text-sm shadow-md whitespace-pre-wrap max-w-2xl mx-auto border border-gray-100 leading-relaxed">
                <p className="text-right font-sans text-xs text-slate-500 mb-4">{coverLetter.date}</p>
                <div className="mb-4">
                  <p className="font-bold">À equipe de Recrutamento & Seleção</p>
                  <p className="font-bold text-indigo-700">{coverLetter.company}</p>
                  <p className="text-slate-550 text-xs">Assunto: Candidatura para a posição de {coverLetter.jobTitle}</p>
                </div>
                <div className="text-justify text-slate-750">
                  {coverLetter.content}
                </div>
              </div>
            </div>
          )}

          {/* Productivity Integrations directories logs */}
          {activeTab === "integrations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Google Calendar pipeline */}
              {integrations.googleCalendarConnected && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {dict.interviewList}
                    </h4>
                  </div>

                  <div className="space-y-2 mb-4 max-h-[140px] overflow-y-auto">
                    {interviews.map(evt => (
                      <div key={evt.id} className="p-2.5 bg-white/5 border border-white/5 rounded-lg text-xs flex justify-between items-center group">
                        <div>
                          <p className="font-bold text-slate-200">{evt.title}</p>
                          <p className="text-[10px] text-slate-400">📅 {evt.date} às {evt.time} ({evt.type})</p>
                        </div>
                        <button
                          onClick={() => removeInterviewEvent(evt.id)}
                          className="text-slate-400 hover:text-rose-400 p-1 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add meeting form */}
                  <div className="flex flex-col gap-2 p-3 bg-slate-900/60 rounded-xl text-xs border border-white/5">
                    <p className="font-bold text-[10px] text-slate-400 mb-1">{dict.scheduleNew}</p>
                    <input
                      type="text"
                      className="p-1 px-2.5 rounded bg-slate-800 border border-white/10 text-slate-100"
                      placeholder="Ex: Entrevista de Conexão com RH"
                      value={newInterviewTitle}
                      onChange={(e) => setNewInterviewTitle(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 p-1 rounded bg-slate-800 border border-white/10 text-slate-100"
                        placeholder="16/06/2026"
                        value={newInterviewDate}
                        onChange={(e) => setNewInterviewDate(e.target.value)}
                      />
                      <input
                        type="text"
                        className="w-20 p-1 rounded bg-slate-800 border border-white/10 text-slate-100"
                        placeholder="15:00"
                        value={newInterviewTime}
                        onChange={(e) => setNewInterviewTime(e.target.value)}
                      />
                      <button
                        onClick={addInterviewEvent}
                        className="px-3 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sincronização Google Drive - Arquivos salvos */}
              {integrations.googleDriveConnected && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4" />
                    Seu Drive Virtual Integrado (Candidaturas)
                  </h4>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto">
                    {driveFiles.map((file, idx) => (
                      <div key={idx} className="p-2.5 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="font-semibold text-slate-200">{file.name}</p>
                            <span className="text-[10px] text-slate-400">{file.timestamp}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 px-2 py-0.5 bg-slate-800 rounded">{file.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* LinkedIn Posts Feed Scheduler & Optimizer */}
          {activeTab === "dashboard" && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-400 animate-pulse" />
                  {dict.postOnLinkedIn}
                </h3>
              </div>

              {/* Post composer */}
              <div className="flex flex-col gap-2.5 mb-5 bg-slate-900/40 p-4 rounded-xl border border-white/5">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Utilize o feed sincronizado para compartilhar suas novas conquistas do seu currículo. A rede de recrutadores receberá atualizações em tempo real!
                </p>
                <textarea
                  className="w-full text-xs p-2.5 bg-slate-950 border border-white/15 rounded-lg text-slate-200 h-20 focus:outline-none"
                  placeholder={dict.postPlaceholder}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                />
                <div className="flex justify-between items-center text-[10px]">
                  <button
                    onClick={() => setNewPostText(`Acabei de reescrever minha história profissional utilizando o gerador com Inteligência Artificial! Otimizei meu cargo técnico de ${resume.personal.title} e conquistei score superior em robôs ATS corporativos. Rumo ao próximo sucesso! 🚀 #inovacao #ats`)}
                    className="text-indigo-400 hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Sugerir texto profissional por IA
                  </button>
                  <button
                    onClick={createSimulatedPost}
                    disabled={!newPostText.trim()}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    {dict.postButton}
                  </button>
                </div>
              </div>

              {/* Feed items */}
              <div className="space-y-3.5">
                {posts.map(post => (
                  <div key={post.id} className="p-4 bg-slate-900/60 border border-white/5 rounded-xl text-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-indigo-900/40 text-indigo-300 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                        RC
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{resume.personal.name}</p>
                        <p className="text-[9px] text-slate-500">{post.scheduledTime}</p>
                      </div>
                      <span className={`ml-auto px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        post.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
                      }`}>
                        {post.status}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-3">{post.content}</p>

                    {post.status === "published" && (
                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 text-[11px] text-slate-500 text-center">
                        <div>📈 <span className="font-bold text-slate-350">{post.views}</span> views</div>
                        <div>👍 <span className="font-bold text-slate-350">{post.likes}</span> likes</div>
                        <div>💬 <span className="font-bold text-slate-350">{post.comments}</span> comments</div>
                        <div>🔄 <span className="font-bold text-slate-350">{post.shares}</span> shares</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

      </main>

      {/* Outer general footer */}
      <footer className="mt-8 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div>Engrenagem autônoma de Otimização ATS • Rômulo Chaves • Romulochaves77@gmail.com</div>
        <div className="flex gap-4">
          <span>Sincronização Ativa</span>
          <span>Google Drive Integrado</span>
        </div>
      </footer>
    </div>
  );
}
