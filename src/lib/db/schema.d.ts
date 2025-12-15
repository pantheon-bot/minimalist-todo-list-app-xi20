import { Generated } from 'kysely';

export interface DB {
  todos: TodosTable;
}

export interface TodosTable {
  id: Generated<number>;
  title: string;
  completed: boolean;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}