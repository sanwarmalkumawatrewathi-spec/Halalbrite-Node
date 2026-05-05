import React from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import CookiePolicy from '@/Components/CookiePolicy';
import { Metadata } from "next";

async function getPageData(slug: string) {
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/api/pages/${slug}`, { next: { revalidate: 60 } });
    const result = await response.json();
    return response.ok ? result.data : null;
  } catch (err) {
    console.error("Failed to fetch static page:", err);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData("cookie-policy");
  if (!page) return { title: "CookiePolicy" };

  const title = page.metaTitle || page.title;
  const description = page.metaDescription || "";

  return {
    title: title,
    description: description,
    keywords: page.metaKeywords,
    openGraph: {
      title: title,
      description: description,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    }
  };
}

export default function CookiePolicyPage() {
  return (
    <div className=" flex flex-col bg-[#fef3f6]">
      <Header />
      <CookiePolicy />
      <Footer />
    </div>
  );
}