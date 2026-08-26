import { useState } from "react";

type StarRatingProps = {
  rating: number | null;
  onRate: (rating: number) => void;
  onRemove: () => void;
  disabled?: boolean;
};

function StarRating({ rating, onRate, onRemove, disabled }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const display = hovered || rating || 0;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition hover:scale-110 disabled:opacity-50"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={star <= display ? "#facc15" : "none"}
            stroke={star <= display ? "#facc15" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/30"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
      {rating && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 text-[11px] text-white/40 hover:text-white/70"
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default StarRating;
