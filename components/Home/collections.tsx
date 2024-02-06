import { Card, CardContent, CardTitle } from 'components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from 'components/ui/carousel';
import { getCollections } from 'lib/shopify';
import Image from 'next/image';
import Link from 'next/link';

export default async function Collections() {
  const collections = await getCollections('');

  return (
    <div className="my-8 flex w-full flex-col items-center justify-center text-center">
      <h2 className="my-3 text-5xl text-accent">Shop By Collections</h2>
      <h3 className="mb-5 text-2xl">
        Browse through your favorite categories. We&apos;ve got them all!
      </h3>
      <div className="mx-10 hidden flex-row flex-wrap items-center justify-center gap-5 md:flex">
        {collections
          .filter((val) => val.image)
          .map((val) => (
            <Link key={val.handle} href={`${val.path}`}>
              <Card className="group max-w-[svw] rounded-lg transition duration-100 hover:border-2 hover:border-accent">
                <CardTitle className="my-4 text-secondary">{val.title}</CardTitle>
                <CardContent>
                  <Image
                    className="rounded-lg group-hover:scale-105"
                    src={val.image?.url}
                    height={250}
                    width={250}
                    alt={val.image?.altText || ''}
                    priority={false}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
      <div className="mx-10 flex max-w-[90svw] items-center justify-center gap-5 md:hidden">
        <Carousel opts={{ loop: true }} className="w-9/12">
          <CarouselContent>
            {collections
              .filter((val) => val.image)
              .map((val) => (
                <CarouselItem
                  key={val.path}
                  className="group relative flex items-center justify-center pl-2 sm:basis-1/3"
                >
                  <Link key={val.handle} href={`${val.path}`}>
                    <Card className="group max-w-[svw] rounded-lg transition duration-1000">
                      <CardTitle className="my-4">{val.title}</CardTitle>
                      <CardContent>
                        <Image
                          className="rounded-lg group-hover:scale-105"
                          src={val.image?.url}
                          height={250}
                          width={250}
                          alt={val.image?.altText || ''}
                          priority={false}
                        />
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
