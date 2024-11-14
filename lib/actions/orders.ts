"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

export async function GetOrders(
  searchQuery: string,
  page: number,
  items_per_page: number
) {
  try {
    const supabase = createClient();
    const query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: true })
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

export async function GetOrderById(order_id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (error) {
      return false;
    }
    return data;
  } catch (error) {
    return false;
  }
}

export async function UpdateOrder(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({
        delivery_status: formData.get("delivery_status"),
        delivery_schedule: formData.get("delivery_schedule") || null,
      })
      .eq("id", formData.get("id"))
      .select();

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/orders");

    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function DeleteOrder(order_id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("orders").delete().eq("id", order_id);

    if (error) {
      console.log("Error ", error.message)
      return { error: error };
    }

    revalidatePath("/orders");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetTotalOrders() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

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

export async function GetItemsByOrderId(order_id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("order_items")
      .select(`*, product_id(*)`)
      .eq("order_id", order_id);

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

export async function GetPendingOrders() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("delivery_status", "PENDING");

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

export async function GetDeliveryOrders() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("delivery_status", "OUT FOR DELIVERY");

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

export async function GetCompletedOrders() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("delivery_status", "COMPLETED");

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
