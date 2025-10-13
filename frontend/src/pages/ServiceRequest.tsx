import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import SectionHeading from '../components/SectionHeading';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import Button from '../components/Button';
import { getServices } from '../services/api';
import type { Service } from '../types';

const serviceRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  serviceId: z.string().min(1, 'Please select a service'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  preferredContactMethod: z.enum(['email', 'phone', 'either']),
});

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

const ServiceRequest = () => {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      preferredContactMethod: 'either',
    },
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);

        // Pre-select service if serviceId is in URL
        const serviceId = searchParams.get('serviceId');
        if (serviceId) {
          setValue('serviceId', serviceId);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [searchParams, setValue]);

  const onSubmit = async (data: ServiceRequestFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_URL}/service-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit service request');
      }

      setSubmitStatus('success');
      reset();
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    { value: '', label: 'Select a Service' },
    ...services.map(service => ({
      value: service._id,
      label: `${service.name} (${service.category})`,
    })),
  ];

  const contactMethodOptions = [
    { value: 'either', label: 'Either Email or Phone' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
  ];

  return (
    <div className="min-h-screen pt-20">
      <AnimatedSection className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <SectionHeading
            subtitle="Interested in one of our services? Fill out the form below and we'll get back to you as soon as possible to discuss your project needs."
          >
            <div className="flex items-center justify-center gap-3">
              <Wrench className="w-8 h-8" />
              Request a Service
            </div>
          </SectionHeading>

          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-md mb-8">
              ✅ Thank you! Your service request has been submitted successfully. We'll contact you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-md mb-8">
              ❌ There was an error submitting your request. Please try again or contact us directly.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('name')}
              placeholder="Your Name *"
              error={errors.name?.message}
            />

            <Input
              {...register('email')}
              type="email"
              placeholder="Your Email *"
              error={errors.email?.message}
            />

            <Input
              {...register('phone')}
              type="tel"
              placeholder="Your Phone Number *"
              error={errors.phone?.message}
            />

            <Select
              {...register('serviceId')}
              options={serviceOptions}
              error={errors.serviceId?.message}
            />

            <TextArea
              {...register('message')}
              placeholder="Tell us about your project and what you need *"
              rows={6}
              error={errors.message?.message}
            />

            <Select
              {...register('preferredContactMethod')}
              options={contactMethodOptions}
              error={errors.preferredContactMethod?.message}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Submitting...' : 'Submit Service Request'}
            </Button>
          </form>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default ServiceRequest;
