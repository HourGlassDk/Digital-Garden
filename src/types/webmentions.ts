export interface WebMentionAuthor {
  type: string;
  name: string;
  photo: string;
  url: string;
}

export interface WebMentionContent {
  html: string;
  text: string;
}

export interface WebMention {
  type: string;
  author: WebMentionAuthor;
  url: string;
  published: string | null;
  "wm-received": string;
  "wm-id": number;
  "wm-source": string;
  "wm-target": string;
  "wm-protocol": string;
  "wm-property": string;
  "wm-private": boolean;
  content?: WebMentionContent;
  "in-reply-to"?: string;
  "like-of"?: string;
  "bookmark-of"?: string;
  "mention-of"?: string;
  name?: string;
  rels?: {
    canonical: string;
  };
}

export interface WebMentionCache {
  lastFetched: string | null;
  children: WebMention[];
}
