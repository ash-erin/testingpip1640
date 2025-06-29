import { Recipe } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Mediterranean Pasta Delight',
    description: 'A traditional Sicilian pasta dish featuring fried eggplant, rich tomato sauce, fresh basil, and grated ricotta salata.',
    image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    prep_time: 20,
    cook_time: 25,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Italian',
    meal_type: 'Dinner',
    ingredients: [
      '400g pasta (penne or rigatoni)',
      '2 large eggplants, diced',
      '400g canned tomatoes',
      '100g ricotta salata, grated',
      '1/4 cup fresh basil leaves',
      '4 cloves garlic, minced',
      '1/2 cup olive oil',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Heat olive oil in a large pan over medium heat.',
      'Add diced eggplant and cook until golden brown, about 10 minutes.',
      'Add minced garlic and cook for 1 minute until fragrant.',
      'Add canned tomatoes, season with salt and pepper, and simmer for 15 minutes.',
      'Meanwhile, cook pasta according to package directions until al dente.',
      'Drain pasta and toss with the eggplant sauce.',
      'Serve topped with grated ricotta salata and fresh basil leaves.'
    ],
    tools: ['Large pan', 'Pasta pot', 'Colander', 'Wooden spoon'],
    created_at: '2025-01-01T00:00:00Z',
    author: {
      id: '1',
      name: 'Maria Rossi',
      avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    is_featured: true,
    category: 'Italian',
    likes_count: 245,
    saves_count: 89
  },
  {
    id: '2',
    title: 'Spicy Thai Green Curry',
    description: 'Aromatic coconut curry with fresh vegetables, tender chicken, and fragrant herbs served over jasmine rice.',
    image_url: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    prep_time: 15,
    cook_time: 20,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Thai',
    meal_type: 'Dinner',
    ingredients: [
      '500g chicken breast, sliced',
      '400ml coconut milk',
      '3 tbsp green curry paste',
      '1 eggplant, cubed',
      '1 bell pepper, sliced',
      '100g green beans',
      '2 tbsp fish sauce',
      '1 tbsp palm sugar',
      'Thai basil leaves',
      'Jasmine rice for serving'
    ],
    instructions: [
      'Heat 2 tbsp of coconut milk in a wok over medium heat.',
      'Add green curry paste and fry until fragrant.',
      'Add chicken and cook until no longer pink.',
      'Pour in remaining coconut milk and bring to a simmer.',
      'Add vegetables and cook for 10 minutes until tender.',
      'Season with fish sauce and palm sugar.',
      'Garnish with Thai basil and serve over jasmine rice.'
    ],
    tools: ['Wok or large pan', 'Rice cooker', 'Knife', 'Cutting board'],
    created_at: '2025-01-02T00:00:00Z',
    author: {
      id: '2',
      name: 'Somchai Patel',
      avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    is_featured: false,
    category: 'Thai',
    likes_count: 189,
    saves_count: 67
  },
  {
    id: '3',
    title: 'Classic French Ratatouille',
    description: 'A rustic vegetable stew from Provence featuring eggplant, zucchini, bell peppers, and tomatoes in aromatic herbs.',
    image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    prep_time: 30,
    cook_time: 45,
    servings: 6,
    difficulty: 'Medium',
    cuisine: 'French',
    meal_type: 'Dinner',
    ingredients: [
      '1 large eggplant, diced',
      '2 zucchini, sliced',
      '2 bell peppers, chopped',
      '4 tomatoes, chopped',
      '1 onion, sliced',
      '4 cloves garlic, minced',
      '1/4 cup olive oil',
      '2 tsp herbes de Provence',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Heat olive oil in a large Dutch oven over medium heat.',
      'Sauté onion until translucent, about 5 minutes.',
      'Add eggplant and cook for 10 minutes until softened.',
      'Add bell peppers and zucchini, cook for 5 minutes.',
      'Add tomatoes, garlic, and herbs. Season with salt and pepper.',
      'Simmer covered for 30 minutes, stirring occasionally.',
      'Serve hot as a main dish or side.'
    ],
    tools: ['Dutch oven', 'Knife', 'Cutting board', 'Wooden spoon'],
    created_at: '2025-01-03T00:00:00Z',
    author: {
      id: '3',
      name: 'Pierre Dubois',
      avatar_url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    is_featured: true,
    category: 'French',
    likes_count: 156,
    saves_count: 78
  },
  {
    id: '4',
    title: 'Japanese Chicken Teriyaki Bowl',
    description: 'Tender glazed chicken served over steamed rice with crisp vegetables and a savory teriyaki sauce.',
    image_url: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    prep_time: 10,
    cook_time: 15,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'Japanese',
    meal_type: 'Lunch',
    ingredients: [
      '2 chicken breasts, sliced',
      '1/4 cup soy sauce',
      '2 tbsp mirin',
      '2 tbsp sake',
      '1 tbsp sugar',
      '1 tsp grated ginger',
      '2 cups cooked rice',
      '1 cucumber, julienned',
      '1 carrot, julienned',
      'Sesame seeds for garnish'
    ],
    instructions: [
      'Mix soy sauce, mirin, sake, sugar, and ginger for teriyaki sauce.',
      'Heat oil in a pan and cook chicken until golden.',
      'Pour teriyaki sauce over chicken and simmer until glazed.',
      'Serve chicken over rice with fresh vegetables.',
      'Garnish with sesame seeds.'
    ],
    tools: ['Pan', 'Rice cooker', 'Knife', 'Mixing bowl'],
    created_at: '2025-01-04T00:00:00Z',
    author: {
      id: '4',
      name: 'Yuki Tanaka',
      avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    is_featured: false,
    category: 'Japanese',
    likes_count: 203,
    saves_count: 92
  },
  {
    id: '5',
    title: 'Mexican Street Tacos',
    description: 'Authentic street-style tacos with seasoned meat, fresh cilantro, onions, and lime on soft corn tortillas.',
    image_url: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    prep_time: 20,
    cook_time: 15,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Mexican',
    meal_type: 'Dinner',
    ingredients: [
      '500g beef or pork, diced',
      '8 corn tortillas',
      '1 onion, finely chopped',
      '1/2 cup fresh cilantro',
      '2 limes, cut into wedges',
      '2 tsp cumin',
      '1 tsp chili powder',
      '1 tsp paprika',
      'Salt and pepper',
      'Hot sauce to taste'
    ],
    instructions: [
      'Season meat with cumin, chili powder, paprika, salt, and pepper.',
      'Cook meat in a hot pan until browned and cooked through.',
      'Warm tortillas in a dry pan or over an open flame.',
      'Fill tortillas with meat, onions, and cilantro.',
      'Serve with lime wedges and hot sauce.'
    ],
    tools: ['Pan', 'Tongs', 'Knife', 'Cutting board'],
    created_at: '2025-01-05T00:00:00Z',
    author: {
      id: '5',
      name: 'Carlos Rodriguez',
      avatar_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    is_featured: false,
    category: 'Mexican',
    likes_count: 178,
    saves_count: 65
  },
  {
    id: '6',
    title: 'Indian Butter Chicken',
    description: 'Creamy and rich tomato-based curry with tender chicken pieces, perfect with basmati rice or naan bread.',
    image_url: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    prep_time: 25,
    cook_time: 30,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Indian',
    meal_type: 'Dinner',
    ingredients: [
      '600g chicken breast, cubed',
      '1 cup heavy cream',
      '400g canned tomatoes',
      '1 onion, chopped',
      '4 cloves garlic, minced',
      '1 inch ginger, grated',
      '2 tsp garam masala',
      '1 tsp turmeric',
      '1 tsp cumin',
      '2 tbsp butter',
      'Fresh cilantro for garnish'
    ],
    instructions: [
      'Marinate chicken with half the spices for 15 minutes.',
      'Cook chicken in butter until golden, set aside.',
      'Sauté onion, garlic, and ginger until fragrant.',
      'Add remaining spices and cook for 1 minute.',
      'Add tomatoes and simmer for 15 minutes.',
      'Stir in cream and cooked chicken.',
      'Garnish with cilantro and serve with rice.'
    ],
    tools: ['Large pan', 'Mixing bowl', 'Wooden spoon', 'Blender'],
    created_at: '2025-01-06T00:00:00Z',
    author: {
      id: '6',
      name: 'Priya Sharma',
      avatar_url: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    is_featured: true,
    category: 'Indian',
    likes_count: 267,
    saves_count: 134
  }
];

export const categories = [
  'Italian',
  'Thai',
  'French',
  'Japanese',
  'Mexican',
  'Indian',
  'Chinese',
  'Mediterranean'
];