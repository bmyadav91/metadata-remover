export type FileCategory =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "text"
  | "archive"
  | "unknown";

export type fileType = {
    uri: string;
    name: string;
    type: FileCategory | string;
    size?: number;
}