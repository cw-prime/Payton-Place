import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, DollarSign, Quote, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getProjectById } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Project } from '../types';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const getImageUrl = (imagePath: string) => {
    // If already a full URL (http/https), return as-is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend API base URL
    return `http://localhost:5000${imagePath}`;
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id!);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <button
            onClick={() => navigate('/projects')}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Floating Edit Button (Admin Only) */}
      {admin && (
        <button
          onClick={() => navigate(`/admin/projects/${id}/edit`)}
          className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center gap-2"
          title="Edit this project"
        >
          <Edit className="w-5 h-5" />
          <span className="hidden md:inline">Edit Project</span>
        </button>
      )}

      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <section className="bg-gray-900">
        <div className="container-custom py-8">
          {/* Main Image */}
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="aspect-video w-full overflow-hidden rounded-lg mb-4"
          >
            <img
              src={getImageUrl(project.images[selectedImage])}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Thumbnail Gallery */}
          {project.images.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {project.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-white scale-95'
                      : 'border-transparent hover:border-gray-400'
                  }`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${project.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title & Category */}
              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-4 capitalize">
                  {project.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
                <p className="text-xl text-gray-600">{project.type}</p>
              </div>

              {/* Description */}
              <div className="prose prose-lg max-w-none mb-12">
                <h2 className="text-2xl font-bold mb-4">About This Project</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {/* Testimonial */}
              {project.testimonial && (
                <div className="bg-gray-50 border-l-4 border-gray-700 p-6 mb-12">
                  <Quote className="w-8 h-8 text-gray-400 mb-4" />
                  <p className="text-lg text-gray-700 italic mb-4">
                    "{project.testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold">{project.testimonial.author}</p>
                      <p className="text-sm text-gray-600">{project.testimonial.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Project Details */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-6">Project Details</h3>

                <div className="space-y-4">
                  {/* Location */}
                  {project.details?.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{project.details.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Completion Date */}
                  {project.details?.completionDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="font-medium">
                          {new Date(project.details.completionDate).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Duration */}
                  {project.details?.duration && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">{project.details.duration}</p>
                      </div>
                    </div>
                  )}

                  {/* Budget */}
                  {project.details?.budget && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Budget Range</p>
                        <p className="font-medium">{project.details.budget}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">
                    Interested in a similar project?
                  </p>
                  <button
                    onClick={() => navigate('/quote')}
                    className="w-full bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
                  >
                    Get a Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects CTA */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">View More Projects</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our portfolio of successful renovation projects
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="btn-primary"
          >
            Browse All Projects
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
