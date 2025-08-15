// app/tos/page.jsx
import React from 'react';

// Metadata for the page
export const metadata = {
  title: 'Terms of Service | HomeLend',
  description: 'HomeLend Terms of Service. By using our website, you agree to these terms.',
  openGraph: {
    title: 'Terms of Service',
    description: 'The official terms of service for the HomeLend platform.',
    url: 'https://homelend.co.ke/terms-of-service',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      },
    ],
  },
};

export default function page() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6 text-center">
          Terms of Service
        </h1>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Introduction
            </h2>
            <p>
              Welcome to HomeLend! These Terms of Service ("Terms") govern your use of our website and services. By accessing or using the HomeLend platform, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Services Provided
            </h2>
            <p>
              HomeLend is a third-party platform that provides a service to help users acquire information about rental properties in Kenya. We are not a landlord, property manager, or real estate agent. We do not own, manage, or lease any of the properties listed on our website.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Property Verification
            </h2>
            <p>
              We are committed to providing a safe and reliable service. All rental units listed on our platform are verified by the website owner or administrator. This verification process is designed to ensure the authenticity and accuracy of the listings. However, we strongly recommend that users always conduct their own due diligence, inspect the property in person, and verify all details before entering into any rental agreement. HomeLend is not responsible for any issues that may arise from a rental agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              User Accounts
            </h2>
            <p>
              To access certain services on HomeLend, you must register and create a user account. You are responsible for maintaining the confidentiality of your account information, including your password. You agree to accept responsibility for all activities that occur under your account. You must be at least 18 years old to create an account.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Prohibited Conduct
            </h2>
            <p>
              You agree not to use the HomeLend platform to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Engage in any illegal or fraudulent activity.</li>
              <li>Post false, misleading, or deceptive information.</li>
              <li>Interfere with the security or integrity of our website.</li>
              <li>Collect or harvest any personal data of other users without their consent.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Disclaimer of Warranties
            </h2>
            <p>
              The HomeLend website and all its content are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, error-free, or secure.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, HomeLend shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes to the website's policies and services are done on a need-to-know basis. It is your responsibility to review the Terms periodically. Your continued use of the service after any changes constitutes your acceptance of the new Terms.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
