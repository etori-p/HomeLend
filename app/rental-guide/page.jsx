// app/rental-guide/page.jsx
import React from 'react';


const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center space-x-3 mb-4">
    <div className="flex-shrink-0 p-3 bg-blue-100 text-blue-600 rounded-full">
      <i className={`${icon} h-6 w-6`}></i>
    </div>
    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
  </div>
);

export default function RentalGuidePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center shadow-lg">
        <div className="absolute inset-0">
          <div className="bg-cover bg-center h-full opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ff621e204364?q=80&w=2670&auto=format&fit=crop')" }}></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            The Ultimate Rental Guide
          </h1>
          <p className="text-xl sm:text-2xl font-light max-w-2xl mx-auto">
            Your step-by-step handbook to finding, securing, and settling into your new rental home across Kenya's cities.
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 md:space-y-20">

          {/* Section 1: Getting Started */}
          <section id="getting-started" className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100">
            <SectionHeader icon="fas fa-search" title="1. Getting Started: Your Search" />
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                The journey to a new home begins with a clear plan. Whether you're looking for a vibrant apartment in Nairobi, a coastal home in Mombasa, or a relaxed spot in Kisumu, start by determining your non-negotiables.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-medium text-gray-900">Define Your Budget:</span> Be realistic about what you can afford. Remember to factor in not just rent, but also utilities, transport, and other monthly expenses.</li>
                <li><span className="font-medium text-gray-900">Choose Your Location:</span> Consider your commute, proximity to amenities, and the overall safety and vibe of the neighborhood.</li>
                <li><span className="font-medium text-gray-900">Create a Checklist:</span> Use a checklist of your must-haves versus nice-to-haves. This will keep you focused and prevent you from getting sidetracked.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: The Application Process */}
          <section id="application-process" className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100">
            <SectionHeader icon="fas fa-clipboard-list" title="2. The Application Process" />
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                Once you find a property you love, it's time to prepare for the application. A strong application can make all the difference in a competitive market.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-medium text-gray-900">Gather Your Documents:</span> Have your national ID or passport, proof of income (pay slips or bank statements), and references ready. This shows you are a serious and prepared applicant.</li>
                <li><span className="font-medium text-gray-900">Be Punctual:</span> Respond to communication from the agent or landlord promptly. Being accessible demonstrates your reliability.</li>
                <li><span className="font-medium text-gray-900">Ask Questions:</span> Don't be afraid to ask about the lease agreement, move-in date, or any specific rules for the property.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Understanding the Lease */}
          <section id="lease-agreement" className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100">
            <SectionHeader icon="fas fa-handshake" title="3. The Lease Agreement" />
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                This is a legally binding document. It is crucial that you read and understand every clause before you sign.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-medium text-gray-900">Review all terms:</span> Pay close attention to the length of the tenancy, the rent amount and due date, and the conditions for termination of the lease.</li>
                <li><span className="font-medium text-gray-900">Security Deposit:</span> Understand how much the deposit is and the conditions under which it will be returned to you at the end of your tenancy.</li>
                <li><span className="font-medium text-gray-900">Maintenance and Repairs:</span> Clarify who is responsible for what. Does the landlord handle major repairs, or are you responsible for minor fixes?</li>
              </ul>
            </div>
          </section>
          
          {/* Section 4: Navigating Specific Cities */}
          <section id="city-tips" className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100">
            <SectionHeader icon="fas fa-city" title="4. City-Specific Rental Tips" />
            <div className="prose max-w-none text-gray-700 space-y-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Nairobi</h3>
                <p>Nairobi is fast-paced with diverse neighborhoods. Consider traffic when choosing your location. Areas like Lavington, Kilimani, and Westlands offer modern apartments, while Donholm and Umoja are more budget-friendly. Always verify commute times during peak hours.</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Mombasa</h3>
                <p>Renting in Mombasa often means dealing with a different climate. Look for houses with good ventilation or air conditioning. Nyali is a popular suburb with beach access and modern amenities, while areas like Bamburi and Shanzu are also great options with varying price points.</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Kisumu</h3>
                <p>The "Lakeside City" offers a more relaxed pace. When renting in Kisumu, be mindful of proximity to Lake Victoria and potential flood risks during heavy rains in certain low-lying areas. The town center and Milimani are popular residential areas.</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Nakuru & Eldoret</h3>
                <p>These two are rapidly growing urban centers. Nakuru offers a blend of city life with the natural beauty of Lake Nakuru. Eldoret is a major agricultural hub, and its rental market is growing. Both cities offer a good balance of affordability and amenities.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Moving In */}
          <section id="moving-in" className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100">
            <SectionHeader icon="fas fa-home" title="5. Moving into Your New Home" />
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                The hard work is over! Now it's time to move in and get settled.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-medium text-gray-900">Inventory and Condition:</span> Take detailed photos and videos of the property on move-in day. This is your proof of the property's condition and can help avoid disputes later.</li>
                <li><span className="font-medium text-gray-900">Transfer Utilities:</span> Make sure all utilities like electricity and water are transferred into your name.</li>
                <li><span className="font-medium text-gray-900">Connect with Your Neighbors:</span> Introduce yourself to your neighbors. A friendly relationship can make a big difference in your new home.</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
