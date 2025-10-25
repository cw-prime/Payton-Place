import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import Select from '../../components/Select';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Service, Category } from '../../types';

const ServiceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [service, setService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    icon: '',
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string>('');
  const [features, setFeatures] = useState<string[]>(['']);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const API_BASE_URL = API_URL.replace('/api', '');

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    fetchService();
    fetchCategories();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/categories?type=project&active=true`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/services/${id}`);
      if (!response.ok) throw new Error('Failed to fetch service');

      const data = await response.json();
      setService(data);
      setFormData({
        name: data.name,
        description: data.description,
        category: data.category,
        icon: data.icon,
      });
      setFeatures(data.features && data.features.length > 0 ? data.features : ['']);
    } catch (error) {
      console.error('Error fetching service:', error);
      setError('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeNewImage = () => {
    setNewImage(null);
    setNewImagePreview('');
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('icon', formData.icon);

      // Add new image if uploaded
      if (newImage) {
        formDataToSend.append('image', newImage);
      }

      // Add features (filter out empty ones)
      const validFeatures = features.filter(f => f.trim() !== '');
      validFeatures.forEach(feature => {
        formDataToSend.append('features', feature);
      });

      const response = await fetch(`${API_URL}/services/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update service');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/services');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = categories.length > 0
    ? categories.map(cat => ({
        value: cat.slug,
        label: cat.name,
      }))
    : [{ value: '', label: 'Loading categories...' }];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Service not found</p>
          <Button onClick={() => navigate('/admin/services')}>Back to Services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/services')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Services
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6">Edit Service</h1>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6">
              Service updated successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Service Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <TextArea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categoryOptions}
            />

            <Input
              label="Icon Name"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              required
              helpText="Icon name from lucide-react library"
            />

            {/* Current Image */}
            {service.image && !newImagePreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Image
                </label>
                <img
                  src={getImageUrl(service.image)}
                  alt={service.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* New Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {service.image ? 'Replace Image' : 'Upload Image'}
              </label>
              {!newImagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload new image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={newImagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeNewImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} fullWidth>
                {isSubmitting ? 'Updating Service...' : 'Update Service'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/services')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ServiceEdit;
