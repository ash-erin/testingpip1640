import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { realtimeService } from '../services/RealtimeService';
import { cacheService } from '../services/CacheService';
import { ImageService } from '../services/ImageService';
import { useRealtimeData } from './useRealtimeSync';

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
  image_url?: string; // Added for image integration
  cuisine?: {
    id: string;
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

export interface Cuisine {
  id: string;
  name: string;
}

export const useRecipes = (cuisineFilter?: string, limit?: number) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up real-time data listeners
  useRealtimeData('recipe', (payload) => {
    console.log('🔄 Recipe data changed, refreshing...');
    fetchRecipes();
  });

  useRealtimeData('recipe-ingredient', (payload) => {
    console.log('🔄 Recipe ingredients changed, refreshing...');
    fetchRecipes();
  });

  useRealtimeData('recipe-step', (payload) => {
    console.log('🔄 Recipe steps changed, refreshing...');
    fetchRecipes();
  });

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create cache key
      const cacheKey = `recipes-${cuisineFilter || 'all'}-${limit || 'unlimited'}`;
      
      // Try to get from cache first
      const cachedData = cacheService.get<Recipe[]>(cacheKey);
      if (cachedData) {
        console.log('✅ Using cached recipe data');
        setRecipes(cachedData);
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching recipes from Supabase database...');

      let query = supabase
        .from('recipes')
        .select(`
          *,
          cuisine:cuisines(id, name),
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
        // Filter by cuisine name
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
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log(`✅ Fetched ${data?.length || 0} recipes from database`);
      
      // Process recipes and add images
      const processedRecipes = await Promise.all(
        (data || []).map(async (recipe) => {
          // Get image URL from storage
          const imageUrl = await ImageService.getRecipeImageUrl(recipe.id);
          
          return {
            ...recipe,
            image_url: imageUrl,
            // Ensure we have fallback values for missing data
            title: recipe.title || 'Untitled Recipe',
            description: recipe.description || 'No description available',
            total_time_minutes: recipe.total_time_minutes || null,
            servings: recipe.servings || null,
            notes: recipe.notes || null,
            likes_count: recipe.likes_count || 0,
            meal_type: recipe.meal_type || null,
            recipe_ingredients: recipe.recipe_ingredients || [],
            recipe_steps: recipe.recipe_steps || [],
            recipe_tools: recipe.recipe_tools || [],
            recipe_tags: recipe.recipe_tags || []
          };
        })
      );
      
      // Cache the results
      if (processedRecipes.length > 0) {
        cacheService.set(cacheKey, processedRecipes, 2 * 60 * 1000); // Cache for 2 minutes
      }
      
      setRecipes(processedRecipes);
    } catch (err) {
      console.error('❌ Error fetching recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes from database');
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

  // Set up real-time listener for this specific recipe
  useRealtimeData('recipe', (payload) => {
    if (payload.new?.id === id || payload.old?.id === id) {
      console.log('🔄 Specific recipe changed, refreshing...');
      fetchRecipe();
    }
  });

  const fetchRecipe = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try cache first
      const cacheKey = `recipe-${id}`;
      const cachedData = cacheService.get<Recipe>(cacheKey);
      if (cachedData) {
        console.log('✅ Using cached recipe data for:', id);
        setRecipe(cachedData);
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching recipe by ID from database:', id);

      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          cuisine:cuisines(id, name),
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
        console.error('❌ Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Recipe not found');
      }

      console.log('✅ Fetched recipe:', data.title);
      
      // Get image URL and process recipe
      const imageUrl = await ImageService.getRecipeImageUrl(data.id);
      
      const processedRecipe = {
        ...data,
        image_url: imageUrl,
        title: data.title || 'Untitled Recipe',
        description: data.description || 'No description available',
        total_time_minutes: data.total_time_minutes || null,
        servings: data.servings || null,
        notes: data.notes || null,
        likes_count: data.likes_count || 0,
        meal_type: data.meal_type || null,
        recipe_ingredients: data.recipe_ingredients || [],
        recipe_steps: data.recipe_steps || [],
        recipe_tools: data.recipe_tools || [],
        recipe_tags: data.recipe_tags || []
      };
      
      // Cache the result
      cacheService.set(cacheKey, processedRecipe, 5 * 60 * 1000); // Cache for 5 minutes
      
      setRecipe(processedRecipe);
    } catch (err) {
      console.error('❌ Error fetching recipe:', err);
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
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up real-time listener
  useRealtimeData('cuisine', (payload) => {
    console.log('🔄 Cuisine data changed, refreshing...');
    fetchCuisines();
  });

  const fetchCuisines = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try cache first
      const cacheKey = 'cuisines-all';
      const cachedData = cacheService.get<Cuisine[]>(cacheKey);
      if (cachedData) {
        console.log('✅ Using cached cuisine data');
        setCuisines(cachedData);
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching cuisines from database...');

      const { data, error } = await supabase
        .from('cuisines')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log(`✅ Fetched ${data?.length || 0} cuisines from database`);
      
      // Process cuisines with fallback values
      const processedCuisines = (data || []).map(cuisine => ({
        id: cuisine.id,
        name: cuisine.name || 'Unknown Cuisine'
      }));
      
      // Cache the results
      if (processedCuisines.length > 0) {
        cacheService.set(cacheKey, processedCuisines, 10 * 60 * 1000); // Cache for 10 minutes
      }
      
      setCuisines(processedCuisines);
    } catch (err) {
      console.error('❌ Error fetching cuisines:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cuisines from database');
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

  // Set up real-time listener for likes changes
  useRealtimeData('recipe-like', (payload) => {
    console.log('🔄 Recipe likes changed, refreshing popular recipes...');
    fetchPopularRecipes();
  });

  const fetchPopularRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try cache first
      const cacheKey = `popular-recipes-${limit}`;
      const cachedData = cacheService.get<Recipe[]>(cacheKey);
      if (cachedData) {
        console.log('✅ Using cached popular recipes data');
        setRecipes(cachedData);
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching popular recipes from database...');

      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          cuisine:cuisines(id, name),
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
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log(`✅ Fetched ${data?.length || 0} popular recipes from database`);
      
      // Process recipes and add images
      const processedRecipes = await Promise.all(
        (data || []).map(async (recipe) => {
          const imageUrl = await ImageService.getRecipeImageUrl(recipe.id);
          
          return {
            ...recipe,
            image_url: imageUrl,
            title: recipe.title || 'Untitled Recipe',
            description: recipe.description || 'No description available',
            total_time_minutes: recipe.total_time_minutes || null,
            servings: recipe.servings || null,
            notes: recipe.notes || null,
            likes_count: recipe.likes_count || 0,
            meal_type: recipe.meal_type || null,
            recipe_ingredients: recipe.recipe_ingredients || [],
            recipe_steps: recipe.recipe_steps || [],
            recipe_tools: recipe.recipe_tools || [],
            recipe_tags: recipe.recipe_tags || []
          };
        })
      );
      
      // Cache the results (shorter TTL for popular content)
      if (processedRecipes.length > 0) {
        cacheService.set(cacheKey, processedRecipes, 1 * 60 * 1000); // Cache for 1 minute
      }
      
      setRecipes(processedRecipes);
    } catch (err) {
      console.error('❌ Error fetching popular recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch popular recipes from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularRecipes();
  }, [limit]);

  return { recipes, loading, error, refetch: fetchPopularRecipes };
};

// Hook to get database statistics
export const useDatabaseStats = () => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalCuisines: 0,
    totalIngredients: 0,
    hasImages: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Get counts from all tables
        const [recipesResult, cuisinesResult, ingredientsResult] = await Promise.all([
          supabase.from('recipes').select('count', { count: 'exact', head: true }),
          supabase.from('cuisines').select('count', { count: 'exact', head: true }),
          supabase.from('ingredients').select('count', { count: 'exact', head: true })
        ]);

        // Check if storage bucket exists
        const hasImages = await ImageService.checkStorageAccess();

        setStats({
          totalRecipes: recipesResult.count || 0,
          totalCuisines: cuisinesResult.count || 0,
          totalIngredients: ingredientsResult.count || 0,
          hasImages
        });

      } catch (error) {
        console.error('❌ Error fetching database stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};