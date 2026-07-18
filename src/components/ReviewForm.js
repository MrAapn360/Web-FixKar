import { useState } from "react";
import { bookingService } from "../api/services";

const SUGGESTED_TAGS = ["On time", "Professional", "Fair price", "Skilled", "Friendly"];

export default function ReviewForm({ bookingId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleTag = (tag) => {
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await bookingService.review(bookingId, { rating, comment: comment || null, tags });
      onSubmitted?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not submit review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card mt-2">
      <h3>Leave a review</h3>

      {error && <div className="form-error mt-1">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating</label>
          <div className="star-picker">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`star-btn ${n <= rating ? "star-btn-active" : ""}`}
                onClick={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>What went well? (optional)</label>
          <div className="skills">
            {SUGGESTED_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`skill-tag skill-tag-toggle ${tags.includes(tag) ? "skill-tag-active" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Comment (optional)</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the service?"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
