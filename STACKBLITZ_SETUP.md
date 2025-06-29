# SnackHack Recipe Platform - StackBlitz Setup Guide

## Quick Setup Instructions

1. Go to [stackblitz.com](https://stackblitz.com)
2. Click "Create Project" → "Vite" → "React + TypeScript"
3. Replace all default files with the files provided in this project
4. Install dependencies (they should auto-install from package.json)
5. Run the development server

## Project Overview

This is a modern recipe discovery platform built with:
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Supabase** integration ready (optional)

## File Structure

```
src/
├── components/          # Reusable UI components
│   ├── Footer.tsx      # Site footer with links
│   ├── HeroCarousel.tsx # Featured recipes carousel
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navbar.tsx      # Navigation with search
│   ├── RecipeCard.tsx  # Individual recipe cards
│   ├── RecipeCarousel.tsx # Recipe category carousels
│   └── RecipeModal.tsx # Recipe detail modal
├── data/
│   └── mockData.ts     # Sample recipe data
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook (Supabase)
│   └── useRecipes.ts   # Recipe data fetching
├── lib/
│   └── supabase.ts     # Supabase client configuration
├── types/
│   └── index.ts        # TypeScript type definitions
├── App.tsx             # Main application component
├── index.css           # Global styles and Tailwind imports
└── main.tsx            # React app entry point
```

## Environment Variables (Optional)

If you want to connect to Supabase for real data:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features

- **Responsive Design**: Works on all device sizes
- **Recipe Discovery**: Browse recipes by category
- **Search Functionality**: Find recipes by name or ingredient
- **Recipe Details**: View full recipes with ingredients and instructions
- **User Authentication**: Ready for Supabase auth integration
- **Modern UI**: Clean, Netflix-inspired design with smooth animations

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Notes for Team Members

- The project uses mock data by default - no backend required to run
- All components are fully typed with TypeScript
- Tailwind CSS is configured for consistent styling
- The design follows modern web standards with accessibility in mind
- Ready for Supabase integration when needed

## Troubleshooting

If you encounter issues:
1. Make sure all dependencies are installed
2. Check that you're using Node.js 16+ 
3. Clear browser cache if styles don't load
4. Restart the development server

## Next Steps

After setting up in StackBlitz:
1. Test all functionality works correctly
2. Share the StackBlitz URL with team members
3. Consider setting up Supabase for real data
4. Customize the design and add new features as needed