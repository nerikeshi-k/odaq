import { assertNever } from "./assertNever";
import { ODAIBAKO_ORIGIN } from "./constants";

const PAGE_TYPES = ["odaibako", "gacha"] as const;
type PageType = typeof PAGE_TYPES[number];

export const isValidPageType = (value: string): value is PageType =>
  PAGE_TYPES.includes(value as any);

export const getUserPageUrl = (type: PageType, username: string) => {
  switch (type) {
    case "odaibako":
      return `${ODAIBAKO_ORIGIN}/u/${username}`;
    case "gacha":
      return `${ODAIBAKO_ORIGIN}/gacha/@${username}`;
    default:
      return assertNever(type);
  }
};
