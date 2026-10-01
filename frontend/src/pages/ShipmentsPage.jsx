import React, { useState, useEffect } from 'react';
import { shipmentAPI } from '../lib/services';
import { Card, CardContent, CardHeader, CardTitle, Input, Select, Alert } from '../components';
import { Truck, MapPin, Calendar } from 'lucide-react';

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTracking, setSearchTracking] = useState('');

  useEffect(() => {
    fetchShipments();
  }, [statusFilter]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await shipmentAPI.getAll(0, 100, statusFilter || null);
      setShipments(response.data);
    } catch (err) {
      setError('Failed to load shipments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackingSearch = async (e) => {
    e.preventDefault();
    if (!searchTracking.trim()) {
      fetchShipments();
      return;
    }
    try {
      const response = await shipmentAPI.getByTracking(searchTracking);
      setShipments([response.data]);
    } catch (err) {
      setError('Shipment not found');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading shipments...</div>;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_transit: 'bg-blue-100 text-blue-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    delayed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shipments & Logistics</h1>

      {error && <Alert type="error" title="Error" children={error} />}

      {/* Tracking Search */}
      <form onSubmit={handleTrackingSearch} className="flex gap-2">
        <Input
          placeholder="Search by tracking number..."
          value={searchTracking}
          onChange={(e) => setSearchTracking(e.target.value)}
        />
      </form>

      {/* Status Filter */}
      <Select
        label="Filter by Status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        options={[
          { value: '', label: 'All Shipments' },
          { value: 'pending', label: 'Pending' },
          { value: 'in_transit', label: 'In Transit' },
          { value: 'out_for_delivery', label: 'Out for Delivery' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'delayed', label: 'Delayed' },
        ]}
      />

      {/* Shipments Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shipments.map((shipment) => (
          <Card key={shipment.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Order #{shipment.order_id}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[shipment.status]}`}>
                  {shipment.status.replace('_', ' ')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {shipment.tracking_number && (
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 transition hover:border-blue-400/40 hover:bg-blue-500/5">
                  <p className="text-sm text-slate-600">Tracking Number</p>
                  <p className="font-mono font-bold">{shipment.tracking_number}</p>
                </div>
              )}

              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> From
                  </p>
                  <p className="font-medium">{shipment.source_location || 'Not specified'}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> To
                  </p>
                  <p className="font-medium">{shipment.destination_location || 'Not specified'}</p>
                </div>
              </div>

              {shipment.carrier && (
                <div>
                  <p className="text-sm text-slate-600">Carrier</p>
                  <p className="font-medium">{shipment.carrier}</p>
                </div>
              )}

              <div className="flex gap-4">
                {shipment.expected_delivery && (
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Expected
                    </p>
                    <p className="font-medium">{new Date(shipment.expected_delivery).toLocaleDateString()}</p>
                  </div>
                )}
                {shipment.actual_delivery && (
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Delivered
                    </p>
                    <p className="font-medium">{new Date(shipment.actual_delivery).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {shipment.delay_predicted && (
                <Alert type="warning" title="Delay Predicted" children="This shipment is predicted to be delayed" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
