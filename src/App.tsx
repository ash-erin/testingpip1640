import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HeroCarousel } from './components/HeroCarousel';
import { RecipeCarousel } from './components/RecipeCarousel';
import { RecipeModal } from './components/RecipeModal';
import { useRecipes, useCuisines, useRecipeById } from './hooks/useRecipes';

function App() {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data from Supabase
  const { recipes: allRecipes, loading: recipesLoading } = useRecipes();
  const { cuisines, loading: cuisinesLoading } = useCuisines();
  const { recipe: selectedRecipe, loading: recipeLoading } = useRecipeById(selectedRecipeId || '');

  const handleViewRecipe = (id: string) => {
    setSelectedRecipeId(id);
    setIsModalOpen(true);
  };

  const handleSaveRecipe = (id: string) => {
    console.log('Saving recipe:', id);
    // TODO: Implement save functionality with Supabase
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipeId(null);
  };

  // Group recipes by cuisine
  const recipesByCuisine = cuisines.reduce((acc, cuisine) => {
    acc[cuisine.name] = allRecipes.filter(recipe => recipe.cuisine_id === cuisine.id);
    return acc;
  }, {} as Record<string, typeof allRecipes>);

  // Get popular recipes (sorted by likes)
  const popularRecipes = [...allRecipes]
    .sort((a, b) => b.likes_count - a.likes_count)
    .slice(0, 6);

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
        {/* Popular This Week */}
        <RecipeCarousel
          title="Popular This Week"
          recipes={popularRecipes}
          onViewRecipe={handleViewRecipe}
          onSaveRecipe={handleSaveRecipe}
          loading={recipesLoading}
        />

        {/* Cuisine Categories */}
        {!cuisinesLoading && cuisines.slice(0, 4).map(cuisine => (
          <RecipeCarousel
            key={cuisine.id}
            title={`${cuisine.name} Cuisine`}
            recipes={recipesByCuisine[cuisine.name] || []}
            onViewRecipe={handleViewRecipe}
            onSaveRecipe={handleSaveRecipe}
            loading={recipesLoading}
          />
        ))}

        {/* Quick & Easy */}
        <RecipeCarousel
          title="Quick & Easy (Under 30 mins)"
          recipes={quickRecipes}
          onViewRecipe={handleViewRecipe}
          onSaveRecipe={handleSaveRecipe}
          loading={recipesLoading}
        />

        {/* Recently Added */}
        <RecipeCarousel
          title="Recently Added"
          recipes={recentRecipes}
          onViewRecipe={handleViewRecipe}
          onSaveRecipe={handleSaveRecipe}
          loading={recipesLoading}
        />
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