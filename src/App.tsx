import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HeroCarousel } from './components/HeroCarousel';
import { RecipeCarousel } from './components/RecipeCarousel';
import { RecipeModal } from './components/RecipeModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useRecipes, useCuisines, useRecipeById, usePopularRecipes } from './hooks/useRecipes';

function App() {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data from Supabase
  const { recipes: allRecipes, loading: recipesLoading, error: recipesError, refetch: refetchRecipes } = useRecipes();
  const { cuisines, loading: cuisinesLoading, error: cuisinesError, refetch: refetchCuisines } = useCuisines();
  const { recipes: popularRecipes, loading: popularLoading, error: popularError } = usePopularRecipes();
  const { recipe: selectedRecipe, loading: recipeLoading } = useRecipeById(selectedRecipeId || '');

  const handleViewRecipe = (id: string) => {
    setSelectedRecipeId(id);
    setIsModalOpen(true);
  };

  const handleSaveRecipe = async (id: string) => {
    console.log('Saving recipe:', id);
    // TODO: Implement save functionality with Supabase
    // This would involve inserting into user_saved_recipes table
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipeId(null);
  };

  // Show loading state while initial data is loading
  if (recipesLoading && cuisinesLoading) {
    return (
      <Layout>
        <div className="bg-slate-900 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-white mt-4">Loading recipes from database...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state if there's a critical error
  if (recipesError || cuisinesError) {
    return (
      <Layout>
        <div className="bg-slate-900 min-h-screen flex items-center justify-center">
          <ErrorMessage 
            message={recipesError || cuisinesError || 'Failed to load data'} 
            onRetry={() => {
              refetchRecipes();
              refetchCuisines();
            }}
          />
        </div>
      </Layout>
    );
  }

  // Group recipes by cuisine
  const recipesByCuisine = cuisines.reduce((acc, cuisine) => {
    acc[cuisine.name] = allRecipes.filter(recipe => recipe.cuisine_id === cuisine.id);
    return acc;
  }, {} as Record<string, typeof allRecipes>);

  // Get quick recipes (under 30 minutes)
  const quickRecipes = allRecipes.filter(recipe => 
    recipe.total_time_minutes && recipe.total_time_minutes <= 30
  );

  // Get recent recipes
  const recentRecipes = [...allRecipes]
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 6);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Recipe Categories */}
      <div className="bg-slate-900 min-h-screen">
        {/* Database Connection Status */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">
                Connected to Supabase • {allRecipes.length} recipes loaded
              </span>
            </div>
          </div>
        </div>

        {/* Popular This Week */}
        <RecipeCarousel
          title="Popular This Week"
          recipes={popularRecipes}
          onViewRecipe={handleViewRecipe}
          onSaveRecipe={handleSaveRecipe}
          loading={popularLoading}
          error={popularError}
        />

        {/* All Recipes if no cuisine-specific data */}
        {allRecipes.length > 0 && (
          <RecipeCarousel
            title="All Recipes"
            recipes={allRecipes.slice(0, 8)}
            onViewRecipe={handleViewRecipe}
            onSaveRecipe={handleSaveRecipe}
            loading={recipesLoading}
          />
        )}

        {/* Cuisine Categories */}
        {!cuisinesLoading && cuisines.slice(0, 4).map(cuisine => {
          const cuisineRecipes = recipesByCuisine[cuisine.name] || [];
          if (cuisineRecipes.length === 0) return null;
          
          return (
            <RecipeCarousel
              key={cuisine.id}
              title={`${cuisine.name} Cuisine`}
              recipes={cuisineRecipes}
              onViewRecipe={handleViewRecipe}
              onSaveRecipe={handleSaveRecipe}
              loading={recipesLoading}
            />
          );
        })}

        {/* Quick & Easy */}
        {quickRecipes.length > 0 && (
          <RecipeCarousel
            title="Quick & Easy (Under 30 mins)"
            recipes={quickRecipes}
            onViewRecipe={handleViewRecipe}
            onSaveRecipe={handleSaveRecipe}
            loading={recipesLoading}
          />
        )}

        {/* Recently Added */}
        {recentRecipes.length > 0 && (
          <RecipeCarousel
            title="Recently Added"
            recipes={recentRecipes}
            onViewRecipe={handleViewRecipe}
            onSaveRecipe={handleSaveRecipe}
            loading={recipesLoading}
          />
        )}

        {/* Empty State */}
        {!recipesLoading && allRecipes.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-white mb-4">No recipes found</h3>
            <p className="text-gray-400 mb-6">
              It looks like there are no recipes in your database yet.
            </p>
            <p className="text-gray-500 text-sm">
              Add some recipes to your Supabase database to see them here!
            </p>
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recipe={selectedRecipe}
        loading={recipeLoading}
      />
    </Layout>
  );
}

export default App;