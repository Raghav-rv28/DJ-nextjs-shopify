import Footer from 'components/layout/footer';
import Collections from 'components/search/collections';
import FilterList from 'components/search/filter';
import { sortingSearch } from 'lib/constants';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="max-w-screen-3xl flex flex-col gap-8 md:px-10 pb-4 text-black dark:text-white md:flex-row">
        <div className="flex w-full flex-col justify-start items-start space-y-3 md:w-1/5 px-10">
          <Collections />
          <FilterList list={sortingSearch} title="Sort by" />
        </div>
        <div className="flex min-h-screen w-4/5 mx-auto flex-col md:order-none">{children}</div>
      </div>
      <Footer />
    </Suspense>
  );
}
