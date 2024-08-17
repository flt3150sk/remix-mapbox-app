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

export const createShopSchema = z.object({
  name: z.string({ message: "入力してください。" }).min(1),
  description: z.string({ message: "入力してください。" }).min(1),
  lat: z.number(),
  lng: z.number(),
});

export type CreateShop = z.infer<typeof createShopSchema>;

export const createShopDefaultValues: CreateShop = {
  name: "",
  description: "",
  lat: 35,
  lng: 135,
};
