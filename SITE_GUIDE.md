# Complete Digital Garden Site Guide

A comprehensive guide to Karl August Nybo's digital garden built with Astro. This site is a personal knowledge management system featuring growing notes, essays, and various content types focused on machine learning, AI safety, and technology.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Content Types](#content-types)
4. [Frontmatter Schema](#frontmatter-schema)
5. [Key Features](#key-features)
6. [Custom Components](#custom-components)
7. [Build Process & Scripts](#build-process--scripts)
8. [Development Workflow](#development-workflow)
9. [Content Management](#content-management)
10. [Special Features](#special-features)

## Tech Stack

- **Astro 5** - Static site generator with MDX support
- **React 18** - Used sparingly for interactive components
- **JavaScript/TypeScript** - Primary language (minimal TypeScript usage)
- **D3.js** - Data visualizations (when needed)
- **Tippy.js** - Tooltip hover previews
- **Sharp & Satori** - Dynamic OG image generation
- **Motion** - Animation library

### Dependencies

- **Content Management**: `@astrojs/mdx`, `gray-matter`, `globby`
- **Styling**: Custom CSS with CSS variables
- **Images**: `sharp`, `astro-embed`
- **External APIs**: `node-fetch` (webmentions), `sanitize-html`
- **Development**: `tsx`, `inquirer`, `dotenv`

## Project Structure

```
src/
├── content/                    # All content collections
│   ├── config.ts              # Content schema definitions
│   ├── data/                  # Generated data files
│   │   ├── topics.json        # Auto-generated topics
│   │   └── webmentions.json   # Cached webmentions
│   ├── essays/                # Long-form opinionated writing
│   ├── notes/                 # Learning notes and explorations
│   ├── smidgeons/             # Short thoughts and links
│   ├── now/                   # Current status updates
│   ├── pages/                 # Static pages
│   ├── books.json             # Books I've read
│   ├── antibooks.json         # Books to read
│   └── disabled/              # Temporarily disabled content
├── components/
│   ├── cards/                 # Content display cards
│   ├── layouts/               # Layout components
│   ├── mdx/                   # MDX importable components
│   ├── search/                # Search functionality
│   ├── unique/                # One-off specific components
│   └── animated-icons/        # Custom animated icons
├── pages/                     # Route pages
├── plugins/                   # Astro plugins (remark-wiki-link)
├── scripts/                   # Build and utility scripts
├── utils/                     # Utility functions
└── layouts/                   # Page layout templates
```

## Content Types

### Active Content Types

#### 1. Essays (`src/content/essays/`)
- **Purpose**: Long-form, opinionated narrative writing with an agenda
- **Format**: MDX files with rich frontmatter
- **Features**: Cover images, featured flag, TOC support
- **Growth Stages**: seedling → budding → evergreen

**Example Frontmatter**:
```yaml
---
title: "Understanding AI Alignment: Challenges and Approaches"
description: "A template for writing in-depth essays about AI safety"
startDate: 2024-01-15
updated: 2024-01-15
type: "essay"
cover: "../../images/covers/ai-enlightenment@2x.png"
topics: ["AI Safety", "Machine Learning", "Ethics"]
growthStage: "budding"
featured: true
draft: false
toc: true
aliases: ["AI Alignment Overview"]
version: 1
versionSummary: "Initial version covering basic alignment challenges"
---
```

#### 2. Notes (`src/content/notes/`)
- **Purpose**: Loose, unopinionated notes on learning topics
- **Format**: MDX files with minimal frontmatter
- **Features**: TOC support, aliases for alternative titles
- **Growth Stages**: seedling → budding → evergreen

**Example Frontmatter**:
```yaml
---
title: "Introduction to Neural Networks"
description: "A template for taking notes on topics you're learning about"
startDate: 2024-01-15
updated: 2024-01-20
type: "note"
topics: ["Machine Learning", "Neural Networks", "Deep Learning"]
growthStage: "seedling"
draft: false
toc: true
aliases: ["Neural Networks Basics", "NN Intro"]
version: 2
versionSummary: "Added CNN and RNN sections"
---
```

#### 3. Smidgeons (`src/content/smidgeons/`)
- **Purpose**: A stream of interesting links, papers, and tiny thoughts
- **Format**: Short MDX files organized by year/month
- **Features**: External link citation support, academic citation format
- **Growth Stages**: Not applicable (always evergreen)

**Example Frontmatter**:
```yaml
---
title: "Interesting Paper on AI Interpretability"
startDate: 2024-01-15
type: "smidgeon"
topics: ["AI Safety", "Interpretability", "Research"]
draft: false
external:
  title: "Mechanistic Interpretability: A Field Guide"
  url: "https://example.com/mechanistic-interpretability"
  author: "Research Team"
citation:
  title: "Mechanistic Interpretability: A Field Guide"
  authors: ["Research Team", "AI Lab"]
  journal: "ML Journal"
  year: 2024
  url: "https://example.com/mechanistic-interpretability"
---
```

#### 4. Now Pages (`src/content/now/`)
- **Purpose**: Current status updates inspired by Derek Sivers' nownownow.com
- **Format**: MDX files with date-based naming
- **Features**: Simple status updates, always evergreen
- **Growth Stages**: Always evergreen

**Example Frontmatter**:
```yaml
---
title: "January 2024"
startDate: 2024-01-01
type: "now"
topics: ["Personal Update", "Learning", "Projects"]
growthStage: "evergreen"
draft: false
---
```

#### 5. Static Pages (`src/content/pages/`)
- **Purpose**: Static site pages (About, Hire Me, etc.)
- **Format**: MDX files with minimal frontmatter
- **Features**: Basic page metadata

#### 6. Books & Antilibrary
- **Books**: JSON file of books I've read
- **Antilibrary**: JSON file of books to read
- **Format**: Structured JSON with cover images and metadata

### Temporarily Disabled Content Types

The following content types have been disabled but can be re-enabled using the `REIMPLEMENT_GUIDE.md`:

- **Patterns**: Design patterns catalogue (`src/content/disabled/patterns/`)
- **Talks**: Conference presentations (`src/content/disabled/talks/`)
- **Podcasts**: Interview appearances (`src/content/disabled/podcasts.json`)

## Frontmatter Schema

### Common Fields (All Content Types)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Content title |
| `type` | string | ✅ | Content type (note, essay, smidgeon, now, page) |
| `startDate` | Date | ✅ | Creation/publication date |
| `topics` | string[] | ❌ | Topic tags for categorization |
| `growthStage` | string | ✅ | Maturity level (seedling/budding/evergreen) |
| `draft` | boolean | ❌ | Hide from production (default: false) |

### Essay-Specific Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | ✅ | SEO description |
| `updated` | Date | ✅ | Last modification date |
| `cover` | Image | ❌ | Cover image for OG cards |
| `featured` | boolean | ❌ | Feature on homepage |
| `toc` | boolean | ❌ | Show table of contents |
| `aliases` | string[] | ❌ | Alternative titles for linking |
| `version` | number | ❌ | Content version number |
| `versionSummary` | string | ❌ | Description of version changes |

### Note-Specific Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | ❌ | Optional description |
| `updated` | Date | ✅ | Last modification date |
| `toc` | boolean | ❌ | Show table of contents |
| `aliases` | string[] | ❌ | Alternative titles for linking |
| `version` | number | ❌ | Content version number |
| `versionSummary` | string | ❌ | Description of version changes |

### Smidgeon-Specific Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `external` | Object | ❌ | External link information |
| `external.title` | string | ✅* | External content title |
| `external.url` | string | ✅* | External content URL |
| `external.author` | string | ❌ | External content author |
| `citation` | Object | ❌ | Academic citation information |

### Growth Stages

- **seedling**: New content, still developing
- **budding**: Content growing and evolving
- **evergreen**: Mature and stable content

## Key Features

### 1. Wiki-Style Internal Links

- **Syntax**: `[[Page Title]]` in MDX content
- **Processing**: Automatically converted to tooltip links
- **Features**: Hover previews with title and description
- **Backlinks**: Automatic bidirectional linking
- **Aliases**: Support for alternative page titles

### 2. Content Versioning

- **Folder-based**: Content organized in folders (e.g., `ai-dark-forest/ai-dark-forest-v1.mdx`)
- **Canonical URLs**: Latest version gets canonical URL (`/ai-dark-forest`)
- **Versioned URLs**: Older versions accessible (`/v1/ai-dark-forest`)
- **Automatic detection**: Latest version determined by `version` field
- **Version warnings**: Banners on archived versions

### 3. Topic System

- **Auto-generation**: Topics extracted from frontmatter
- **Topic pages**: Dedicated pages for each topic
- **Filtering**: Filter content by topics in garden view
- **Topic-based navigation**: Related content discovery

### 4. Search & Discovery

- **Garden view**: Unified view of all content types
- **Filtering**: By type, topic, growth stage
- **Masonry layouts**: Responsive grid layouts
- **Backlinks**: See what links to each page

### 5. Social Features

- **Webmentions**: Social interactions via webmention.io
- **Brid.gy integration**: Fetch from multiple platforms
- **Automatic updates**: Fetched during build process
- **Display**: Social reactions, mentions, and links

### 6. Dynamic OG Images

- **Satori + Sharp**: Generate images on the fly
- **Per-content**: Unique images for each piece of content
- **Template-based**: Consistent design with content metadata
- **SEO optimized**: Proper meta tags for social sharing

### 7. Content Management

- **Draft system**: Hide unfinished content
- **TOC generation**: Automatic table of contents
- **View transitions**: Smooth page navigation
- **Mobile responsive**: Optimized for all devices

## Custom Components

### MDX Importable Components (`src/components/mdx/`)

#### Layout Components
- **GridColumns**: Responsive grid layouts
  ```astro
  <GridColumns columns={2} maxWidth="1200px">
    <div>Content 1</div>
    <div>Content 2</div>
  </GridColumns>
  ```

- **FullWidthSection**: Full-width content sections
- **Center**: Centered content containers
- **Spacer**: Vertical spacing

#### Media Components
- **BasicImage**: Optimized local images
- **RemoteImage**: External image handling
- **Video**: Video embeds
- **ImageLink**: Clickable images

#### Interactive Components
- **Tooltip**: Hover tooltips with custom content
- **InternalTooltipLink**: Wiki-style internal links
- **Accordion**: Expandable/collapsible content
- **TweetEmbed**: Twitter embeds

#### Content Components
- **Alert**: Warning/notice boxes
- **QuoteCard**: Styled quote blocks
- **SimpleCard**: Basic content cards
- **LinkCard**: Link preview cards
- **References**: Citation lists
- **Footnote**: Footnote handling

#### Typography Components
- **Title1-4**: Hierarchical heading styles
- **SmallTitle2**: Smaller heading variant
- **SmallCaps**: Small caps text
- **Highlight**: Text highlighting
- **Subtext**: Secondary text

#### Specialized Components
- **AcademicReference**: Academic citation format
- **BlockquoteCitation**: Quotes with citations
- **ResourceBook**: Book reference cards
- **AssumedAudience**: Audience assumptions
- **Disclaimer**: Content disclaimers
- **ComingSoon**: Placeholder content
- **Draft**: Draft content indicators

### Card Components (`src/components/cards/`)

- **EssayCard**: Essay preview cards
- **NoteCard**: Note preview cards
- **SmidgeonCard**: Smidgeon preview cards
- **BookCard**: Book display cards
- **ProjectCard**: Project showcase cards
- **NowCard**: Now page cards

### Layout Components (`src/components/layouts/`)

- **MasonryGrid**: Masonry layout implementation
- **TableOfContents**: Auto-generated TOC
- **Backlinks**: Related content linking
- **Topics**: Topic display and navigation
- **WebMentions**: Social interaction display
- **GrowthStage**: Growth stage indicators
- **VersionDropdown**: Version selection UI

## Build Process & Scripts

### Development Commands

```bash
pnpm run dev          # Start development server
pnpm run build        # Production build
pnpm run preview      # Preview production build
```

### Content Scripts

```bash
pnpm run generate-links    # Process internal links and backlinks
pnpm run fetch-webmentions # Fetch social interactions
pnpm run smidgeon          # Create new smidgeon interactively
pnpm run date             # Get current date for content
```

### Build Process Flow

1. **Pre-build Scripts**:
   - `generate-links.tsx`: Processes wiki links, generates backlinks
   - `generate-topics.ts`: Extracts topics from content frontmatter

2. **Content Processing**:
   - MDX compilation with remark plugins
   - Wiki link transformation to InternalTooltipLink components
   - Image optimization and OG image generation

3. **Production Build**:
   - `get-webmentions.tsx`: Fetches social interactions
   - Static site generation
   - RSS feed creation
   - Sitemap generation

### Script Details

#### `generate-links.tsx`
- Processes all MDX content files
- Extracts `[[wiki links]]` from content
- Generates bidirectional linking data
- Creates `links.json` with forward and backward links
- Handles content versioning and canonical URLs
- Filters out draft content

#### `generate-topics.ts`
- Scans all content collections for `topics` arrays
- Creates deduplicated topic list
- Outputs sorted topics for filtering and navigation

#### `get-webmentions.tsx`
- Fetches webmentions from webmention.io API
- Handles pagination for large datasets
- Caches results to avoid API rate limits
- Merges new mentions with cached data

#### `create-smidgeon.ts`
- Interactive CLI for creating new smidgeons
- Prompts for title and metadata
- Creates properly named files with frontmatter
- Organizes by year/month directories

## Development Workflow

### Creating New Content

#### 1. Essays
```bash
# Create new essay file
touch src/content/essays/my-essay.mdx
```
Add frontmatter following the essay schema, then write content using MDX syntax and custom components.

#### 2. Notes
```bash
# Create new note file
touch src/content/notes/my-note.mdx
```
Follow the note schema, focus on learning and exploration rather than opinion.

#### 3. Smidgeons
```bash
# Use interactive script
pnpm run smidgeon
# Or create manually
touch src/content/smidgeons/2024/2024-01-my-smidgeon.mdx
```

#### 4. Now Pages
```bash
# Create monthly update
touch src/content/now/2024-01.mdx
```

### Content Versioning

To create a new version of existing content:

1. Create folder: `src/content/essays/my-post/`
2. Move existing file: `my-post-v1.mdx`
3. Create new version: `my-post-v2.mdx`
4. Update frontmatter with incremented `version`
5. Add `versionSummary` describing changes

The system automatically:
- Generates canonical URLs for latest versions
- Creates versioned URLs for older versions
- Adds version warning banners
- Updates internal links to point to canonical URLs

### Using Custom Components

In your MDX files, import and use components:

```astro
---
import { GridColumns, Alert, Tooltip } from '../components/mdx';
---

<GridColumns columns={2}>
  <Alert title="Important">
    This is an important notice
  </Alert>
  <div>
    Regular content here
  </div>
</GridColumns>
```

### Internal Linking

Use wiki-style links throughout your content:

```mdx
# My Content

I'm writing about [[Neural Networks]] and how they relate to [[AI Safety]].
This creates automatic links with hover previews.
```

The system will:
- Convert `[[Neural Networks]]` to tooltip links
- Generate backlinks automatically
- Handle aliases and alternative titles
- Update links when content moves or is versioned

## Content Management

### Draft Content

Mark content as draft to hide from production:

```yaml
---
title: "My Draft Post"
draft: true
---
```

Draft content:
- Won't appear in production builds
- Still available in development
- Excluded from link generation
- Hidden from search and navigation

### Growth Stages

Use growth stages to indicate content maturity:

```yaml
---
growthStage: "seedling"  # New, developing content
# growthStage: "budding"   # Growing, evolving content
# growthStage: "evergreen" # Mature, stable content
---
```

Growth stages are displayed as icons and used for filtering.

### Topics Management

Add topics to content for categorization:

```yaml
---
topics: ["Machine Learning", "Neural Networks", "AI Safety"]
---
```

Topics are:
- Auto-extracted during build
- Used for content filtering
- Generate dedicated topic pages
- Support topic-based navigation

### Content Updates

When updating content:

1. Update the `updated` date in frontmatter
2. Increment `version` if significant changes
3. Add `versionSummary` explaining changes
4. Consider updating `growthStage` if content matured

## Special Features

### Wiki-Style Linking System

The site's signature feature is its bi-directional linking system:

**Creating Links**:
```mdx
See also [[Neural Networks]] for more details.
```

**Link Features**:
- Automatic tooltip generation on hover
- Shows title, description, and growth stage
- Supports aliases for flexible naming
- Generates backlinks automatically

**Backlinks**:
- Every page shows what links to it
- Helps discover related content
- Updates automatically when content changes

### Content Versioning

Advanced versioning system for long-term content maintenance:

**Folder Structure**:
```
src/content/essays/my-post/
├── my-post-v1.mdx  # Original version
├── my-post-v2.mdx  # Updated version
└── my-post-v3.mdx  # Latest version
```

**URL Handling**:
- Canonical: `/my-post` (always latest version)
- Versioned: `/v1/my-post`, `/v2/my-post` (specific versions)
- Automatic redirects and warnings

**Benefits**:
- Preserve content history
- Maintain stable URLs
- Allow iterative improvement
- Support canonical URL management

### Dynamic OG Image Generation

Every piece of content gets a custom social sharing image:

**Features**:
- Auto-generated from content metadata
- Consistent branding and design
- Optimized for social media platforms
- Includes title, description, and growth stage

**Implementation**:
- Satori for SVG generation
- Sharp for image processing
- Template-based design system
- Cached for performance

### Webmention Integration

Social interaction tracking across platforms:

**Supported Platforms**:
- Twitter/X
- Mastodon
- Personal blogs
- Other Webmention-enabled platforms

**Features**:
- Automatic fetching via Brid.gy
- Cached for performance
- Displayed on relevant content
- Supports likes, reposts, replies, and mentions

### Search and Discovery

Powerful content discovery system:

**Garden View**: Unified view of all content types with advanced filtering

**Filtering Options**:
- Content type (essays, notes, smidgeons, etc.)
- Topics (multi-select)
- Growth stages
- Date ranges

**Search Features**:
- Full-text search across all content
- Topic-based browsing
- Content relationship visualization
- Mobile-optimized interface

## Environment Setup

### Required Environment Variables

Create `.env` file:

```env
WEBMENTION_API_KEY=your_webmention_token
```

### Development Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm run dev
   ```

3. **Create content**:
   - Add essays to `src/content/essays/`
   - Add notes to `src/content/notes/`
   - Use `pnpm run smidgeon` for quick thoughts

### Production Deployment

1. **Build site**:
   ```bash
   pnpm run build
   ```

2. **Deploy**:
   ```bash
   ./deploy.sh  # Deploys to Vercel
   ```

The build process automatically:
- Generates internal links and backlinks
- Fetches latest webmentions
- Creates OG images
- Optimizes assets
- Generates RSS feeds

## Best Practices

### Content Creation

1. **Start with seedlings**: New content begins as "seedling"
2. **Use internal linking**: Connect related ideas with `[[links]]`
3. **Add relevant topics**: Help with discovery and categorization
4. **Update regularly**: Keep content fresh with versioning
5. **Use appropriate components**: Leverage custom MDX components

### Link Management

1. **Use descriptive titles**: Make links meaningful
2. **Add aliases**: Support multiple ways to reference content
3. **Check backlinks**: See what's linking to your content
4. **Update broken links**: Versioning helps maintain link stability

### Version Control

1. **Version major updates**: When content significantly changes
2. **Use version summaries**: Explain what changed in each version
3. **Maintain canonical URLs**: Let the system handle URL management
4. **Check internal links**: Ensure they point to latest versions

### SEO and Discovery

1. **Write good descriptions**: Essential for SEO and social sharing
2. **Use relevant topics**: Helps with content discovery
3. **Update content regularly**: Fresh content ranks better
4. **Leverage OG images**: Custom images improve social sharing

## Troubleshooting

### Common Issues

**Links not working?**
- Run `pnpm run generate-links` to rebuild link database
- Check if target content is marked as draft
- Verify spelling and aliases in link targets

**Missing topics?**
- Run `pnpm run generate-topics` to rebuild topic list
- Check frontmatter for proper topic array syntax
- Ensure topics are strings, not objects

**Build failures?**
- Check MDX syntax in all content files
- Verify frontmatter matches schema requirements
- Run development server to see detailed error messages

**Webmentions not showing?**
- Verify `WEBMENTION_API_KEY` is set in `.env`
- Check webmention.io configuration
- Run `pnpm run fetch-webmentions` to update cache

### Performance Issues

**Slow build times?**
- Check if webmention fetch is timing out
- Consider reducing image sizes
- Verify all external links are accessible

**Large bundle size?**
- Check D3.js usage (only import what's needed)
- Optimize images and assets
- Review custom component dependencies

This comprehensive guide should help you understand and work with every aspect of the digital garden. The system is designed to be flexible and extensible while maintaining clean separation of concerns between content, presentation, and functionality.