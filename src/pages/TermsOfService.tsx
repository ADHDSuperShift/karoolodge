import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hotel
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300">
            Barrydale Klein Karoo Boutique Hotel
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> September 24, 2025
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using the services of Barrydale Klein Karoo Boutique Hotel, you accept 
              and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">2. Reservations and Bookings</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Booking Process</h3>
            <p className="text-gray-700 mb-4">
              All reservations must be guaranteed with a valid credit card. Confirmation of your 
              reservation will be sent via email within 24 hours of booking.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Payment Terms</h3>
            <p className="text-gray-700 mb-4">
              A deposit of 50% is required at the time of booking. The remaining balance is due 
              upon arrival. We accept major credit cards, EFT, and cash payments.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">3. Cancellation Policy</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Standard Cancellations</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>48+ hours before arrival: Full refund of deposit</li>
              <li>24-48 hours before arrival: 50% refund of deposit</li>
              <li>Less than 24 hours: No refund</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Peak Season & Special Events</h3>
            <p className="text-gray-700 mb-4">
              During peak seasons and special events, a 7-day cancellation policy applies. 
              No refunds for cancellations made less than 7 days before arrival.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">4. Check-in and Check-out</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Check-in:</strong> 14:00 (2:00 PM)</li>
              <li><strong>Check-out:</strong> 11:00 (11:00 AM)</li>
              <li>Early check-in and late check-out may be available upon request and subject to availability</li>
              <li>Late check-out after 2:00 PM may incur additional charges</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">5. Guest Conduct</h2>
            <p className="text-gray-700 mb-4">Guests are expected to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Treat all property and staff with respect</li>
              <li>Comply with noise policies, especially during quiet hours (22:00 - 07:00)</li>
              <li>Not exceed the maximum occupancy for their accommodation</li>
              <li>Not smoke in non-smoking areas</li>
              <li>Be responsible for any damage caused during their stay</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">6. Liability and Insurance</h2>
            <p className="text-gray-700 mb-4">
              The hotel shall not be liable for any loss, damage, or injury to guests or their property, 
              except where such loss or damage is caused by our negligence. We recommend guests obtain 
              comprehensive travel insurance.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">7. Force Majeure</h2>
            <p className="text-gray-700 mb-4">
              We shall not be held liable for any failure to perform our obligations due to circumstances 
              beyond our reasonable control, including but not limited to natural disasters, government 
              actions, or public health emergencies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">8. Privacy</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand 
              how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">9. Modifications</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting on our website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> info@barrydalekaroolodge.co.za</p>
              <p className="text-gray-700"><strong>Phone:</strong> 028 572 1020</p>
              <p className="text-gray-700"><strong>Address:</strong> 11 Tennant Street, Barrydale, Western Cape, South Africa, 6750</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
