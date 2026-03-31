import { ArtifactType } from "@/db/schema";

export function autoTag(content: string, type: ArtifactType): string[] {
  const tags = new Set<string>();

  // Type-based tags
  const typeTags: Record<ArtifactType, string[]> = {
    html: ["html", "web", "frontend"],
    react: ["react", "component", "jsx", "frontend", "web"],
    svg: ["svg", "graphics", "vector"],
    mermaid: ["mermaid", "diagram", "chart", "visualization"],
    code: ["code", "snippet"],
    markdown: ["markdown", "md", "documentation"],
    json: ["json", "data", "config"],
    css: ["css", "styling", "design"],
    text: ["text", "plain"],
    python: ["python", "script"],
    typescript: ["typescript", "ts"],
    javascript: ["javascript", "js"],
    shell: ["shell", "bash", "script", "terminal"],
  };

  const typeSpecificTags = typeTags[type] || [];
  typeSpecificTags.forEach((tag) => tags.add(tag));

  // Framework/language detection from content patterns
  const patterns = [
    { pattern: /import\s+React|from\s+['"]react['"]|jsx/, tags: ["react"] },
    { pattern: /import\s+.*from\s+['"]next['"]|next\//, tags: ["nextjs"] },
    { pattern: /import\s+.*from\s+['"]vue['"]/, tags: ["vue"] },
    { pattern: /import\s+.*from\s+['"]svelte['"]/, tags: ["svelte"] },
    { pattern: /import\s+.*from\s+['"]@angular\//, tags: ["angular"] },
    { pattern: /import\s+.*from\s+['"]express['"]|require\(['"]express['"]\)/, tags: ["express", "backend"] },
    { pattern: /import\s+.*from\s+['"]fastify['"]/, tags: ["fastify", "backend"] },
    { pattern: /import\s+.*from\s+['"]@nestjs\//, tags: ["nestjs", "backend"] },
    { pattern: /import\s+.*from\s+['"]@prisma\/|prisma\./, tags: ["prisma", "orm", "database"] },
    { pattern: /import\s+.*from\s+['"]drizzle-orm['"]/, tags: ["drizzle", "orm", "database"] },
    { pattern: /SELECT\s+.*FROM|INSERT\s+INTO|UPDATE\s+.*SET|DELETE\s+FROM/i, tags: ["sql", "database"] },
    { pattern: /def\s+\w+\s*\(|class\s+\w+.*:/, tags: ["python"] },
    { pattern: /fn\s+\w+|pub\s+fn\s+\w+|impl\s+\w+/, tags: ["rust"] },
    { pattern: /package\s+main|func\s+\w+.*\{/, tags: ["go"] },
    { pattern: /use\s+\w+;|fn\s+main\(\)/, tags: ["rust"] },
    { pattern: /System\.out\.print|public\s+class\s+\w+/, tags: ["java"] },
    { pattern: /Console\.WriteLine|namespace\s+\w+/, tags: ["csharp", ".net"] },
    { pattern: /cout\s+<</, tags: ["cpp"] },
    { pattern: /printf\s*\(|#include\s+<>/, tags: ["c"] },
    { pattern: /gem\s+['"]|require\s+['"]/, tags: ["ruby"] },
    { pattern: /import\s+.*from\s+['"]php['"]|<\?php/, tags: ["php"] },
    { pattern: /import\s+.*from\s+['"]@anthropic-ai\/sdk['"]/, tags: ["anthropic", "ai", "llm"] },
    { pattern: /import\s+.*from\s+['"]openai['"]/, tags: ["openai", "ai", "llm"] },
    { pattern: /import\s+.*from\s+['"]@langchain\//, tags: ["langchain", "ai"] },
    { pattern: /dockerfile|FROM\s+\w+|docker-compose/i, tags: ["docker", "devops"] },
    { pattern: /kubernetes|k8s|deployment:\s*|service:\s*/i, tags: ["kubernetes", "k8s", "devops"] },
    { pattern: /terraform|resource\s+["\w+]+/i, tags: ["terraform", "iac", "devops"] },
    { pattern: /github:|actions:|uses:\s*/i, tags: ["github", "ci-cd", "actions"] },
    { pattern: /\.test\.|\.spec\.|describe\(|it\(|test\(/, tags: ["test", "testing"] },
    { pattern: /jest|vitest|cypress|playwright/i, tags: ["testing"] },
    { pattern: /webpack|vite|rollup|esbuild/i, tags: ["build", "tooling"] },
    { pattern: /eslint|prettier|biome/i, tags: ["linting", "tooling"] },
  ];

  patterns.forEach(({ pattern, tags: patternTags }) => {
    if (pattern.test(content)) {
      patternTags.forEach((tag) => tags.add(tag));
    }
  });

  // Purpose/keyword detection
  const keywords = [
    { keywords: ["dashboard", "chart", "graph", "visualization"], tag: "dashboard" },
    { keywords: ["api", "endpoint", "rest", "graphql"], tag: "api" },
    { keywords: ["auth", "login", "register", "jwt", "session"], tag: "authentication" },
    { keywords: ["backup", "restore", "migrate"], tag: "backup" },
    { keywords: ["cli", "command", "terminal", "prompt"], tag: "cli" },
    { keywords: ["component", "ui", "interface"], tag: "ui" },
    { keywords: ["hook", "use"], tag: "hook" },
    { keywords: ["middleware", "interceptor"], tag: "middleware" },
    { keywords: ["scheduler", "cron", "job"], tag: "scheduler" },
    { keywords: ["queue", "worker", "background"], tag: "queue" },
    { keywords: ["cache", "redis", "memcached"], tag: "cache" },
    { keywords: ["email", "mail", "notification"], tag: "email" },
    { keywords: ["payment", "stripe", "paypal"], tag: "payment" },
    { keywords: ["upload", "file", "storage", "s3"], tag: "storage" },
    { keywords: ["search", "elasticsearch", "algolia"], tag: "search" },
    { keywords: ["webhook", "event"], tag: "webhook" },
    { keywords: ["migration", "seed"], tag: "migration" },
    { keywords: ["schema", "model", "entity"], tag: "model" },
    { keywords: ["service", "controller"], tag: "service" },
    { keywords: ["utility", "helper", "lib"], tag: "utility" },
  ];

  const lowerContent = content.toLowerCase();
  keywords.forEach(({ keywords, tag }) => {
    if (keywords.some((kw) => lowerContent.includes(kw))) {
      tags.add(tag);
    }
  });

  return Array.from(tags).sort();
}
