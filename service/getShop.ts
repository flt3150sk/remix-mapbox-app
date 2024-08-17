import { supabase } from "lib/supabase";
import { shopSchema, Shop } from "domain/shop";

export const getShop = async (shopId: string) => {
  try {
    const { data } = await supabase
      .from("shop")
      .select("*")
      .eq("id", shopId)
      .single();
    
    if (!data) {
      throw new Error("Shop not found");
    }

    const shop = shopSchema.safeParse(data);

    if (shop.success) {
      return shop.data;
    }

    console.error(shop.error.errors);
    return data as Shop;
  } catch (error) {
    throw new Error("Failed to fetch shops");
  }
};
