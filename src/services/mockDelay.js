import { MOCK_DELAY_MS } from "../config/api";

export const mockDelay = (result) =>
  new Promise((resolve) => setTimeout(() => resolve(result), MOCK_DELAY_MS));
