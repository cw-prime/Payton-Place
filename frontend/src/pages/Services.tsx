import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import ServiceCard from '../components/ServiceCard';
import SectionHeading from '../components/SectionHeading';
import LoadingSpinner from '../components/LoadingSpinner';
import { getServices } from '../services/api';
import { ArrowRight } from 'lucide-react';
import type { Service } from '../types';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const residentialServices = services.filter((s) => s.category === 'residential');
  const commercialServices = services.filter((s) => s.category === 'commercial');

  return (
    <div className="min-h-screen pt-20">
      <AnimatedSection className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            subtitle="Payton Place Development offers a comprehensive suite of renovation and development services tailored to meet the unique needs of both residential and commercial clients. Our expertise spans from individual room remodels to complete property transformations, ensuring quality and satisfaction every step of the way."
          >
            Our Services
          </SectionHeading>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Residential Services */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold mb-8">Residential Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {residentialServices.map((service, index) => (
                    <AnimatedSection key={service._id} delay={index * 0.1}>
                      <ServiceCard service={service} />
                    </AnimatedSection>
                  ))}
                </div>
              </div>

              {/* Commercial Services */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold mb-8">Commercial Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {commercialServices.map((service, index) => (
                    <AnimatedSection key={service._id} delay={index * 0.1}>
                      <ServiceCard service={service} />
                    </AnimatedSection>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <AnimatedSection className="mt-12">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white">
                  <h3 className="text-3xl font-bold mb-4">
                    Interested in One of Our Services?
                  </h3>
                  <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
                    Request a specific service and we'll get back to you with a customized quote and timeline for your project.
                  </p>
                  <Link
                    to="/service-request"
                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Request a Service
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </AnimatedSection>
            </>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Services;
