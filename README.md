# SnackHack - Real-time Recipe Platform

A modern recipe discovery platform with real-time data synchronization, built with React, TypeScript, and Supabase.

## 🚀 Features

### Real-time Data Synchronization
- **Live Updates**: Automatic UI updates when database changes occur
- **Multi-table Sync**: Monitors recipes, ingredients, cuisines, users, and more
- **Connection Management**: Automatic reconnection with retry logic
- **Cache Integration**: Intelligent caching with TTL and invalidation

### Security & Performance
- **Read-only Access**: Secure data access with no unauthorized writes
- **Error Boundaries**: Comprehensive error handling and recovery
- **Lazy Loading**: Optimized performance with efficient data loading
- **Connection Monitoring**: Real-time status monitoring and diagnostics

### User Experience
- **Responsive Design**: Works seamlessly across all devices
- **Netflix-inspired UI**: Modern, clean interface with smooth animations
- **Search & Discovery**: Advanced recipe search and categorization
- **Real-time Indicators**: Visual feedback for connection and sync status

## 🏗️ Architecture

### Real-time Synchronization System

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │  RealtimeService │    │   Supabase DB   │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Components  │◄┼────┼►│ Subscriptions│◄┼────┼►│   Tables    │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Cache Layer │◄┼────┼►│ Error Handler│ │    │ │ Real-time   │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ │ Events      │ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Services

#### RealtimeService
- Manages WebSocket connections to Supabase
- Handles subscription lifecycle and error recovery
- Provides event-driven data change notifications
- Implements security measures for read-only access

#### CacheService
- Intelligent caching with TTL (Time To Live)
- Automatic cleanup of expired entries
- Memory-efficient with configurable size limits
- Cache statistics and hit rate monitoring

#### Error Boundaries
- Component-level error isolation
- Graceful degradation and recovery options
- Development-friendly error reporting
- Production-safe error handling

## 🔧 Technical Implementation

### Database Schema Integration
The system integrates with the following Supabase tables:
- `recipes` - Main recipe data
- `cuisines` - Recipe categories
- `ingredients` - Recipe ingredients
- `recipe_ingredients` - Recipe-ingredient relationships
- `recipe_steps` - Cooking instructions
- `recipe_tools` - Required cooking tools
- `recipe_tags` - Recipe tags and labels
- `users` - User profiles
- `user_saved_recipes` - User's saved recipes
- `recipe_likes` - Recipe likes and ratings

### Real-time Subscriptions
```typescript
// Example: Recipe changes subscription
const recipeChannel = supabase
  .channel('recipes-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'recipes'
  }, (payload) => handleRecipeChange(payload))
  .subscribe();
```

### Security Measures
- **Read-only Operations**: All database operations are read-only
- **Error Handling**: Proper handling of unauthorized write attempts
- **Token Security**: Secure handling of authentication credentials
- **Connection Validation**: Continuous connection health monitoring

## 🛠️ Development

### Prerequisites
- Node.js 16+
- Supabase account and project
- Environment variables configured

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation
```bash
npm install
npm run dev
```

### Key Components

#### Hooks
- `useRealtimeSync()` - Real-time synchronization status
- `useRealtimeData()` - Subscribe to specific data changes
- `useRecipes()` - Recipe data with real-time updates
- `useCuisines()` - Cuisine data with caching

#### Services
- `RealtimeService` - Core real-time functionality
- `CacheService` - Data caching and optimization

#### Components
- `RealtimeStatus` - Connection status display
- `ErrorBoundary` - Error handling wrapper
- `RecipeCarousel` - Recipe display with real-time updates

## 📊 Monitoring & Diagnostics

### Real-time Status Panel
- Connection status indicator
- Active channel monitoring
- Cache statistics display
- Error reporting and retry options
- Last sync timestamp tracking

### Performance Metrics
- Cache hit rates
- Connection stability
- Data freshness indicators
- Error frequency monitoring

## 🔒 Security Features

### Read-only Access
- All operations are read-only by design
- Write attempts are blocked and logged
- Secure credential handling
- Connection validation

### Error Handling
- Graceful degradation on connection loss
- Automatic retry with exponential backoff
- Component-level error boundaries
- User-friendly error messages

## 🚀 Deployment

The application is optimized for deployment on:
- Vercel
- Netlify
- Any static hosting service

Build command: `npm run build`
Output directory: `dist`

## 📝 Integration Points

### Supabase Integration
- Real-time subscriptions via WebSocket
- RESTful API for data fetching
- Automatic schema type generation
- Connection pooling and optimization

### Frontend Integration
- React hooks for data management
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React for icons

## 🔄 Data Flow

1. **Initial Load**: Fetch data from Supabase with caching
2. **Real-time Setup**: Establish WebSocket connections
3. **Change Detection**: Monitor database changes
4. **Cache Invalidation**: Update cached data when changes occur
5. **UI Updates**: Automatically refresh components
6. **Error Recovery**: Handle connection issues gracefully

## 📈 Performance Optimizations

- **Lazy Loading**: Components load data on demand
- **Intelligent Caching**: Reduce database queries
- **Connection Pooling**: Efficient WebSocket management
- **Error Boundaries**: Prevent cascading failures
- **Memory Management**: Automatic cleanup of resources

---

Built with ❤️ for food lovers everywhere. Powered by Supabase real-time technology.