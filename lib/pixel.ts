interface CapiEventOptions {
  pixelId: string;
  accessToken: string;
  testCode?: string;
  eventName: 'PageView' | 'Lead' | 'Purchase';
  eventId: string;
  url: string;
  ip: string;
  userAgent: string;
  customData?: {
    value?: number;
    currency?: string;
  };
}

export async function sendCapiEvent({
  pixelId,
  accessToken,
  testCode,
  eventName,
  eventId,
  url,
  ip,
  userAgent,
  customData,
}: CapiEventOptions) {
  if (!pixelId || !accessToken) {
    console.log('Skipping CAPI: Pixel ID or Access Token is missing.');
    return { success: false, error: 'Missing Pixel config' };
  }

  // Convert IP address to clean string (handling local and IPv6 formats)
  let cleanIp = ip || '';
  if (cleanIp === '::1' || cleanIp === '127.0.0.1') {
    cleanIp = '127.0.0.1'; // Test IP locally, standard public IP in prod
  }

  const payload: any = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: url,
        action_source: 'website',
        user_data: {
          client_ip_address: cleanIp,
          client_user_agent: userAgent || 'Unknown User Agent',
        },
      },
    ],
  };

  if (customData) {
    payload.data[0].custom_data = customData;
  }

  if (testCode) {
    payload.test_event_code = testCode;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log(`CAPI [${eventName}] response:`, result);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, result };
  } catch (error: any) {
    console.error(`Error sending CAPI [${eventName}] event:`, error);
    return { success: false, error: error.message || 'CAPI call failed' };
  }
}
