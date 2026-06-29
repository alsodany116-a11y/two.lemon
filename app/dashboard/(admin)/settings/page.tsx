import { supabaseAdmin } from '@/lib/supabase';
import SettingsClient from './settings-client';

export const revalidate = 0; // Dynamic server component

export default async function SettingsDashboard() {
  let countdown = '2026-07-15T00:00:00.000Z';
  let details = 'موقع رسائل الحب هو طريقتك المبتكرة للتعبير عن مشاعرك...';
  let thankYou = 'سعداء جداً بكوننا جزءاً من توثيق ذكرياتكما الرومانسية...';
  let thankYouStep1 = 'سنقوم بالتواصل معك عبر الواتساب على الرقم المرفق بالطلب خلال 24 ساعة كحد أقصى.';
  let thankYouStep2 = 'سنسلمك رابط صفحتكما الخاصة والرقم السري الخاص بها، لتفاجئ بها شريك حياتك بهدية لا تُنسى!';
  let price = '80';

  try {
    const { data: settingsData } = await supabaseAdmin
      .from('settings')
      .select('key, value')
      .in('key', [
        'countdown_end',
        'website_details',
        'thank_you_message',
        'thank_you_step1',
        'thank_you_step2',
        'website_price'
      ]);

    if (settingsData) {
      const dbCountdown = settingsData.find((s) => s.key === 'countdown_end')?.value;
      if (dbCountdown) countdown = dbCountdown;

      const dbDetails = settingsData.find((s) => s.key === 'website_details')?.value;
      if (dbDetails) details = dbDetails;

      const dbThankYou = settingsData.find((s) => s.key === 'thank_you_message')?.value;
      if (dbThankYou) thankYou = dbThankYou;

      const dbStep1 = settingsData.find((s) => s.key === 'thank_you_step1')?.value;
      if (dbStep1) thankYouStep1 = dbStep1;

      const dbStep2 = settingsData.find((s) => s.key === 'thank_you_step2')?.value;
      if (dbStep2) thankYouStep2 = dbStep2;

      const dbPrice = settingsData.find((s) => s.key === 'website_price')?.value;
      if (dbPrice) price = dbPrice;
    }
  } catch (error) {
    console.error('Error fetching settings for settings page:', error);
  }

  return (
    <SettingsClient
      initialCountdown={countdown}
      initialDetails={details}
      initialThankYou={thankYou}
      initialThankYouStep1={thankYouStep1}
      initialThankYouStep2={thankYouStep2}
      initialPrice={price}
    />
  );
}
