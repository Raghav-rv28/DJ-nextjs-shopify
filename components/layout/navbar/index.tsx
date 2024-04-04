import ThemeSwitcher from 'components/layout/navbar/theme-switcher';
import { Separator } from 'components/ui/separator';
import { getCollections } from 'lib/shopify';
import Image from 'next/image';
import Link from 'next/link';
import Account from './account';
import { CategoryMenu } from './category-menu';
import MobileMenu from './mobile-menu';
import Search from './search';
import { Suspense } from 'react';
import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';

export default async function Navbar() {
  const goldCollections = await getCollections('title:Gold');
  const menCollections = await getCollections('title:Men');
  const silverCollections = await getCollections('title:silver');
  const diamondCollections = await getCollections('title:diamond');
  return (
    <nav className="sticky top-0 z-[60] flex flex-col items-center justify-between bg-inherit p-4 lg:justify-between lg:px-6">
      <div className="my-3 flex w-full items-center">
        <div className="block flex-none lg:hidden">
          <MobileMenu
            goldCategories={goldCollections}
            menCategories={menCollections}
            silverCategories={silverCollections}
            diamondCategories={diamondCollections}
          />
        </div>
        <div className="flex w-full lg:w-1/3">
          <Link
            href="/"
            className="mr-auto flex w-full items-center justify-center lg:mr-6 lg:max-w-[200px]"
          >
            <div className="ml-2 flex-none lg:block">
              <Image
                src={
                  'https://cdn.shopify.com/s/files/1/0736/0882/3069/files/footer-logo.png?v=1681830146'
                }
                className="hidden md:block"
                alt="logo"
                width={150}
                height={53}
              />
              <Image
                src={
                  'https://cdn.shopify.com/s/files/1/0736/0882/3069/files/cropped-dubai-jewellers-logo.png?v=1682698333'
                }
                className="block md:hidden"
                alt="logo"
                width={50}
                height={50}
              />
            </div>
          </Link>
        </div>
        <div className="hidden justify-center lg:flex lg:w-1/3">
          <Search />
        </div>
        <div className="flex justify-end space-x-7 lg:mr-[5rem] lg:w-1/3">
          <span className="hidden lg:flex">
            <ThemeSwitcher />
          </span>
          <Account />
          <Suspense fallback={<OpenCart />}>
            <Cart />
          </Suspense>
        </div>
      </div>
      <Separator />
      <div className="my-2 hidden w-full items-center justify-center md:flex md:basis-full">
        <CategoryMenu
          goldCategories={goldCollections}
          menCategories={menCollections}
          silverCategories={silverCollections}
          diamondCategories={diamondCollections}
        />
      </div>
    </nav>
  );
}
