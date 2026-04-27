"use client";

import Link from "next/link";
import { TbCalendarEvent } from "react-icons/tb";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
export default function Footer() {
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
                        <li>
                            <Link href="/about" className="hover:underline">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/how-it-works" className="hover:underline">
                                How It Works
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:underline">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link href="/careers" className="hover:underline">
                                Careers
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="font-semibold mb-4">Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/terms" className="hover:underline">
                                Terms of Service
                            </Link>
                        </li>
                        <li>
                            <Link href="/refund" className="hover:underline">
                                Refund Policy
                            </Link>
                        </li>
                        <li>
                            <Link href="/halal-standards" className="hover:underline">
                                Halal Standards
                            </Link>
                        </li>
                        <li>
                            <Link href="/privacy" className="hover:underline">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link href="/cookies" className="hover:underline">
                                Cookie Policy
                            </Link>
                        </li>
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