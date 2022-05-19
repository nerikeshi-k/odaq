import { assertNever } from "./assertNever";

const EXTENSIONS = ["svg"] as const;
type Extension = typeof EXTENSIONS[number];

export const isValidExtension = (value: string): value is Extension =>
  EXTENSIONS.includes(value as any);

export const getContentType = (ext: Extension): string => {
  switch (ext) {
    case "svg":
      return "image/svg+xml";
    default:
      return assertNever(ext);
  }
};
