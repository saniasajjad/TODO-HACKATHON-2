export interface User {
  id: number;
  email: string;
  auth_id: string;
  created_at: string;
}

export interface Todo {
  id: number;
  description: string;
  is_completed: boolean;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  description: string;
}

export interface UpdateTodoInput {
  description?: string;
  is_completed?: boolean;
}
