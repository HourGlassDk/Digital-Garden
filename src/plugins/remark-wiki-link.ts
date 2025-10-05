import { visit } from "unist-util-visit";
import linkMaps from "../links.json";

interface LinkMap {
  ids: string[];
  slug: string;
  growthStage?: string;
  description?: string;
}

export function remarkWikiLink() {
	return (tree: any): void => {
		visit(tree, "text", (node: any, index: number | undefined, parent: any) => {
			if (index === undefined) return;
			
			const matches = Array.from(node.value.matchAll(/\[\[(.*?)\]\]/g));
			if (!matches.length) return;

			const children: any[] = [];
			let lastIndex = 0;

			matches.forEach((match: unknown) => {
				const regExpMatch = match as RegExpMatchArray;
				const [fullMatch, linkText] = regExpMatch;
				const startIndex = regExpMatch.index || 0;
				const endIndex = startIndex + fullMatch.length;

				// Add text before the match
				if (startIndex > lastIndex) {
					children.push({
						type: "text",
						value: node.value.slice(lastIndex, startIndex),
					});
				}

				// Find the matching post in linkMaps
				const matchedPost = (linkMaps as LinkMap[]).find((post) =>
					post.ids.some((id) => id.toLowerCase() === linkText.toLowerCase())
				);

				if (matchedPost) {
					// Create the InternalTooltipLink component
					children.push({
						type: "mdxJsxFlowElement",
						name: "InternalTooltipLink",
						attributes: [
							{
								type: "mdxJsxAttribute",
								name: "href",
								value: `/${matchedPost.slug}`,
							},
							{
								type: "mdxJsxAttribute",
								name: "title",
								value: matchedPost.ids[0],
							},
							{
								type: "mdxJsxAttribute",
								name: "description",
								value: matchedPost.description || "",
							},
						],
						children: [{ type: "text", value: linkText }],
					});
				} else {
					// If no match found, just add the text as is
					children.push({
						type: "text",
						value: fullMatch,
					});
				}

				lastIndex = endIndex;
			});

			// Add any remaining text
			if (lastIndex < node.value.length) {
				children.push({
					type: "text",
					value: node.value.slice(lastIndex),
				});
			}

			// Replace the original node with our new children
			parent.children.splice(index, 1, ...children);
		});
	};
}