import { supabase } from "lib/supabase";
import { shopsSchema, Shops } from "domain/shop";

export const getShops = async () => {
  try {
    const { data } = await supabase.from("shop").select("*");
    const shops = shopsSchema.safeParse(data);

    if (shops.success) {
      return shops.data;
    }

    console.error(shops.error.errors);
    return data as Shops;
  } catch (error) {
    throw new Error("Failed to fetch shops");
  }
};
