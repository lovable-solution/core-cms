import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface CaseStudyMeta {
  slug: string;
  order: number;
  theme: string;
  title: string;
  sector: string;
  region: string;
  year: string;
  client?: string;
  summary: string;
  cover?: string;
  challenge: string;
  action: string;
  result: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'case-studies');

export function getCaseStudySlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getCaseStudy(slug: string): { meta: CaseStudyMeta; content: string } | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return {
    meta: { slug, ...(data as Omit<CaseStudyMeta, 'slug'>) },
    content,
  };
}

export function getAllCaseStudies(): CaseStudyMeta[] {
  return getCaseStudySlugs()
    .map((slug) => getCaseStudy(slug)?.meta)
    .filter((x): x is CaseStudyMeta => Boolean(x))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
