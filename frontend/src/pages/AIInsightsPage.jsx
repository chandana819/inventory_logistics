import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { aiAPI } from '../lib/services';
import { Card, CardContent, CardHeader, CardTitle, Alert } from '../components';
import { TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

export default function AIInsightsPage() {
  const [forecast, setForecast] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [delays, setDelays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const [forecastRes, recRes, anomRes, delayRes] = await Promise.all([
        aiAPI.getDemandForecast(1).catch(() => ({ data: null })),
        aiAPI.getReorderRecommendations(),
        aiAPI.detectAnomalies(),
        aiAPI.predictDeliveryDelays(),
      ]);

      setForecast(forecastRes.data);
      setRecommendations(recRes.data);
      setAnomalies(anomRes.data);
      setDelays(delayRes.data);
    } catch (err) {
      setError('Failed to load insights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading AI insights...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Insights & Predictions</h1>

      {error && <Alert type="error" title="Error" children={error} />}

      {/* Demand Forecast Chart */}
      {forecast && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Demand Forecast ({forecast.forecast_period})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-600">Product</p>
                <p className="font-bold">{forecast.product_name}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-600">Confidence</p>
                <p className="font-bold">{(forecast.confidence * 100).toFixed(0)}%</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-600">Avg Historical</p>
                <p className="font-bold">{Math.round(forecast.historical_demand.reduce((a, b) => a + b, 0) / forecast.historical_demand.length) || 0}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-600">Avg Forecast</p>
                <p className="font-bold">{Math.round(forecast.forecasted_demand.reduce((a, b) => a + b, 0) / forecast.forecasted_demand.length) || 0}</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={forecast.forecasted_demand.map((val, idx) => ({
                  period: `Day ${idx + 1}`,
                  forecast: val,
                }))}
              >
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="forecast" stroke="#3b82f6" fillOpacity={1} fill="url(#colorForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Reorder Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Smart Reorder Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <p className="text-slate-600">No reorder recommendations at this time</p>
          ) : (
            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'high' ? 'bg-red-50 border-red-500' :
                  rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{rec.product_name}</p>
                      <p className="text-sm text-slate-600">
                        Current: {rec.current_quantity} | Reorder Level: {rec.reorder_level}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{rec.recommended_quantity}</p>
                      <p className="text-sm text-slate-600">units recommended</p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {rec.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Anomaly Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Anomaly Detection Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {anomalies.length === 0 ? (
            <p className="text-slate-600">No anomalies detected</p>
          ) : (
            <div className="space-y-2">
              {anomalies.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-500' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{alert.type.replace('_', ' ')}</p>
                      <p className="text-sm">{alert.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                      alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Delay Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Delay Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          {delays.length === 0 ? (
            <Alert type="success" title="Great News!" children="No delivery delays predicted" />
          ) : (
            <div className="space-y-2">
              {delays.map((delay, idx) => (
                <div key={idx} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{delay.order_id}</p>
                      {delay.tracking_number && <p className="text-sm text-slate-600">Tracking: {delay.tracking_number}</p>}
                      <p className="text-sm text-slate-600">
                        Expected: {new Date(delay.expected_delivery).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{Math.round(delay.delay_probability * 100)}%</p>
                      <p className="text-sm text-slate-600">delay probability</p>
                      <p className="text-sm font-medium text-red-700 mt-1">
                        ~{delay.predicted_delay_days} days late
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
