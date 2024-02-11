import { SignedIn, SignedOut, currentUser } from '@clerk/nextjs';

import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'components/ui/dropdown-menu';
import Link from 'next/link';
import { Suspense } from 'react';
import SignOutButton from './sign-out';
import ThemeSwitcher from './theme-switcher';
export default async function Account() {
  const user = await currentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="ml-[2rem]">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>DJ</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[70] w-56">
        <div className="m-1 mt-0 flex justify-between">
        <Suspense fallback={<OpenCart />}>
            <Cart />
          </Suspense>
          <div className='md:hidden'><ThemeSwitcher /></div>
        </div>
        <DropdownMenuSeparator />
        {/* NAVIGATION */}
        <SignedIn>
          <DropdownMenuLabel>{`${user?.firstName} ${user?.lastName}`}</DropdownMenuLabel>
          <DropdownMenuLabel>{user?.emailAddresses[0]?.emailAddress}</DropdownMenuLabel>
          <DropdownMenuSeparator />
        </SignedIn>

        {/* LOGIN  */}
        <DropdownMenuItem>
          <SignedIn>
            <SignOutButton />
          </SignedIn>
          <SignedOut>
            <Link href={'/sign-in'}>Login</Link>
          </SignedOut>
        </DropdownMenuItem>
        <SignedOut>
          <DropdownMenuItem>
            <Link href={'/sign-up'}>Sign Up</Link>
          </DropdownMenuItem>
        </SignedOut>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
