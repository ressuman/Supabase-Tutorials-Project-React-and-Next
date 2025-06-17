import TodoForm from "./todo-form";
import TodoItem from "./todo-item";

export default function TodoList({
  todos,
}: {
  readonly todos: ReadonlyArray<string>;
}) {
  return (
    <>
      <TodoForm />
      <div className="w-full flex flex-col gap-4">
        {todos?.map((todo) => {
          return <TodoItem todo={todo} key={todo} />;
        })}
      </div>
    </>
  );
}
