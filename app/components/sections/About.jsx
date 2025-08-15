import React from 'react'

function About() {
  return (
    <section id="about" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    About HomeLend
                </h2>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                    Your trusted partner in finding quality rental properties in Nairobi
                </p>
            </div>

            <div className="mt-10">
                <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                <i className="fas fa-home"></i>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Our Mission</h3>
                            <p className="mt-2 text-base text-gray-500">
                                To simplify the rental process in Nairobi by connecting tenants with quality properties and providing transparent, reliable information.
                            </p>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                <i className="fas fa-check-circle"></i>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Verified Listings</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Every property on our platform is personally verified by our team to ensure accuracy and prevent scams.
                            </p>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                <i className="fas fa-map-marked-alt"></i>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Neighborhood Expertise</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Our team has in-depth knowledge of Nairobi's diverse neighborhoods to help you find the perfect location.
                            </p>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                <i className="fas fa-headset"></i>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Dedicated Support</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Our customer service team is available to assist you throughout your rental journey, from search to move-in.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 bg-blue-50 rounded-lg overflow-hidden shadow">
                <div className="lg:grid lg:grid-cols-12">
                    <div className="lg:col-span-6 p-8 sm:p-12">
                        <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Our Story</h3>
                        <p className="mt-4 text-gray-600">
                            Founded in 2018 by a team frustrated with Nairobi's opaque rental market, HomeLend was born out of a desire to create a more transparent, efficient way to find quality rental properties.
                        </p>
                        <p className="mt-4 text-gray-600">
                            What started as a small database of verified listings has grown into Nairobi's most trusted rental platform, helping thousands find their perfect home each year.
                        </p>
                        <div className="mt-6">
                            <a href="#contact" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                Get in Touch
                            </a>
                        </div>
                    </div>
                    <div className="hidden lg:block lg:col-span-6">
                        <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="HomeLend team" />
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default About