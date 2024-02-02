import About from 'components/Home/about';
import Categories from 'components/Home/categories';
import Collections from 'components/Home/collections';
import Divider from 'components/Home/divider';
import Gender from 'components/Home/gender';
import HeroSection from 'components/Home/hero-section';
import Incentives from 'components/Home/incentives';
import Reviews from 'components/Home/reviews';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import { Skeleton } from 'components/ui/skeleton';
import { Suspense } from 'react';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  return (
    <>
      {/* Intro Section */}
      <Suspense fallback={<Skeleton className="h-[75svh] w-[75svw]" />}>
        <HeroSection />
      </Suspense>
      <Divider />
      {/* Collections */}
      <Collections />
      <Divider />
      {/* Some Category (Best Selling, New arrivals) */}
      <h1 className="my-10 w-full text-center text-5xl">Best Selling Products</h1>
      <ThreeItemGrid />
      <Divider />
      {/* Show Categories (GOLD, SILVER, DIAMOND, MENS) */}
      <Categories />
      <Divider />
      <Incentives />
      <Gender />
      <Divider />
      <About />
      <Reviews />
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
