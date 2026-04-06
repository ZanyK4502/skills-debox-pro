export const PRACTICE_IMAGE_MAX_SIZE_BYTES = 2 * 1024 * 1024;

export const defaultPracticeTemplateByLanguage = {
  en: `
<h2>Best use cases</h2>
<ul>
  <li>Describe when this skill works best.</li>
</ul>
<h2>Steps</h2>
<ol>
  <li>Explain the first step.</li>
  <li>Explain the second step.</li>
</ol>
<h2>Notes</h2>
<ul>
  <li>Add practical tips, caveats, or common mistakes to avoid.</li>
</ul>
`.trim(),
  zh: `
<h2>适用场景</h2>
<ul>
  <li>说明这个 skill 最适合在什么情况下使用。</li>
</ul>
<h2>操作步骤</h2>
<ol>
  <li>写清第一步该怎么做。</li>
  <li>写清第二步该怎么做。</li>
</ol>
<h2>注意事项</h2>
<ul>
  <li>补充实践建议、常见坑或使用限制。</li>
</ul>
`.trim(),
} as const;

export function getPracticeTemplateFlagKey(slug: string) {
  return `practice-template-initialized:${slug}`;
}
