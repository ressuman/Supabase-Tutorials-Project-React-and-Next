"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Todo } from "@/types/custom";
import { Trash2 } from "lucide-react";
import { deleteTodo, updateTodo } from "../todos/action";

export default function TodoItem({ todo }: { readonly todo: Todo }) {
  return (
    <form>
      <TodoCard todo={todo} />
    </form>
  );
}

export const TodoCard = ({ todo }: { todo: Todo }) => {
  return (
    <Card className={cn("w-full")}>
      <CardContent className="flex items-start gap-3 p-3">
        <span className="size-10 flex items-center justify-center">
          <Checkbox
            // disabled={pending}
            checked={Boolean(todo.is_complete)}
            //checked={Boolean(checked)}
            onCheckedChange={async (val) => {
              if (val === "indeterminate") return;
              //setChecked(val);
              await updateTodo({
                ...todo,
                is_complete: val,
              });
            }}
          />
        </span>
        <p className={cn("flex-1 pt-2 min-w-0 break-words")}>{todo.task}</p>
        <Button
          //disabled={pending}
          formAction={async (data) => {
            // optimisticUpdate({
            //   action: "delete",
            //   todo,
            // });
            await deleteTodo(todo.id);
          }}
          variant="ghost"
          size="icon"
        >
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">Delete Todo</span>
        </Button>
      </CardContent>
    </Card>
  );
};
