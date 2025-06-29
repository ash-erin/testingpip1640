import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RecipeCard } from './RecipeCard';

interface Recipe {
  id: string;
  title: string;
  image_url: string;
  prep_time: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  likes_count: number;
}

interface RecipeCarouselProps {
  title: string;
  recipes: Recipe[];
  onSaveRecipe?: (id: string) => void;
  onViewRecipe?: (id: string) => void;
}

export const RecipeCarousel: React.FC<RecipeCarouselProps> = ({
  title,
  recipes,
  onSaveRecipe,
  onViewRecipe
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of one card plus gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
  }, [recipes]);

  if (!recipes.length) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-white mb-6 px-4 sm:px-6 lg:px-8">{title}</h2>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-slate-800 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 relative">
      <div className="flex items-center justify-between mb-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full transition-colors duration-200 ${
              canScrollLeft 
                ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-full transition-colors duration-200 ${
              canScrollRight 
                ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex space-x-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recipes.map((recipe) => (
            <div key={recipe.id} className="flex-none w-80">
              <RecipeCard
                {...recipe}
                onSave={onSaveRecipe}
                onView={onViewRecipe}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};