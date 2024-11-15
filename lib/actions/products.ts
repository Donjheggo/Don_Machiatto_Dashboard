"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function GetProducts(
  searchQuery: string,
  page: number,
  items_per_page: number
) {
  try {
    const supabase = createClient();
    const query = supabase
      .from("products")
      .select(`*`)
      .order("name", { ascending: true })
      .range((page - 1) * items_per_page, page * items_per_page - 1);

    const { data, error } = searchQuery
      ? await query.ilike("name", `%${searchQuery}%`)
      : await query;

    if (error) {
      console.error(error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function UploadImage(file: File) {
  const supabase = createClient();
  const fileName = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file);

  if (error) {
    return { error: error.message };
  }

  const { data } = supabase.storage.from("products").getPublicUrl(fileName);

  if (!data) {
    return { error: "Failed to upload image." };
  }

  return { imageUrl: data.publicUrl };
}

async function DeleteImage(imageUrl: string) {
  const supabase = createClient();
  const fileName = imageUrl.split("/").pop();
  if (!fileName) return { error: "Invalid image URL" };

  const { error } = await supabase.storage.from("products").remove([fileName]);

  if (error) {
    return { error: error.message };
  }

  return { error: "" };
}

export async function CreateProduct(formData: FormData) {
  try {
    const supabase = createClient();
    const image = formData.get("image") as File;

    const { imageUrl, error: uploadError } = await UploadImage(image);

    if (uploadError) {
      return { error: uploadError };
    }

    const { error } = await supabase
      .from("products")
      .insert({
        image: imageUrl,
        name: formData.get("name"),
        flavor: formData.get("flavor"),
        price: formData.get("price"),
        quantity: formData.get("quantity"),
      })
      .select();

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/products");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetProductById(id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return false;
    }
    return data;
  } catch (error) {
    return false;
  }
}

export async function UpdateProduct(formData: FormData) {
  try {
    const supabase = createClient();

    // Get the current image URL from the formData
    let imageUrl = formData.get("currentImageUrl") as string;
    const image = formData.get("image") as File | null;

    // If there's new image replaced, replace the existing one
    if (image && image.size > 0) {
      if (imageUrl) {
        const { error } = await DeleteImage(imageUrl);
        if (error) {
          console.error("Failed to delete old image: ", error);
        }
      }

      const result = await UploadImage(image);

      if ("error" in result) {
        return { error: result.error };
      }

      imageUrl = result.imageUrl;
    }

    const { error } = await supabase
      .from("products")
      .update({
        image: imageUrl,
        name: formData.get("name"),
        flavor: formData.get("flavor"),
        price: formData.get("price"),
        quantity: formData.get("quantity"),
      })
      .eq("id", formData.get("id"))
      .select();

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/products");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function DeleteProduct(id: string) {
  try {
    const supabase = createClient();

    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching product: ", fetchError.message);
      return { error: fetchError.message };
    }

    if (product && product.image) {
      const { error } = await DeleteImage(product.image);
      if (error) {
        console.error("Failed to delete product image: ", error);
      }
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return { error: error };
    }
    revalidatePath("/products");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetTotalProducts() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase.from("products").select("*");

    if (error) {
      console.error(error);
      return 0;
    }
    return data.length || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export async function GetAllProducts() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error(error.message);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
