"use server";

import { Todo } from "@/types/custom";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Add a new todo
export async function addTodo(formData: FormData) {
  const supabase = await createClient();
  const text = formData.get("todo") as string | null;

  if (!text) {
    throw new Error("Text is required");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User is not authenticated.");
  }

  const { error } = await supabase.from("todos").insert({
    task: text,
    user_id: user.id,
  });

  if (error) {
    throw new Error("Failed to add the task.");
  }

  revalidatePath("/todos");
}

// Delete a todo by ID
export async function deleteTodo(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User is not authenticated.");
  }

  const { error } = await supabase.from("todos").delete().match({
    id,
    user_id: user.id,
  });

  if (error) {
    throw new Error("Failed to delete the task.");
  }

  revalidatePath("/todos");
}

// Update a todo (by ID and user)
export async function updateTodo(todo: Todo) {
  // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate a delay

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User is not authenticated.");
  }

  const { error } = await supabase.from("todos").update(todo).match({
    id: todo.id,
    user_id: user.id,
  });

  if (error) {
    throw new Error("Failed to update the task.");
  }

  revalidatePath("/todos");
}
