import { supabaseAdmin } from '@/lib/supabase';
import TestimonialsClient from './testimonials-client';

export const revalidate = 0; // Dynamic server component

export default async function TestimonialsDashboard() {
  let testimonials: any[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    testimonials = data || [];
  } catch (error) {
    console.error('Error fetching testimonials for dashboard:', error);
  }

  return <TestimonialsClient initialTestimonials={testimonials} />;
}
