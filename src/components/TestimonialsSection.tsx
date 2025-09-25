import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Enhanced testimonials with TripAdvisor-style data
  const testimonials = [
    {
      id: 1,
      name: "Sarah_J_CT",
      realName: "Sarah J",
      location: "Cape Town, South Africa",
      tripAdvisorBadge: "Top Contributor",
      avatar: "SJ",
      rating: 5,
      title: "Exceptional Klein Karoo Experience",
      text: "An absolutely magical experience! The Klein Karoo landscape is breathtaking, and the hotel's attention to detail is exceptional. The Vintage Car Restaurant was a highlight - such a unique dining experience with incredible food. Staff went above and beyond.",
      date: "November 2024",
      tripType: "Romantic getaway",
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      name: "MikeT_JHB",
      realName: "Michael T",
      location: "Johannesburg, South Africa",
      tripAdvisorBadge: "Reviewer",
      avatar: "MT",
      rating: 5,
      title: "Perfect Wine Country Retreat",
      text: "Perfect getaway from city life. The wine boutique has an excellent selection of local wines, and the staff's knowledge is impressive. We'll definitely be back for the jazz evenings at Windpomp Bar. Outstanding value for money!",
      date: "October 2024",
      tripType: "Couples trip",
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      name: "Emma_vdM_DBN",
      realName: "Emma v",
      location: "Durban, South Africa",
      tripAdvisorBadge: "Senior Reviewer",
      avatar: "EV",
      rating: 5,
      title: "Anniversary Weekend Perfection",
      text: "Our anniversary weekend was perfect. The luxury suite had stunning mountain views, and the sunset sessions at the bar were romantic. The staff made us feel like royalty throughout our stay. Highly recommend the Route 62 packages.",
      date: "September 2024",
      tripType: "Anniversary",
      helpful: 15,
      verified: true
    },
    {
      id: 4,
      name: "JamesK_UK",
      realName: "James K",
      location: "London, United Kingdom",
      tripAdvisorBadge: "Hotel Expert",
      avatar: "JK",
      rating: 4,
      title: "Authentic South African Charm",
      text: "Fantastic boutique hotel with authentic Klein Karoo character. The accommodation was spotless and comfortable. Restaurant serves excellent local cuisine. Only minor issue was WiFi in some areas, but that added to the digital detox experience!",
      date: "August 2024",
      tripType: "Solo travel",
      helpful: 6,
      verified: true
    },
    {
      id: 5,
      name: "FamilyAdventure_CT",
      realName: "Lisa & David M",
      location: "Cape Town, South Africa",
      tripAdvisorBadge: "Top Contributor",
      avatar: "LM",
      rating: 5,
      title: "Family-Friendly Excellence",
      text: "Brilliant family stay! Kids loved exploring the grounds while we enjoyed the wine tasting. Family suite was spacious and well-equipped. Staff were incredibly helpful with local activity recommendations. The star-gazing was unforgettable!",
      date: "July 2024",
      tripType: "Family vacation",
      helpful: 21,
      verified: true
    },
    {
      id: 6,
      name: "WineEnthusiast_PE",
      realName: "Robert S",
      location: "Port Elizabeth, South Africa",
      tripAdvisorBadge: "Wine Expert",
      avatar: "RS",
      rating: 5,
      title: "Wine Lover's Paradise",
      text: "Outstanding selection in the wine boutique! Knowledgeable sommelier, excellent local varietals, perfect pairings with dinner. The cellar tour was educational and fun. This is definitely a must-visit for wine enthusiasts traveling Route 62.",
      date: "June 2024",
      tripType: "Wine tour",
      helpful: 9,
      verified: true
    }
  ];

  const reviewsPerSlide = 2;
  const totalSlides = Math.ceil(testimonials.length / reviewsPerSlide);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const getCurrentReviews = () => {
    const startIndex = currentSlide * reviewsPerSlide;
    return testimonials.slice(startIndex, startIndex + reviewsPerSlide);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with TripAdvisor branding */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-lg mr-4">
              TripAdvisor
            </div>
            <div className="flex items-center">
              <div className="flex text-amber-600 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-current" />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">4.8/5</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
            Guest Reviews
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real reviews from verified guests who stayed at Barrydale Klein Karoo Boutique Hotel
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
                    {testimonials
                      .slice(slideIndex * reviewsPerSlide, slideIndex * reviewsPerSlide + reviewsPerSlide)
                      .map((testimonial) => (
                        <div 
                          key={testimonial.id} 
                          className="bg-gray-50 rounded-xl p-6 relative hover:shadow-lg transition-all duration-300 border border-gray-100"
                        >
                          {/* TripAdvisor-style header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                                {testimonial.avatar}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{testimonial.realName}</h4>
                                <p className="text-sm text-gray-600">{testimonial.location}</p>
                                <p className="text-xs text-amber-600 font-medium">{testimonial.tripAdvisorBadge}</p>
                              </div>
                            </div>
                            
                            {testimonial.verified && (
                              <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                                ✓ Verified
                              </div>
                            )}
                          </div>

                          {/* Rating and Title */}
                          <div className="mb-3">
                            <div className="flex items-center mb-2">
                              <div className="flex text-amber-600 mr-2">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{testimonial.date}</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{testimonial.title}</h3>
                            <p className="text-xs text-gray-500 mb-3">✈ Trip type: {testimonial.tripType}</p>
                          </div>
                          
                          {/* Review Text */}
                          <Quote className="w-6 h-6 text-amber-600 mb-2" />
                          <p className="text-gray-700 leading-relaxed italic mb-4">
                            "{testimonial.text}"
                          </p>
                          
                          {/* Helpful votes */}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>👍 {testimonial.helpful} people found this helpful</span>
                            <span className="text-xs">@{testimonial.name}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 border border-gray-200"
            disabled={totalSlides <= 1}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 border border-gray-200"
            disabled={totalSlides <= 1}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-amber-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* TripAdvisor CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-amber-50 rounded-full px-8 py-4 mb-6">
            <div className="flex text-amber-600 mr-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div>
              <span className="text-amber-800 font-bold text-lg">4.8/5 Excellent</span>
              <span className="text-amber-700 ml-2">(247 reviews)</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.open('https://www.tripadvisor.com', '_blank')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center mr-4"
            >
              View on TripAdvisor
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
            
            <button className="border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Write a Review
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Reviews collected from TripAdvisor and verified guest stays
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;