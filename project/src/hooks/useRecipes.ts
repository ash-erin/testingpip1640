import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Recipe } from '../types';

export const useRecipes = (category?: string, limit?: number) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('recipes')
          .select(`
            *,
            author:profiles(id, name, avatar_url)
          `)
          .order('created_at', { ascending: false });

        if (category) {
          query = query.eq('category', category);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        setRecipes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [category, limit]);

  return { recipes, loading, error };
};

export const useFeaturedRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select(`
            *,
            author:profiles(id, name, avatar_url)
          `)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setRecipes(data || []);
      } catch (err) {
        console.error('Error fetching featured recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRecipes();
  }, []);

  return { recipes, loading };
};