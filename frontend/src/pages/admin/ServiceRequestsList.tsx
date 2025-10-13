import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Mail, Phone, Clock, CheckCircle, X, ExternalLink, LogOut } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

interface ServiceRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  serviceId: {
    _id: string;
    name: string;
    category: string;
  };
  message: string;
  preferredContactMethod: 'email' | 'phone' | 'either';
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'declined';
  createdAt: string;
  updatedAt: string;
}

const ServiceRequestsList = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const url = filterStatus
        ? `${API_URL}/service-requests?status=${filterStatus}`
        : `${API_URL}/service-requests`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch service requests');

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching service requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ServiceRequest['status']) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_URL}/service-requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      fetchRequests();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const deleteRequest = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the request from "${name}"?`)) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_URL}/service-requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete request');

      alert('Service request deleted successfully!');
      fetchRequests();
    } catch (error) {
      alert('Failed to delete service request');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      declined: 'bg-red-100 text-red-700',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Site
              </a>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Service Requests</h1>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : requests.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No service requests found.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{request.name}</h3>
                      <p className="text-sm text-gray-600">
                        Service: <span className="font-medium">{request.serviceId.name}</span>
                        <span className="ml-2 text-xs text-gray-500">({request.serviceId.category})</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                      <button
                        onClick={() => deleteRequest(request._id, request.name)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete request"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${request.email}`} className="hover:text-blue-600">
                        {request.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${request.phone}`} className="hover:text-blue-600">
                        {request.phone}
                      </a>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-gray-700">{request.message}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Prefers: {request.preferredContactMethod}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {request.status === 'new' && (
                        <button
                          onClick={() => updateStatus(request._id, 'contacted')}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 text-sm"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {request.status === 'contacted' && (
                        <button
                          onClick={() => updateStatus(request._id, 'in-progress')}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm"
                        >
                          In Progress
                        </button>
                      )}
                      {(request.status === 'in-progress' || request.status === 'contacted') && (
                        <button
                          onClick={() => updateStatus(request._id, 'completed')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServiceRequestsList;
