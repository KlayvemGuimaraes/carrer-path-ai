import { z } from "zod";
import { CertificationSchema, type Certification } from "../schemas.ts";
// Static import ensures the JSON is bundled, avoiding URL/asset issues in Workers
import rawCatalog from "../data/certifications.json" assert { type: "json" };

/**
 * Loads the certification catalog from the local JSON file.
 * In a real-world scenario, this could be replaced by a database call or an external API.
 * @returns {Promise<Certification[]>} A promise that resolves to the validated list of certifications.
 */
export async function loadCatalog(): Promise<Certification[]> {
  // Validate statically imported data against the Zod schema
  return z.array(CertificationSchema).parse(rawCatalog as unknown as Certification[]);
}
