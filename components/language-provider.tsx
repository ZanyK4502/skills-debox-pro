"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Language = "en" | "zh";

type CategoryCopy = {
  name: string;
  description: string;
};

type SkillCopy = {
  name: string;
  tags: string[];
  summary: string;
  useCases: string;
  audience: string;
  reason: string;
};

type Dictionary = {
  header: {
    home: string;
    categories: string;
    about: string;
    toggle: string;
  };
  footer: {
    tagline: string;
  };
  home: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    categoryEyebrow: string;
    categoryTitle: string;
    categoryDescription: string;
    methodologyEyebrow: string;
    methodologyTitle: string;
    methodologyDescription: string;
    logicEyebrow: string;
    logicTitle: string;
    logicDescription: string;
    boundaryEyebrow: string;
    boundaryTitle: string;
    boundaryDescription: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    backHome: string;
    viewCategories: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  categoryPage: {
    backHome: string;
    eyebrow: string;
    readyStatus: string;
    soonStatus: string;
    soonEyebrow: string;
    soonTitle: string;
    soonDescription: string;
    featuredEyebrow: string;
    featuredTitle: string;
    featuredDescription: string;
    backupEyebrow: string;
    backupTitle: string;
    backupDescription: string;
  };
  categoryCard: {
    readyStatus: string;
    soonStatus: string;
    readyAction: string;
    readyNote: string;
    soonAction: string;
    soonNote: string;
  };
  skillCard: {
    featured: string;
    backup: string;
    openLink: string;
    overview: string;
    useCases: string;
    audience: string;
    reason: string;
  };
  categories: Record<string, CategoryCopy>;
  skills: Record<string, SkillCopy>;
};

type LanguageContextValue = {
  language: Language;
  dictionary: Dictionary;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
  getCategoryCopy: (
    slug: string,
    fallback?: Partial<CategoryCopy>,
  ) => CategoryCopy;
  getSkillCopy: (key: string, fallback?: Partial<SkillCopy>) => SkillCopy;
};

const LANGUAGE_STORAGE_KEY = "skills-debox-language";

