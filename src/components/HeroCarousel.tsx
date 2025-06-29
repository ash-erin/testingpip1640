import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Info, Clock, Users } from 'lucide-react';
import { useRecipes } from '../hooks/useRecipes';
import { ImageService } from '../services/ImageService';

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Get featured recipes from database
  const { recipes: allRecipes, loading } = useRecipes(undefined, 5);
  
  // Use the first few recipes as featured, or fallback to empty array
  const featuredRecipes = allRecipes.slice(0, 3);

  useEffect(() => {
    if (!isPlaying || featuredRecipes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredRecipes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, featuredRecipes.length]);

  const nextSlide = () => {
    if (featuredRecipes.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % featuredRecipes.length);
    }
  };

  const prevSlide = () => {
    if (featuredRecipes.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + featuredRecipes.length) % featuredRecipes.length);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative h-[70vh] overflow-hidden bg-slate-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-white">Loading featured recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  // No recipes state
  if (featuredRecipes.length === 0) {
    return (
      <div className="relative h-[70vh] overflow-hidden bg-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl text-center mx-auto">
              <div className="mb-4">
                <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  SnackHack
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Discover Amazing Recipes
              </h1>
              
              <p className="text-lg text-gray-200 mb-6 leading-relaxed max-w-xl mx-auto">
                Your culinary journey starts here. Connect your database to see featured recipes from your collection.
              </p>

              <div className="flex items-center justify-center space-x-4">
                <button className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200">
                  <Info className="w-5 h-5" />
                  <span>Learn More</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentRecipe = featuredRecipes[currentSlide];

  return (
    <div 
      className="relative h-[70vh] overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentRecipe.image_url || ImageService.getFallbackImage(currentRecipe.title, currentRecipe.cuisine?.name)}
          alt={currentRecipe.title}
          className="w-full h-full object-cover transition-all duration-1000"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = ImageService.getFallbackImage(currentRecipe.title, currentRecipe.cuisine?.name);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="mb-4">
              <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured Recipe
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {currentRecipe.title}
            </h1>
            
            <p className="text-lg text-gray-200 mb-6 leading-relaxed max-w-xl">
              {currentRecipe.description || 'A delicious recipe from our collection.'}
            </p>

            {/* Recipe Info */}
            <div className="flex items-center space-x-6 mb-8 text-gray-300 flex-wrap">
              {currentRecipe.total_time_minutes && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{currentRecipe.total_time_minutes} min</span>
                </div>
              )}
              {currentRecipe.servings && (
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{currentRecipe.servings} servings</span>
                </div>
              )}
              {currentRecipe.cuisine && (
                <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {currentRecipe.cuisine.name}
                </div>
              )}
              {currentRecipe.meal_type && (
                <div className="px-3 py-1 bg-orange-500/80 rounded-full text-sm">
                  {currentRecipe.meal_type}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200">
                <Play className="w-5 h-5" />
                <span>View Recipe</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-600/80 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200">
                <Info className="w-5 h-5" />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {featuredRecipes.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {featuredRecipes.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredRecipes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};