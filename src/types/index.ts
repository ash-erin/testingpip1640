export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  meal_type: string;
  ingredients: string[];
  instructions: string[];
  tools: string[];
  created_at: string;
  author: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  is_featured: boolean;
  category: string;
  likes_count: number;
  saves_count: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface SavedRecipe {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}