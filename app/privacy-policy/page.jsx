import React from 'react';

// Metadata for the page
export const metadata = {
  title: 'Privacy Policy | HomeLend',
  description: 'HomeLend Privacy Policy. Learn how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy',
    description: 'The official privacy policy for the HomeLend platform.',
    url: 'https://homelend.co.ke/privacy-policy',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1550565228-4a654d241de5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      },
    ],
  },
};

export default function page() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6 text-center">
          Privacy Policy
        </h1>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Introduction
            </h2>
            <p>
              Your privacy is important to us. This Privacy Policy explains how HomeLend ("we," "us," or "our") collects, uses, and protects your personal information when you use our website. By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Information We Collect
            </h2>
            <p>
              We collect information to provide and improve our services. The types of information we may collect include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>
                <span className="font-semibold">Personal Information:</span> When you register for an account or use our services, we may collect personal details such as your name, email address, phone number, and password.
              </li>
              <li>
                <span className="font-semibold">User Content:</span> This includes any information you voluntarily provide, such as your saved favorite properties, search history, or any feedback you submit.
              </li>
              <li>
                <span className="font-semibold">Usage Data:</span> We automatically collect data about how you interact with our website. This includes your IP address, browser type, pages visited, time spent on the site, and other diagnostic data.
              </li>
              <li>
                <span className="font-semibold">Property Information:</span> As a third-party platform, we collect and verify information about rental units, including property descriptions, photos, and features. This information is publicly displayed to help you find a suitable home.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              How We Use Your Information
            </h2>
            <p>
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>To provide and maintain our services, including property listings and user account management.</li>
              <li>To personalize your experience and show you relevant content based on your search history and preferences.</li>
              <li>To communicate with you about your account, new features, and important updates.</li>
              <li>To verify the authenticity of properties and maintain the integrity of our platform.</li>
              <li>To monitor and analyze usage patterns to improve the functionality and design of our website.</li>
              <li>To protect our services and users from fraudulent or harmful activity.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Sharing Your Information
            </h2>
            <p>
              We do not sell or rent your personal information to third parties. However, we may share your data in the following situations:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>
                <span className="font-semibold">With Your Consent:</span> We will only share your personal contact information with property agents or owners with your explicit consent, such as when you request to view a property.
              </li>
              <li>
                <span className="font-semibold">Service Providers:</span> We may use third-party companies to perform services on our behalf, such as website hosting, data analysis, or customer support. These third parties are obligated not to disclose or use your information for any other purpose.
              </li>
              <li>
                <span className="font-semibold">Legal Compliance:</span> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Your Rights
            </h2>
            <p>
              You have the right to access, update, or request the deletion of your personal information at any time. You can do this by logging into your account or by contacting us directly.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Data Security
            </h2>
            <p>
              We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
