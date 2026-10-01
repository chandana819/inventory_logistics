import React, { useState, useEffect } from 'react';
import { orderAPI } from '../lib/services';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Alert } from '../components';
import { Plus, Eye, Package } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    order_items: [{ product_id: '', quantity: '', price: '' }],
    notes: '',
  });

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll(0, 100, statusFilter || null);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await orderAPI.create(formData);
      setShowForm(false);
      setFormData({ order_items: [{ product_id: '', quantity: '', price: '' }], notes: '' });
      fetchOrders();
    } catch (err) {
      setError('Failed to create order');
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    packed: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Order
        </Button>
      </div>

      {error && <Alert type="error" title="Error" children={error} />}

      {/* Status Filter */}
      <Select
        label="Filter by Status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        options={[
          { value: '', label: 'All Orders' },
          { value: 'pending', label: 'Pending' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'packed', label: 'Packed' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'delivered', label: 'Delivered' },
        ]}
      />

      {/* Create Order Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Order Items</label>
                {formData.order_items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Product ID"
                      type="number"
                      value={item.product_id}
                      onChange={(e) => {
                        const newItems = [...formData.order_items];
                        newItems[idx].product_id = e.target.value;
                        setFormData({ ...formData, order_items: newItems });
                      }}
                    />
                    <Input
                      placeholder="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...formData.order_items];
                        newItems[idx].quantity = e.target.value;
                        setFormData({ ...formData, order_items: newItems });
                      }}
                    />
                    <Input
                      placeholder="Price"
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...formData.order_items];
                        newItems[idx].price = e.target.value;
                        setFormData({ ...formData, order_items: newItems });
                      }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Order</Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 font-semibold">Order ID</th>
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-right p-3 font-semibold">Total Amount</th>
                  <th className="text-center p-3 font-semibold">Items</th>
                  <th className="text-center p-3 font-semibold">Status</th>
                  <th className="text-center p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-3 font-medium">#{order.id}</td>
                    <td className="p-3">{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="p-3 text-right">${order.total_amount.toFixed(2)}</td>
                    <td className="p-3 text-center flex items-center justify-center gap-1">
                      <Package className="w-4 h-4" />
                      {order.order_items?.length || 0}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Button size="sm" variant="secondary" className="flex items-center gap-1 mx-auto">
                        <Eye className="w-4 h-4" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
