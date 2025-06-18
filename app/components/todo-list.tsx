"use client";

import { Todo } from "@/types/custom";
import TodoForm from "./todo-form";
import TodoItem from "./todo-item";
import { useOptimistic } from "react";

export type Action = "delete" | "update" | "create";

export type TodoOptimisticUpdate = (action: {
  action: Action;
  todo: Todo;
}) => void;

export default function TodoList({
  todos,
}: {
  readonly todos: ReadonlyArray<Todo>;
}) {
  const [optimisticTodos, optimisticTodosUpdate] = useOptimistic(
    [...todos],
    TodoReducer
  );

  return (
    <>
      <TodoForm optimisticUpdate={optimisticTodosUpdate} />
      <div className="w-full flex flex-col gap-4">
        {optimisticTodos?.map((todo) => {
          return (
            <TodoItem
              optimisticUpdate={optimisticTodosUpdate}
              todo={todo}
              key={todo.id}
            />
          );
        })}
      </div>
    </>
  );
}

export function TodoReducer(
  state: Array<Todo>,
  {
    action,
    todo,
  }: {
    action: Action;
    todo: Todo;
  }
) {
  switch (action) {
    case "delete":
      return state.filter(({ id }) => id !== todo.id);
    case "update":
      return state.map((t) => (t.id === todo.id ? todo : t));
    case "create":
      return [todo, ...state];
    default:
      return state;
  }
}
