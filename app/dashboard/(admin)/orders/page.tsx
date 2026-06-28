import { supabaseAdmin } from '@/lib/supabase';
import OrdersClient from './orders-client';

export const revalidate = 0; // Fresh orders on every page reload

export default async function OrdersDashboard() {
  let orders: any[] = [];
  
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    orders = data || [];
  } catch (error) {
    console.error('Error fetching orders for dashboard:', error);
  }

  return <OrdersClient initialOrders={orders} />;
}
