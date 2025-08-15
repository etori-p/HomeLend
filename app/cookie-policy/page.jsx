import React from 'react';

// Metadata for the page
export const metadata = {
  title: 'Cookie Policy | HomeLend',
  description: 'HomeLend Cookie Policy. Learn about the types of cookies we use and how they enhance your experience.',
  openGraph: {
    title: 'Cookie Policy',
    description: 'The official cookie policy for the HomeLend platform.',
    url: 'https://homelend.co.ke/cookie-policy',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      },
    ],
  },
};

export default function page() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6 text-center">
          Cookie Policy
        </h1>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              What are Cookies?
            </h2>
            <p>
              Cookies are small text files that are placed on your device (computer, smartphone, etc.) when you visit a website. They are used to make websites work more efficiently and to provide information to the website owners.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              How We Use Cookies
            </h2>
            <p>
              HomeLend uses cookies for several purposes to enhance your user experience:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>
                <span className="font-semibold">Essential Cookies:</span> These cookies are necessary for the website to function correctly. They enable core functionalities like security, network management, and accessibility.
              </li>
              <li>
                <span className="font-semibold">Performance and Analytics Cookies:</span> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This allows us to improve our services and content.
              </li>
              <li>
                <span className="font-semibold">Functionality Cookies:</span> These cookies remember your preferences, such as your search filters or a property you’ve marked as a favorite. This provides you with a more personalized experience.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Your Choices
            </h2>
            <p>
              You can manage or disable cookies through your web browser settings. Most browsers allow you to control cookies, including whether to accept them and how to remove them. However, please be aware that disabling essential cookies may affect the functionality of the HomeLend website.
            </p>
          </div>
          
          <p>
            If you have any questions about these policies, please feel free to contact us through the channels provided on our website.
          </p>
        </section>
      </div>
    </div>
  );
}
