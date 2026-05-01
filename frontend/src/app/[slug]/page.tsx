import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Metadata } from "next";

interface StaticPage {
  title: string;
  content: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

async function getPageData(slug: string): Promise<StaticPage | null> {
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageData(slug);
  if (!page) return { title: "Page Not Found" };

  const title = page.metaTitle || page.title;
  const description = page.metaDescription || "";

  return {
    title: title,
    description: description,
    keywords: page.metaKeywords,
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      url: `/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    }
  };
}

export default async function StaticPageDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fef3f6]">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-red-900 mb-4">404</h1>
          <p className="text-gray-600 mb-8">Page not found</p>
          <a href="/" className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition">
            Back to Home
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fef3f6]">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-20">
        <article className="bg-white rounded-3xl shadow-xl shadow-red-100/50 overflow-hidden">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-12 md:px-12 md:py-16 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              {page.title}
            </h1>
            <div className="flex items-center gap-4 text-red-100 text-sm">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: {new Date(page.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-8 md:p-12 prose prose-lg max-w-none prose-red prose-headings:text-red-900 prose-a:text-red-600 prose-img:rounded-2xl">
            <div 
              dangerouslySetInnerHTML={{ __html: page.content }} 
              className="static-page-content"
            />
          </div>
        </article>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .static-page-content h1 { font-size: 2.25rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: #7f1d1d; }
        .static-page-content h2 { font-size: 1.875rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.875rem; color: #7f1d1d; }
        .static-page-content h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #7f1d1d; }
        .static-page-content p { margin-bottom: 1.25rem; line-height: 1.75; color: #374151; }
        .static-page-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.25rem; }
        .static-page-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.25rem; }
        .static-page-content li { margin-bottom: 0.5rem; }
        .static-page-content blockquote { border-left: 4px solid #ef4444; padding-left: 1rem; font-style: italic; color: #4b5563; margin: 1.5rem 0; }
        .static-page-content a { color: #dc2626; text-decoration: underline; font-weight: 500; }
        .static-page-content a:hover { color: #991b1b; }
        .static-page-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
        .static-page-content th, .static-page-content td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
        .static-page-content th { background-color: #f9fafb; font-weight: 600; }
      `}} />
    </div>
  );
}
