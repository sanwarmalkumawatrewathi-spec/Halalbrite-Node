"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TbCalendarEvent } from "react-icons/tb";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
export default function Footer() {
    const [companyPages, setCompanyPages] = useState<any[]>([]);
    const [supportPages, setSupportPages] = useState<any[]>([]);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
                const response = await fetch(`${baseUrl}/api/pages`);
                const result = await response.json();
                if (response.ok) {
                    const pages = result.data || [];
                    setCompanyPages(pages.filter((p: any) => p.showInMenu && p.menuLocation === 'company'));
                    setSupportPages(pages.filter((p: any) => p.showInMenu && p.menuLocation === 'support'));
                }
            } catch (err) {
                console.error("Failed to fetch footer pages:", err);
            }
        };
        fetchPages();
    }, []);

    return (
        <footer className="bg-red-700 text-white mt-[80px]">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Logo + Description */}
                <div>
                    <h2 className="flex items-center gap-2 font-semibold text-lg mb-6">
                        <TbCalendarEvent size={25} />
                        <span>HalalBrite</span>
                    </h2>
                    <p className="text-sm text-red-100">
                        Connecting communities through meaningful halal events.
                    </p>
                </div>

                {/* Company */}
                <div>
                    <h3 className="font-semibold mb-4">Company</h3>
                    <ul className="space-y-2 text-sm">
                        {companyPages.map(page => (
                            <li key={page.slug}>
                                <Link href={`/${page.slug}`} className="hover:underline">
                                    {page.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="font-semibold mb-4">Support</h3>
                    <ul className="space-y-2 text-sm">
                        {supportPages.map(page => (
                            <li key={page.slug}>
                                <Link href={`/${page.slug}`} className="hover:underline">
                                    {page.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="font-semibold mb-3">Follow Us</h3>
                    <div className="grid  grid-cols-5 gap-3 ">
                        <Link href="#" className="bg-red-400 w-[35px] h-[35px] rounded-full hover:bg-red-400 flex justify-center items-center">
                            <FaInstagram width={16} height={16}/>
                        </Link>
                        <Link href="#" className="bg-red-400 w-[35px] h-[35px] rounded-full hover:bg-red-400 flex justify-center items-center">
                            <FaFacebook width={16} height={16}/>
                        </Link>
                        <Link href="#" className="bg-red-400 w-[35px] h-[35px] rounded-full hover:bg-red-400 flex justify-center items-center">
                            <AiFillTwitterCircle width={16} height={16}/>
                        </Link>
                         <Link href="#" className="bg-red-400 w-[35px] h-[35px] rounded-full hover:bg-red-400 flex justify-center items-center">
                            <AiFillTwitterCircle width={16} height={16}/>
                        </Link>
                         <Link href="#" className="bg-red-400 w-[35px] h-[35px] rounded-full hover:bg-red-400 flex justify-center items-center">
                            <AiFillTwitterCircle width={16} height={16}/>
                        </Link>
                       
                         <Link href="#" className="bg-red-400 w-[35px] h-[35px] rounded-full hover:bg-red-400 flex justify-center items-center">
                            <AiFillTwitterCircle width={16} height={16}/>
                        </Link>
                        
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="text-center text-sm text-red-100 border-t border-red-900 py-4 w-7xl mx-auto">
                © 2025 HalalBrite. All rights reserved.
            </div>
        </footer>
    );
}