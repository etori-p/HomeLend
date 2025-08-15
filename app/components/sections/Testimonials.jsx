'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { FaStar, FaRegStar, FaSpinner, FaPaperPlane, FaTimesCircle } from 'react-icons/fa';


const Spinner = ({ size = 'w-5 h-5', color = 'text-blue-500' }) => (
  <FaSpinner className={`${size} ${color} animate-spin`} />
);

// Star Rating Component for display and input
const StarRating = ({ rating, setRating, editable = false }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`cursor-pointer ${editable ? 'hover:text-yellow-500' : ''} ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        onClick={() => editable && setRating(i)}
      >
        {i <= rating ? <FaStar /> : <FaRegStar />}
      </span>
    );
  }
  return <div className="flex">{stars}</div>;
};

// Function to get a random set of unique testimonials
const getRandomTestimonials = (allTestimonials, count) => {
  if (allTestimonials.length <= count) {
    return allTestimonials;
  }
  const shuffled = [...allTestimonials].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function Testimonials() {
  const { data: session, status: sessionStatus } = useSession();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states for new testimonial submission
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // State to hold the testimonials currently being displayed on mobile
  const [mobileDisplayTestimonials, setMobileDisplayTestimonials] = useState([]);
  
  // Ref for the scrolling container on desktop
  const scrollRef = useRef(null);
  
  // State to control the automatic scrolling for desktop
  const [isScrolling, setIsScrolling] = useState(true);
  const scrollInterval = useRef(null);

  // Check if it's a mobile screen
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to fetch testimonials
  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/testimonials', { method: 'GET' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch testimonials.');
      }
      const data = await res.json();
      setTestimonials(data);
      // Set the initial set of testimonials to display for mobile
      setMobileDisplayTestimonials(getRandomTestimonials(data, 3));
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err.message || 'Could not load testimonials.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  //  Automatic Random Refresh for Mobile 
  useEffect(() => {
    // Only run this on mobile-sized screens
    if (isMobile && testimonials.length > 0) {
      const refreshInterval = setInterval(() => {
        setMobileDisplayTestimonials(getRandomTestimonials(testimonials, 3));
      }, 5000); 

      // Clean up the interval on component unmount or when not on mobile
      return () => clearInterval(refreshInterval);
    }
    // Don't run if not mobile
    return;
  }, [isMobile, testimonials]);

  //  Automatic Horizontal Scrolling for Desktop 
  useEffect(() => {
    const container = scrollRef.current;
    // Only run this on non-mobile sized screens
    if (isMobile || !isScrolling || testimonials.length === 0 || !container) {
      return;
    }

    // Create a duplicated list for seamless looping
    const duplicatedTestimonials = testimonials.length > 3 ? [...testimonials, ...testimonials] : testimonials;
    
    // Interval to trigger the scroll every 6 seconds
    scrollInterval.current = setInterval(() => {
      const cardWidth = container.children[0]?.offsetWidth || 0;
      const scrollAmount = cardWidth + 32; 
      
      const originalContentWidth = cardWidth * testimonials.length + 32 * (testimonials.length - 1);

      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

      if (container.scrollLeft >= originalContentWidth) {
        container.scrollTo({ left: 0, behavior: 'auto' });
      }
    }, 6000);

    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [isMobile, isScrolling, testimonials]);


  // Handle new testimonial submission
  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    if (sessionStatus !== 'authenticated') {
      setSubmitError('You must be logged in to submit a testimonial.');
      setSubmitting(false);
      return;
    }
    if (newRating === 0) {
      setSubmitError('Please select a star rating.');
      setSubmitting(false);
      return;
    }
    if (newComment.trim().length < 10 || newComment.trim().length > 500) {
      setSubmitError('Comment must be between 10 and 500 characters.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating, comment: newComment }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit testimonial.');
      }

      const data = await res.json();
      setSubmitSuccess('Testimonial submitted successfully!');
      setNewRating(0);
      setNewComment('');
      fetchTestimonials();
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      setSubmitError(err.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  // Create a combined list of testimonials for the desktop loop
  const duplicatedTestimonials = testimonials.length > 3 ? [...testimonials, ...testimonials] : testimonials;

  return (
    <section className="py-12 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Hear from satisfied renters who found their perfect home through HomeLend
          </p>
        </div>

        {/* Testimonial Submission Form (Conditional) */}
        {sessionStatus === 'authenticated' && (
          <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave Your Testimonial</h3>
            <form onSubmit={handleSubmitTestimonial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating:</label>
                <StarRating rating={newRating} setRating={setNewRating} editable={true} />
                {submitError.includes('rating') && (
                  <p className="text-red-500 text-xs mt-1">{submitError}</p>
                )}
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Comment:</label>
                <textarea
                  id="comment"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="4"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience..."
                  required
                ></textarea>
                {(submitError.includes('Comment') || submitError.includes('characters')) && (
                  <p className="text-red-500 text-xs mt-1">{submitError}</p>
                )}
              </div>
              {submitError && !submitError.includes('rating') && !submitError.includes('Comment') && (
                <p className="text-red-500 text-sm">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="text-green-600 text-sm">{submitSuccess}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 font-semibold flex items-center justify-center transition-colors duration-200"
              >
                {submitting ? <Spinner size="w-4 h-4" color="text-white" /> : <FaPaperPlane className="mr-2" />}
                {submitting ? 'Submitting...' : 'Submit Testimonial'}
              </button>
            </form>
          </div>
        )}

        {/* Display Testimonials */}
        {loading ? (
          <div className="mt-16 flex flex-col items-center justify-center min-h-[200px]">
            <Spinner size="w-16 h-16" color="text-blue-500" />
            <p className="text-xl text-gray-600 mt-4">Loading testimonials...</p>
          </div>
        ) : error ? (
          <div className="mt-16 text-center text-red-600 text-lg">
            <FaTimesCircle className="inline-block mr-2" /> {error}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="mt-16 text-center text-gray-600 text-lg">
            No testimonials yet. Be the first to share your experience!
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="mt-16 flex flex-col space-y-4 sm:hidden">
              {mobileDisplayTestimonials.map((testimonial) => (
                <div 
                  key={testimonial._id} 
                  className="bg-white p-6 rounded-lg shadow-md w-full"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {testimonial.userId?.image ? (
                        <img className="h-12 w-12 rounded-full object-cover" src={testimonial.userId.image} alt={testimonial.userId.firstName} />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-lg">
                          {testimonial.userId?.firstName ? testimonial.userId.firstName[0].toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {testimonial.userId?.firstName || 'Anonymous User'} {testimonial.userId?.lastName || ''}
                      </h4>
                      <div className="flex mt-1">
                        <StarRating rating={testimonial.rating} editable={false} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">
                      "{testimonial.comment}"
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div 
              ref={scrollRef}
              className="mt-16 hidden sm:flex overflow-x-auto scroll-smooth snap-x snap-mandatory space-x-8 pb-4 hide-scrollbar"
              onMouseEnter={() => setIsScrolling(false)}
              onMouseLeave={() => setIsScrolling(true)} 
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <div 
                  key={`${testimonial._id}-${index}`} 
                  className="bg-white p-6 rounded-lg shadow-md min-w-[33.3333%] snap-center"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {testimonial.userId?.image ? (
                        <img className="h-12 w-12 rounded-full object-cover" src={testimonial.userId.image} alt={testimonial.userId.firstName} />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-lg">
                          {testimonial.userId?.firstName ? testimonial.userId.firstName[0].toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {testimonial.userId?.firstName || 'Anonymous User'} {testimonial.userId?.lastName || ''}
                      </h4>
                      <div className="flex mt-1">
                        <StarRating rating={testimonial.rating} editable={false} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">
                      "{testimonial.comment}"
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
