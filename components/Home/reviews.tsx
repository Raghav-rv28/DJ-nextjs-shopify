import { Progress } from 'components/ui/progress';
import { JSX, SVGProps } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';

export default async function Reviews() {
  return (
    <div className="my-20 p-10 text-black dark:text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Customer Reviews</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-lg">
                4.9
                <StarIcon className="ml-2 text-yellow-400" />
                <span className="text-sm">Based on 981 reviews</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-6">5</span>
                  <StarIcon className="text-yellow-400" />
                  <Progress className="w-[60%] bg-yellow-400" value={98} />
                  <span className="ml-2">98%</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">4</span>
                  <StarIcon className="text-yellow-400" />
                  <Progress className=" w-[60%] bg-yellow-400" value={1} />
                  <span className="ml-2">&lt; 1% </span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">3</span>
                  <StarIcon className="text-yellow-400" />
                  <Progress className="w-[60%] bg-yellow-400" value={1} />
                  <span className="ml-2">&lt; 1% </span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">2</span>
                  <StarIcon className="text-yellow-400" />
                  <Progress className="w-[60%] bg-yellow-400" value={1} />
                  <span className="ml-2">&lt; 1% </span>
                </div>
                <div className="flex items-center">
                  <span className="w-6">1</span>
                  <StarIcon className="text-yellow-400" />
                  <Progress className="w-[60%] bg-yellow-400" value={2} />
                  <span className="ml-2">2%</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center md:items-start">
              <h3 className="text-center text-xl font-semibold">Share your thoughts</h3>
              <p className="text-center text-sm md:text-left">
                If you’ve used this product, share your thoughts with other customers
              </p>
              <Button className="mx- mt-4">Write a review</Button>
            </div>
          </div>
          <div className="space-y-8 lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="hidden md:block">
                  <AvatarImage alt="Harsimranpreet Sidhu" />
                  <AvatarFallback>HS</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold">Harsimranpreet Sidhu</span>
                    <StarIcon className="ml-2 text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                  </div>
                  <p className="text-sm">
                    I highly recommend Dubai Jewellers not only for their luxurious or
                    vintage-inspired collection but also for their customer service. They will
                    apprise you even the minor detail of the piece you are looking for. It was my
                    first time buying gold in Canada and they (sorry I forgot to ask names) made it
                    so easy for me. Thanks again to all of you at the Dubai Jewellers!
                  </p>
                </div>
              </div>
              <hr className="border-gray-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="hidden md:block">
                  <AvatarImage alt="Sunny Kalra" />
                  <AvatarFallback>SK</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold">Sunny Kalra</span>
                    <StarIcon className="ml-2 text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                  </div>
                  <p className="text-sm">
                    Purchased a gold chain today first time at this location, it&apos;s a really
                    nice clean shop, with great designs, and friendly staff. I had a good experience
                    and would recommend this shop to anyone.
                  </p>
                </div>
              </div>
              <hr className="border-gray-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="hidden md:block">
                  <AvatarImage alt="H K" />
                  <AvatarFallback>HK</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold">HK</span>
                    <StarIcon className="ml-2 text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                  </div>
                  <p className="text-sm">
                    Amazing experience! Very friendly staff and great customer service would
                    definitely recommend a visit to this place! 10/10
                  </p>
                </div>
              </div>
              <hr className="border-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#facc15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
