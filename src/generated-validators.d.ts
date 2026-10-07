import type { Domain } from "./contracts.ts";

declare const validators: Record<Domain, (value: unknown) => boolean>;
export default validators;
