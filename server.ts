import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("GEMINI_API_KEY not found in environment, falling back to smart simulated services.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. ENDPOINT: Parse LinkedIn copy-pasted text into organized ResumeData
app.post("/api/gemini/parse-linkedin", async (req, res) => {
  const { rawText, language = "pt" } = req.body;
  if (!rawText || typeof rawText !== "string") {
    return res.status(400).json({ error: "Texto do perfil é obrigatório." });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Return smart fallback so the app does not break
    return res.json({
      personal: {
        name: "Romulo Chaves",
        title: "Engenheiro de Software Sênior",
        email: "romulochaves77@gmail.com",
        phone: "+55 11 99999-8888",
        location: "São Paulo, Brasil",
        linkedin: "linkedin.com/in/romulochaves",
        website: "romulochaves.dev",
        github: "github.com/romulochaves",
      },
      summary: "Profissional de tecnologia com mais de 8 anos de experiência em desenvolvimento de software fullstack, com foco em arquiteturas escaláveis, React, Node.js e computação em nuvem.",
      experience: [
        {
          id: "exp1",
          company: "Tech Solutions Inc.",
          role: "Líder Técnico de Software",
          period: "2022 - Presente",
          description: "Liderança de equipe ágil com foco em sistemas SaaS de alta escalabilidade. Implementação de microsserviços integrados.",
          metrics: ["Redução de 35% no tempo de carregamento de páginas internas", "Aumento de 20% na eficiência de processamento de filas em background"]
        },
        {
          id: "exp2",
          company: "Global Softwares",
          role: "Desenvolvedor Fullstack Sênior",
          period: "2019 - 2022",
          description: "Desenvolvimento de APIs robustas e interfaces de painéis interactivos em tempo real para controle de logística.",
          metrics: ["Otimização de consultas SQL resultando em 45% de melhora na performance", "Implementação de pipeline CI/CD reduzindo deploy de 1 hora para 4 minutos"]
        }
      ],
      education: [
        {
          id: "edu1",
          institution: "Universidade de São Paulo (USP)",
          degree: "Bacharelado",
          field: "Ciência da Computação",
          period: "2014 - 2018"
        }
      ],
      skills: ["React", "TypeScript", "Node.js", "Express", "Docker", "AWS", "SQL", "GraphQL", "Git"],
      projects: [
        {
          id: "proj1",
          name: "Plataforma SaaS Multitenant",
          description: "Arquitetura e desenvolvimento de um portal de autoatendimento escalável gerenciando pagamentos.",
          technologies: "React, Node.js, Stripe, PostgreSQL"
        }
      ],
      languages: ["Português (Nativo)", "Inglês (Avançado)"]
    });
  }

  try {
    const prompt = `Analise o perfil bruto (LinkedIn ou currículo livre) fornecido abaixo e extraia todas as informações no formato estruturado para um currículo profissional de alto nível. Preencha todos os campos possíveis em idioma: ${language}.
Crie métricas de impacto realísticas (com porcentagens, horas, lucros ou reduções de custos) baseadas nas descrições de cargo do usuário para valorizar o perfil.

Texto Bruto:
${rawText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um recrutador e headhunter de elite que extrai dados brutos de perfis e os transforma em currículos em formato JSON estruturado perfeito. Se faltarem informações como telefone ou redes sociais, use cadeias de caracteres vazias ou padrões inferidos de forma realista.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personal: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                website: { type: Type.STRING },
                github: { type: Type.STRING },
              },
              required: ["name", "title", "email", "phone"]
            },
            summary: { type: Type.STRING, description: "Resumo profissional de 3 a 5 linhas focado em conquistas." },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  period: { type: Type.STRING },
                  description: { type: Type.STRING, description: "Descrição textual sintética das atividades" },
                  metrics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 a 4 conquistas com números de impacto, ex: Reduzi latência em 30%, liderei equipe de 5 desenvolvedores"
                  }
                },
                required: ["id", "company", "role", "period", "description", "metrics"]
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  field: { type: Type.STRING },
                  period: { type: Type.STRING }
                },
                required: ["id", "institution", "degree", "field", "period"]
              }
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: { type: Type.STRING }
                },
                required: ["id", "name", "description"]
              }
            },
            languages: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["personal", "summary", "experience", "education", "skills", "projects", "languages"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Erro ao analisar LinkedIn:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor ao analisar LinkedIn." });
  }
});

// 2. ENDPOINT: Optimize experiences using AI and output updated descriptions and impact metrics
app.post("/api/gemini/optimize-bullets", async (req, res) => {
  const { role, company, description, currentMetrics = [], language = "pt" } = req.body;
  
  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      optimizedDescription: `${description} (Otimizado por IA para maior impacto profissional na área de ${role})`,
      metrics: [
        `Garantia de 99.9% de uptime para sistemas de produção na ${company}`,
        "Redução de custos operacionais de TI em cerca de 15%",
        "Liderança pontual de entregas de sprint sem atrasos nos prazos"
      ]
    });
  }

  try {
    const prompt = `Melhore a descrição do cargo profissional para fins de currículo competitivo, com foco em métricas de impacto e resultados palpáveis. 
Cargo: ${role} na empresa ${company}
Descrição fornecida pelo usuário: ${description}
Métricas existentes (se houver): ${currentMetrics.join("; ")}

Por favor, gere uma descrição textual executiva otimizada de 2-3 linhas e uma lista de 3 ou 4 marcadores (bullets) de conquistas reais e mensuráveis com dados simulados realísticos abundantes (como porcentagens de economia, escala, tamanho de projetos, aumentos de receita, reduções de bugs ou prazos acelerados) apropriadas para este cargo em idioma: ${language}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um consultor de carreira de elite. Sua meta é reescrever a experiência usando palavras de ação fortes e extrair dados estatísticos específicos para criar um perfil atraente e adequado para triagem de IA/ATS.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedDescription: { type: Type.STRING },
            metrics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 3 a 4 conquistas métricas escritas em primeira pessoa do plural de forma profissional."
            }
          },
          required: ["optimizedDescription", "metrics"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Erro ao otimizar textos com Gemini:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. ENDPOINT: Assess ATS score and give keywords & suggestions
app.post("/api/gemini/analyze-ats", async (req, res) => {
  const { resumeData, jobDescription, language = "pt" } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      score: 78,
      grammarAndFormatting: [
        "Certifique-se de usar datas em formatos consistentes de mês/ano em todo o currículo.",
        "Não inclua fotos ou ícones de barra de habilidades coloridas muito chamativos para evitar problemas de escaneamento em leitores ATS antigos."
      ],
      suggestedKeywords: [
        "Kubernetes",
        "CI/CD",
        "React Hooks",
        "Jest",
        "Clean Architecture",
        "Scrum"
      ],
      matchingKeywords: [
        "TypeScript",
        "React",
        "Node.js",
        "AWS",
        "SQL"
      ],
      impactMetricsTips: [
        "Sua experiência em Global Softwares pode se beneficiar de mais números. Quantos servidores integrados?",
        "Tente mensurar o volume de dados tratados na plataforma SaaS."
      ],
      overallFeedback: "O currículo está muito bem estruturado e focado em engenharia de alta performance. Adicionando palavras-chave de testes unitários e orquestração de nuvem aumentará o score para acima de 90%."
    });
  }

  try {
    const prompt = `Compare os dados do currículo do candidato com a descrição da vaga fornecida para calcular a compatibilidade ATS (Sistemas de Rastreamento de Candidatos).
Curriculum Vitae:
${JSON.stringify(resumeData)}

Descrição da Vaga/Requisitos:
${jobDescription || "Engenharia de Software de Alta Performance, Cloud Computing, Metodologias Ágeis, React, Node.js"}

Forneça um relatório completo de otimização ATS em formato JSON com o idioma de resposta: ${language}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um mecanismo validador de ATS. Avalie o currículo minuciosamente com base no cargo pretendido, detecte incoerências de formato, sugira palavras-chave cruciais que estão presentes na descrição da vaga e ausentes no currículo, e dê dicas de métricas organizadas.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Compatibilidade geral de 0 a 100" },
            grammarAndFormatting: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Erros de estrutura, formatação ou alertas de legibilidade de robôs ATS"
            },
            suggestedKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Keywords essenciais da vaga que faltam ou deveriam ser adicionadas no currículo"
            },
            matchingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Keywords relevantes da vaga que foram encontradas com sucesso"
            },
            impactMetricsTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Dicas de onde adicionar mais números ou resultados de negócios"
            },
            overallFeedback: { type: Type.STRING, description: "Sumário resumido de conselhos estratégicos" }
          },
          required: ["score", "grammarAndFormatting", "suggestedKeywords", "matchingKeywords", "impactMetricsTips", "overallFeedback"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Erro ao analisar currículo no ATS:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. ENDPOINT: Generate Cover Letter (Carta de Apresentação)
app.post("/api/gemini/generate-cover-letter", async (req, res) => {
  const { resumeData, company, jobTitle, jobDescription, language = "pt" } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      recipient: "Gerente de Contratação",
      company: company || "Empresa de Tecnologia",
      jobTitle: jobTitle || "Engenheiro de Software",
      content: `Prezada equipe de contratação da ${company || "sua empresa"},\n\n` +
        `Escrevo para expressar meu forte interesse na vaga de ${jobTitle || "Engenheiro de Software Sênior"}. Com base nas minhas competências desenvolvidas como ${resumeData?.personal?.title || "desenvolvedor de tecnologia"}, estou confiante de que posso agregar valor de negócios para o time.\n\n` +
        `Em minhas experiências anteriores, atuei no desenvolvimento de softwares de alta performance utilizando ${resumeData?.skills?.slice(0, 5).join(", ") || "tecnologias modernas"} e reduzi gargalos operacionais em até 30% em projetos estratégicos.\n\n` +
        `Agradeço antecipadamente pelo tempo e consideração de avaliar meu perfil profissional.\n\nAminstosamente,\n${resumeData?.personal?.name || "Candidato"}`,
      date: new Date().toLocaleDateString(language === "pt" ? "pt-BR" : "en-US")
    });
  }

  try {
    const prompt = `Crie uma Carta de Apresentação (Cover Letter) profissional extremamente persuasiva, elegante e motivadora ligando o currículo do candidato com os detalhes da vaga.
Currículo do Candidato:
${JSON.stringify(resumeData)}

Empresa que oferece a vaga: ${company}
Título do cargo pretendido: ${jobTitle}
Descrição/Contexto da vaga:
${jobDescription || "Buscamos pessoas capacitadas para resolver complexidades tecnológicas, impulsionar inovações no produto e liderar processos de entrega."}

Por favor, escreva a carta de apresentação com excelente formatação de parágrafos em idioma: ${language}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um copywriter executivo e redator especializado de cartas de recomendação corporativa de grande impacto. Escreva uma carta profissional sob medida estruturada com Saudação, Introdução engajadora, Ligação estratégica das maiores conquistas dele com as dores da empresa descritas na vaga, e Conclusão com chamada de ação para entrevista formal.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipient: { type: Type.STRING },
            company: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
            content: { type: Type.STRING, description: "Corpo de texto da carta completo, contendo parágrafos estruturados" },
            date: { type: Type.STRING }
          },
          required: ["recipient", "company", "jobTitle", "content", "date"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Erro ao gerar carta de apresentação:", error);
    res.status(500).json({ error: error.message });
  }
});

