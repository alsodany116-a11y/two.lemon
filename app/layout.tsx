import type { Metadata } from 'next';
import './globals.css';
import { supabaseAdmin } from '@/lib/supabase';

// Define layout metadata for SEO and Social Previews
export const metadata: Metadata = {
  title: 'رسائل الحب — هدية رومانسية مبتكرة لمن تحب',
  description: 'احفظ أجمل ذكرياتك الرومانسية في صفحة خاصة ومحمية للأبد. تصميم فاخر وتجربة فريدة لمن تحب.',
  metadataBase: new URL('https://love-messages.com'), // Replace with actual domain on deployment
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'رسائل الحب — هدية رومانسية مبتكرة لمن تحب',
    description: 'احفظ أجمل ذكرياتك الرومانسية في صفحة خاصة ومحمية للأبد. تصميم فاخر وتجربة فريدة لمن تحب.',
    url: '/',
    siteName: 'رسائل الحب',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'رسائل الحب والذكريات الرومانسية',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch Facebook Pixel ID from database settings
  let pixelId = '';
  try {
    const { data } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'pixel_id')
      .single();
    if (data) {
      pixelId = data.value.trim();
    }
  } catch (error) {
    console.error('Error fetching pixel_id in layout:', error);
  }

  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        {/* PWA / iOS Web App Meta Tags */}
        <meta name="theme-color" content="#4a0010" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ذكريات الحب" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Google Fonts Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Dynamic Facebook Pixel Tracking Code */}
        {pixelId && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${pixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt="pixel"
              />
            </noscript>
          </>
        )}
      </head>
      <body className="bg-romantic-gradient min-h-screen flex flex-col font-cairo">
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
