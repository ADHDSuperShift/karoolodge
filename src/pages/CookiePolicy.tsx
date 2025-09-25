import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CookiePolicy: React.FC = () => {
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
            Cookie Policy
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
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you 
              visit our website. They are widely used to make websites work more efficiently and to 
              provide information to website owners.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-700 mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>To ensure our website functions properly</li>
              <li>To remember your preferences and settings</li>
              <li>To analyze how you use our website</li>
              <li>To provide personalized content and advertisements</li>
              <li>To improve our services and website performance</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Essential Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies are necessary for the website to function and cannot be switched off. 
              They are usually set in response to actions made by you, such as setting privacy 
              preferences or filling in forms.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Performance Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies collect information about how visitors use our website, such as which 
              pages are visited most often. This data helps us improve how our website works.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Functionality Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies allow the website to remember choices you make and provide enhanced, 
              more personal features. They may be set by us or by third-party providers.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Marketing Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies are used to deliver advertisements that are relevant to you and your 
              interests. They may also be used to limit the number of times you see an advertisement.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              We may use third-party services that place cookies on your device. These include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Google Analytics:</strong> To analyze website traffic and usage patterns</li>
              <li><strong>Booking Systems:</strong> To facilitate hotel reservations</li>
              <li><strong>Social Media:</strong> To enable social media sharing features</li>
              <li><strong>Payment Processors:</strong> To securely process payments</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">5. Cookie Duration</h2>
            <p className="text-gray-700 mb-4">Cookies may be either:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period or until you delete them</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">6. Managing Your Cookie Preferences</h2>
            <p className="text-gray-700 mb-4">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Use your browser settings to block or delete cookies</li>
              <li>Set your browser to notify you when cookies are being sent</li>
              <li>Use browser plugins that block tracking cookies</li>
              <li>Opt-out of targeted advertising through industry websites</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">7. Browser Settings</h2>
            <p className="text-gray-700 mb-4">
              Most browsers allow you to manage cookie settings. Here's how to access these settings 
              in popular browsers:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">8. Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our use of cookies, please contact us:
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

export default CookiePolicy;
