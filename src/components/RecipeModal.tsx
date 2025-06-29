import React from 'react';
import { X, Clock, Users, ChefHat, Heart, Share2, Utensils } from 'lucide-react';
import { Recipe } from '../hooks/useRecipes';
import { ImageService } from '../services/ImageService';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  loading?: boolean;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ 
  isOpen, 
  onClose, 
  recipe, 
  loading = false 
}) => {
  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-black/75 transition-opacity" onClick={onClose} />
          <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 shadow-xl rounded-2xl">
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-white mt-4">Loading recipe details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  // Format ingredients from database
  const formatIngredients = () => {
    if (!recipe.recipe_ingredients || recipe.recipe_ingredients.length === 0) {
      return ['No ingredients listed'];
    }

    return recipe.recipe_ingredients
      .map(ri => {
        let ingredient = ri.ingredient.name;
        if (ri.amount) ingredient = `${ri.amount} ${ingredient}`;
        if (ri.descriptor) ingredient = `${ingredient} (${ri.descriptor})`;
        if (ri.is_optional) ingredient = `${ingredient} - optional`;
        return ingredient;
      })
      .sort();
  };

  // Format instructions from database
  const formatInstructions = () => {
    if (!recipe.recipe_steps || recipe.recipe_steps.length === 0) {
      return ['No instructions available'];
    }

    return recipe.recipe_steps
      .sort((a, b) => (a.step_number || 0) - (b.step_number || 0))
      .map(step => step.instruction)
      .filter(Boolean);
  };

  // Get tools from database
  const getTools = () => {
    if (!recipe.recipe_tools || recipe.recipe_tools.length === 0) {
      return [];
    }
    return recipe.recipe_tools.map(rt => rt.tool.name);
  };

  // Get tags from database
  const getTags = () => {
    if (!recipe.recipe_tags || recipe.recipe_tags.length === 0) {
      return [];
    }
    return recipe.recipe_tags.map(rt => rt.tag.name);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black/75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="relative">
            <img
              src={recipe.image_url || ImageService.getFallbackImage(recipe.title, recipe.cuisine?.name)}
              alt={recipe.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = ImageService.getFallbackImage(recipe.title, recipe.cuisine?.name);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-3xl font-bold text-white mb-2">{recipe.title}</h1>
              {recipe.description && (
                <p className="text-gray-200 text-lg">{recipe.description}</p>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Recipe Info */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center space-x-6 text-gray-300 flex-wrap gap-2">
                {recipe.total_time_minutes && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{recipe.total_time_minutes} min total</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>{recipe.servings} servings</span>
                  </div>
                )}
                {recipe.cuisine && (
                  <div className="flex items-center space-x-2">
                    <ChefHat className="w-5 h-5" />
                    <span>{recipe.cuisine.name}</span>
                  </div>
                )}
                {recipe.meal_type && (
                  <div className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm">
                    {recipe.meal_type}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200">
                  <Heart className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Tags */}
            {getTags().length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {getTags().map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Ingredients ({formatIngredients().length})
                </h3>
                <ul className="space-y-2">
                  {formatIngredients().map((ingredient, index) => (
                    <li key={index} className="flex items-start space-x-3 text-gray-300">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>

                {/* Tools */}
                {getTools().length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <Utensils className="w-5 h-5" />
                      <span>Equipment Needed</span>
                    </h4>
                    <ul className="space-y-1">
                      {getTools().map((tool, index) => (
                        <li key={index} className="text-gray-300 text-sm">
                          • {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Instructions ({formatInstructions().length} steps)
                </h3>
                <ol className="space-y-4">
                  {formatInstructions().map((instruction, index) => (
                    <li key={index} className="flex space-x-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <p className="text-gray-300 leading-relaxed pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Notes */}
            {recipe.notes && (
              <div className="mt-8 p-4 bg-slate-800 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">Chef's Notes</h4>
                <p className="text-gray-300">{recipe.notes}</p>
              </div>
            )}

            {/* Recipe Stats */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>❤️ {recipe.likes_count} likes</span>
                  <span>📅 Added {recipe.created_at ? new Date(recipe.created_at).toLocaleDateString() : 'Unknown'}</span>
                </div>
                <div className="text-xs">
                  Recipe ID: {recipe.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};