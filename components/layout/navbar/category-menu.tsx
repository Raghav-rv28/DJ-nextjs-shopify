'use client';

import Link from 'next/link';
import * as React from 'react';

import { clsx } from 'clsx';
import { Collection } from 'lib/shopify/types';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '../../../components/ui/navigation-menu';
import { cn } from '../../../lib/utils';

export function CategoryMenu({
  goldCategories,
  menCategories,
  silverCategories,
  diamondCategories
}: {
  goldCategories: Collection[];
  menCategories: Collection[];
  silverCategories: Collection[];
  diamondCategories: Collection[];
}) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Gold</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href={goldCategories[0]?.path || '/search'}
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">{goldCategories[0]?.title}</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      {goldCategories[0]?.description}
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              {goldCategories.map(
                (component: {
                  title: string;
                  path: string | undefined;
                  description: string | null | undefined;
                }) => {
                  if (component.title === 'All') return;
                  return (
                    <ListItem key={component.title} title={component.title} href={component.path}>
                      {component.description?.substring(0, 50)}
                      {component.description !== null &&
                      component.description !== undefined &&
                      component.description !== ''
                        ? '...'
                        : ''}
                    </ListItem>
                  );
                }
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Men&apos;s</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] gap-3 p-4 md:w-[800px] md:grid-cols-2 lg:w-[900px] ">
              {menCategories.map((component) => {
                if (component.title === 'All') return;
                return (
                  <ListItem
                    key={component.title}
                    className=""
                    title={component.title}
                    href={component.path}
                  >
                    {component.description}
                  </ListItem>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Silver</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] gap-3 p-4 md:w-[800px] md:grid-cols-2 lg:w-[900px] ">
              {silverCategories.map((component) => {
                if (component.title === 'All') return;
                return (
                  <ListItem
                    key={component.title}
                    className=""
                    title={component.title}
                    href={component.path}
                  >
                    {component.description}
                  </ListItem>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Diamond</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] gap-3 p-4 md:w-[800px] md:grid-cols-2 lg:w-[900px] ">
              {diamondCategories.map((component) => {
                if (component.title === 'All') return;
                return (
                  <ListItem
                    key={component.title}
                    className=""
                    title={component.title}
                    href={component.path}
                  >
                    {component.description}
                  </ListItem>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/search/new-arrivals" legacyBehavior passHref>
            <NavigationMenuLink className={clsx(navigationMenuTriggerStyle(), 'bg-transparent')}>
              New Arrivals
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            title={title}
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
