import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HeroCarousel } from './components/HeroCarousel';
import { RecipeCarousel } from './components/RecipeCarousel';
import { RecipeModal } from './components/RecipeModal';
import { mockRecipes, categories } from './data/mockData';
import { Recipe } from './types';

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewRecipe = (id: string) => {
    const recipe = mockRecipes.find(r => r.id === id);
    if (recipe) {
      setSelectedRecipe(recipe);
      setIsModalOpen(true);
    }
  };

  const handleSaveRecipe = (id: string) => {
    console.log('Saving recipe:', id);
    // Implement save functionality
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  // Group recipes by category
  const recipesByCategory = categories.reduce((acc, category) => {
    acc[category] = mockRecipes.filter(recipe => recipe.category === category);
    return acc;
  }, {} as Record<string, Recipe[]>);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Recipe Categories */}
      <div className="bg-slate-900 min-h-screen">
        {/* Featured Recipes */}
        <RecipeCarousel
          title="Featured Recipes"
          recipes={mockRecipes.filter(recipe => recipe.is_featured)}
          onViewRecipe={handleViewRecipe}
          onSaveRecipe={handleSaveRecipe}
        />

        {/* Popular This Week */}
        <RecipeCarousel
          title="Popular This Week"
          recipes={mockRecipes.sort((a, b) => b.likes_count - a.likes_count).slice(0, 6)}
          onViewRecipe={handleViewRecipe}
          onSaveRecipe={handleSaveRecipe}
        />

        {/* Categories */}
        {categories.slice(0, 4).map(category => (
          <RecipeCarousel
            key={category}
            title={`${category} Cuisine`}
            recipes={recipesByCategory[category] || []}
            onViewRecipe={handleViewRecipe}
            onSaveRecipe={handleSaveRecipe}
          />
        ))}

        {/* Quick & Easy */}
        <RecipeCarousel
          title="Quick & Easy (Under 30 mins)"
          recipes={mockRecipes.filter(recipe => (recipe.prep_time + recipe.cook_time) <= 30)}
          onViewRecipe={handleViewRecipe}
          onSaveRecipe={handleSaveRecipe}
        />

        {/* Recently Added */}
        <RecipeCarousel
          title="Recently Added"
          recipes={mockRecipes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6)}
          onViewRecipe={handleViewRecipe}
          onSaveRecipe={handleSaveRecipe}
        />
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recipe={selectedRecipe}
      />
    </Layout>
  );
}

export default App;