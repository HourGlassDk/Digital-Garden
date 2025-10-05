import * as fs from "fs";
import fetch from "node-fetch";
import lodash from "lodash";
import * as dotenv from "dotenv";
dotenv.config();

// Define Cache Location and API Endpoint
const CACHE_DIR = "src/content/data";
const TOKEN = process.env.WEBMENTION_API_KEY;

interface Webmention {
  "wm-id": string;
  [key: string]: any;
}

interface WebmentionFeed {
  children: Webmention[];
}

interface WebmentionCache {
  lastFetched: string | null;
  children: Webmention[];
}

async function fetchWebmentions(since?: string, perPage: number = 100): Promise<WebmentionFeed> {
  let allMentions: WebmentionFeed = { children: [] };
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    let url = `https://webmention.io/api/mentions.jf2?domain=maggieappleton.com&token=${TOKEN}&per-page=${perPage}&page=${page}`;
    if (since) {
      // Ensure we're not using a future date
      const sinceDate = new Date(since);
      const now = new Date();
      if (sinceDate > now) {
        console.log(
          ">>> Warning: Last fetch time was in the future, resetting to current time",
        );
        since = now.toISOString();
      }
      url += `&since=${since}`;
    }

    console.log(`>>> Fetching webmentions page ${page}...`);
    const response = await fetch(url);
    console.log(">>> Response status:", response.status);

    if (response.ok) {
      const feed = (await response.json()) as WebmentionFeed;
      if (feed.children && feed.children.length > 0) {
        allMentions.children = [...allMentions.children, ...feed.children];
        console.log(
          `>>> ${feed.children.length} mentions fetched on page ${page}`,
        );
        page++;
      } else {
        hasMore = false;
      }
    } else {
      const errorText = await response.text();
      console.log(">>> Error response:", errorText);
      hasMore = false;
    }
  }

  console.log(`>>> Total mentions fetched: ${allMentions.children.length}`);
  return allMentions;
}

// Merge fresh webmentions with cached entries, unique per id
function mergeWebmentions(a: WebmentionFeed, b: WebmentionFeed): Webmention[] {
  return lodash.unionBy(a.children, b.children, "wm-id");
}

// save combined webmentions in cache file
function writeToCache(data: WebmentionCache): void {
  const filePath = `${CACHE_DIR}/webmentions.json`;
  const fileContent = JSON.stringify(data, null, 2);
  // create cache folder if it doesnt exist already
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
  }
  // write data to cache json file
  fs.writeFile(filePath, fileContent, (err) => {
    if (err) throw err;
    console.log(`>>> webmentions saved to ${filePath}`);
  });
}

// get cache contents from json file
function readFromCache(): WebmentionCache {
  const filePath = `${CACHE_DIR}/webmentions.json`;

  if (fs.existsSync(filePath)) {
    const cacheFile = fs.readFileSync(filePath, "utf8");
    const cache = JSON.parse(cacheFile) as WebmentionCache;
    console.log(">>> Last fetch time was:", cache.lastFetched);
    return cache;
  }

  // no cache found.
  return {
    lastFetched: null,
    children: [],
  };
}

async function ReadCacheAndFetch(): Promise<void> {
  console.log(">>> Starting webmention fetch...");
  const cache = readFromCache();

  if (cache.children.length) {
    console.log(`>>> ${cache.children.length} webmentions loaded from cache`);
    console.log(">>> Fetching new webmentions since last fetch...");
    const feed = await fetchWebmentions(cache.lastFetched || undefined);

    if (feed) {
      const webmentions: WebmentionCache = {
        lastFetched: new Date().toISOString(),
        children: mergeWebmentions({ children: cache.children }, feed),
      };
      writeToCache(webmentions);
      return;
    }
  } else {
    // No cache exists, fetch all mentions
    console.log(">>> No cache found. Fetching all webmentions...");
    const feed = await fetchWebmentions();

    if (feed) {
      const webmentions: WebmentionCache = {
        lastFetched: new Date().toISOString(),
        children: feed.children,
      };
      writeToCache(webmentions);
      return;
    }
  }

  return;
}

ReadCacheAndFetch();