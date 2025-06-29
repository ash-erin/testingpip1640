import React from 'react';
import { X, Clock, Users, ChefHat, Heart, Share2, Utensils } from 'lucide-react';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    prep_time: number;
    cook_time: number;
    servings: number;
    difficulty: string;
    cuisine: string;
    ingredients: string[];
    instructions: string[];
    tools: string[];
    author: {
      name: string;
      avatar_url?: string;
    };
  } | null;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, recipe }) => {
  if (!isOpen || !recipe) return null;

  const totalTime = recipe.prep_time + recipe.cook_time;

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
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-64 object-cover"
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
              <p className="text-gray-200 text-lg">{recipe.description}</p>
            </div>
          </div>

          <div className="p-6">
            {/* Recipe Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{totalTime} min total</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ChefHat className="w-5 h-5" />
                  <span>{recipe.cuisine}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  recipe.difficulty === 'Easy' ? 'bg-green-500 text-white' :
                  recipe.difficulty === 'Medium' ? 'bg-yellow-500 text-black' :
                  'bg-red-500 text-white'
                }`}>
                  {recipe.difficulty}
                </div>
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

            {/* Author */}
            <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-700">
              <img
                src={recipe.author.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                alt={recipe.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-medium">Recipe by {recipe.author.name}</p>
                <p className="text-gray-400 text-sm">Home Chef</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Ingredients</h3>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start space-x-3 text-gray-300">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>

                {/* Tools */}
                {recipe.tools.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <Utensils className="w-5 h-5" />
                      <span>Equipment Needed</span>
                    </h4>
                    <ul className="space-y-1">
                      {recipe.tools.map((tool, index) => (
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
                <h3 className="text-xl font-bold text-white mb-4">Instructions</h3>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};