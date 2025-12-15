import { TodoList } from '@/components/todo-list';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Todo
            </h1>
            <p className="text-muted-foreground">
              A minimalist todo list
            </p>
          </div>

          {/* Todo list component */}
          <TodoList />
        </div>
      </main>
    </div>
  );
}
