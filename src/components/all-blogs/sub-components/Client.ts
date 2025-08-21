import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Get environment variables
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "crywsjkw";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "stage";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2021-08-31";

if (!PROJECT_ID || !DATASET || !API_VERSION) {
  throw new Error('Missing Sanity project_id or dataset or api_version');
}


// Initialize Sanity client with environment variables
export const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: true,
});

// Initialize the image URL builder
const builder = imageUrlBuilder(client);

// Export the image URL builder function
export const urlFor = (source: string) => builder.image(source);
