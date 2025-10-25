import RatingStars from './RatingStars';
import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const submittedDate = new Date(review.createdAt).toLocaleDateString();

  return (
    <article className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
          <p className="text-sm text-gray-500">By {review.customerName} • {submittedDate}</p>
        </div>
        <RatingStars rating={review.rating} />
      </div>

      <p className="text-gray-700 leading-relaxed mb-4">
        {review.body}
      </p>

      {review.serviceId?.name && (
        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
          {review.serviceId.name}
        </span>
      )}
    </article>
  );
};

export default ReviewCard;
