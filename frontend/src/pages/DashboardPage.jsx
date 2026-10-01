import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, ShoppingCart, Truck, AlertTriangle } from 'lucide-react';
import { aiAPI } from '../lib/services';
import { Card, CardContent, CardHeader, CardTitle, Alert } from '../components';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [delays, setDelays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsRes, anomaliesRes, delaysRes] = await Promise.all([
        aiAPI.getDashboardMetrics(),
        aiAPI.detectAnomalies().catch(() => ({ data: [] })),
        aiAPI.predictDeliveryDelays().catch(() => ({ data: [] })),
      ]);

      setMetrics(metricsRes.data);
      setAnomalies(anomaliesRes.data);
      setDelays(delaysRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
          <Icon className={`w-12 h-12 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {error && <Alert type="error" title="Error" children={error} />}

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Products" value={metrics.total_products} icon={Package} color="text-blue-500" />
          <StatCard title="Stock Value" value={`$${metrics.stock_value?.toLocaleString()}`} icon={Package} color="text-green-500" />
          <StatCard title="Pending Orders" value={metrics.pending_orders} icon={ShoppingCart} color="text-orange-500" />
          <StatCard title="In Transit" value={metrics.in_transit_shipments} icon={Truck} color="text-purple-500" />
        </div>
      )}

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomalies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Anomaly Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {anomalies.length === 0 ? (
              <p className="text-slate-600">No anomalies detected</p>
            ) : (
              <div className="space-y-2">
                {anomalies.slice(0, 5).map((alert, idx) => (
                  <div key={idx} className={`p-3 rounded-lg text-sm ${
                    alert.severity === 'high' ? 'bg-red-50 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-50 text-yellow-800' :
                    'bg-blue-50 text-blue-800'
                  }`}>
                    <p className="font-medium">{alert.type}</p>
                    <p>{alert.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Delays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-red-500" />
              Predicted Delays
            </CardTitle>
          </CardHeader>
          <CardContent>
            {delays.length === 0 ? (
              <p className="text-slate-600">No delays predicted</p>
            ) : (
              <div className="space-y-2">
                {delays.slice(0, 5).map((delay, idx) => (
                  <div key={idx} className="p-3 bg-red-50 rounded-lg text-sm">
                    <p className="font-medium">Order #{delay.order_id}</p>
                    <p className="text-red-800">{Math.round(delay.delay_probability * 100)}% chance of {delay.predicted_delay_days}d delay</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stock Distribution Chart */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-2">Stock Status</p>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Low Stock', value: metrics.low_stock_items || 0 },
                        { name: 'Adequate', value: Math.max(0, metrics.total_products - (metrics.low_stock_items || 0)) },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-2">Recent Activity Stats</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span>Low Stock Items</span>
                    <span className="font-bold text-red-600">{metrics.low_stock_items}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span>Delayed Shipments</span>
                    <span className="font-bold text-orange-600">{metrics.delayed_shipments}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span>Stock Value</span>
                    <span className="font-bold text-green-600">${metrics.stock_value?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
