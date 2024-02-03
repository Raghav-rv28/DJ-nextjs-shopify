import Footer from 'components/layout/footer';
import Collections from 'components/layout/search/collections';
import FilterList from 'components/layout/search/filter';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger
} from 'components/ui/drawer';
import { sorting } from 'lib/constants';
import { SlidersHorizontal, X } from 'lucide-react';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="max-w-screen-3xl mx-auto flex flex-col gap-8 px-10 pb-4 text-black dark:text-white md:flex-row">
        <div className="order-none flex w-full justify-center md:max-w-[425px]">
          <FilterList list={sorting} title="Sort by" />
        </div>
        <div className="order-last flex min-h-screen w-full flex-col md:order-none">
          <Drawer direction="left">
            <DrawerTrigger className="flex max-w-[120px] flex-row items-center justify-center p-2">
              Filter
              <SlidersHorizontal className="ml-2 h-4 w-4 " />
            </DrawerTrigger>
            <DrawerContent className="z-[70] flex h-full w-full flex-col bg-white pb-6 dark:bg-black md:max-w-[40vw]">
              <DrawerHeader className="flex flex-row items-center justify-between bg-slate-800 py-3">
                Filters
                <DrawerClose>
                  <X className="p-1 hover:rounded-sm hover:border-2 hover:border-white" />
                </DrawerClose>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
          {children}
        </div>
        <div className="order-none w-full  justify-center md:max-w-[425px]">
          <Collections />
        </div>
      </div>
      <Footer />
    </Suspense>
  );
}
