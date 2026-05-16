import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Pricing from '@/Components/Pricing';

export const metadata = {
  title: 'Pricing | Halalbrite',
  description: 'Simple and transparent pricing for halal events. No hidden fees.',
};

export default function PricingPage() {
  return (
    <div className="flex flex-col bg-[#fef3f6]">
      <Header />
      <Pricing />
      <Footer />
    </div>
  );
}
