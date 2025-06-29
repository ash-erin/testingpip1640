import { supabase } from '../lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Recipe } from '../hooks/useRecipes';

export interface RealtimeConfig {
  enableRecipeSync: boolean;
  enableUserSync: boolean;
  enableImageSync: boolean;
  retryAttempts: number;
  retryDelay: number;
}

export interface SyncStatus {
  connected: boolean;
  lastSync: Date | null;
  error: string | null;
  activeChannels: string[];
}

export type DataChangeHandler<T = any> = (
  payload: RealtimePostgresChangesPayload<T>
) => void;

export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private config: RealtimeConfig;
  private status: SyncStatus;
  private retryTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private changeHandlers: Map<string, DataChangeHandler[]> = new Map();

  constructor(config: Partial<RealtimeConfig> = {}) {
    this.config = {
      enableRecipeSync: true,
      enableUserSync: true,
      enableImageSync: true,
      retryAttempts: 3,
      retryDelay: 2000,
      ...config
    };

    this.status = {
      connected: false,
      lastSync: null,
      error: null,
      activeChannels: []
    };

    console.log('🔄 RealtimeService initialized with config:', this.config);
  }

  /**
   * Initialize all real-time subscriptions
   */
  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing real-time synchronization...');
      
      // Test connection first
      await this.testConnection();
      
      // Initialize subscriptions based on config
      if (this.config.enableRecipeSync) {
        await this.initializeRecipeSync();
      }
      
      if (this.config.enableUserSync) {
        await this.initializeUserSync();
      }
      
      if (this.config.enableImageSync) {
        await this.initializeImageSync();
      }

      this.status.connected = true;
      this.status.lastSync = new Date();
      this.status.error = null;
      
      console.log('✅ Real-time synchronization initialized successfully');
      console.log('📊 Active channels:', this.status.activeChannels);
      
    } catch (error) {
      console.error('❌ Failed to initialize real-time sync:', error);
      this.status.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  /**
   * Test database connection
   */
  private async testConnection(): Promise<void> {
    console.log('🧪 Testing database connection...');
    
    const { error } = await supabase
      .from('recipes')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      throw new Error(`Connection test failed: ${error.message}`);
    }
    
    console.log('✅ Database connection verified');
  }

  /**
   * Initialize recipe-related real-time subscriptions
   */
  private async initializeRecipeSync(): Promise<void> {
    console.log('🍽️ Setting up recipe synchronization...');
    
    // Subscribe to recipes table changes
    const recipeChannel = supabase
      .channel('recipes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipes'
        },
        (payload) => this.handleRecipeChange(payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipe_ingredients'
        },
        (payload) => this.handleRecipeIngredientChange(payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipe_steps'
        },
        (payload) => this.handleRecipeStepChange(payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipe_likes'
        },
        (payload) => this.handleRecipeLikeChange(payload)
      );

    await this.subscribeToChannel('recipes', recipeChannel);
    
    // Subscribe to cuisines and ingredients
    const metaChannel = supabase
      .channel('recipe-meta-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cuisines'
        },
        (payload) => this.handleCuisineChange(payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ingredients'
        },
        (payload) => this.handleIngredientChange(payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tags'
        },
        (payload) => this.handleTagChange(payload)
      );

    await this.subscribeToChannel('recipe-meta', metaChannel);
  }

  /**
   * Initialize user-related real-time subscriptions
   */
  private async initializeUserSync(): Promise<void> {
    console.log('👤 Setting up user synchronization...');
    
    const userChannel = supabase
      .channel('user-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users'
        },
        (payload) => this.handleUserChange(payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_saved_recipes'
        },
        (payload) => this.handleUserSavedRecipeChange(payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_preferences'
        },
        (payload) => this.handleUserPreferenceChange(payload)
      );

    await this.subscribeToChannel('users', userChannel);
  }

  /**
   * Initialize image storage synchronization
   */
  private async initializeImageSync(): Promise<void> {
    console.log('🖼️ Setting up image synchronization...');
    
    // Note: Supabase Storage doesn't have real-time events yet
    // This is a placeholder for future implementation
    console.log('ℹ️ Image sync will be implemented when Supabase Storage real-time events are available');
  }

  /**
   * Subscribe to a channel with error handling and retry logic
   */
  private async subscribeToChannel(name: string, channel: RealtimeChannel): Promise<void> {
    try {
      const response = await channel.subscribe((status) => {
        console.log(`📡 Channel '${name}' status:`, status);
        
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Successfully subscribed to ${name} channel`);
          this.status.activeChannels.push(name);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Error in ${name} channel`);
          this.handleChannelError(name, channel);
        } else if (status === 'TIMED_OUT') {
          console.warn(`⏰ ${name} channel timed out`);
          this.handleChannelTimeout(name, channel);
        }
      });

      this.channels.set(name, channel);
      console.log(`🔗 Channel '${name}' setup complete`);
      
    } catch (error) {
      console.error(`❌ Failed to subscribe to ${name} channel:`, error);
      throw error;
    }
  }

  /**
   * Handle channel errors with retry logic
   */
  private handleChannelError(channelName: string, channel: RealtimeChannel): void {
    console.log(`🔄 Attempting to recover ${channelName} channel...`);
    
    // Clear existing timeout
    const existingTimeout = this.retryTimeouts.get(channelName);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Set retry timeout
    const timeout = setTimeout(() => {
      this.retryChannelSubscription(channelName, channel);
    }, this.config.retryDelay);
    
    this.retryTimeouts.set(channelName, timeout);
  }

  /**
   * Handle channel timeouts
   */
  private handleChannelTimeout(channelName: string, channel: RealtimeChannel): void {
    console.log(`⏰ ${channelName} channel timed out, attempting reconnection...`);
    this.handleChannelError(channelName, channel);
  }

  /**
   * Retry channel subscription
   */
  private async retryChannelSubscription(channelName: string, channel: RealtimeChannel): Promise<void> {
    try {
      console.log(`🔄 Retrying ${channelName} channel subscription...`);
      
      // Unsubscribe first
      await channel.unsubscribe();
      
      // Re-subscribe
      await channel.subscribe();
      
      console.log(`✅ ${channelName} channel reconnected successfully`);
      
    } catch (error) {
      console.error(`❌ Failed to retry ${channelName} channel:`, error);
      this.status.error = `Failed to reconnect ${channelName}: ${error}`;
    }
  }

  /**
   * Recipe change handlers
   */
  private handleRecipeChange(payload: RealtimePostgresChangesPayload<Recipe>): void {
    console.log('🍽️ Recipe change detected:', payload.eventType, payload.new?.title || payload.old?.title);
    this.notifyHandlers('recipe', payload);
    this.status.lastSync = new Date();
  }

  private handleRecipeIngredientChange(payload: RealtimePostgresChangesPayload<any>): void {
    console.log('🥕 Recipe ingredient change detected:', payload.eventType);
    this.notifyHandlers('recipe-ingredient', payload);
    this.status.lastSync = new Date();
  }

  private handleRecipeStepChange(payload: RealtimePostgresChangesPayload<any>): void {
    console.log('📝 Recipe step change detected:', payload.eventType);
    this.notifyHandlers('recipe-step', payload);
    this.status.lastSync = new Date();
  }

  private handleRecipeLikeChange(payload: RealtimePostgresChangesPayload<any>): void {
    console.log('❤️ Recipe like change detected:', payload.eventType);
    this.notifyHandlers('recipe-like', payload);
    this.status.lastSync = new Date();
  }

  private handleCuisineChange(payload: RealtimePostgresChangesPayload<any>): void {
    console.log('🌍 Cuisine change detected:', payload.eventType);
    this.notifyHandlers('cuisine', payload);
    this.status.lastSync = new Date();
  }

  private handleIngredientChange(payload: RealtimePostgresChangesPayload<any>): void {
    console.log('🥬 Ingredient change detected:', payload.eventType);
    this.notifyHandlers('ingredient', payload);
    this.status.lastSync = new Date();
  }

  private handleTagChange(payload: RealtimePostgresChangesPayload<any>): void {
    console.log('🏷️ Tag change detected:', payload.eventType);
    this.notifyHandlers('tag', payload);
    this.status.lastSync = new Date();
  }

  /**
   * User change handlers
   */
  private handleUserChange(payload: RealtimePostgresChangesPayload<any>): void {
    console.log('👤 User change detected:', payload.eventType);
    this.notifyHandlers('user', payload);
    this.status.lastSync = new Date();
  }

  private handleUserSavedRecipeChange(payload: RealtimePostgresChangesPayload<any>): void {
    console.log('💾 User saved recipe change detected:', payload.eventType);
    this.notifyHandlers('user-saved-recipe', payload);
    this.status.lastSync = new Date();
  }

  private handleUserPreferenceChange(payload: RealtimePostgresChangesPayload<any>): void {
    console.log('⚙️ User preference change detected:', payload.eventType);
    this.notifyHandlers('user-preference', payload);
    this.status.lastSync = new Date();
  }

  /**
   * Register a change handler for specific data types
   */
  public onDataChange(dataType: string, handler: DataChangeHandler): () => void {
    if (!this.changeHandlers.has(dataType)) {
      this.changeHandlers.set(dataType, []);
    }
    
    this.changeHandlers.get(dataType)!.push(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.changeHandlers.get(dataType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Notify all registered handlers for a data type
   */
  private notifyHandlers(dataType: string, payload: RealtimePostgresChangesPayload<any>): void {
    const handlers = this.changeHandlers.get(dataType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`❌ Error in ${dataType} change handler:`, error);
        }
      });
    }
  }

  /**
   * Get current synchronization status
   */
  public getStatus(): SyncStatus {
    return { ...this.status };
  }

  /**
   * Manually trigger a sync check
   */
  public async forcSync(): Promise<void> {
    console.log('🔄 Force syncing data...');
    try {
      await this.testConnection();
      this.status.lastSync = new Date();
      this.status.error = null;
      console.log('✅ Force sync completed');
    } catch (error) {
      console.error('❌ Force sync failed:', error);
      this.status.error = error instanceof Error ? error.message : 'Force sync failed';
      throw error;
    }
  }

  /**
   * Cleanup all subscriptions
   */
  public async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up real-time subscriptions...');
    
    // Clear all retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
    
    // Unsubscribe from all channels
    const unsubscribePromises = Array.from(this.channels.values()).map(channel => 
      channel.unsubscribe()
    );
    
    await Promise.all(unsubscribePromises);
    
    this.channels.clear();
    this.changeHandlers.clear();
    this.status.activeChannels = [];
    this.status.connected = false;
    
    console.log('✅ Real-time subscriptions cleaned up');
  }

  /**
   * Security: Prevent unauthorized write operations
   */
  public async attemptWrite(table: string, operation: string): Promise<never> {
    const error = `🚫 SECURITY: Write operation '${operation}' on table '${table}' is not allowed. This service is read-only.`;
    console.error(error);
    throw new Error(error);
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();