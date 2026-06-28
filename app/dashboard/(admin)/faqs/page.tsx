import { supabaseAdmin } from '@/lib/supabase';
import FaqsClient from './faqs-client';

export const revalidate = 0; // Dynamic server component

export default async function FaqsDashboard() {
  let faqs: any[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    faqs = data || [];
  } catch (error) {
    console.error('Error fetching FAQs for dashboard:', error);
  }

  return <FaqsClient initialFaqs={faqs} />;
}
