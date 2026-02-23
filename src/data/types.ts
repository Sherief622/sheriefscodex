export interface ContentBlockBase {
  id: string;
  type: string;
}

export interface TextBlock extends ContentBlockBase {
  type: "text";
  body: string;
}

export interface CodeBlockData extends ContentBlockBase {
  type: "code";
  code: string;
  language: string;
  caption?: string;
}

export interface ImageBlock extends ContentBlockBase {
  type: "image";
  src: string;
  alt?: string;
  caption?: string;
}

export interface HeadingBlock extends ContentBlockBase {
  type: "heading";
  text: string;
  level: 2 | 3;
}

export type ContentBlock =
  | TextBlock
  | CodeBlockData
  | ImageBlock
  | HeadingBlock;

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  contentBlocks: ContentBlock[];
}
