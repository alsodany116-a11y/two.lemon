import { supabaseAdmin } from '@/lib/supabase';
import PixelClient from './pixel-client';

export const revalidate = 0; // Dynamic server component

export default async function PixelDashboard() {
  let pixelId = '';
  let accessToken = '';
  let testCode = '';

  try {
    const { data: settingsData } = await supabaseAdmin
      .from('settings')
      .select('key, value')
      .in('key', ['pixel_id', 'pixel_access_token', 'pixel_test_code']);

    if (settingsData) {
      pixelId = settingsData.find((s) => s.key === 'pixel_id')?.value || '';
      accessToken = settingsData.find((s) => s.key === 'pixel_access_token')?.value || '';
      testCode = settingsData.find((s) => s.key === 'pixel_test_code')?.value || '';
    }
  } catch (error) {
    console.error('Error fetching pixel settings for dashboard:', error);
  }

  return (
    <PixelClient
      initialPixelId={pixelId}
      initialAccessToken={accessToken}
      initialTestCode={testCode}
    />
  );
}
