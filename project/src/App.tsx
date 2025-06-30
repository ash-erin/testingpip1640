import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HeroCarousel } from './components/HeroCarousel';
import { RecipeCarousel } from './components/RecipeCarousel';
import { RecipeModal } from './components/RecipeModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { RealtimeStatus } from './components/RealtimeStatus';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useRecipes, useCuisines, useRecipeById, usePopularRecipes, useDatabaseStats } from './hooks/useRecipes';
import { useRealtimeSync } from './hooks/useRealtimeSync';

function App() {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRealtimeStatus, setShowRealtimeStatus] = useState(false);

  // Initialize real-time synchronization
  const { isConnected, error: syncError } = useRealtimeSync();

  // Fetch data from Supabase with real-time updates
  const { recipes: allRecipes, loading: recipesLoading, error: recipesError, refetch: refetchRecipes } = useRecipes();
  const { cuisines, loading: cuisinesLoading, error: cuisinesError, refetch: refetchCuisines } = useCuisines();
  const { recipes: popularRecipes, loading: popularLoading, error: popularError } = usePopularRecipes();
  const { recipe: selectedRecipe, loading: recipeLoading } = useRecipeById(selectedRecipeId || '');
  const { stats, loading: statsLoading } = useDatabaseStats();

  const handleViewRecipe = (id: string) => {
    setSelectedRecipeId(id);
    setIsModalOpen(true);
  };

  const handleSaveRecipe = async (id: string) => {
    console.log('💾 Saving recipe:', id);
    // TODO: Implement save functionality with Supabase
    // This would involve inserting into user_saved_recipes table
    // Note: This would require write permissions and user authentication
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipeId(null);
  };

  // Show loading state while initial data is loading
  if (recipesLoading && cuisinesLoading && statsLoading) {
    return (
      <ErrorBoundary>
        <Layout>
          <div className="bg-slate-900 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-white mt-4">🔄 Loading recipes from Supabase database...</p>
              <p className="text-gray-400 text-sm mt-2">Connected to: whguiexyhsfqhrjtjpru.supabase.co</p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-400">
                  Real-time sync: {isConnected ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </Layout>
      </ErrorBoundary>
    );
  }

  // Show error state if there's a critical error
  if (recipesError || cuisinesError) {
    return (
      <ErrorBoundary>
        <Layout>
          <div className="bg-slate-900 min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md">
              <ErrorMessage 
                message={recipesError || cuisinesError || 'Failed to load data from database'} 
                onRetry={() => {
                  refetchRecipes();
                  refetchCuisines();
                }}
              />
              <div className="mt-4 p-4 bg-slate-800 rounded-lg text-left">
                <h4 className="text-white font-semibold mb-2">🔧 Database Connection Details:</h4>
                <p className="text-gray-300 text-sm">URL: whguiexyhsfqhrjtjpru.supabase.co</p>
                <p className="text-gray-300 text-sm">Status: {recipesError || cuisinesError}</p>
                <p className="text-gray-300 text-sm">Real-time: {isConnected ? 'Connected' : 'Disconnected'}</p>
                {syncError && (
                  <p className="text-red-400 text-sm mt-2">Sync Error: {syncError}</p>
                )}
              </div>
            </div>
          </div>
        </Layout>
      </ErrorBoundary>
    );
  }

  // Group recipes by cuisine (only show cuisines that have recipes)
  const recipesByCuisine = cuisines.reduce((acc, cuisine) => {
    const cuisineRecipes = allRecipes.filter(recipe => recipe.cuisine_id === cuisine.id);
    if (cuisineRecipes.length > 0) {
      acc[cuisine.name] = cuisineRecipes;
    }
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
    <ErrorBoundary>
      <Layout>
        {/* Hero Section */}
        <HeroCarousel />

        {/* Recipe Categories */}
        <div className="bg-slate-900 min-h-screen">
          {/* Database Connection Status */}
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-green-400 text-sm">
                    ✅ Connected to Supabase • {stats.totalRecipes} recipes • {stats.totalCuisines} cuisines
                  </span>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                  <span className="text-blue-400 text-sm">
                    Real-time: {isConnected ? 'Active' : 'Inactive'}
                  </span>
                  {stats.hasImages && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-purple-400 text-sm">Images: Connected</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setShowRealtimeStatus(!showRealtimeStatus)}
                  className="text-xs text-green-300 hover:text-green-200 transition-colors duration-200"
                >
                  {showRealtimeStatus ? 'Hide' : 'Show'} Details
                </button>
              </div>
              {cuisines.length > 0 && (
                <div className="mt-2 text-xs text-green-300">
                  📂 Available cuisines: {cuisines.map(c => c.name).join(', ')}
                </div>
              )}
            </div>

            {/* Real-time Status Panel */}
            {showRealtimeStatus && (
              <div className="mt-4">
                <RealtimeStatus />
              </div>
            )}
          </div>

          {/* Popular This Week - Only show if we have recipes */}
          {popularRecipes.length > 0 && (
            <ErrorBoundary fallback={<div className="p-8 text-center text-red-400">Error loading popular recipes</div>}>
              <RecipeCarousel
                title="🔥 Popular This Week"
                recipes={popularRecipes}
                onViewRecipe={handleViewRecipe}
                onSaveRecipe={handleSaveRecipe}
                loading={popularLoading}
                error={popularError}
              />
            </ErrorBoundary>
          )}

          {/* All Recipes - Only show if we have recipes */}
          {allRecipes.length > 0 && (
            <ErrorBoundary fallback={<div className="p-8 text-center text-red-400">Error loading all recipes</div>}>
              <RecipeCarousel
                title="🍽️ All Recipes"
                recipes={allRecipes.slice(0, 8)}
                onViewRecipe={handleViewRecipe}
                onSaveRecipe={handleSaveRecipe}
                loading={recipesLoading}
              />
            </ErrorBoundary>
          )}

          {/* Cuisine Categories - Only show cuisines that have recipes */}
          {Object.entries(recipesByCuisine).map(([cuisineName, cuisineRecipes]) => (
            <ErrorBoundary key={cuisineName} fallback={<div className="p-8 text-center text-red-400">Error loading {cuisineName} recipes</div>}>
              <RecipeCarousel
                title={`🌍 ${cuisineName} Cuisine`}
                recipes={cuisineRecipes}
                onViewRecipe={handleViewRecipe}
                onSaveRecipe={handleSaveRecipe}
                loading={recipesLoading}
              />
            </ErrorBoundary>
          ))}

          {/* Quick & Easy - Only show if we have quick recipes */}
          {quickRecipes.length > 0 && (
            <ErrorBoundary fallback={<div className="p-8 text-center text-red-400">Error loading quick recipes</div>}>
              <RecipeCarousel
                title="⚡ Quick & Easy (Under 30 mins)"
                recipes={quickRecipes}
                onViewRecipe={handleViewRecipe}
                onSaveRecipe={handleSaveRecipe}
                loading={recipesLoading}
              />
            </ErrorBoundary>
          )}

          {/* Recently Added - Only show if we have recent recipes */}
          {recentRecipes.length > 0 && (
            <ErrorBoundary fallback={<div className="p-8 text-center text-red-400">Error loading recent recipes</div>}>
              <RecipeCarousel
                title="🆕 Recently Added"
                recipes={recentRecipes}
                onViewRecipe={handleViewRecipe}
                onSaveRecipe={handleSaveRecipe}
                loading={recipesLoading}
              />
            </ErrorBoundary>
          )}

          {/* Empty State - Only show if no recipes at all */}
          {!recipesLoading && allRecipes.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-white mb-4">📭 No recipes found in database</h3>
              <p className="text-gray-400 mb-6">
                Your Supabase database is connected but doesn't contain any recipes yet.
              </p>
              <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-auto">
                <h4 className="text-white font-semibold mb-2">🗄️ Database Status:</h4>
                <p className="text-green-400 text-sm">✅ Connected to: whguiexyhsfqhrjtjpru.supabase.co</p>
                <p className={`text-sm mt-1 ${isConnected ? 'text-blue-400' : 'text-yellow-400'}`}>
                  🔄 Real-time sync: {isConnected ? 'Active' : 'Inactive'}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  📊 Database contains: {stats.totalRecipes} recipes, {stats.totalCuisines} cuisines, {stats.totalIngredients} ingredients
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Add some recipes to your database to see them here!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recipe Modal */}
        <ErrorBoundary fallback={<div className="fixed inset-0 bg-black/75 flex items-center justify-center text-white">Error loading recipe details</div>}>
          <RecipeModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            recipe={selectedRecipe}
            loading={recipeLoading}
          />
        </ErrorBoundary>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;