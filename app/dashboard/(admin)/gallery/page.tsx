import { supabaseAdmin } from '@/lib/supabase';
import GalleryClient from './gallery-client';

export const revalidate = 0; // Fresh content every load

export default async function GalleryDashboard() {
  let images: any[] = [];
  let textAbove = 'لقطات حية لبعض الذكريات الرائعة المطبوعة والمحفوظة لعملائنا 📸';
  let textBelow = 'كل صورة تحكي قصة حب، وذكريات تعيش للأبد في قلوب من تحب.';

  try {
    // Fetch images and settings in parallel
    const [galleryRes, settingsRes] = await Promise.all([
      supabaseAdmin
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('settings')
        .select('key, value')
        .in('key', ['gallery_text_above', 'gallery_text_below'])
    ]);

    images = galleryRes.data || [];

    if (settingsRes.data) {
      const dbAbove = settingsRes.data.find((s) => s.key === 'gallery_text_above')?.value;
      if (dbAbove) textAbove = dbAbove;

      const dbBelow = settingsRes.data.find((s) => s.key === 'gallery_text_below')?.value;
      if (dbBelow) textBelow = dbBelow;
    }
  } catch (error) {
    console.error('Error loading gallery dashboard data:', error);
  }

  return (
    <GalleryClient
      images={images}
      initialTextAbove={textAbove}
      initialTextBelow={textBelow}
    />
  );
}
