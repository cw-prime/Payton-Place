import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';

const TeamForm = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    email: '',
    phone: '',
    linkedin: '',
    twitter: '',
    order: 0,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!image) {
      setError('Please upload a team member photo');
      setIsSubmitting(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('image', image);
      formDataToSend.append('order', String(formData.order));

      if (formData.email) formDataToSend.append('email', formData.email);
      if (formData.phone) formDataToSend.append('phone', formData.phone);

      // Handle social links
      const socialLinks: any = {};
      if (formData.linkedin) socialLinks.linkedin = formData.linkedin;
      if (formData.twitter) socialLinks.twitter = formData.twitter;
      if (Object.keys(socialLinks).length > 0) {
        formDataToSend.append('socialLinks', JSON.stringify(socialLinks));
      }

      const response = await fetch(`${API_URL}/team`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create team member');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/team');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/team')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Team
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
          <h1 className="text-3xl font-bold mb-6">Add Team Member</h1>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6">
              Team member added successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo *
              </label>
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload photo</span>
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
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
            />

            <Input
              label="Role / Title"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              placeholder="Senior Developer"
            />

            <TextArea
              label="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
              rows={4}
              placeholder="Tell us about this team member..."
            />

            <Input
              label="Email (Optional)"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />

            <Input
              label="Phone (Optional)"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
            />

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Social Links (Optional)</h3>

              <Input
                label="LinkedIn URL"
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />

              <Input
                label="Twitter URL"
                type="url"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="https://twitter.com/username"
              />
            </div>

            <Input
              label="Display Order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              helpText="Lower numbers appear first (0 = first)"
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} fullWidth>
                {isSubmitting ? 'Adding Team Member...' : 'Add Team Member'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/team')}
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

export default TeamForm;
