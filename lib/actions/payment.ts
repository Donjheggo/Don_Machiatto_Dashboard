"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

export async function GetPaymentMethod() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("gcash_number_payment")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error.message);
      return false;
    }

    return data[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function CreatePayment(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("gcash_number_payment")
      .insert([
        {
          number: formData.get("number"),
        },
      ])
      .select();

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/payment")
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetPaymentById(id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("gcash_number_payment")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error.message);
      return false;
    }

    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function UpdatePayment(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("gcash_number_payment")
      .update({
        number: formData.get("number"),
      })
      .eq("id", formData.get("id"))
      .select();

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/payment")
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}
