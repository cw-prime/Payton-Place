import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AnimatedSection from '../components/AnimatedSection';
import SectionHeading from '../components/SectionHeading';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import Button from '../components/Button';
import Turnstile from '../components/Turnstile';
import { submitQuoteRequest } from '../services/api';

const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  projectType: z.enum(['residential', 'commercial', 'both'], {
    required_error: 'Please select a project type',
  }),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  budgetRange: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const Quote = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteFormData) => {
    if (!turnstileToken) {
      setSubmitStatus('error');
      console.error('Turnstile verification required');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');
      await submitQuoteRequest({ ...data, turnstileToken } as any);
      setSubmitStatus('success');
      reset();
      setSelectedProjectType('');
      setTurnstileToken('');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectTypeClick = (type: 'residential' | 'commercial' | 'both') => {
    setSelectedProjectType(type);
    setValue('projectType', type);
  };

  const budgetOptions = [
    { value: '', label: 'Select Budget Range' },
    { value: 'under-50k', label: 'Under $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: '100k-200k', label: '$100,000 - $200,000' },
    { value: '200k-500k', label: '$200,000 - $500,000' },
    { value: 'over-500k', label: 'Over $500,000' },
  ];

  const timelineOptions = [
    { value: '', label: 'Select Timeline' },
    { value: 'asap', label: 'ASAP' },
    { value: '1-3-months', label: '1-3 Months' },
    { value: '3-6-months', label: '3-6 Months' },
    { value: '6-12-months', label: '6-12 Months' },
    { value: 'flexible', label: 'Flexible' },
  ];

  return (
    <div className="min-h-screen pt-20">
      <AnimatedSection className="section-padding bg-white">
        <div className="container-custom max-w-2xl">
          <SectionHeading
            subtitle="Tell us about your project, and we'll provide you with a detailed quote."
          >
            Get a Quote
          </SectionHeading>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('name')}
              label="Name"
              placeholder="Your Name"
              error={errors.name?.message}
            />

            <Input
              {...register('email')}
              label="Email"
              type="email"
              placeholder="Your Email"
              error={errors.email?.message}
            />

            <Input
              {...register('phone')}
              label="Phone Number"
              type="tel"
              placeholder="Your Phone Number"
              error={errors.phone?.message}
            />

            {/* Project Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Project Type
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleProjectTypeClick('residential')}
                  className={`flex-1 px-4 py-3 border rounded-md font-medium transition-colors ${
                    selectedProjectType === 'residential'
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Residential
                </button>
                <button
                  type="button"
                  onClick={() => handleProjectTypeClick('commercial')}
                  className={`flex-1 px-4 py-3 border rounded-md font-medium transition-colors ${
                    selectedProjectType === 'commercial'
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Commercial
                </button>
                <button
                  type="button"
                  onClick={() => handleProjectTypeClick('both')}
                  className={`flex-1 px-4 py-3 border rounded-md font-medium transition-colors ${
                    selectedProjectType === 'both'
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Both
                </button>
              </div>
              {errors.projectType && (
                <p className="mt-1 text-sm text-red-600">{errors.projectType.message}</p>
              )}
            </div>

            <TextArea
              {...register('description')}
              label="Project Description"
              placeholder="Describe your project in detail"
              rows={6}
              error={errors.description?.message}
            />

            <Select
              {...register('budgetRange')}
              label="Budget Range"
              options={budgetOptions}
              error={errors.budgetRange?.message}
            />

            <Select
              {...register('timeline')}
              label="Timeline"
              options={timelineOptions}
              error={errors.timeline?.message}
            />

            <Turnstile
              onVerify={setTurnstileToken}
              onError={() => setTurnstileToken('')}
            />

            <Button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              fullWidth
              className="!py-4"
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
            </Button>

            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                Thank you for your quote request! We'll review your project details and get back to you within 24-48 hours.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                Something went wrong. Please try again later or contact us directly.
              </div>
            )}
          </form>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Quote;
