import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = 'https://whguiexyhsfqhrjtjpru.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZ3VpZXh5aHNmcWhyanRqcHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMjI0MDMsImV4cCI6MjA2Njc5ODQwM30.6mw2vcq6bTNosXp4exUP7Rys89p7c8QHUb1d7JG2cNo';

console.log('🔗 Initializing Supabase client...');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Anon Key present:', !!supabaseAnonKey);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test the connection immediately
console.log('🧪 Testing Supabase connection...');
supabase.from('recipes').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('❌ Supabase connection error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('✅ Supabase connected successfully!');
      console.log('📊 Total recipes in database:', count);
    }
  })
  .catch(err => {
    console.error('❌ Connection test failed:', err);
  });