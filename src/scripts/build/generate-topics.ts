import fs from "fs/promises";
import path from "path";
import { globby } from "globby";
import matter from "gray-matter";

async function generateTopics() {
  // Get all MDX files from content directories
  const contentDirs = [
    "src/content/essays",
    "src/content/notes",
    "src/content/smidgeons",
    // Temporarily disabled:
    // "src/content/patterns",
    // "src/content/talks",
  ];

  const mdxFiles = await globby(contentDirs.map((dir) => `${dir}/**/*.mdx`));

  // Extract topics from frontmatter
  const topics = new Set<string>();

  for (const file of mdxFiles) {
    const content = await fs.readFile(file, "utf-8");
    const { data } = matter(content);
    if (data.topics) {
      data.topics.forEach((topic: string) => topics.add(topic));
    }
  }

  // Convert to array and sort alphabetically
  const sortedTopics = Array.from(topics).sort();

  console.log(`✨ Generated schema with ${sortedTopics.length} topics`);
}

generateTopics().catch(console.error);
