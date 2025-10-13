import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Upload, X, Star } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import Select from '../../components/Select';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getProjectById } from '../../services/api';
import type { Project, Category } from '../../types';

const ProjectEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    location: '',
    duration: '',
    budget: '',
    featured: false,
  });

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const API_BASE_URL = API_URL.replace('/api', '');

  const getImageUrl = (imagePath: string) => {
    // If already a full URL (http/https), return as-is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend API base URL
    return `${API_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    fetchProject();
    fetchCategories();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories?type=project&active=true`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await getProjectById(id!);
      setProject(data);
      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        type: data.type,
        location: data.details?.location || '',
        duration: data.details?.duration || '',
        budget: data.details?.budget || '',
        featured: data.featured,
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      console.log('📷 Files selected:', files.length);
      console.log('📷 Current newImages count:', newImages.length);

      setNewImages(prev => {
        console.log('📷 Previous images:', prev.length);
        const updated = [...prev, ...files];
        console.log('📷 After adding:', updated.length);
        return updated;
      });

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });

      // Clear the input so you can select the same file again if needed
      e.target.value = '';
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRemoveExistingImage = (imageUrl: string) => {
    setImagesToRemove(prev => {
      if (prev.includes(imageUrl)) {
        // Unmark for deletion
        return prev.filter(img => img !== imageUrl);
      } else {
        // Mark for deletion
        return [...prev, imageUrl];
      }
    });
  };

  const setAsFeaturedImage = (imageUrl: string) => {
    if (!project) return;

    // Move the selected image to the first position
    const updatedImages = [imageUrl, ...project.images.filter(img => img !== imageUrl)];
    setProject({ ...project, images: updatedImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      // Debug: Check token
      console.log('🔑 Token being sent:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      console.log('📦 LocalStorage token:', localStorage.getItem('adminToken')?.substring(0, 20) + '...');

      // Filter out images marked for deletion
      const existingImages = project!.images.filter(img => !imagesToRemove.includes(img));
      console.log('🗑️ Images to remove:', imagesToRemove);
      console.log('📷 Remaining existing images:', existingImages);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('featured', String(formData.featured));

      if (formData.location) formDataToSend.append('details[location]', formData.location);
      if (formData.duration) formDataToSend.append('details[duration]', formData.duration);
      if (formData.budget) formDataToSend.append('details[budget]', formData.budget);

      // Send existing images (that weren't marked for deletion)
      existingImages.forEach((imageUrl) => {
        formDataToSend.append('existingImages[]', imageUrl);
      });

      // Add new images if any
      newImages.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update project');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/projects');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.slug,
    label: cat.name,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Project not found</p>
          <button
            onClick={() => navigate('/admin/projects')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Projects
          </button>
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
              onClick={() => navigate('/admin/projects')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Projects
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6">Edit Project</h1>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6">
              ✅ Project updated successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Images
                <span className="text-gray-500 text-xs ml-2">(First image is the featured/main image)</span>
                {imagesToRemove.length > 0 && (
                  <span className="text-red-600 text-sm ml-2">
                    ({imagesToRemove.length} marked for deletion)
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {project.images.map((image, index) => {
                  const isMarkedForDeletion = imagesToRemove.includes(image);
                  const isFeatured = index === 0;
                  return (
                    <div key={index} className="relative group">
                      <img
                        src={getImageUrl(image)}
                        alt={`Current ${index + 1}`}
                        className={`w-full h-32 object-cover rounded-lg transition-all ${
                          isMarkedForDeletion
                            ? 'opacity-40 border-4 border-red-500'
                            : isFeatured
                            ? 'opacity-100 border-4 border-yellow-400'
                            : 'opacity-100 border-2 border-transparent'
                        }`}
                      />

                      {/* Featured Badge */}
                      {isFeatured && !isMarkedForDeletion && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </div>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => toggleRemoveExistingImage(image)}
                        className={`absolute top-2 right-2 p-1 rounded-full transition-all ${
                          isMarkedForDeletion
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white opacity-0 group-hover:opacity-100'
                        }`}
                        title={isMarkedForDeletion ? 'Click to keep this image' : 'Click to remove this image'}
                      >
                        {isMarkedForDeletion ? (
                          <span className="text-xs px-1">Undo</span>
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>

                      {/* Set as Featured Button */}
                      {!isFeatured && !isMarkedForDeletion && (
                        <button
                          type="button"
                          onClick={() => setAsFeaturedImage(image)}
                          className="absolute bottom-2 left-2 bg-yellow-400 text-gray-900 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                          title="Set as featured image"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}

                      {isMarkedForDeletion && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                            Will be deleted
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* New Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Images
              </label>

              {newImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload new images (you can select multiple)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Project Details */}
            <Input
              label="Project Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <TextArea
              label="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              required
            />

            <Select
              label="Category *"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categoryOptions}
              required
            />

            <Input
              label="Project Type *"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <Input
              label="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />

            <Input
              label="Budget Range"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Feature this project on homepage
              </label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} fullWidth>
                {isSubmitting ? 'Updating Project...' : 'Update Project'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/projects')}
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

export default ProjectEdit;
