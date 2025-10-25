import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Filter,
  LogOut,
  Search,
  Star,
  XCircle,
  Trash2,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import RatingStars from '../../components/RatingStars';
import ReviewEditModal, { type ReviewEditFormValues } from '../../components/admin/ReviewEditModal';
import { getServices } from '../../services/api';
import type { Review, ReviewAnalytics, Service } from '../../types';

const statusColors: Record<Review['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const ReviewsList = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [analytics, setAnalytics] = useState<ReviewAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{ total: number; pages: number; limit: number }>({
    total: 0,
    pages: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    status: 'pending',
    serviceId: '',
    minRating: '',
    search: '',
  });
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const API_URL = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:5000/api', []);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    loadServices();
  }, []);

  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    try {
      setAnalyticsLoading(true);
      const response = await fetch(`${API_URL}/reviews/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching review analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [API_URL, token]);

  const fetchReviews = useCallback(async (overridePage?: number) => {
    if (!token) return;
    const currentPage = overridePage ?? page;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(pagination.limit),
      });

      if (filters.status) params.set('status', filters.status);
      if (filters.serviceId) params.set('serviceId', filters.serviceId);
      if (filters.minRating) params.set('minRating', filters.minRating);
      if (filters.search.trim()) params.set('search', filters.search.trim());

      const response = await fetch(`${API_URL}/reviews/admin?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch reviews');

      const data = await response.json();
      setReviews(data.data);
      setPagination(data.pagination);
      setPage(data.pagination.page);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, filters, page, pagination.limit, token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  const handleStatusChange = async (id: string, status: Review['status']) => {
    if (!token) return;
    try {
      setUpdatingId(id);
      const response = await fetch(`${API_URL}/reviews/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      await Promise.all([fetchReviews(page), fetchAnalytics()]);
    } catch (error) {
      alert('Unable to update review status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (review: Review) => {
    if (!token) return;
    try {
      setUpdatingId(review._id);
      const response = await fetch(`${API_URL}/reviews/${review._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !review.featured }),
      });

      if (!response.ok) throw new Error('Failed to update review');

      await Promise.all([fetchReviews(page), fetchAnalytics()]);
    } catch (error) {
      alert('Unable to update review.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;

    try {
      setUpdatingId(id);
      const response = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete review');

      await Promise.all([fetchReviews(page), fetchAnalytics()]);
    } catch (error) {
      alert('Unable to delete review.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEditSave = async (values: ReviewEditFormValues) => {
    if (!token || !editingReview) return;

    try {
      setIsSavingEdit(true);
      const response = await fetch(`${API_URL}/reviews/${editingReview._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          serviceId: values.serviceId || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to update review');

      setEditingReview(null);
      await Promise.all([fetchReviews(page), fetchAnalytics()]);
    } catch (error) {
      alert('Unable to save changes.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 stars & up' },
    { value: '4', label: '4 stars & up' },
    { value: '3', label: '3 stars & up' },
  ];

  const serviceOptions = [
    { value: '', label: 'All Services' },
    ...services.map((service) => ({
      value: service._id,
      label: service.name,
    })),
  ];

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Customer Reviews</h1>
              <p className="text-gray-600">Moderate, feature, and manage feedback left by customers.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Pending: {analytics?.counts.pending ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-500">Average Rating</p>
              {analyticsLoading ? (
                <div className="py-2">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-3">
                  <RatingStars rating={analytics?.averageRating ?? 0} showValue />
                  <span className="text-sm text-gray-500">
                    from {analytics?.totals.approved ?? 0} approved
                  </span>
                </div>
              )}
            </div>

            <div className="border border-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-500">Review Totals</p>
              <div className="mt-2 text-2xl font-semibold text-gray-900">
                {analytics?.totals.all ?? 0}
              </div>
              <p className="text-sm text-gray-500">Overall submissions</p>
            </div>

            <div className="border border-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-500">Latest Activity</p>
              <div className="mt-2 text-lg font-semibold text-gray-900">
                {analytics?.latestActivity
                  ? new Date(analytics.latestActivity).toLocaleString()
                  : 'No reviews yet'}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 text-gray-700 font-semibold mb-4">
            <Filter className="w-5 h-5" />
            Filters
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(event) => {
                  setFilters((prev) => ({ ...prev, status: event.target.value }));
                }}
                className="w-full border border-gray-200 rounded-md px-3 py-2 bg-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Service</label>
              <select
                value={filters.serviceId}
                onChange={(event) => {
                  setFilters((prev) => ({ ...prev, serviceId: event.target.value }));
                }}
                className="w-full border border-gray-200 rounded-md px-3 py-2 bg-white"
              >
                {serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Rating</label>
              <select
                value={filters.minRating}
                onChange={(event) => {
                  setFilters((prev) => ({ ...prev, minRating: event.target.value }));
                }}
                className="w-full border border-gray-200 rounded-md px-3 py-2 bg-white"
              >
                {ratingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                  placeholder="Name, email, or keywords"
                  className="w-full border border-gray-200 rounded-md px-9 py-2 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Review list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {loading ? (
            <div className="py-16">
              <LoadingSpinner />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-600 py-12">No reviews match the current filters.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <div key={review._id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{review.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[review.status]}`}>
                          {review.status.toUpperCase()}
                        </span>
                        {review.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-500 mb-3">
                        <span>{review.customerName} • {review.customerEmail}</span>
                        <span>{new Date(review.createdAt).toLocaleString()}</span>
                        {review.serviceId?.name && (
                          <span className="inline-flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-blue-500" />
                            {review.serviceId.name}
                          </span>
                        )}
                      </div>
                      <RatingStars rating={review.rating} />
                      <p className="mt-3 text-gray-700 leading-relaxed">
                        {review.body}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {review.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(review._id, 'approved')}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                          disabled={updatingId === review._id}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(review._id, 'rejected')}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          disabled={updatingId === review._id}
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleFeatured(review)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                          review.featured
                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                        disabled={updatingId === review._id}
                      >
                        <Star className="w-4 h-4" />
                        {review.featured ? 'Featured' : 'Feature'}
                      </button>
                      <button
                        onClick={() => setEditingReview(review)}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        disabled={updatingId === review._id}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-4">
            <div className="text-sm text-gray-600">
              Showing page {pagination.pages === 0 ? 0 : page} of {pagination.pages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newPage = Math.max(1, page - 1);
                  fetchReviews(newPage);
                }}
                disabled={page <= 1}
                className="px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  const newPage = Math.min(pagination.pages, page + 1);
                  fetchReviews(newPage);
                }}
                disabled={page >= pagination.pages}
                className="px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      <ReviewEditModal
        review={editingReview}
        services={services}
        isOpen={Boolean(editingReview)}
        onClose={() => setEditingReview(null)}
        onSubmit={handleEditSave}
        isSaving={isSavingEdit}
      />
    </div>
  );
};

export default ReviewsList;
