import { supabase } from "lib/supabase";
import { shopsSchema, Shops } from "domain/shop";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";

export const getShops = async (context: LoaderFunctionArgs["context"]) => {
  try {
    const { data } = await supabase(
      context.cloudflare.env.SUPABASE_URL,
      context.cloudflare.env.SUPABASE_ANON_KEY
    )
      .from("shop")
      .select("*");
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
