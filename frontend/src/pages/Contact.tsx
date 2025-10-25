import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import SectionHeading from '../components/SectionHeading';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import Button from '../components/Button';
import { submitContactForm } from '../services/api';
import type { ContactForm } from '../types';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  projectType: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');
      await submitContactForm(data as ContactForm);
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

  const projectTypeOptions = [
    { value: '', label: 'Select Project Type' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'both', label: 'Both' },
  ];

  return (
    <div className="min-h-screen pt-20">
      <AnimatedSection className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <SectionHeading
            subtitle="We're here to help with your development needs. Whether you're planning a residential renovation or a commercial project, our team is ready to assist you. Reach out to us today to discuss your vision and how we can bring it to life."
          >
            Get in Touch
          </SectionHeading>

          {/* Contact Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-12">
            <Input
              {...register('name')}
              placeholder="Your Name"
              error={errors.name?.message}
            />

            <Input
              {...register('email')}
              type="email"
              placeholder="Your Email"
              error={errors.email?.message}
            />

            <TextArea
              {...register('message')}
              placeholder="Your Message"
              error={errors.message?.message}
            />

            <Select
              {...register('projectType')}
              options={projectTypeOptions}
              error={errors.projectType?.message}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
              className="!py-4"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>

            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                Something went wrong. Please try again later.
              </div>
            )}
          </form>

          {/* Contact Information */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Phone: (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Email: info@paytonplace.com</span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-lg overflow-hidden">
            <iframe
              title="Service area map highlighting St. Louis and the surrounding metro region"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-90.5992%2C38.4821%2C-89.7989%2C38.7945&amp;layer=mapnik&amp;marker=38.6270%2C-90.1994"
              className="w-full h-96 border-0"
              loading="lazy"
              allowFullScreen
            />
            <p className="mt-2 text-sm text-gray-500">
              Serving the Greater St. Louis metro area.{' '}
              <a
                href="https://www.openstreetmap.org/?mlat=38.6270&amp;mlon=-90.1994#map=11/38.6270/-90.1994"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View larger map
              </a>
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Contact;
