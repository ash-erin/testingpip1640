import { supabase } from '../lib/supabase';

export interface RecipeImage {
  id: string;
  recipe_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export class ImageService {
  private static readonly BUCKET_NAME = 'recipe-images';
  private static readonly DEFAULT_IMAGE = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';

  /**
   * Get recipe image URL from Supabase storage
   */
  static async getRecipeImageUrl(recipeId: string): Promise<string> {
    try {
      console.log(`🖼️ Fetching image for recipe: ${recipeId}`);

      // First, try to get the image path from the database
      const { data: imageData, error: imageError } = await supabase
        .from('recipe_images')
        .select('image_path, is_primary')
        .eq('recipe_id', recipeId)
        .eq('is_primary', true)
        .single();

      if (imageError || !imageData) {
        console.log(`📷 No primary image found for recipe ${recipeId}, using default`);
        return this.DEFAULT_IMAGE;
      }

      // Get the public URL from storage
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(imageData.image_path);

      if (urlData?.publicUrl) {
        console.log(`✅ Found image for recipe ${recipeId}: ${urlData.publicUrl}`);
        return urlData.publicUrl;
      }

      console.log(`📷 Image path exists but URL generation failed for recipe ${recipeId}`);
      return this.DEFAULT_IMAGE;

    } catch (error) {
      console.error(`❌ Error fetching image for recipe ${recipeId}:`, error);
      return this.DEFAULT_IMAGE;
    }
  }

  /**
   * Get all images for a recipe
   */
  static async getRecipeImages(recipeId: string): Promise<string[]> {
    try {
      const { data: imageData, error } = await supabase
        .from('recipe_images')
        .select('image_path')
        .eq('recipe_id', recipeId)
        .order('is_primary', { ascending: false });

      if (error || !imageData || imageData.length === 0) {
        return [this.DEFAULT_IMAGE];
      }

      const imageUrls = imageData.map(img => {
        const { data: urlData } = supabase.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(img.image_path);
        return urlData?.publicUrl || this.DEFAULT_IMAGE;
      });

      return imageUrls.length > 0 ? imageUrls : [this.DEFAULT_IMAGE];

    } catch (error) {
      console.error(`❌ Error fetching images for recipe ${recipeId}:`, error);
      return [this.DEFAULT_IMAGE];
    }
  }

  /**
   * Check if storage bucket exists and is accessible
   */
  static async checkStorageAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('❌ Storage access error:', error);
        return false;
      }

      const bucketExists = data?.some(bucket => bucket.name === this.BUCKET_NAME);
      console.log(`🗄️ Recipe images bucket exists: ${bucketExists}`);
      
      return bucketExists || false;
    } catch (error) {
      console.error('❌ Storage check failed:', error);
      return false;
    }
  }

  /**
   * Get fallback image based on recipe title or cuisine
   */
  static getFallbackImage(recipeTitle?: string, cuisine?: string): string {
    // Generate a more specific fallback based on content
    const keywords = [recipeTitle, cuisine].filter(Boolean).join(' ').toLowerCase();
    
    // Map common food terms to better stock photos
    const foodImageMap: Record<string, string> = {
      'pasta': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'pizza': 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'salad': 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'soup': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'chicken': 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'beef': 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'fish': 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'dessert': 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'cake': 'https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'bread': 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'curry': 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'rice': 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'italian': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'mexican': 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'asian': 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'indian': 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'chinese': 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'thai': 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'french': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    };

    // Find matching image
    for (const [key, imageUrl] of Object.entries(foodImageMap)) {
      if (keywords.includes(key)) {
        return imageUrl;
      }
    }

    return this.DEFAULT_IMAGE;
  }
}