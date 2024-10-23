"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

export async function GetAllMessages(admin_id: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select(`*, sender_id(email)`)
      .eq("receiver_id", admin_id);

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

export async function GetAllUsers() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("users")
      .select("*")
      .eq("role", "USER")
      .order("email", { ascending: true });

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

export async function GetUserMessageById(conversation_id: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return data;
  } catch (error) {
    return [];
  }
}

export async function SendMessage(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: formData.get("sender_id"),
          receiver_id: formData.get("receiver_id"),
          message: formData.get("message"),
          conversation_id: formData.get("conversation_id"),
        },
      ])
      .select();
    if (error) {
      return false;
    }
    revalidatePath("/message");
    return true;
  } catch (error) {
    return false;
  }
}
