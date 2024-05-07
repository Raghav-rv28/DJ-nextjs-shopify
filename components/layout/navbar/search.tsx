'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from 'components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from 'components/ui/dialog';
import { ScrollArea } from 'components/ui/scroll-area';
import { Separator } from 'components/ui/separator';
import { getPredictiveSearch } from 'lib/shopify';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Search() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('q') ?? '');
  const [predictiveResults, setPredictiveResults] = useState<{
    queries: any[];
    collections: any[];
    products: any[];
  }>();
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }

    router.push(createUrl('/search', newParams));
  }

  const changeSearchQuery = async (e: { target: { value: string } }) => {
    setQuery(e.target.value);
    if (e.target.value !== '') {
      const results = await getPredictiveSearch({ query: e.target.value });
      setPredictiveResults(results);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <form onSubmit={onSubmit} className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
            <input
              type="text"
              name="search"
              placeholder="Search for products..."
              value={query}
              className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
            />
            <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
              <MagnifyingGlassIcon className="h-4" />
            </div>
          </form>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
            <input
              type="text"
              name="search"
              placeholder="Search for products..."
              value={query}
              onChange={changeSearchQuery}
              className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
            />
            <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
              <MagnifyingGlassIcon className="h-4" />
            </div>
          </form>
          {predictiveResults?.queries !== undefined && (
            <ScrollArea className="h-[50vh]">
              <div className="flex flex-col justify-center">
                {predictiveResults?.queries !== undefined && (
                  <>
                    <h2 className="my-2 w-full text-center text-lg font-bold">Popular Searches</h2>
                    <div className="my-2 flex flex-row flex-wrap items-center justify-center gap-1">
                      {predictiveResults?.queries.map((value) => {
                        const newParams = new URLSearchParams();
                        newParams.set('q', value.text);
                        return (
                          <Link
                            key={value.text}
                            href={createUrl(pathname, newParams)}
                            className="flex flex-row items-center justify-center rounded-full bg-primary p-2 py-0 text-base text-accent"
                          >
                            {value.text}
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              height="1rem"
                              width="1rem"
                              className="m-1 h-full translate-y-1"
                            >
                              <path d="M10 10.414l4 4 5.707-5.707L22 11V5h-6l2.293 2.293L14 11.586l-4-4-7.707 7.707 1.414 1.414z" />
                            </svg>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
                {predictiveResults?.products !== undefined && (
                  <>
                    <Separator />
                    <div className="my-2 flex flex-row flex-wrap items-center justify-center gap-1">
                      <h2 className="w-full text-center text-lg font-bold">Products</h2>
                      {predictiveResults?.products.map((product) => {
                        return (
                          <Card
                            key={product.id}
                            className="max-w-[150px] overflow-hidden rounded-lg bg-primary text-accent shadow-md"
                          >
                            <Image
                              alt={product.title}
                              className="h-[125px] w-[150px] object-cover"
                              height={product.featuredImage.height}
                              src={product.featuredImage.url}
                              style={{
                                objectFit: 'cover'
                              }}
                              width={product.featuredImage.width}
                            />
                            <CardContent className="m-2 flex w-full items-center justify-center p-2 pl-0">
                              <h3 className="whitespace-normal text-base font-semibold">
                                {product.title}
                              </h3>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </>
                )}
                {predictiveResults?.collections !== undefined && (
                  <>
                    <Separator />
                    <div className="my-2 flex flex-row flex-wrap items-center justify-center gap-1">
                      <h2 className="w-full text-center text-lg font-bold">Collections</h2>
                      {predictiveResults?.collections.map((collection) => {
                        return (
                          <Card
                            key={collection.id}
                            className="max-w-[150px] overflow-hidden rounded-lg bg-primary text-accent shadow-md"
                          >
                            <Image
                              alt={collection.title}
                              className="h-[125px] w-[150px] object-cover text-center"
                              height={collection.image?.height}
                              src={collection.image?.url}
                              style={{
                                objectFit: 'cover'
                              }}
                              width={collection.image?.width}
                            />
                            <CardContent className="m-2 flex w-full items-center justify-center p-2 pl-0">
                              <h3 className="whitespace-normal text-base font-semibold">
                                {collection.title}
                              </h3>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
