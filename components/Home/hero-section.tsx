import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/../../components/ui/carousel';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Carousel opts={{ loop: true }} className="w-full md:w-10/12">
        <CarouselContent>
          <CarouselItem className="flex items-center justify-center">
            <Image
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 66vw,(max-width: 1500px) 100vw"
              src={
                'https://cdn.shopify.com/s/files/1/0736/0882/3069/files/Happy_Holidays_website_banner.png?v=1702749764'
              }
              priority
              width={1366}
              height={768}
              alt=""
            />
          </CarouselItem>
          <CarouselItem className="flex items-center justify-center">
            <Image
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 66vw,(max-width: 1500px) 100vw"
              src={
                'https://cdn.shopify.com/s/files/1/0736/0882/3069/files/banner-2.png?v=1684775105'
              }
              width={2500}
              height={563}
              alt=""
            />
          </CarouselItem>
          <CarouselItem className="flex items-center justify-center">
            <Image
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 66vw,(max-width: 1500px) 100vw"
              src={
                'https://cdn.shopify.com/s/files/1/0736/0882/3069/files/banner-1.png?v=1684774717'
              }
              width={1500}
              height={563}
              alt=""
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
