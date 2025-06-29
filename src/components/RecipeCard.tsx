import React, { useState } from 'react';
import { Heart, Clock, Users, ChefHat } from 'lucide-react';
import { Recipe } from '../hooks/useRecipes';
import { ImageService } from '../services/ImageService';

interface RecipeCardProps {
  recipe: Recipe;
  onSave?: (id: string) => void;
  onView?: (id: string) => void;
  isSaved?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSave,
  onView,
  isSaved = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [imageError, setImageError] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    onSave?.(recipe.id);
  };

  const handleView = () => {
    onView?.(recipe.id);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Get image URL with fallback
  const getImageUrl = () => {
    if (imageError) {
      return ImageService.getFallbackImage(recipe.title, recipe.cuisine?.name);
    }
    return recipe.image_url || ImageService.getFallbackImage(recipe.title, recipe.cuisine?.name);
  };

  // Get difficulty level based on time or default to "Medium"
  const getDifficultyLevel = () => {
    if (!recipe.total_time_minutes) return 'Medium';
    
    const totalTime = recipe.total_time_minutes;
    if (totalTime <= 20) return 'Easy';
    if (totalTime <= 45) return 'Medium';
    return 'Hard';
  };

  // Format ingredients count
  const getIngredientsCount = () => {
    const count = recipe.recipe_ingredients?.length || 0;
    return count > 0 ? `${count} ingredients` : 'No ingredients listed';
  };

  // Format steps count
  const getStepsCount = () => {
    const count = recipe.recipe_steps?.length || 0;
    return count > 0 ? `${count} steps` : 'No steps listed';
  };

  return (
    <div
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      <div className="relative overflow-hidden rounded-xl bg-slate-800 shadow-lg">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl()}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              saved 
                ? 'bg-red-500 text-white' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>

          {/* Difficulty Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              getDifficultyLevel() === 'Easy' ? 'bg-green-500 text-white' :
              getDifficultyLevel() === 'Medium' ? 'bg-yellow-500 text-black' :
              'bg-red-500 text-white'
            }`}>
              {getDifficultyLevel()}
            </span>
          </div>

          {/* Meal Type Badge */}
          {recipe.meal_type && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                {recipe.meal_type}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors duration-200">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {recipe.description}
            </p>
          )}

          {/* Recipe Info */}
          <div className="flex items-center justify-between text-gray-400 text-sm mb-3">
            <div className="flex items-center space-x-4">
              {recipe.total_time_minutes && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.total_time_minutes}m</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{recipe.servings}</span>
                </div>
              )}
            </div>
            {recipe.cuisine && (
              <div className="flex items-center space-x-1">
                <ChefHat className="w-4 h-4" />
                <span className="truncate max-w-20">{recipe.cuisine.name}</span>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="text-xs text-gray-500 mb-3">
            <div>{getIngredientsCount()}</div>
            <div>{getStepsCount()}</div>
          </div>

          {/* Likes and Tags */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <Heart className="w-4 h-4" />
              <span>{recipe.likes_count} likes</span>
            </div>
            
            {/* Tags */}
            {recipe.recipe_tags && recipe.recipe_tags.length > 0 && (
              <div className="flex space-x-1">
                {recipe.recipe_tags.slice(0, 2).map((tagItem, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs"
                  >
                    {tagItem.tag.name}
                  </span>
                ))}
                {recipe.recipe_tags.length > 2 && (
                  <span className="text-gray-500 text-xs">+{recipe.recipe_tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Recipe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};