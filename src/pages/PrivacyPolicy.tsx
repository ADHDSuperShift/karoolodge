import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
            Privacy Policy
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
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you make a reservation, 
              create an account, subscribe to our newsletter, or contact us for support.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Billing and payment information</li>
              <li>Preferences and special requests</li>
              <li>Communication records</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Process and manage your reservations</li>
              <li>Provide customer service and support</li>
              <li>Send you confirmations, updates, and marketing communications</li>
              <li>Improve our services and website functionality</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Service providers who assist with our operations</li>
              <li>Payment processors for booking transactions</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your information</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              Our website uses cookies and similar technologies to enhance your experience. 
              Please see our Cookie Policy for detailed information about our use of cookies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">7. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> info@barrydalekaroolodge.co.za</p>
              <p className="text-gray-700"><strong>Phone:</strong> 028 572 1020</p>
              <p className="text-gray-700"><strong>Address:</strong> 11 Tennant Street, Barrydale, Western Cape, South Africa, 6750</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
