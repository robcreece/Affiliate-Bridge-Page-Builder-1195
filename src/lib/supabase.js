import { createClient } from '@supabase/supabase-js'

// These would be your actual Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

if (supabaseUrl === 'https://your-project.supabase.co' || supabaseKey === 'your-anon-key') {
  console.warn('Supabase credentials not configured. Using mock data.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Mock storage for development
export const mockStorage = {
  upload: async (fileName, content) => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock URL
    const mockUrl = `https://mock-storage.example.com/bridge-pages/${fileName}`;
    return { data: { path: fileName }, error: null };
  },
  
  getPublicUrl: (fileName) => {
    return {
      data: {
        publicUrl: `https://mock-storage.example.com/bridge-pages/${fileName}`
      }
    };
  }
};