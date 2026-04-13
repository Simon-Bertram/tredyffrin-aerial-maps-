// Collection typings for EmDash (from seed/seed.json). Regenerate when the schema
// changes: run `pnpm run dev` then `pnpm run emdash:types` in apps/web.

import type { ContentBylineCredit, PortableTextBlock } from "emdash";

export interface Page {
	id: string;
	slug: string | null;
	status: string;
	title: string;
	template?: "Default" | "Full Width";
	content?: PortableTextBlock[];
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date | null;
	bylines?: ContentBylineCredit[];
}

export interface Post {
	id: string;
	slug: string | null;
	status: string;
	title: string;
	featured_image?: {
		id: string;
		src?: string;
		alt?: string;
		width?: number;
		height?: number;
	};
	content?: PortableTextBlock[];
	excerpt?: string;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date | null;
	bylines?: ContentBylineCredit[];
}

declare module "emdash" {
	interface EmDashCollections {
		pages: Page;
		posts: Post;
	}
}