const enSkillCopies = {
  "https://clawhub.ai/gpyAngyoujun/multi-search-engine": {
    name: "Multi Search Engine",
    tags: [
      "Meta Search",
      "Multi-Engine",
      "No API Key",
      "Information Retrieval",
      "Research Support",
    ],
    summary:
      "Aggregates multiple search engines and supports advanced operators for fast multi-source research.",
    useCases:
      "Looking up references, finding PDFs and webpages, searching across languages, and scoping a topic quickly.",
    audience:
      "General users, researchers, content operators, and developers.",
    reason:
      "Broad coverage makes it a strong entry-point skill for research workflows.",
  },
  "https://clawhub.ai/kesslerio/academic-deep-research": {
    name: "Academic Deep Research",
    tags: [
      "Deep Research",
      "Rigorous Methodology",
      "APA Citations",
      "Literature Review",
      "Competitive Research",
    ],
    summary:
      "Uses multi-round research and structured citations to complete more rigorous in-depth research tasks.",
    useCases:
      "Deep topic research, competitor analysis, literature reviews, and formal research reports.",
    audience: "Researchers, analysts, and content strategists.",
    reason:
      "Strong methodology makes it a representative choice for deeper research work.",
  },
  "https://clawhub.ai/steipete/summarize": {
    name: "Summarize",
    tags: [
      "Summaries",
      "URL Digest",
      "PDF Summary",
      "Multimodal Reading",
      "Research Support",
    ],
    summary:
      "Quickly summarizes content from URLs, PDFs, images, audio, and video.",
    useCases:
      "Reading long articles, reviewing PDFs quickly, and extracting the essence of video content.",
    audience: "General users, researchers, students, and content teams.",
    reason:
      "A practical compression tool for reading and synthesis after research.",
  },
  "https://clawhub.ai/ivangdavila/market-research": {
    name: "Market Research",
    tags: [
      "Business Research",
      "Market Analysis",
      "Competitor Mapping",
      "Pricing Validation",
      "Demand Validation",
    ],
    summary:
      "A research-oriented skill for market sizing, competitor analysis, pricing, and demand validation.",
    useCases:
      "Category research, competitor analysis, and product positioning decisions.",
    audience: "Product managers, operators, founders, and research users.",
    reason: "A strong fit for business and market research workflows.",
  },
  "https://clawhub.ai/ytthuan/super-websearch-realtime": {
    name: "Realtime Web Search",
    tags: [
      "Realtime Search",
      "Freshness Check",
      "Lightweight Retrieval",
      "Latest Information",
      "Low Barrier",
    ],
    summary:
      "Useful for checking what has happened recently and quickly supplementing time-sensitive information.",
    useCases:
      "Checking the latest news and validating time-sensitive facts.",
    audience: "General users and research users.",
    reason:
      "Lightweight and direct, making it a practical supporting recommendation.",
  },
  "https://clawhub.ai/spclaudehome/skill-vetter": {
    name: "Skill Vetter",
    tags: [
      "Skill Audit",
      "Pre-Install Check",
      "Permission Scope",
      "Red Flags",
      "Low-Barrier Security",
    ],
    summary:
      "Checks source, permission scope, suspicious patterns, and risk level before installing a skill.",
    useCases:
      "Reviewing an unfamiliar skill before installation and auditing third-party skills.",
    audience:
      "General users, OpenClaw or ClawHub users, platform reviewers, and technical leads.",
    reason:
      "A perfect fit for a 'review before install' workflow and website positioning.",
  },
  "https://clawhub.ai/misirov/openclaw-security-audit": {
    name: "Openclaw Security Audit",
    tags: [
      "OpenClaw Audit",
      "Deployment Check",
      "Config Risk",
      "Credential Exposure",
      "Hardening Advice",
    ],
    summary:
      "Audits OpenClaw deployments for configuration mistakes, exposed surfaces, and leakage risks.",
    useCases:
      "Post-deployment security review and hardening for self-hosted setups.",
    audience: "Self-hosted OpenClaw users, administrators, and technical teams.",
    reason:
      "Highly aligned with the OpenClaw ecosystem and real deployment scenarios.",
  },
  "https://clawhub.ai/jgarrison929/security-auditor": {
    name: "Security Auditor",
    tags: [
      "Code Security",
      "OWASP",
      "Authentication",
      "Input Validation",
      "Web Security",
    ],
    summary: "Reviews code and web applications for common security issues.",
    useCases: "Code reviews and security checks before launch.",
    audience: "Developers, security engineers, and technical leads.",
    reason: "A better fit for developer-oriented code security checks.",
  },
  "https://clawhub.ai/gitgoodordietrying/security-audit-toolkit": {
    name: "Security Audit Toolkit",
    tags: [
      "Dependency Scan",
      "Secret Detection",
      "TLS Check",
      "File Permissions",
      "Infra Audit",
    ],
    summary:
      "Checks dependency vulnerabilities, hardcoded secrets, SSL/TLS issues, and permission problems.",
    useCases:
      "Auditing repositories, checking for secrets, and running infrastructure security reviews.",
    audience: "Developers, DevOps engineers, and security engineers.",
    reason:
      "Comprehensive coverage, though the usage threshold is slightly higher.",
  },
  "https://clawhub.ai/ansengu11/openclaw-safe-guard": {
    name: "Lobster Security Guard",
    tags: [
      "Chinese Security Audit",
      "Static Skill Scan",
      "Permission Risk",
      "Dependency Risk",
      "GitHub Review",
    ],
    summary:
      "Runs static security scans on skills and outputs a Chinese risk report.",
    useCases:
      "Reviewing local skills and scanning third-party skills before use.",
    audience: "Chinese-speaking users and OpenClaw users.",
    reason:
      "Especially useful for Chinese-speaking users who want clearer security reporting.",
  },
  "https://clawhub.ai/azep-ninja/quickintel-scan": {
    name: "Quick Intel Token Security Scanner",
    tags: [
      "Web3 Security",
      "Token Risk",
      "Honeypot Detection",
      "Contract Scan",
      "Pre-Buy Check",
    ],
    summary:
      "Checks whether a token has honeypot behavior, scam patterns, or other smart-contract risks.",
    useCases:
      "Scanning a token before buying and reviewing suspicious projects.",
    audience: "Web3 users, traders, and on-chain researchers.",
    reason:
      "A useful complementary pick for Web3-specific risk assessment.",
  },
  "https://clawhub.ai/Veeramanikandanr48/market-environment-analysis": {
    name: "Market Environment Analysis",
    tags: [
      "Macro Markets",
      "Global Markets",
      "Risk Appetite",
      "Market Overview",
      "Economic Indicators",
    ],
    summary:
      "Summarizes global indices, FX, commodities, Treasury yields, and VIX to deliver a market environment readout.",
    useCases:
      "Writing market overviews, judging risk appetite, and adding macro context to analysis.",
    audience: "Researchers, content teams, and market watchers.",
    reason:
      "A strong representative tool for macro market information needs.",
  },
  "https://clawhub.ai/deanpress/polymarket-odds": {
    name: "Polymarket Odds",
    tags: [
      "Prediction Markets",
      "Event Probability",
      "Polymarket",
      "Market Expectations",
      "Realtime Odds",
    ],
    summary:
      "Looks up prediction market odds, prices, and events to quickly see how likely the market thinks something is.",
    useCases:
      "Checking probabilities for political, sports, and crypto events and doing event-driven analysis.",
    audience:
      "General users, research users, Web3 users, and content operators.",
    reason:
      "A good flagship pick for understanding event expectations.",
  },
  "https://clawhub.ai/AlphaFactor/crypto": {
    name: "Crypto Market",
    tags: [
      "Crypto Prices",
      "Multi-Exchange",
      "Price Alerts",
      "CCXT",
      "Realtime Monitoring",
    ],
    summary:
      "Fetches crypto prices, candlesticks, and order books across exchanges and supports alerts.",
    useCases:
      "Watching BTC or ETH prices in real time and comparing across exchanges.",
    audience: "Web3 users, traders, and research users.",
    reason:
      "A very practical choice for users who need live crypto market coverage.",
  },
  "https://clawhub.ai/fpsjago/trading-research": {
    name: "Trading Research",
    tags: [
      "Binance",
      "Technical Analysis",
      "DCA",
      "Position Management",
      "Market Scanning",
    ],
    summary:
      "Uses public Binance data for technical analysis, DCA planning, and market scanning.",
    useCases:
      "Reviewing prices and candlesticks, planning DCA entries, and sizing positions.",
    audience: "Web3 users, trading researchers, and advanced users.",
    reason:
      "A well-scoped option for research-oriented trading analysis.",
  },
  "https://clawhub.ai/desk3/cryptocurrency-market-live-briefing": {
    name: "Cryptocurrency Market Live Briefing",
    tags: [
      "Market Briefing",
      "BTC/ETH/SOL",
      "Sentiment Indicators",
      "Industry News",
      "Quick Updates",
    ],
    summary:
      "Creates a crypto market briefing that combines prices, sentiment, technical signals, policy updates, and industry news.",
    useCases:
      "Producing morning or evening summaries and checking major coins and sentiment quickly.",
    audience: "Content operators, research users, and general users.",
    reason:
      "A strong pick when you want a more finished market briefing output.",
  },
  "https://clawhub.ai/dannyshmueli/polymarket-api": {
    name: "Polymarket API",
    tags: [
      "Polymarket",
      "Read-Only Query",
      "Prediction Markets",
      "Event Probability",
      "Lightweight API",
    ],
    summary: "Provides read-only queries for Polymarket markets and events.",
    useCases: "Fetching prediction market events and odds data.",
    audience: "Research users, Web3 users, and content teams.",
    reason:
      "Overlaps with the main recommendation but works well as a supporting option.",
  },
} satisfies Record<string, SkillCopy>;