// 5. ENDPOINT: Suggest specific resume optimizations with Accept/Reject support
app.post("/api/gemini/suggest-optimizations", async (req, res) => {
  const { resumeData, language = "pt" } = req.body;
  if (!resumeData) {
    return res.status(400).json({ error: "Dados do currículo são obrigatórios." });
  }

  const ai = getGeminiClient();
  const firstExpId = resumeData.experience?.[0]?.id || "exp1";
  
  if (!ai) {
    // Return high-quality, relevant fallback suggestions matching the candidate's profile
    return res.json({
      suggestions: [
        {
          id: "sug_summary",
          type: "summary",
          targetId: "",
          title: "Maximizar Impacto do Resumo Executivo",
          originalText: resumeData.summary || "",
          suggestedText: `Arquiteto e Engenheiro de Software Sênior especializado no desenvolvimento de plataformas altamente concorridas e escalabilidade na nuvem (AWS/Docker). Histórico comprovado de liderança técnica de equipes ágeis multicompetentes, com foco em desenvolvimento ágil de microsserviços resilientes em Node.js e React. Fluência no desenvolvimento de integrações financeiras seguras e otimização de performance corporativa.`,
          rationale: "O resumo proposto substitui descrições passivas por palavras de ação fortes e adiciona palavras-chave em alta no mercado corporativo (escalabilidade, soluções resilientes, liderança técnica), garantindo compatibilidade superior com robôs de triagem ATS."
        },
        {
          id: "sug_skills",
          type: "skills",
          targetId: "",
          title: "Adicionar Competências Críticas de Nuvem/Arquitetura",
          originalText: resumeData.skills ? resumeData.skills.join(", ") : "",
          suggestedText: "Kubernetes, CI/CD, Arquitetura de Microsserviços, System Design, Jest",
          rationale: "Empresas modernas escaneiam termos como 'Kubernetes', 'CI/CD' e 'System Design' para posições sênior. Adicioná-las aumenta em até 40% a relevância do seu currículo em painéis de análise."
        },
        {
          id: `sug_exp_${firstExpId}`,
          type: "experience",
          targetId: firstExpId,
          title: "Melhorar Descrição de Conquistas ATS da Primeira Experiência",
          originalText: resumeData.experience?.[0]?.description || "",
          suggestedText: "Liderança de times de engenharia ágil com foco na modernização de arquitetura SaaS robusta de alta disponibilidade, estruturando barramentos de mensagens assíncronos e garantindo integrações de APIs de pagamento sem fricção.",
          rationale: "Trabalha a concisão e insere termos de impacto técnico de forte aderência para processos de headhunting."
        }
      ]
    });
  }

  try {
    const prompt = `Analise detalhadamente o currículo fornecido abaixo e elabore de 3 a 5 sugestões específicas e independentes de otimização para elevar a nota de compatibilidade ATS e o apelo visual/profissional do candidato para recrutadores sêniores.
Para cada sugestão, identifique o tipo ('summary', 'skills' ou 'experience') e o ID correspondente da experiência do usuário (se aplicável).
Foque em: clareza do texto, remoção de redundâncias (concisão), uso de palavras-chave competitivas e quantificação de impacto (métricas de desempenho).

Dados do Currículo Atual:
${JSON.stringify(resumeData)}

Gere os resultados no formato JSON de acordo com o idioma: ${language}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um mentor de carreiras especializado em readequação curricular e design instrucional. Seu objetivo é sugerir melhorias de impacto direto sob a forma de substituições precisas de texto para que possam ser aplicadas de forma programática. No campo suggestedText de skills, forneça apenas os nomes das habilidades novos que devem ser anexados, separados por vírgula. Para o summary ou experience, o suggestedText deve ser a reescrita completa da seção.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, description: "Must be exactly one of: 'summary', 'skills', 'experience'" },
                  targetId: { type: Type.STRING, description: "If type is experience, provide the ID of that experience element. Otherwise empty string." },
                  title: { type: Type.STRING },
                  originalText: { type: Type.STRING, description: "The original passage or general state of that segment to optimize." },
                  suggestedText: { type: Type.STRING, description: "The complete premium replacement text (for summary/experience) or comma-separated technologies to append (for skills)." },
                  rationale: { type: Type.STRING, description: "Explicação em um parágrafo dos ganhos claros em clareza, concisão, robôs ATS e headhunting do mercado." }
                },
                required: ["id", "type", "targetId", "title", "originalText", "suggestedText", "rationale"]
              }
            }
          },
          required: ["suggestions"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Erro ao gerar sugestões de otimização:", error);
    res.status(500).json({ error: error.message });
  }
});

// 6. ENDPOINT: Recommendation Engine (Courses, articles, networking connection opportunities and jobs)
app.post("/api/gemini/career-recommendations", async (req, res) => {
  const { resumeData, language = "pt" } = req.body;
  if (!resumeData) {
    return res.status(400).json({ error: "Dados do currículo são obrigatórios." });
  }

  const ai = getGeminiClient();
  const candidateTitle = resumeData.personal?.title || "Engenheiro de Software";
  const candidateSkills = resumeData.skills?.slice(0, 5).join(", ") || "React, TypeScript, Node.js";

  if (!ai) {
    // Generate beautiful and realistic mock career recommendations directly matched to candidate
    return res.json({
      courses: [
        {
          title: "System Design for High Scalability & Performance",
          platform: "Educative.io",
          duration: "24h (Self-paced)",
          link: "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers",
          rationale: `Como você atua como ${candidateTitle}, dominar o design de sistemas distribuídos e de microsserviços complexos é o diferencial que empresas como Nubank e Uber buscam.`
        },
        {
          title: "TypeScript & Node.js Advanced Architecture Patterns",
          platform: "Pluralsight",
          duration: "12h",
          link: "https://www.pluralsight.com/courses/typescript-advanced-architectures",
          rationale: `Alinhado com seu foco em ${candidateSkills}, esse curso aborda padrões Clean Architecture, injeção de dependência avançada e otimização de performance no Node.`
        }
      ],
      articles: [
        {
          title: "Optimizing High-Volume PostgreSQL Queries on AWS RDS",
          source: "AWS Engineering Blog",
          readTime: "8 min read",
          link: "https://aws.amazon.com/blogs/database/optimizing-postgresql-queries/",
          rationale: "Focado em melhorar a infraestrutura e latência de banco de dados, tópico extremamente útil para alavancar suas conquistas ATS."
        },
        {
          title: "The Ultimate Guide to Resilient Microservice Communications",
          source: "Martin Fowler Publications",
          readTime: "15 min read",
          link: "https://martinfowler.com/articles/microservices.html",
          rationale: "Conceitos de resiliência (Circuit Breakers e retentativas) essenciais para as vagas de alta concorrência."
        }
      ],
      networking: [
        {
          viewingProfile: true,
          personaRole: "Group Product Manager",
          targetCompany: "Nubank",
          rationale: "Sua sólida experiência com microsserviços transacionais é muito aderente às necessidades da tribo de Core Banking do Nubank.",
          outreachPitch: `Olá! Notei suas publicações sobre escalabilidade de produtos financeiros. Tenho atuado refinando barramentos transacionais em Node/TypeScript e adoraria trocar impressões rápidas sobre desafios comuns de processamento assíncrono na nuvem. Um abraço!`
        },
        {
          viewingProfile: false,
          personaRole: "Lead IT Recruiter & Headhunter",
          targetCompany: "CI&T (Global Tech Partner)",
          rationale: "A CI&T está expandindo times de soluções multitenant corporativas e ativamente contratando perfis sênior TypeScript/AWS.",
          outreachPitch: `Olá! Acompanho as iniciativas de expansão tecnológica da CI&T. Sou Engenheiro de Software Fullstack centrado em criar ecossistemas ágeis e eficientes (React/APIs). Caso tenham alguma frente sênior onde minhas competências possam agilizar entregas, estou aberto para uma conversa informal. Obrigado!`
        }
      ],
      jobs: [
        {
          title: "Senior Fullstack Engineer (Fintech & Payments Hub)",
          company: "Nubank",
          location: "São Paulo, SP (Híbrido)",
          matchingScore: 94,
          keyRequirements: "React, Node.js, TypeScript, Cloud Architecture (AWS/Docker)",
          link: "https://nubank.com.br/carreiras",
          description: "Responsável por liderar a evolução técnica de gateways bancários em canais móveis e web, mantendo rigorosa segurança cibernética e latência ultrabaixa."
        },
        {
          title: "Software Architect (SaaS Global Solutions)",
          company: "Hotmart",
          location: "Belo Horizonte, MG / Remoto",
          matchingScore: 89,
          keyRequirements: "System Design, Microsserviços, Node.js, SQL & GraphQL",
          link: "https://hotmart.com/pt-br/carreiras",
          description: "Definir diretrizes arquiteturais para portais SaaS de abrangência global, atuando próximo aos desenvolvedores no refinamento de pipelines CI/CD."
        }
      ]
    });
  }

  try {
    const prompt = `Seu papel é atuar como um motor especialista de mentoria técnica e aconselhamento de carreiras para profissionais de tecnologia de elite.
Com base no perfil curricular do usuário abaixo, gere recomendações exclusivas e personalizadas:
1. CURSOS RELEVANTES: que preencham potenciais gaps ou acelerem a maturidade técnica em tecnologias avançadas.
2. ARTIGOS DE ENGENHARIA: artigos reais de vanguarda tecnológica.
3. CONEXÕES DE NETWORKING: Cargos e empresas estratégicas para conectar no LinkedIn, com um texto de primeiro contato profissional (outreach text pitch) contextualizado ao candidato.
4. OPORTUNIDADES DE VAGAS: Vagas fictícias mas realistas com a respectiva pontuação de matching (Score 0-100) calibrada ao candidato.

Perfil do Candidato:
${JSON.stringify(resumeData)}

Idioma do retorno das descrições: ${language}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é o CareerEngine da plataforma. Retorne dados extremamente ricos e personalizados em formato JSON estruturado com os caminhos corretos de desenvolvimento profissional.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            courses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  link: { type: Type.STRING },
                  rationale: { type: Type.STRING, description: "Justificativa de por que esse curso acelerará sua ascensão" }
                },
                required: ["title", "platform", "duration", "link", "rationale"]
              }
            },
            articles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  source: { type: Type.STRING },
                  readTime: { type: Type.STRING },
                  link: { type: Type.STRING },
                  rationale: { type: Type.STRING, description: "Como a leitura agregará valor aos sprints dele" }
                },
                required: ["title", "source", "readTime", "link", "rationale"]
              }
            },
            networking: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  personaRole: { type: Type.STRING, description: "Ex. Engineering Manager ou Tech Recruiter" },
                  targetCompany: { type: Type.STRING },
                  rationale: { type: Type.STRING, description: "A relação de valor entre os perfis" },
                  outreachPitch: { type: Type.STRING, description: "Mensagem curta e elegante em primeira pessoa para enviar em convite no LinkedIn" }
                },
                required: ["personaRole", "targetCompany", "rationale", "outreachPitch"]
              }
            },
            jobs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  location: { type: Type.STRING },
                  matchingScore: { type: Type.INTEGER },
                  keyRequirements: { type: Type.STRING },
                  link: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "company", "location", "matchingScore", "keyRequirements", "link", "description"]
              }
            }
          },
          required: ["courses", "articles", "networking", "jobs"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Erro ao gerar recomendações de carreira:", error);
    res.status(500).json({ error: error.message });
  }
});


// Configure Vite middleware in development or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server autostarted on http://0.0.0.0:${PORT}`);
  });
}

startServer();
