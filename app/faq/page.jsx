'use client';

import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How does HomeLend ensure the properties are real and not scams?',
      answer: 'We prioritize listing authenticity. Every property on our platform is verified through a rigorous process that includes on-site inspections, confirmation of ownership, and a review of the provided photos. We only work with trusted agents and landlords to provide you with a safe and secure browsing experience. We encourage users to never pay for a property they have not seen in person.',
    },
    {
      question: 'What types of properties can I find on HomeLend?',
      answer: 'HomeLend features a wide variety of rental properties to suit every need. You can find everything from single rooms and bedsitters (studios) to modern apartments and spacious family houses in many neighborhoods across Kenya.',
    },
    {
      question: 'What makes a neighborhood "Hot" or "Popular" on your website?',
      answer: 'Our "Hot" and "Popular" neighborhood tags are based on real-time feedback from our users. We analyze factors like high search interest, positive tenant reviews, and community engagement to identify areas that are currently in high demand. This helps you find not just a house, but a vibrant community to live in.',
    },
    {
      question: 'What is the typical rental process through HomeLend?',
      answer: 'The process is simple: 1. Search our listings using our powerful filters. 2. View high-quality photos and detailed property information. 3. Use the contact details on the listing to schedule a viewing with the agent or landlord. 4. Once you are satisfied, you will sign a tenancy agreement and pay the required deposit and rent before moving in. We recommend you get a written agreement and receipts for all payments.',
    },
    {
      question: 'What documents are required to rent a property in Kenya?',
      answer: 'Typically, you will need a copy of your National ID or passport, a signed tenancy agreement, and evidence of rent and deposit payments. Some landlords may also request references from a previous landlord or your employer.',
    },
    {
      question: 'What about the security deposit? How much is it, and when will I get it back?',
      answer: 'The security deposit is usually equivalent to one or two months\' rent. It is held by the landlord to cover any damages beyond normal wear and tear or unpaid rent. You are entitled to a full refund of your deposit upon vacating the property, provided it is left in good condition and all outstanding bills are cleared. We advise tenants to document the property\'s condition with photos and videos before moving in to avoid disputes.',
    },
    {
      question: 'How are utilities like water and electricity handled?',
      answer: 'This varies by property. In most cases, tenants are responsible for their own utility bills, which are paid separately. Some properties may include water or garbage collection fees within the rent. The listing details on HomeLend will specify which utilities are included, but you should always confirm this with the landlord or agent before signing the agreement.',
    },
    {
      question: 'How can I report a problem with a listing or an agent?',
      answer: 'Your feedback is crucial to maintaining our high standards. If you encounter any misleading information, a unresponsive agent, or a listing that seems fraudulent, please use the "Report Listing" button on the property page. Our team will investigate immediately to ensure the integrity of our platform.',
    },
    {
      question: 'Are there any hidden costs I should be aware of?',
      answer: 'HomeLend is committed to transparency. The price displayed is the monthly rent. However, you should be prepared for standard move-in costs, which typically include a refundable security deposit and an agent’s commission (if applicable). We always encourage you to ask the landlord or agent for a full breakdown of all costs before making any payments.',
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <header className="p-6 sm:p-8 text-center bg-blue-50">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Everything you need to know about HomeLend and renting a property in Kenya.
          </p>
        </header>
        
        <main className="p-6 sm:p-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="flex items-center justify-between w-full py-4 text-left font-medium text-lg text-gray-800 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                >
                  <span>{faq.question}</span>
                  <FaChevronDown
                    className={`transform transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180 text-blue-600' : 'text-gray-500'
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-700 text-base leading-relaxed pl-4 border-l-2 border-blue-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
