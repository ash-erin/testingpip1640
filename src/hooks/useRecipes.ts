import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  cuisine_id: string | null;
  meal_type: string | null;
  total_time_minutes: number | null;
  servings: number | null;
  notes: string | null;
  likes_count: number;
  created_at: string | null;
  cuisine?: {
    name: string;
  };
  recipe_ingredients: Array<{
    amount: string | null;
    descriptor: string | null;
    is_optional: boolean | null;
    ingredient: {
      name: string;
    };
  }>;
  recipe_steps: Array<{
    step_number: number | null;
    instruction: string | null;
  }>;
  recipe_tools: Array<{
    tool: {
      name: string;
    };
  }>;
  recipe_tags: Array<{
    tag: {
      name: string;
    };
  }>;
}

export const useRecipes = (cuisineFilter?: string, limit?: number) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('recipes')
          .select(`
            *,
            cuisine:cuisines(name),
            recipe_ingredients(
              amount,
              descriptor,
              is_optional,
              ingredient:ingredients(name)
            ),
            recipe_steps(
              step_number,
              instruction
            ),
            recipe_tools(
              tool:tools(name)
            ),
            recipe_tags(
              tag:tags(name)
            )
          `)
          .order('created_at', { ascending: false });

        if (cuisineFilter) {
          query = query.eq('cuisine.name', cuisineFilter);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setRecipes(data || []);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [cuisineFilter, limit]);

  return { recipes, loading, error };
};

export const useRecipeById = (id: string) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('recipes')
          .select(`
            *,
            cuisine:cuisines(name),
            recipe_ingredients(
              amount,
              descriptor,
              is_optional,
              ingredient:ingredients(name)
            ),
            recipe_steps(
              step_number,
              instruction
            ),
            recipe_tools(
              tool:tools(name)
            ),
            recipe_tags(
              tag:tags(name)
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  return { recipe, loading, error };
};

export const useCuisines = () => {
  const [cuisines, setCuisines] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const { data, error } = await supabase
          .from('cuisines')
          .select('*')
          .order('name');

        if (error) throw error;
        setCuisines(data || []);
      } catch (err) {
        console.error('Error fetching cuisines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCuisines();
  }, []);

  return { cuisines, loading };
};