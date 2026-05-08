'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart, Users, Zap, TrendingUp,
  DollarSign, Laptop, Calendar, GraduationCap, Shield, Coffee,
  Briefcase, Clock, CircleCheckBig, ArrowDown
} from 'lucide-react';
import { LocationIcon } from './Icons';

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  applicationLink?: string;
}

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/jobs`);
        const result = await response.json();
        if (result.success) {
          setJobs(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <main className="flex-1 w-full bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase w-3.5 h-3.5 sm:w-4 sm:h-4"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>
            <span className="text-xs sm:text-sm">Join Our Team</span>
          </div>
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Build the Future of Halal Events
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-red-100 max-w-2xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
            Join a mission-driven team creating the UK's leading platform for halal events. Work on meaningful problems that impact thousands of people in our community.
          </p>
          <a href="#open-positions" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 py-2 has-[>svg]:px-3 bg-white text-red-600 hover:bg-red-50 text-sm sm:text-base">
            View Open Positions
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-right ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 md:space-y-20">

          {/* Our Values Section */}
          <section>
            <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
              <h2 className="mb-3 sm:mb-4 text-gray-900 text-xl sm:text-2xl md:text-3xl">Our Values</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">These principles guide everything we do at HalalBrite</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

              <div className="bg-white text-gray-900 flex flex-col gap-6 border p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <h3 className="mb-1.5 sm:mb-2 text-gray-900 text-base sm:text-lg md:text-xl">Community First</h3>
                <p className="text-gray-600 text-sm sm:text-base">We exist to serve the Muslim community and make halal events accessible to everyone.</p>
              </div>

              <div className="bg-white text-gray-900 flex flex-col gap-6 border p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <h3 className="mb-1.5 sm:mb-2 text-gray-900 text-base sm:text-lg md:text-xl">Inclusive Culture</h3>
                <p className="text-gray-600 text-sm sm:text-base">We celebrate diversity and create a welcoming environment where everyone can thrive.</p>
              </div>

              <div className="bg-white text-gray-900 flex flex-col gap-6 border p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <h3 className="mb-1.5 sm:mb-2 text-gray-900 text-base sm:text-lg md:text-xl">Move Fast</h3>
                <p className="text-gray-600 text-sm sm:text-base">We iterate quickly, learn from feedback, and continuously improve our platform.</p>
              </div>

              <div className="bg-white text-gray-900 flex flex-col gap-6 border p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <h3 className="mb-1.5 sm:mb-2 text-gray-900 text-base sm:text-lg md:text-xl">Own Your Impact</h3>
                <p className="text-gray-600 text-sm sm:text-base">Take ownership of your work and see the direct impact on thousands of users.</p>
              </div>

            </div>
          </section>

          {/* Benefits & Perks Section */}
          <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
              <h2 className="mb-3 sm:mb-4 text-gray-900 text-xl sm:text-2xl md:text-3xl">Benefits & Perks</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">We invest in our team's wellbeing and growth</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">

              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-gray-900 text-sm sm:text-base md:text-lg">Competitive Salary</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Market-leading compensation packages with performance bonuses</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <LocationIcon size={20} className="text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-gray-900 text-sm sm:text-base md:text-lg">Remote First</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Work from anywhere in Europe with flexible hours</p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-gray-900 text-sm sm:text-base md:text-lg">Generous PTO</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">25 days annual leave plus public holidays and Eid celebrations</p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-gray-900 text-sm sm:text-base md:text-lg">Learning Budget</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">€1,500 annual budget for courses, conferences, and books</p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-gray-900 text-sm sm:text-base md:text-lg">Health Insurance</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Comprehensive private health and dental coverage</p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-gray-900 text-sm sm:text-base md:text-lg">Wellness Perks</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Gym membership, mental health support, and wellness stipend</p>
                </div>
              </div>

            </div>
          </section>

          {/* Open Positions Section */}
          <section id="open-positions">
            <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
              <h2 className="mb-3 sm:mb-4 text-gray-900 text-xl sm:text-2xl md:text-3xl">Open Positions</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                {loading ? 'Searching for opportunities...' : `${jobs.length} opportunities to make an impact`}
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {loading ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
                  <p className="text-gray-500">Loading career opportunities...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No open positions at the moment.</p>
                  <p className="text-gray-400 text-sm">Check back later or send us your CV!</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job._id} className="bg-white text-gray-900 flex flex-col gap-6 border p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-2 text-gray-900 text-base sm:text-lg md:text-xl">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{job.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <LocationIcon size={16} className="text-red-500" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{job.type}</span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={job.applicationLink || '#'}
                        target={job.applicationLink ? "_blank" : "_self"}
                        className="inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl whitespace-nowrap w-full md:w-auto text-sm sm:text-base"
                      >
                        Apply Now
                      </a>
                    </div>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{job.description}</p>
                    <div>
                      <h4 className="mb-2 sm:mb-3 text-gray-900 text-sm sm:text-base md:text-lg">Requirements:</h4>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {job.requirements && job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600 text-xs sm:text-sm md:text-base">
                            <CircleCheckBig className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Application Process Section */}
          <section className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl md:text-3xl">Application Process</h2>
              <p className="text-base sm:text-lg md:text-xl text-red-100 mb-8 sm:mb-10 md:mb-12 px-2 sm:px-0">We believe in a fair and transparent hiring process</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl">1</div>
                  <h3 className="mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg font-medium">Apply</h3>
                  <p className="text-red-100 text-xs sm:text-sm md:text-base">Submit your CV and cover letter</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl">2</div>
                  <h3 className="mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg font-medium">Screen</h3>
                  <p className="text-red-100 text-xs sm:text-sm md:text-base">Initial call with our team</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl">3</div>
                  <h3 className="mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg font-medium">Interview</h3>
                  <p className="text-red-100 text-xs sm:text-sm md:text-base">Meet the team and showcase your skills</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl">4</div>
                  <h3 className="mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg font-medium">Offer</h3>
                  <p className="text-red-100 text-xs sm:text-sm md:text-base">Join the HalalBrite family!</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6">
                <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 px-2 sm:px-0">Don't see a role that fits? We're always looking for talented people.</p>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 bg-white text-red-600 hover:bg-red-50 text-sm sm:text-base">
                  Send Us Your CV
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
