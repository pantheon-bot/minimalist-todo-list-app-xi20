import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET /api/todos - List all todos
export async function GET() {
  try {
    const todos = await db
      .selectFrom('todos')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();

    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const result = await db
      .insertInto('todos')
      .values({
        title: title.trim(),
        completed: false,
      })
      .executeTakeFirstOrThrow();

    // Fetch the newly created todo
    const todo = await db
      .selectFrom('todos')
      .selectAll()
      .where('id', '=', Number(result.insertId))
      .executeTakeFirst();

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