const dictionaries: Record<Language, Dictionary> = {
  en: {
    header: {
      home: "Home",
      categories: "Categories",
      about: "About / Methodology",
      toggle: "EN / 中文",
    },
    footer: {
      tagline:
        "Clawhub Skills Guide - Discover AI tools that are genuinely useful.",
    },
    home: {
      badge: "Clawhub Skills Guide",
      title:
        "Focus on high-frequency scenarios and discover AI tools that truly work",
      subtitle:
        "Exploring a large collection of Clawhub Skills can take more effort than using them. We surface the most approachable and immediately useful tools, so you can skip blind trial and error and get productive faster.",
      primaryCta: "Browse featured categories",
      secondaryCta: "How we curate",
      categoryEyebrow: "Categories",
      categoryTitle: "Explore tool scenarios",
      categoryDescription:
        "Organized by real workflows to cover the full flow of everyday work.",
      methodologyEyebrow: "Methodology",
      methodologyTitle: "Curated for clarity, not for volume",
      methodologyDescription:
        "The goal is not to collect everything, but to offer a high-signal entry point that helps you quickly identify the right tool for the job.",
      logicEyebrow: "Selection Logic",
      logicTitle: "Scenario-first, practical by default",
      logicDescription:
        "We prioritize tools with clear boundaries and strong workflow fit, so you can understand who they are for and when to use them at a glance.",
      boundaryEyebrow: "Coverage",
      boundaryTitle: "Quality first, expanding steadily",
      boundaryDescription:
        "The current release focuses on the most practical and frequently needed scenarios. More categories will be added once they meet the same quality bar.",
    },
    about: {
      eyebrow: "About / Methodology",
      title:
        "Cut through information overload and make AI tool discovery easier",
      description:
        "We focus on identifying high-quality AI tools for high-frequency workflows. By curating and structuring a large tool landscape around real application scenarios, we help you reduce trial and error and improve productivity faster.",
      backHome: "Back to home",
      viewCategories: "View categories",
      sections: [
        {
          title: "Why this guide exists",
          content:
            "Clawhub offers a rich ecosystem of skills, but most users struggle with one thing first: there are simply too many options. This guide acts as a practical filter to help you find the tools worth trying first.",
        },
        {
          title: "How categories are defined",
          content:
            "Categories are organized around user goals and real-world tasks. What matters here is the workflow a skill can improve, not the implementation details behind it.",
        },
        {
          title: "How skills are selected",
          content:
            "We prioritize skills that are easy to understand, clearly scoped, and representative of a meaningful workflow. Each recommendation is presented with practical context so you can judge fit quickly.",
        },
        {
          title: "Why only three categories are live now",
          content:
            "The first release focuses on Research, Security, and Market Intelligence because they map to some of the most urgent everyday needs. The goal is to make these categories genuinely useful before expanding further.",
        },
        {
          title: "How this guide will grow",
          content:
            "This is a living guide, not a static list. As the Clawhub ecosystem evolves, we will continue adding strong new skills and gradually complete the remaining categories.",
        },
      ],
    },
    categoryPage: {
      backHome: "Back to home",
      eyebrow: "Category",
      readyStatus: "Curated",
      soonStatus: "Planned",
      soonEyebrow: "Planned",
      soonTitle: "This category is being curated",
      soonDescription:
        "High-quality tools for this category are being tested and reviewed. We are working to bring together the most effective productivity stack for this workflow.",
      featuredEyebrow: "Featured",
      featuredTitle: "Start with the most representative picks",
      featuredDescription:
        "These featured skills are the best place to begin when you want a quick understanding of what this category is best at.",
      backupEyebrow: "More Picks",
      backupTitle: "Broader coverage for related needs",
      backupDescription:
        "These additional recommendations help you explore adjacent use cases once you have the main direction in mind.",
    },
    categoryCard: {
      readyStatus: "Ready",
      soonStatus: "Planned",
      readyAction: "Open category",
      readyNote: "Explore curated picks",
      soonAction: "In progress",
      soonNote: "More recommendations coming",
    },
    skillCard: {
      featured: "Featured",
      backup: "More picks",
      openLink: "Open original link",
      overview: "Overview",
      useCases: "Use cases",
      audience: "Audience",
      reason: "Why it stands out",
    },
    categories: {
      research: {
        name: "Research & Discovery",
        description:
          "Covers multi-source search, deep research, summarization, and market research to support the full path from finding information to forming conclusions.",
      },
      "content-creation-translation": {
        name: "Content Creation & Translation",
        description:
          "Focused on writing, rewriting, translation, and content organization, with curated picks for everyday users coming next.",
      },
      "productivity-automation": {
        name: "Productivity & Automation",
        description:
          "Covers everyday office workflows, task operations, repetitive work automation, and practical efficiency tools.",
      },
      "data-spreadsheets": {
        name: "Data Processing & Spreadsheets",
        description:
          "Designed for spreadsheet workflows, data cleanup, analysis, summarization, and structured outputs.",
      },
      "development-programming": {
        name: "Development & Programming",
        description:
          "Focused on coding workflows such as generation, debugging, refactoring, documentation understanding, and developer productivity.",
      },
      "websites-frontend": {
        name: "Websites & Frontend",
        description:
          "Covers web building, frontend implementation, component work, and page optimization scenarios.",
      },
      "devops-cloud": {
        name: "DevOps, Deployment & Cloud",
        description:
          "Built for deployment, environment setup, cloud operations, and keeping services stable after launch.",
      },
      "security-risk": {
        name: "Security & Risk",
        description:
          "Includes installation checks, configuration review, code security, deployment security, and on-chain risk detection.",
      },
      "market-intelligence": {
        name: "Market Intelligence",
        description:
          "Focused on macro markets, prediction markets, and crypto market data to help you understand context and event expectations quickly.",
      },
      "image-video-generation": {
        name: "Image & Video Generation",
        description:
          "Focused on image generation, video generation, creative assets, and visual content workflows.",
      },
      "system-cli": {
        name: "System Enhancement & CLI",
        description:
          "Suitable for local system enhancement, command-line collaboration, terminal assistance, and environment management.",
      },
      "ai-workflows-agents": {
        name: "AI Workflows & Multi-Agent",
        description:
          "Focused on multi-agent collaboration, task orchestration, workflow decomposition, and automated execution.",
      },
    },
    skills: enSkillCopies,
  },
  zh: {
    header: {
      home: "首页",
      categories: "分类导航",
      about: "关于 / 方法",
      toggle: "EN / 中文",
    },
    footer: {
      tagline: "Clawhub Skills Guide - 帮你发现真正好用的 AI 工具。",
    },
    home: {
      badge: "Clawhub Skills Guide",
      title: "专注高频场景，发现真正好用的 AI 工具",
      subtitle:
        "面对海量的 Clawhub Skills，探索成本往往很高。我们为你筛选出最容易上手、最能直接解决问题的优质工具，帮你省去盲目试错的时间，开箱即用。",
      primaryCta: "查看精选分类",
      secondaryCta: "了解筛选方法",
      categoryEyebrow: "分类导航",
      categoryTitle: "探索工具场景",
      categoryDescription: "按实际工作流划分，覆盖日常工作全流程。",
      methodologyEyebrow: "方法说明",
      methodologyTitle: "核心理念：做减法，降门槛",
      methodologyDescription:
        "重点不是盲目追求数量，而是提供一个高信噪比的精选入口。我们先把各个方向最有代表性的 skill 挑出来，帮你快速定位需要的工具。",
      logicEyebrow: "筛选逻辑",
      logicTitle: "筛选标准：场景导向，即开即用",
      logicDescription:
        "优先筛选边界清晰、能代表特定工作流方向的工具。剥离冗长的技术背景，直接提供适用人群与典型场景，一秒判断是否契合需求。",
      boundaryEyebrow: "当前边界",
      boundaryTitle: "宁缺毋滥，持续更新",
      boundaryDescription:
        "当前版本优先覆盖需求最明确的核心场景。为了保证推荐质量，我们会花更多时间在工具的测试与验证上，并逐步开放更多分类。",
    },
    about: {
      eyebrow: "About / Methodology",
      title: "拒绝信息过载，重塑团队的 AI 工具探索体验",
      description:
        "我们专注提炼高频工作流中的优质 AI 工具。通过按实际应用场景对海量工具进行严选与结构化整理，帮你降低试错成本，即刻提升生产力。",
      backHome: "返回首页",
      viewCategories: "查看分类结构",
      sections: [
        {
          title: "初衷：解决“不知从何试起”的痛点",
          content:
            "Clawhub 上的 skills 非常丰富，但普通用户最常见的困扰是“太多了，不知道先用哪个”。这个网站的目标是作为你的“前置过滤器”，把真正值得一试的工具提炼出来，降低探索门槛。",
        },
        {
          title: "分类：以“任务目标”为原点",
          content:
            "我们完全按照用户的“任务目标”来划分。我们关心的是一个 skill 能帮你解决什么实际问题、适合什么工作场景，而不是它背后调用了什么接口。一切以“好用、能用”为先。",
        },
        {
          title: "skill 的筛选标准是什么",
          content:
            "第一版优先选择用途清晰、边界明确、适合快速理解的 skill。除了功能本身，我们还会看它是否能代表一个方向、是否适合作为入口、是否有明确使用场景，以及是否值得推荐给非重度技术用户。",
        },
        {
          title: "演进：从最高频的场景切入",
          content:
            "首批上线的“信息检索、安全风控、市场信息”是大家日常需求最迫切的三个方向。我们希望先把这部分内容做精做透，确保每一条推荐都有极高的参考价值。",
        },
        {
          title: "后续会持续更新",
          content:
            "精选导航不是一个静态列表，而是一个会随着 Clawhub 生态共同生长的活文档。我们会持续发掘新的优质 skill，并逐步补齐余下的分类，欢迎保持关注。",
        },
      ],
    },
    categoryPage: {
      backHome: "返回首页",
      eyebrow: "分类页面",
      readyStatus: "已完成整理",
      soonStatus: "规划中",
      soonEyebrow: "规划中",
      soonTitle: "该分类正在整理中",
      soonDescription:
        "该分类的优质工具正在紧张测试与严格筛选中。我们希望为你呈现最有效率的生产力组合，敬请期待后续更新。",
      featuredEyebrow: "主推荐",
      featuredTitle: "适合先看的代表性 skill",
      featuredDescription:
        "主推荐优先覆盖这个分类里最容易理解、最值得先试、最能代表方向的 skill，适合第一次建立分类印象时直接查看。",
      backupEyebrow: "更多推荐",
      backupTitle: "用来补充视角与场景覆盖",
      backupDescription:
        "这些 skill 用来扩展同一分类下的不同使用方向，帮助你根据具体任务继续细分选择，而不是只停留在一个代表性工具上。",
    },
    categoryCard: {
      readyStatus: "已完成",
      soonStatus: "规划中",
      readyAction: "进入分类页",
      readyNote: "可查看精选结果",
      soonAction: "整理中",
      soonNote: "后续补充推荐",
    },
    skillCard: {
      featured: "主推荐",
      backup: "更多推荐",
      openLink: "打开原始链接",
      overview: "功能概览",
      useCases: "典型场景",
      audience: "适用人群",
      reason: "推荐理由",
    },
    categories: {
      research: {
        name: "信息检索与研究",
        description:
          "覆盖多来源检索、深度研究、摘要归纳与市场研究，适合从找资料到输出结论的完整流程。",
      },
      "content-creation-translation": {
        name: "内容创作与翻译",
        description:
          "面向写作、改写、翻译与内容整理的 skill 分类，后续会补充适合普通用户的精选结果。",
      },
      "productivity-automation": {
        name: "办公效率与自动化",
        description: "关注日常办公、任务流转、重复工作自动化与效率工具整合。",
      },
      "data-spreadsheets": {
        name: "数据处理与表格",
        description: "聚焦表格处理、数据清洗、分析归纳与结构化输出场景。",
      },
      "development-programming": {
        name: "开发编程",
        description: "面向代码生成、调试、重构、文档理解与开发工作流的 skill 分类。",
      },
      "websites-frontend": {
        name: "网站与前端",
        description: "围绕网页制作、前端开发、组件搭建与页面优化的 skill 分类。",
      },
      "devops-cloud": {
        name: "运维部署与云服务",
        description: "适合部署上线、环境配置、云资源运维与服务稳定性相关场景。",
      },
      "security-risk": {
        name: "安全与风控",
        description: "覆盖安装前审计、配置检查、代码安全、部署安全与链上风险识别。",
      },
      "market-intelligence": {
        name: "行情与市场信息",
        description: "围绕宏观市场、预测市场与加密行情，帮助快速掌握市场环境与事件预期。",
      },
      "image-video-generation": {
        name: "图片与视频生成",
        description: "聚焦图像生成、视频生成、素材编辑与视觉内容工作流。",
      },
      "system-cli": {
        name: "系统增强与命令行",
        description: "适合本地系统增强、命令行协作、终端辅助与环境管理等场景。",
      },
      "ai-workflows-agents": {
        name: "AI 工作流与多 Agent",
        description: "关注多 Agent 协作、任务编排、工作流拆分与自动执行能力。",
      },
    },
    skills: {},
  },
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLanguage === "en" || storedLanguage === "zh") {
      setLanguageState(storedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const dictionary = dictionaries[language];

    return {
      language,
      dictionary,
      toggleLanguage: () =>
        setLanguageState((current) => (current === "en" ? "zh" : "en")),
      setLanguage: (nextLanguage) => setLanguageState(nextLanguage),
      getCategoryCopy: (slug, fallback = {}) => ({
        name: dictionary.categories[slug]?.name ?? fallback.name ?? slug,
        description:
          dictionary.categories[slug]?.description ?? fallback.description ?? "",
      }),
      getSkillCopy: (key, fallback = {}) => ({
        name: dictionary.skills[key]?.name ?? fallback.name ?? "",
        tags: dictionary.skills[key]?.tags ?? fallback.tags ?? [],
        summary: dictionary.skills[key]?.summary ?? fallback.summary ?? "",
        useCases: dictionary.skills[key]?.useCases ?? fallback.useCases ?? "",
        audience: dictionary.skills[key]?.audience ?? fallback.audience ?? "",
        reason: dictionary.skills[key]?.reason ?? fallback.reason ?? "",
      }),
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
