export type SkillTier = "featured" | "backup";
export type SkillLifecycleStatus = "active" | "archived";

export interface Skill {
  name: string;
  categorySlug: string;
  tier: SkillTier;
  status?: SkillLifecycleStatus;
  tags: string[];
  summary: string;
  useCases: string;
  audience: string;
  reason: string;
  url: string;
  publishedAt?: string;
  contributor?: string;
}

export const skills: Skill[] = [
  {
    name: "Multi Search Engine",
    categorySlug: "research",
    tier: "featured",
    status: "active",
    tags: ["聚合搜索", "多搜索引擎", "无 API Key", "资料检索", "研究辅助"],
    summary: "聚合多个搜索引擎，支持高级搜索操作，适合快速做多来源资料检索。",
    useCases: "查资料、找 PDF/网页、跨中英文搜索、做主题摸排。",
    audience: "普通用户、研究型用户、内容运营、开发者。",
    reason: "覆盖面广，适合做资料入口型 skill。",
    url: "https://clawhub.ai/gpyAngyoujun/multi-search-engine",
  },
  {
    name: "Academic Deep Research",
    categorySlug: "research",
    tier: "featured",
    status: "active",
    tags: ["深度研究", "严谨方法论", "APA 引用", "文献综述", "竞品研究"],
    summary: "通过多轮研究和规范引用，完成更严谨的深度研究任务。",
    useCases: "深度专题研究、竞品分析、文献综述、研究报告。",
    audience: "研究型用户、分析师、内容策划。",
    reason: "方法论完整，适合作为深度研究代表。",
    url: "https://clawhub.ai/kesslerio/academic-deep-research",
  },
  {
    name: "Summarize",
    categorySlug: "research",
    tier: "backup",
    status: "active",
    tags: ["摘要生成", "URL 摘要", "PDF 摘要", "多模态阅读", "研究辅助"],
    summary: "对 URL、PDF、图片、音频和视频内容做快速摘要。",
    useCases: "看长文章、快速读 PDF、整理视频内容。",
    audience: "普通用户、研究型用户、学生、内容人员。",
    reason: "适合作为研究后阅读压缩工具。",
    url: "https://clawhub.ai/steipete/summarize",
  },
  {
    name: "Market Research",
    categorySlug: "research",
    tier: "backup",
    status: "active",
    tags: ["商业研究", "市场分析", "竞品映射", "定价验证", "需求验证"],
    summary: "面向市场规模、竞品、价格与需求验证的研究型 skill。",
    useCases: "赛道研究、竞品分析、产品定位判断。",
    audience: "产品经理、运营、创业者、研究型用户。",
    reason: "更偏商业研究方向。",
    url: "https://clawhub.ai/ivangdavila/market-research",
  },
  {
    name: "Realtime Web Search",
    categorySlug: "research",
    tier: "backup",
    status: "archived",
    tags: ["实时搜索", "查新", "轻量检索", "最新信息", "低门槛"],
    summary: "适合查最近发生的事，快速补充实时资料。",
    useCases: "查最新消息、验证时效性信息。",
    audience: "普通用户、研究型用户。",
    reason: "轻量、直接，适合补充位。",
    url: "https://clawhub.ai/ytthuan/super-websearch-realtime",
  },
  {
    name: "Skill Vetter",
    categorySlug: "security-risk",
    tier: "featured",
    status: "active",
    tags: ["skill 审计", "安装前检查", "权限范围", "红旗检测", "低门槛安全"],
    summary: "在安装 skill 前检查来源、权限范围、可疑模式和风险等级。",
    useCases: "安装陌生 skill 前做安全检查、审核第三方 skill。",
    audience: "普通用户、OpenClaw/ClawHub 用户、平台审核人员、技术负责人。",
    reason: "非常适合“先审再装”的网站定位。",
    url: "https://clawhub.ai/spclaudehome/skill-vetter",
  },
  {
    name: "Openclaw Security Audit",
    categorySlug: "security-risk",
    tier: "featured",
    status: "active",
    tags: ["OpenClaw 安全审计", "部署检查", "配置风险", "凭据泄露", "硬化建议"],
    summary: "审计 OpenClaw 部署中的配置错误、暴露面和泄露风险。",
    useCases: "自部署后做安全检查、做 hardening。",
    audience: "OpenClaw 自部署用户、管理员、技术同学。",
    reason: "很贴近 OpenClaw 生态本身。",
    url: "https://clawhub.ai/misirov/openclaw-security-audit",
  },
  {
    name: "Security Auditor",
    categorySlug: "security-risk",
    tier: "backup",
    status: "active",
    tags: ["代码安全", "OWASP", "认证授权", "输入校验", "Web 安全"],
    summary: "审查代码和 Web 应用中的常见安全问题。",
    useCases: "代码 review、上线前安全检查。",
    audience: "开发者、安全工程师、技术负责人。",
    reason: "更偏开发者代码安全。",
    url: "https://clawhub.ai/jgarrison929/security-auditor",
  },
  {
    name: "Security Audit Toolkit",
    categorySlug: "security-risk",
    tier: "backup",
    status: "active",
    tags: ["依赖扫描", "密钥检测", "TLS 检查", "文件权限", "基础设施审计"],
    summary: "检查依赖漏洞、硬编码密钥、SSL/TLS 和权限问题。",
    useCases: "审代码仓库、查 secret、做基础设施安全体检。",
    audience: "开发者、运维、安全工程师。",
    reason: "覆盖面全，但使用门槛稍高。",
    url: "https://clawhub.ai/gitgoodordietrying/security-audit-toolkit",
  },
  {
    name: "龙虾安全卫士",
    categorySlug: "security-risk",
    tier: "backup",
    status: "archived",
    tags: ["中文安全审计", "技能静态扫描", "权限风险", "依赖风险", "GitHub 审核"],
    summary: "对 skills 做静态安全扫描并输出中文风险报告。",
    useCases: "审核本地 skills、扫描第三方 skill。",
    audience: "中文用户、OpenClaw 用户。",
    reason: "很适合中文用户场景。",
    url: "https://clawhub.ai/ansengu11/openclaw-safe-guard",
  },
  {
    name: "Quick Intel Token Security Scanner",
    categorySlug: "security-risk",
    tier: "backup",
    status: "active",
    tags: ["Web3 安全", "代币风险", "honeypot 检测", "合约扫描", "买币前检查"],
    summary: "检查代币是否有 honeypot、骗局或其他合约风险。",
    useCases: "买 token 前先扫一下、检查可疑项目。",
    audience: "Web3 用户、交易用户、链上研究者。",
    reason: "适合作为 Web3 风险子方向补位。",
    url: "https://clawhub.ai/azep-ninja/quickintel-scan",
  },
  {
    name: "Market Environment Analysis",
    categorySlug: "market-intelligence",
    tier: "featured",
    status: "active",
    tags: ["宏观市场", "全球市场", "风险偏好", "市场综述", "经济指标"],
    summary: "汇总全球股指、外汇、商品、美债收益率和 VIX，并输出市场环境分析。",
    useCases: "写市场综述、判断市场风险偏好、做宏观背景分析。",
    audience: "研究型用户、内容人员、交易关注者。",
    reason: "适合作为宏观市场信息代表。",
    url: "https://clawhub.ai/Veeramanikandanr48/market-environment-analysis",
  },
  {
    name: "Polymarket Odds",
    categorySlug: "market-intelligence",
    tier: "featured",
    status: "active",
    tags: ["预测市场", "事件概率", "Polymarket", "市场预期", "实时赔率"],
    summary: "查询预测市场的赔率、价格和事件，快速看市场认为某件事发生的概率。",
    useCases: "看政治/体育/加密事件概率，做事件驱动型分析。",
    audience: "普通用户、研究型用户、Web3 用户、内容运营。",
    reason: "适合作为事件预期代表。",
    url: "https://clawhub.ai/deanpress/polymarket-odds",
  },
  {
    name: "Crypto Market",
    categorySlug: "market-intelligence",
    tier: "backup",
    status: "active",
    tags: ["加密行情", "多交易所", "价格提醒", "CCXT", "实时监控"],
    summary: "获取多交易所加密价格、K 线和盘口，并支持价格提醒。",
    useCases: "看 BTC/ETH 实时价格、跨交易所比价。",
    audience: "Web3 用户、交易用户、研究型用户。",
    reason: "很适合作为加密行情工具。",
    url: "https://clawhub.ai/AlphaFactor/crypto",
  },
  {
    name: "Trading Research",
    categorySlug: "market-intelligence",
    tier: "backup",
    status: "active",
    tags: ["Binance", "技术分析", "DCA", "仓位管理", "市场扫描"],
    summary: "基于 Binance 公共数据做技术分析、定投规划和市场扫描。",
    useCases: "看币价与 K 线、做 DCA 计划、算仓位。",
    audience: "Web3 用户、交易研究用户、进阶用户。",
    reason: "边界清楚，适合研究分析。",
    url: "https://clawhub.ai/fpsjago/trading-research",
  },
  {
    name: "Cryptocurrency Market Live Briefing",
    categorySlug: "market-intelligence",
    tier: "backup",
    status: "active",
    tags: ["市场简报", "BTC/ETH/SOL", "情绪指标", "行业新闻", "快讯"],
    summary: "输出包含价格、情绪、技术指标、政策和行业新闻的加密市场简报。",
    useCases: "做晨报/晚报、快速看主流币和市场情绪。",
    audience: "内容运营、研究型用户、普通用户。",
    reason: "很适合做成品简报展示。",
    url: "https://clawhub.ai/desk3/cryptocurrency-market-live-briefing",
  },
  {
    name: "Polymarket API",
    categorySlug: "market-intelligence",
    tier: "backup",
    status: "archived",
    tags: ["Polymarket", "只读查询", "预测市场", "事件概率", "轻量接口"],
    summary: "只读查询 Polymarket 的 markets 和 events。",
    useCases: "查询预测市场事件和赔率数据。",
    audience: "研究型用户、Web3 用户、内容人员。",
    reason: "和主推荐有重合，但可作为补充位。",
    url: "https://clawhub.ai/dannyshmueli/polymarket-api",
  },
];

export function getSkillsByCategory(categorySlug: string) {
  return skills.filter((skill) => skill.categorySlug === categorySlug);
}

function isActiveSkill(skill: Skill) {
  return skill.status !== "archived";
}

export function getActiveSkillsByCategory(categorySlug: string) {
  return skills.filter(
    (skill) => skill.categorySlug === categorySlug && isActiveSkill(skill),
  );
}

export function hasActiveSkillsInCategory(categorySlug: string) {
  return getActiveSkillsByCategory(categorySlug).length > 0;
}

export function getFeaturedSkills(categorySlug: string) {
  return skills.filter(
    (skill) =>
      skill.categorySlug === categorySlug &&
      skill.tier === "featured" &&
      isActiveSkill(skill),
  );
}

export function getBackupSkills(categorySlug: string) {
  return skills.filter(
    (skill) =>
      skill.categorySlug === categorySlug &&
      skill.tier === "backup" &&
      isActiveSkill(skill),
  );
}

export function getArchivedSkills(categorySlug: string) {
  return skills.filter(
    (skill) => skill.categorySlug === categorySlug && skill.status === "archived",
  );
}
