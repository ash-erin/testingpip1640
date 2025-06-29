import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Info, Clock, Users } from 'lucide-react';

interface FeaturedRecipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  servings: number;
  difficulty: string;
  cuisine: string;
}

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Mock featured recipes - replace with actual data
  const featuredRecipes: FeaturedRecipe[] = [
    {
      id: '1',
      title: 'Mediterranean Pasta Delight',
      description: 'A traditional Sicilian pasta dish featuring fried eggplant, rich tomato sauce, fresh basil, and grated ricotta salata, offering a harmonious blend of Mediterranean flavors.',
      image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      prep_time: 30,
      servings: 4,
      difficulty: 'Medium',
      cuisine: 'Italian'
    },
    {
      id: '2',
      title: 'Spicy Thai Curry Bowl',
      description: 'Aromatic coconut curry with fresh vegetables, tender chicken, and fragrant herbs served over jasmine rice.',
      image_url: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      prep_time: 25,
      servings: 2,
      difficulty: 'Easy',
      cuisine: 'Thai'
    },
    {
      id: '3',
      title: 'Classic French Ratatouille',
      description: 'A rustic vegetable stew from Provence featuring eggplant, zucchini, bell peppers, and tomatoes in aromatic herbs.',
      image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      prep_time: 45,
      servings: 6,
      difficulty: 'Medium',
      cuisine: 'French'
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredRecipes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, featuredRecipes.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredRecipes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredRecipes.length) % featuredRecipes.length);
  };

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
          src={currentRecipe.image_url}
          alt={currentRecipe.title}
          className="w-full h-full object-cover transition-all duration-1000"
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
              {currentRecipe.description}
            </p>

            {/* Recipe Info */}
            <div className="flex items-center space-x-6 mb-8 text-gray-300">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{currentRecipe.prep_time} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{currentRecipe.servings} servings</span>
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {currentRecipe.difficulty}
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {currentRecipe.cuisine}
              </div>
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

      {/* Slide Indicators */}
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
    </div>
  );
};