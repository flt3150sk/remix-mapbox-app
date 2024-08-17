import { z } from "zod";

export const shopSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  lat: z.number(),
  lng: z.number(),
  created_at: z.string(),
});
export const shopsSchema = z.array(shopSchema);

export type Shop = z.infer<typeof shopSchema>;
export type Shops = z.infer<typeof shopsSchema>;

