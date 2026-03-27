export type CategoryStatus = "ready" | "soon";

export interface Category {
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
}

export const categories: Category[] = [
  {
    name: "信息检索与研究",
    slug: "research",
    description: "覆盖多来源检索、深度研究、摘要归纳与市场研究，适合从找资料到输出结论的完整流程。",
    status: "ready",
  },
  {
    name: "内容创作与翻译",
    slug: "content-creation-translation",
    description: "面向写作、改写、翻译与内容整理的 skill 分类，后续会补充适合普通用户的精选结果。",
    status: "soon",
  },
  {
    name: "办公效率与自动化",
    slug: "productivity-automation",
    description: "关注日常办公、任务流转、重复工作自动化与效率工具整合。",
    status: "soon",
  },
  {
    name: "数据处理与表格",
    slug: "data-spreadsheets",
    description: "聚焦表格处理、数据清洗、分析归纳与结构化输出场景。",
    status: "soon",
  },
  {
    name: "开发编程",
    slug: "development-programming",
    description: "面向代码生成、调试、重构、文档理解与开发工作流的 skill 分类。",
    status: "soon",
  },
  {
    name: "网站与前端",
    slug: "websites-frontend",
    description: "围绕网页制作、前端开发、组件搭建与页面优化的 skill 分类。",
    status: "soon",
  },
  {
    name: "运维部署与云服务",
    slug: "devops-cloud",
    description: "适合部署上线、环境配置、云资源运维与服务稳定性相关场景。",
    status: "soon",
  },
  {
    name: "安全与风控",
    slug: "security-risk",
    description: "覆盖安装前审计、配置检查、代码安全、部署安全与链上风险识别。",
    status: "ready",
  },
  {
    name: "行情与市场信息",
    slug: "market-intelligence",
    description: "围绕宏观市场、预测市场与加密行情，帮助快速掌握市场环境与事件预期。",
    status: "ready",
  },
  {
    name: "图片与视频生成",
    slug: "image-video-generation",
    description: "聚焦图像生成、视频生成、素材编辑与视觉内容工作流。",
    status: "soon",
  },
  {
    name: "系统增强与命令行",
    slug: "system-cli",
    description: "适合本地系统增强、命令行协作、终端辅助与环境管理等场景。",
    status: "soon",
  },
  {
    name: "AI 工作流与多 Agent",
    slug: "ai-workflows-agents",
    description: "关注多 Agent 协作、任务编排、工作流拆分与自动执行能力。",
    status: "soon",
  },
];

export const completedCategoriesCount = categories.filter(
  (category) => category.status === "ready",
).length;

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
