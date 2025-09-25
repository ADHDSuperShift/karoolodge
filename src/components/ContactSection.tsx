import React, { useMemo, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useGlobalState } from '@/contexts/GlobalStateContext';

const ContactSection: React.FC = () => {
  const { siteContent } = useGlobalState();
  const { contactInfo } = siteContent;
  const addressLines = useMemo(
    () => (contactInfo.address ? contactInfo.address.split('\n') : []),
    [contactInfo.address]
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const encodedAddress = encodeURIComponent((contactInfo.address || '11 Tennant Street Barrydale South Africa').replace(/\n/g, ' '));
  const mapSrc = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ready to experience the magic of the Klein Karoo? Get in touch with us to plan your perfect getaway.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-8">Get in Touch</h3>
            
            <div className="space-y-6 mb-8">
                            <div className="flex items-start">
                <Phone className="w-6 h-6 text-amber-600 mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-600">{contactInfo.phone || '028 572 1020'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-amber-600 mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">{contactInfo.email || 'info@barrydalekaroolodge.co.za'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-amber-600 mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Address</h4>
                  {addressLines.length > 0 ? (
                    addressLines.map((line, index) => (
                      <p key={index} className="text-gray-600">
                        {line}
                      </p>
                    ))
                  ) : (
                    <>
                      <p className="text-gray-600">11 Tennant Street</p>
                      <p className="text-gray-600">Barrydale, Western Cape</p>
                      <p className="text-gray-600">South Africa, 6750</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-6 h-6 text-amber-600 mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Reception Hours</h4>
                  <p className="text-gray-600">Daily: 07:00 - 22:00</p>
                  <p className="text-gray-600">24/7 Emergency Contact Available</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-inner">
              <iframe
                title="Barrydale Karoo Boutique Hotel location"
                src={mapSrc}
                className="h-64 w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Tell us about your visit plans, special requirements, or any questions you have..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
              >
                Send Message <Send className="w-5 h-5" />
              </button>
            </form>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              We'll respond to your inquiry within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
