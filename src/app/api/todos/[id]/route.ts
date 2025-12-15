import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// PATCH /api/todos/[id] - Update a todo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id, 10);

    if (isNaN(todoId)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, completed } = body;

    // Build update object dynamically based on provided fields
    const updates: { title?: string; completed?: boolean } = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title must be a non-empty string' },
          { status: 400 }
        );
      }
      updates.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return NextResponse.json(
          { error: 'Completed must be a boolean' },
          { status: 400 }
        );
      }
      updates.completed = completed;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const result = await db
      .updateTable('todos')
      .set(updates)
      .where('id', '=', todoId)
      .executeTakeFirst();

    if (Number(result.numUpdatedRows) === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    // Fetch the updated todo
    const todo = await db
      .selectFrom('todos')
      .selectAll()
      .where('id', '=', todoId)
      .executeTakeFirst();

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id, 10);

    if (isNaN(todoId)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    const result = await db
      .deleteFrom('todos')
      .where('id', '=', todoId)
      .executeTakeFirst();

    if (Number(result.numDeletedRows) === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
