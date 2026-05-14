"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TbCalendarEvent } from "react-icons/tb";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
export default function Footer() {
    const companyPages = [
        { title: "About Us", slug: "aboutus" },
        { title: "How It Works", slug: "how-it-works" },
        { title: "Contact", slug: "contact" },
        { title: "Careers", slug: "careers" }
    ];

    const supportPages = [
        { title: "Terms of Service", slug: "terms-of-service" },
        { title: "Refund Policy", slug: "refund-policy" },
        { title: "Halal Standards", slug: "halal-standards" },
        { title: "Privacy Policy", slug: "privacy-policy" },
        { title: "Cookie Policy", slug: "cookie-policy" }
    ];

    return (
        <footer className="bg-[#d32f2fff] text-white mt-auto">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-[20px] pt-[10px] pr-[16px] pb-[20px] pl-[16px] px-[32px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="sm:col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
                            <Link href="/" className="  logoside">
                                <img src="/images/footer.png" alt="Logo" className="w-full img-fluid" />
                            </Link>
                        </div>
                        <p className="text-red-100 text-sm">Connecting communities through meaningful halal events.</p>
                    </div>

                    <div>
                        <h4 className="mb-4">Company</h4>
                        <ul className="space-y-2 text-red-100 text-sm">
                            {companyPages.map(page => (
                                <li key={page.slug}>
                                    <Link href={`/${page.slug}`} className="hover:text-white transition-colors">
                                        {page.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4">Support</h4>
                        <ul className="space-y-2 text-red-100 text-sm">
                            {supportPages.map(page => (
                                <li key={page.slug}>
                                    <Link href={`/${page.slug}`} className="hover:text-white transition-colors">
                                        {page.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4">Follow Us</h4>
                        <div className="flex gap-3 flex-wrap">
                            <Link href="https://www.instagram.com/Halalbrite/" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram w-5 h-5 text-white/80"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                            </Link>
                            <Link href="https://www.facebook.com/people/Halalbrite/61567698940439/" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-5 h-5 text-white/80"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </Link>
                            {/* <Link href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="X">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter w-5 h-5 text-white/80"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Pinterest">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin w-5 h-5 text-white/80"><path d="M12 17v5"></path><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path></svg>
                            </Link> */}
                            <Link href="https://www.linkedin.com/company/Halalbrite/" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin w-5 h-5 text-white/80"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </Link>
                            {/* <Link href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="YouTube">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube w-5 h-5 text-white/80"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
                            </Link> */}
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#a30000] mt-8 pt-8 text-center text-red-100 text-sm">
                    <p>© 2026 Halalbrite. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}