export function assertNever(_: never): never {
  throw new Error("value must be never");
}
