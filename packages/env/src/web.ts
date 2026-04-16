import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "PUBLIC_",
  client: {
    PUBLIC_SERVER_URL: z.url(),
    PUBLIC_SANITY_PROJECT_ID: z.string().trim().min(1),
    PUBLIC_SANITY_DATASET: z.string().trim().min(1),
    PUBLIC_SANITY_API_VERSION: z.string().trim().min(1),
  },
  runtimeEnv: (import.meta as any).env,
  emptyStringAsUndefined: true,
});
