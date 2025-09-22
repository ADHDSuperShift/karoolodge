import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "Cape Town",
      image: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528773911_f94af1ba.webp",
      rating: 5,
      text: "An absolutely magical experience! The Karoo landscape is breathtaking, and the hotel's attention to detail is exceptional. The Vintage Car Restaurant was a highlight - such a unique dining experience with incredible food.",
      date: "November 2024"
    },
    {
      id: 2,
      name: "Michael Thompson",
      location: "Johannesburg",
      image: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528776069_05fd95dd.webp",
      rating: 5,
      text: "Perfect getaway from city life. The wine boutique has an excellent selection of local wines, and the staff's knowledge is impressive. We'll definitely be back for the jazz evenings at Windpomp Bar.",
      date: "October 2024"
    },
    {
      id: 3,
      name: "Emma van der Merwe",
      location: "Durban",
      image: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528778380_4721b9d9.webp",
      rating: 5,
      text: "Our anniversary weekend was perfect. The luxury suite had stunning mountain views, and the sunset sessions at the bar were romantic. The staff made us feel like royalty throughout our stay.",
      date: "September 2024"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
            Guest Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what our guests say about their unforgettable stays at Barrydale Karoo Boutique Hotel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-xl p-8 relative hover:shadow-lg transition-shadow duration-300">
              <Quote className="w-8 h-8 text-amber-600 mb-4" />
              
              <div className="flex text-amber-500 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                  <p className="text-xs text-gray-500">{testimonial.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-amber-50 rounded-full px-6 py-3">
            <div className="flex text-amber-500 mr-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-amber-700 font-semibold">4.9/5 Average Rating</span>
            <span className="text-amber-600 ml-2">(127 reviews)</span>
          </div>
          
          <div className="mt-6">
            <button className="border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Read All Reviews
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;