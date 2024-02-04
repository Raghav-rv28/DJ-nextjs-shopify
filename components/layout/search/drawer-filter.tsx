'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from 'components/ui/accordion';
import { Button } from 'components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger
} from 'components/ui/drawer';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { ScrollArea } from 'components/ui/scroll-area';
import { SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';

export default function DrawerFilter({ productTags }: { productTags: string[] }) {
  // const [jewelleryTypes, setJewelleryTypes] = React.useState(['Gold']);
  const [productTag, setProductTag] = React.useState('none');
  const [priceRange, setPriceRange] = React.useState({ min: 0.0, max: 1e7 });
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  // const mutateJewelleryTypeFilter = (val: string | boolean, type: string) => {
  //   if (!jewelleryTypes.includes(type) && !!val) setJewelleryTypes((prev) => prev.concat([type]));
  //   if (jewelleryTypes.includes(type) && !!!val)
  //     setJewelleryTypes((prev) => prev.filter((jType) => jType !== type));
  // };

  const onSubmit = useCallback(() => {
    let url = `${pathname}?`;

    searchParams.forEach((val, key) => {
      if (key === 'q') url = url.concat(`${key}=${val}&`);
    });

    if (
      !url.includes('min') &&
      !url.includes('max') &&
      (priceRange.min !== 0 || priceRange.max !== 1e7)
    )
      url = url.concat(`min=${priceRange.min}&max=${priceRange.max}&`);

    if (!url.includes('tag') && productTag !== 'none') url = url.concat(`tag=${productTag}&`);
    router.push(url);
  }, [pathname, priceRange.max, priceRange.min, productTag, router, searchParams]);

  const changeTag = useCallback((value: string) => {
    setProductTag(value);
  }, []);

  return (
    <div>
      <Drawer direction="left">
        <DrawerTrigger className="flex max-w-[120px] flex-row items-center justify-center p-2">
          Filter
          <SlidersHorizontal className="ml-2 h-4 w-4 " />
        </DrawerTrigger>
        <DrawerContent className="z-[70] flex h-full w-full flex-col bg-white pb-6 dark:bg-black md:max-w-[40vw]">
          <DrawerHeader className="flex flex-row items-center justify-between bg-orange-300 py-3 dark:bg-slate-800">
            Filters
            <DrawerClose>
              <X className="p-1 hover:rounded-sm hover:border-2 hover:border-white" />
            </DrawerClose>
          </DrawerHeader>
          <div className="m-[5px] flex w-[98%]">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Product Tag</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    defaultValue={productTag}
                    onValueChange={changeTag}
                    className="w-full"
                  >
                    <ScrollArea className="max-h-[400px] w-full">
                      <div className="flex flex-col items-start space-x-2">
                        <div className="flex items-center p-1">
                          <RadioGroupItem className="mx-1 ml-3" value="none" id="none" />
                          <Label className="text-base" htmlFor="none">
                            None
                          </Label>
                        </div>
                        {productTags.map((tag) => {
                          return (
                            <div key={tag} className="flex items-center p-1">
                              <RadioGroupItem className="mx-1" value={tag} id={tag} />
                              <Label className="text-base" htmlFor={tag}>
                                {tag}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent className="flex flex-row items-center justify-between p-1">
                  <Input
                    className="mx-1"
                    type="number"
                    inputMode="numeric"
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))
                    }
                    defaultValue={priceRange.min}
                  />
                  <Input
                    className="mx-1"
                    type="number"
                    inputMode="numeric"
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    defaultValue={priceRange.max}
                  />
                </AccordionContent>
              </AccordionItem>
              {/* <AccordionItem value="item-3">
                <AccordionTrigger>Jewellery Type</AccordionTrigger>
                <AccordionContent className="flex flex-row items-center justify-between p-1">
                <div className="flex flex-col items-start space-x-2">
                    <div className="flex flex-row items-center justify-center p-1">
                      <Checkbox
                        id="Gold"
                        checked={jewelleryTypes.includes('Gold')}
                        onCheckedChange={(checked) => mutateJewelleryTypeFilter(checked, 'Gold')}
                        className="ml-2 mr-2"
                      />
                      <label
                        htmlFor="Gold"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Gold
                      </label>
                    </div>

                    <div className="flex flex-row items-center justify-center p-1">
                      <Checkbox
                        id="Diamond"
                        className="mr-2"
                        checked={jewelleryTypes.includes('Diamond')}
                        onCheckedChange={(checked) => mutateJewelleryTypeFilter(checked, 'Diamond')}
                      />
                      <label
                        htmlFor="Diamond"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Diamond
                      </label>
                    </div>

                    <div className="flex flex-row items-center justify-center p-1">
                      <Checkbox
                        id="Silver"
                        className="mr-2"
                        checked={jewelleryTypes.includes('Silver')}
                        onCheckedChange={(checked) => mutateJewelleryTypeFilter(checked, 'Silver')}
                      />
                      <label
                        htmlFor="Silver"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Silver
                      </label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem> */}
            </Accordion>
          </div>
          <DrawerFooter>
            <DrawerClose>
              <Button onClick={onSubmit}>Submit</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
