import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import Select from '../../components/Select';
import Button from '../../components/Button';
import StarRatingInput from '../../components/StarRatingInput';
import type { Review, Service } from '../../types';

const reviewEditSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email().max(160),
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(120),
  body: z.string().min(10).max(1000),
  serviceId: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

export type ReviewEditFormValues = z.infer<typeof reviewEditSchema>;

interface ReviewEditModalProps {
  review: Review | null;
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ReviewEditFormValues) => Promise<void>;
  isSaving: boolean;
}

const ReviewEditModal = ({
  review,
  services,
  isOpen,
  onClose,
  onSubmit,
  isSaving,
}: ReviewEditModalProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewEditFormValues>({
    resolver: zodResolver(reviewEditSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      rating: 5,
      title: '',
      body: '',
      serviceId: '',
      featured: false,
      status: 'pending',
    },
  });

  useEffect(() => {
    if (review && isOpen) {
      reset({
        customerName: review.customerName,
        customerEmail: review.customerEmail,
        rating: review.rating,
        title: review.title,
        body: review.body,
        serviceId: review.serviceId?._id ?? '',
        featured: review.featured,
        status: review.status,
      });
    }
  }, [review, isOpen, reset]);

  if (!isOpen || !review) return null;

  const serviceOptions = [
    { value: '', label: 'No service selected' },
    ...services.map((service) => ({
      value: service._id,
      label: service.name,
    })),
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">Edit Review</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
          })}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              {...register('customerName')}
              label="Customer Name"
              error={errors.customerName?.message}
            />
            <Input
              {...register('customerEmail')}
              label="Customer Email"
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
              />
            )}
          />

          <Input
            {...register('title')}
            label="Review Title"
            error={errors.title?.message}
          />

          <TextArea
            {...register('body')}
            label="Review Body"
            rows={6}
            error={errors.body?.message}
          />

          <Select
            {...register('serviceId')}
            label="Associated Service"
            options={serviceOptions}
            error={errors.serviceId?.message}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              {...register('status')}
              label="Status"
              options={statusOptions}
              error={errors.status?.message}
            />

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                {...register('featured')}
              />
              <span className="text-sm font-medium text-gray-700">
                Feature this review on the Services page
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewEditModal;
