import { createClient } from '@sanity/client'

import { env } from '@tehs-aerial-images/env/web'

export const sanityClient = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID,
  dataset: env.PUBLIC_SANITY_DATASET,
  apiVersion: env.PUBLIC_SANITY_API_VERSION,
  useCdn: true,
  perspective: 'published',
})
