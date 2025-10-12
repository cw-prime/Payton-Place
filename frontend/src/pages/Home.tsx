import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Users, TrendingUp } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import ProjectCard from '../components/ProjectCard';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProjects, getServices } from '../services/api';
import type { Project, Service } from '../types';

interface SiteSettings {
  heroMediaType: 'image' | 'video';
  heroImageUrl: string;
  heroVideoUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
}

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const API_BASE_URL = API_URL.replace('/api', '');

  const getMediaUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, servicesData, settingsData] = await Promise.all([
          getProjects(undefined, true), // Get featured projects
          getServices(),
          fetch(`${API_URL}/settings`).then(res => res.json()),
        ]);
        setFeaturedProjects(projectsData.slice(0, 3));
        setServices(servicesData.slice(0, 6));
        setSettings(settingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Media with Parallax Effect */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 z-10" />

          {/* Show loading state or default while settings load */}
          {!settings ? (
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600"
              alt="Modern home"
              className="w-full h-full object-cover"
            />
          ) : settings.heroMediaType === 'video' ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                minWidth: '100%',
                minHeight: '100%',
              }}
              onError={(e) => {
                console.error('Video failed to load, showing fallback image');
                e.currentTarget.style.display = 'none';
              }}
            >
              <source src={getMediaUrl(settings.heroVideoUrl)} type="video/mp4" />
            </video>
          ) : (
            <img
              src={getMediaUrl(settings.heroImageUrl)}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 container-custom text-center text-white">
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {settings?.heroHeadline || 'Transforming Spaces, Building Dreams'}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {settings?.heroSubheadline || 'Premier real estate development company specializing in exceptional residential and commercial renovations'}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/projects"
              className="bg-white text-gray-900 px-8 py-4 rounded-md hover:bg-gray-100 transition-colors font-medium inline-flex items-center justify-center"
            >
              View Our Projects
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/quote"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-md hover:bg-white hover:text-gray-900 transition-colors font-medium"
            >
              Get a Quote
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <AnimatedSection className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-700" />
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-700" />
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-gray-600">Satisfied Clients</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-700" />
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Projects Section */}
      <AnimatedSection className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Explore our portfolio of successful renovation projects, showcasing our
                commitment to quality and innovation
              </p>
            </div>
            <Link
              to="/projects"
              className="hidden md:inline-flex items-center text-gray-700 hover:text-gray-900 font-medium"
            >
              View All Projects
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}

          <div className="text-center md:hidden">
            <Link
              to="/projects"
              className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium"
            >
              View All Projects
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Services Section */}
      <AnimatedSection className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Comprehensive renovation and development services tailored to meet the
              unique needs of both residential and commercial clients
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/services"
              className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium"
            >
              View All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="section-padding bg-gray-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Let's discuss your vision and bring it to life with our expert team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quote"
              className="bg-white text-gray-900 px-8 py-4 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Get a Free Quote
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-md hover:bg-white hover:text-gray-900 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Home;
