import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from './Input';
import TextArea from './TextArea';
import Select from './Select';
import Button from './Button';
import Turnstile from './Turnstile';
import StarRatingInput from './StarRatingInput';
import { submitReview, type ReviewSubmissionPayload } from '../services/api';
import type { Service } from '../types';

const reviewSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customerEmail: z.string().email('Invalid email address').max(160),
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  body: z.string().min(20, 'Review must be at least 20 characters').max(1000),
  serviceId: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  services: Service[];
  onSuccess?: () => void;
}

const ReviewForm = ({ services, onSuccess }: ReviewFormProps) => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      serviceId: '',
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setSubmitStatus('idle');
      setErrorMessage('');

      if (!turnstileToken && import.meta.env.VITE_TURNSTILE_SITE_KEY) {
        setErrorMessage('Please complete the verification before submitting.');
        return;
      }

      const payload: ReviewSubmissionPayload = {
        customerName: data.customerName.trim(),
        customerEmail: data.customerEmail.trim(),
        rating: data.rating,
        title: data.title.trim(),
        body: data.body.trim(),
        serviceId: data.serviceId ? data.serviceId : undefined,
        turnstileToken,
      };

      await submitReview(payload);
      setSubmitStatus('success');
      reset({ rating: 5, customerName: '', customerEmail: '', title: '', body: '', serviceId: '' });
      setTurnstileToken('');
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Unable to submit review. Please try again.';
      setErrorMessage(message);
      setSubmitStatus('error');
    }
  };

  const serviceOptions = [
    { value: '', label: 'Select a service (optional)' },
    ...services.map((service) => ({
      value: service._id,
      label: service.name,
    })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Share Your Experience</h3>
        <p className="text-gray-600">
          We value your feedback. Your review helps other homeowners learn about our work.
        </p>
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          ✅ Thank you! Your review has been submitted and will appear once approved.
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          {...register('customerName')}
          placeholder="Your Name *"
          error={errors.customerName?.message}
        />
        <Input
          {...register('customerEmail')}
          type="email"
          placeholder="Email Address *"
          error={errors.customerEmail?.message}
        />
      </div>

      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <StarRatingInput
            value={field.value}
            onChange={(value) => field.onChange(value)}
            onBlur={field.onBlur}
            error={errors.rating?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <Input
        {...register('title')}
        placeholder="Review title *"
        error={errors.title?.message}
      />

      <TextArea
        {...register('body')}
        rows={5}
        placeholder="Share details about your project and experience *"
        error={errors.body?.message}
      />

      <Select
        {...register('serviceId')}
        options={serviceOptions}
        error={errors.serviceId?.message}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Turnstile
          onVerify={setTurnstileToken}
          onError={() => setTurnstileToken('')}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
