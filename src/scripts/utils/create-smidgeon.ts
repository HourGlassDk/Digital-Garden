#!/usr/bin/env node

import inquirer from "inquirer";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type SmidgeonType = "plain" | "external" | "citation";

interface SmidgeonPrompt {
  smidgeonType: SmidgeonType;
  title: string;
  topics: string;
}

async function createSmidgeon(): Promise<void> {
  // Get smidgeon type from user
  const { smidgeonType }: SmidgeonPrompt = await inquirer.prompt([
    {
      type: "list",
      name: "smidgeonType",
      message: "What type of smidgeon would you like to create?",
      choices: [
        { name: "Plain smidgeon note", value: "plain" },
        { name: "Link to external article/thing", value: "external" },
        { name: "Citation to a paper", value: "citation" },
      ],
    },
  ]);

  // Get title from user
  const { title }: { title: string } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of your smidgeon?",
      validate: (input: string): boolean | string => {
        if (input.trim() === "") {
          return "Title cannot be empty";
        }
        return true;
      },
    },
  ]);

  // Get topics from user
  const { topics }: { topics: string } = await inquirer.prompt([
    {
      type: "input",
      name: "topics",
      message: "What topics does this relate to? (comma-separated)",
      validate: (input: string): boolean | string => {
        if (input.trim() === "") {
          return "Please provide at least one topic";
        }
        return true;
      },
    },
  ]);

  // Parse topics into array
  const topicsArray: string = topics
    .split(",")
    .map((topic: string) => `"${topic.trim()}"`)
    .join(", ");

  // Create filename
  const date: Date = new Date();
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const slug: string = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  const filename: string = `${year}-${month}-${slug}.mdx`;

  // Create frontmatter based on type
  let frontmatter: string = "";
  
  if (smidgeonType === "plain") {
    frontmatter = `---
title: "${title}"
startDate: ${date.toISOString()}
type: "smidgeon"
topics: [${topicsArray}]
draft: true
---

`;
  } else if (smidgeonType === "external") {
    frontmatter = `---
title: "${title}"
startDate: ${date.toISOString()}
type: "smidgeon"
topics: [${topicsArray}]
external:
  url: ""
  title: ""
  author: ""
draft: true
---

`;
  } else if (smidgeonType === "citation") {
    frontmatter = `---
title: "${title}"
startDate: ${date.toISOString()}
type: "smidgeon"
topics: [${topicsArray}]
citation:
  title: ""
  authors: [""]
  journal: ""
  year: 
  url: ""
draft: true
---

`;
  }

  // Write file directly in smidgeons directory
  const smidgeonsDir: string = path.join(
    __dirname,
    "..",
    "src",
    "content",
    "smidgeons",
  );
  const filePath: string = path.join(smidgeonsDir, filename);
  await fs.writeFile(filePath, frontmatter);

  console.log(`Created new ${smidgeonType} smidgeon at: ${filePath}`);

  // Open in VS Code
  exec(`code ${filePath}`, (error: Error | null): void => {
    if (error) {
      console.error("Could not open file in VS Code:", error);
    }
  });
}

createSmidgeon().catch(console.error);