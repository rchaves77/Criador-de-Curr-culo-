import { ResumeData } from "../types";

export const initialResume: ResumeData = {
  personal: {
    name: "Rômulo Chaves",
    title: "Engenheiro de Software Fullstack Sênior",
    email: "romulochaves77@gmail.com",
    phone: "+55 (11) 98765-4321",
    location: "São Paulo, SP - Brasil",
    linkedin: "linkedin.com/in/romulochaves77",
    website: "romulochaves.dev",
    github: "github.com/romulochaves77"
  },
  summary: "Desenvolvedor de software com 8 anos de experiência sólida em arquitetura de sistemas escaláveis e modernas APIs. Especialista em TypeScript, React, Node.js e ecossistemas de nuvem (AWS e Google Cloud). Focado em otimizar performance operacional de produtos de software para gerar valor real ao negócio e excelente experiência do usuário final.",
  experience: [
    {
      id: "exp1",
      company: "InnovateTech Corp",
      role: "Engenheiro Fullstack Principal",
      period: "2023 - Presente",
      description: "Liderança técnica no desenvolvimento da plataforma core de pagamentos digitais em tempo real. Implementação de arquitetura baseada em microsserviços serverless.",
      metrics: [
        "Aumentou a taxa de transações integradas com sucesso em 35% no primeiro semestre.",
        "Reduziu a latência das buscas no banco de dados distribuído de 1.2s para apenas 150ms.",
        "Coordenou com sucesso a migração de microsserviços legados com zero downtime operacional."
      ]
    },
    {
      id: "exp2",
      company: "Global Softwares Brasil",
      role: "Desenvolvedor Sênior TypeScript",
      period: "2020 - 2023",
      description: "Desenvolvimento de painéis integrados de BI corporativo e otimização de consultas assíncronas complexas em banco de dados SQL e NoSQL.",
      metrics: [
        "Economizou USD 45,000 anuais em servidores AWS reorganizando processos inativos de cache.",
        "Reduziu o ciclo médio de entrega das features em 4 dias utilizando metodologias ágeis integradas.",
        "Implementou pipeline automatizado de testes de cobertura atingindo índice ideal de 94%."
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Universidade Estadual do Rio de Janeiro (UERJ)",
      degree: "Bacharelado",
      field: "Engenharia de Computação",
      period: "2015 - 2019"
    }
  ],
  skills: [
    "JavaScript", "TypeScript", "React.JS", "Node.JS", "Express.JS", 
    "AWS", "GraphQL", "Google Cloud", "PostgreSQL", "Docker", "Tailwind CSS", "Acessibilidade WCAG"
  ],
  projects: [
    {
      id: "proj1",
      name: "Sistema de Roteamento de Logística em Tempo Real",
      description: "Plataforma escalável com algoritmos geométricos inteligentes para despacho automático de frota logística parceira.",
      technologies: "Node.js, Redis, Google Maps API, Websockets"
    }
  ],
  languages: [
    "Português (Nativo)", "Inglês (Fluente)", "Espanhol (Intermediário)"
  ]
};
