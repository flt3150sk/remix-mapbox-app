import { supabase } from "lib/supabase";
import { shopsSchema, Shops, CreateShop } from "domain/shop";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";

export const postShop = async (
  createShop: CreateShop,
  context: LoaderFunctionArgs["context"]
) => {
  try {
    const { data } = await supabase(
      context.cloudflare.env.SUPABASE_URL,
      context.cloudflare.env.SUPABASE_ANON_KEY
    )
      .from("shop")
      .insert(createShop)
      .select();

    if (!data) {
      throw new Error("Error Create Shop");
    }

    const shop = shopsSchema.safeParse(data);

    if (shop.success) {
      return shop.data[0].id;
    }

    console.error(shop.error.errors);
    return (data as Shops)[0].id;
  } catch (error) {
    throw new Error("Failed to fetch shops");
  }
};
