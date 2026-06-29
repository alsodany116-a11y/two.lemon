import { supabaseAdmin } from '@/lib/supabase';
import OrdersClient from './orders-client';

export const revalidate = 0; // Fresh orders on every page reload

export default async function OrdersDashboard() {
  let orders: any[] = [];
  let price = 80;
  
  try {
    const [ordersRes, settingsRes] = await Promise.all([
      supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('settings')
        .select('value')
        .eq('key', 'website_price')
        .single()
    ]);
      
    if (ordersRes.error) {
      throw ordersRes.error;
    }
    
    orders = ordersRes.data || [];
    if (settingsRes.data && settingsRes.data.value) {
      price = Number(settingsRes.data.value) || 80;
    }
  } catch (error) {
    console.error('Error fetching orders dashboard data:', error);
  }

  return <OrdersClient initialOrders={orders} price={price} />;
}
