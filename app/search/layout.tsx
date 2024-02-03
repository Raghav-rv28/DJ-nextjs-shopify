import Footer from 'components/layout/footer';
import Collections from 'components/layout/search/collections';
import FilterList from 'components/layout/search/filter';
import { sorting } from 'lib/constants';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="max-w-screen-3xl mx-auto flex flex-col gap-8 px-10 pb-4 text-black dark:text-white md:flex-row">
        <div className="order-none flex w-full justify-center md:max-w-[425px]">
          <FilterList list={sorting} title="Sort by" />
        </div>
        <div className="order-last flex min-h-screen w-full flex-col md:order-none">{children}</div>
        <div className="order-none w-full  justify-center md:max-w-[425px]">
          <Collections />
        </div>
      </div>
      <Footer />
    </Suspense>
  );
}
