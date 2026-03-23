export type Difficulty = "easy" | "medium" | "hard";

export type FileType = "text" | "image" | "folder" | "terminal" | "chat";

export type DesktopItem = {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  imageUrl?: string;
  children?: DesktopItem[];
};

export type WindowPosition = {
  x: number;
  y: number;
};

export type WindowSize = {
  width: number;
  height: number;
};

export type WindowInstance = {
  id: string;
  title: string;
  type: FileType;
  content?: string;
  imageUrl?: string;
  children?: DesktopItem[];
  zIndex: number;
  position: WindowPosition;
  size: WindowSize;
};

export type Briefing = {
  title: string;
  description: string;
  hints?: string[];
};
