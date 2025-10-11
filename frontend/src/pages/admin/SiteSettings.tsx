import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Upload, Video, Image as ImageIcon, LogOut, ExternalLink } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Settings {
  _id: string;
  heroMediaType: 'image' | 'video';
  heroImageUrl: string;
  heroVideoUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
}

const SiteSettings = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [, setSettings] = useState<Settings | null>(null);
  const [formData, setFormData] = useState({
    heroMediaType: 'image' as 'image' | 'video',
    heroImageUrl: '',
    heroVideoUrl: '',
    heroHeadline: '',
    heroSubheadline: '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');

  const API_URL = 'http://localhost:5000/api';
  const API_BASE_URL = 'http://localhost:5000';

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/settings`);
      const data = await response.json();

      setSettings(data);
      setFormData({
        heroMediaType: data.heroMediaType,
        heroImageUrl: data.heroImageUrl,
        heroVideoUrl: data.heroVideoUrl,
        heroHeadline: data.heroHeadline,
        heroSubheadline: data.heroSubheadline,
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSize = file.size / 1024 / 1024; // Convert to MB

      if (fileSize > 100) {
        setError('Video file size must be less than 100MB');
        return;
      }

      setSelectedVideo(file);

      // Create object URL for video preview
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('heroMediaType', formData.heroMediaType);
      formDataToSend.append('heroHeadline', formData.heroHeadline);
      formDataToSend.append('heroSubheadline', formData.heroSubheadline);

      if (formData.heroMediaType === 'image') {
        if (selectedImage) {
          formDataToSend.append('heroImage', selectedImage);
        } else {
          formDataToSend.append('heroImageUrl', formData.heroImageUrl);
        }
      } else {
        // Video mode
        if (selectedVideo) {
          formDataToSend.append('heroVideo', selectedVideo);
        } else {
          formDataToSend.append('heroVideoUrl', formData.heroVideoUrl);
        }
      }

      const response = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update settings');
      }

      setSuccess(true);
      await fetchSettings();
      setSelectedImage(null);
      setImagePreview('');
      setSelectedVideo(null);
      setVideoPreview('');

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6">Site Settings</h1>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6">
              ✅ Settings updated successfully!
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Homepage Hero Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Homepage Hero</h2>

              {/* Media Type Toggle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Background Media Type
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, heroMediaType: 'image' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 rounded-lg transition-all ${
                      formData.heroMediaType === 'image'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <ImageIcon className="w-5 h-5" />
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, heroMediaType: 'video' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 rounded-lg transition-all ${
                      formData.heroMediaType === 'video'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    Video
                  </button>
                </div>
              </div>

              {/* Image Upload */}
              {formData.heroMediaType === 'image' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload New Image
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload hero image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current/Preview Image
                    </label>
                    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview || getImageUrl(formData.heroImageUrl)}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* External URL Option */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or Use External Image URL
                    </label>
                    <Input
                      type="url"
                      value={formData.heroImageUrl}
                      onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              )}

              {/* Video Upload/URL */}
              {formData.heroMediaType === 'video' && (
                <div className="space-y-4">
                  {/* Video File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Video File
                    </label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                      <p className="text-sm text-blue-800 font-medium mb-1">📐 Recommended Video Dimensions:</p>
                      <p className="text-sm text-blue-700">
                        • <strong>16:9 aspect ratio</strong> (widescreen) for best results<br />
                        • Recommended: <strong>1920x1080</strong> or <strong>1280x720</strong><br />
                        • Avoid: Square (1:1) or vertical (9:16) videos - these will show black bars
                      </p>
                    </div>
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {selectedVideo ? selectedVideo.name : 'Click to upload hero video (max 100MB)'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">MP4, WebM, MOV, AVI</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                    {selectedVideo && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Video selected: {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>

                  {/* External URL Option */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or Use External Video URL
                    </label>
                    <Input
                      type="url"
                      value={formData.heroVideoUrl}
                      onChange={(e) => setFormData({ ...formData, heroVideoUrl: e.target.value })}
                      placeholder="https://example.com/video.mp4"
                      required={formData.heroMediaType === 'video' && !selectedVideo}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Tip: Keep video file size under 100MB. Use H.264 codec for MP4 for best compatibility.
                    </p>
                  </div>

                  {/* Video Preview */}
                  {(videoPreview || formData.heroVideoUrl) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current/Preview Video
                      </label>
                      <div className="w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
                        <video
                          src={videoPreview || (formData.heroVideoUrl.startsWith('http') ? formData.heroVideoUrl : `${API_BASE_URL}${formData.heroVideoUrl}`)}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        >
                          <p className="text-white text-center">Video preview not available</p>
                        </video>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hero Text Content */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Hero Text Content</h3>

              <div>
                <Input
                  label="Headline"
                  value={formData.heroHeadline}
                  onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                  required
                  placeholder="Transforming Spaces, Building Dreams"
                />
              </div>

              <div>
                <TextArea
                  label="Subheadline"
                  value={formData.heroSubheadline}
                  onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
                  required
                  rows={3}
                  placeholder="Premier real estate development company..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} fullWidth>
                {isSubmitting ? 'Saving Settings...' : 'Save Settings'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/dashboard')}
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

export default SiteSettings;
