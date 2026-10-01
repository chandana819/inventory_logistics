import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, ShoppingCart, Truck, AlertTriangle, Boxes, Users, Clock3 } from 'lucide-react';
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
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          </div>
          <Icon className={`w-12 h-12 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between border-b border-slate-800 pb-5">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Operations overview</p>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Dashboard</h1>
        </div>
        <div className="hidden rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300 sm:block">
          Live inventory data
        </div>
      </div>

      {error && <Alert type="error" title="Error" children={error} />}

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">
          <StatCard title="Total Products" value={metrics.total_products} icon={Package} color="text-blue-400" />
          <StatCard title="Stock Value" value={`$${metrics.stock_value?.toLocaleString()}`} icon={Package} color="text-green-400" />
          <StatCard title="Pending Orders" value={metrics.pending_orders} icon={ShoppingCart} color="text-orange-400" />
          <StatCard title="In Transit" value={metrics.in_transit_shipments} icon={Truck} color="text-orange-400" />
          <StatCard title="Total Units" value={metrics.total_units?.toLocaleString()} icon={Boxes} color="text-blue-400" />
          <StatCard title="Suppliers" value={metrics.active_suppliers} icon={Users} color="text-green-400" />
        </div>
      )}

      {/* Alerts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Anomalies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Anomaly Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {anomalies.length === 0 ? (
              <p className="dashboard-muted">No anomalies detected</p>
            ) : (
              <div className="space-y-2">
                {anomalies.slice(0, 5).map((alert, idx) => (
                  <div key={idx} className={`p-3 rounded-lg text-sm ${
                    alert.severity === 'high' ? 'border border-orange-400/30 bg-orange-500/10 text-orange-200' :
                    alert.severity === 'medium' ? 'border border-yellow-400/30 bg-yellow-500/10 text-yellow-200' :
                    'border border-blue-400/30 bg-blue-500/10 text-blue-200'
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
              <Clock3 className="h-5 w-5 text-orange-400" />
              Predicted Delays
            </CardTitle>
          </CardHeader>
          <CardContent>
            {delays.length === 0 ? (
              <p className="dashboard-muted">No delays predicted</p>
            ) : (
              <div className="space-y-2">
                {delays.slice(0, 5).map((delay, idx) => (
                  <div key={idx} className="rounded-lg border border-orange-400/30 bg-orange-500/10 p-3 text-sm">
                    <p className="font-medium">Order #{delay.order_id}</p>
                    <p className="text-orange-200">{Math.round(delay.delay_probability * 100)}% chance of {delay.predicted_delay_days}d delay</p>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="dashboard-muted mb-2 text-sm">Stock Status</p>
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
                      outerRadius={88}
                      fill="#2563eb"
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
                <p className="dashboard-muted mb-2 text-sm">Recent Activity Stats</p>
                <div className="space-y-3">
                  <div className="dashboard-soft-panel flex items-center justify-between rounded p-3">
                    <span>Low Stock Items</span>
                    <span className="font-bold text-orange-400">{metrics.low_stock_items}</span>
                  </div>
                  <div className="dashboard-soft-panel flex items-center justify-between rounded p-3">
                    <span>Delayed Shipments</span>
                    <span className="font-bold text-orange-400">{metrics.delayed_shipments}</span>
                  </div>
                  <div className="dashboard-soft-panel flex items-center justify-between rounded p-3">
                    <span>Stock Value</span>
                    <span className="font-bold text-green-600">${metrics.stock_value?.toLocaleString()}</span>
                  </div>
                  <div className="dashboard-soft-panel flex items-center justify-between rounded p-3">
                    <span>Total Orders</span>
                    <span className="font-bold text-blue-400">{metrics.total_orders}</span>
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
