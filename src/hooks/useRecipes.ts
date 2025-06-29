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

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching recipes from Supabase...');

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
        // First get the cuisine ID
        const { data: cuisineData } = await supabase
          .from('cuisines')
          .select('id')
          .eq('name', cuisineFilter)
          .single();
        
        if (cuisineData) {
          query = query.eq('cuisine_id', cuisineData.id);
        }
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched recipes:', data?.length || 0);
      setRecipes(data || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [cuisineFilter, limit]);

  return { recipes, loading, error, refetch: fetchRecipes };
};

export const useRecipeById = (id: string) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching recipe by ID:', id);

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
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched recipe:', data);
      setRecipe(data);
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  return { recipe, loading, error, refetch: fetchRecipe };
};

export const useCuisines = () => {
  const [cuisines, setCuisines] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCuisines = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching cuisines from Supabase...');

      const { data, error } = await supabase
        .from('cuisines')
        .select('*')
        .order('name');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched cuisines:', data?.length || 0);
      setCuisines(data || []);
    } catch (err) {
      console.error('Error fetching cuisines:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cuisines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuisines();
  }, []);

  return { cuisines, loading, error, refetch: fetchCuisines };
};

export const usePopularRecipes = (limit: number = 6) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching popular recipes...');

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
        .order('likes_count', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched popular recipes:', data?.length || 0);
      setRecipes(data || []);
    } catch (err) {
      console.error('Error fetching popular recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch popular recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularRecipes();
  }, [limit]);

  return { recipes, loading, error, refetch: fetchPopularRecipes };
};