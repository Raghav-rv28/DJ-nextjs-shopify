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
  DrawerHeader,
  DrawerTrigger
} from 'components/ui/drawer';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { ScrollArea } from 'components/ui/scroll-area';
import { createUrl } from 'lib/utils';
import { SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';

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

  useEffect(() => {
    if (searchParams.has('min') && searchParams.get('min') !== '0') {
      setPriceRange((prev) => ({ ...prev, min: Number(searchParams.get('min')) ?? 0 }));
    }
    if (searchParams.has('max') && Number(searchParams.get('max')) !== 1e7)
      setPriceRange((prev) => ({ ...prev, max: Number(searchParams.get('max')) ?? 1e7 }));
    if (searchParams.has('tag') && searchParams.get('tag') !== 'none')
      setProductTag(searchParams.get('tag') ?? 'prev');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (!params.has('min') && priceRange.min !== 0) {
      params.append('min', String(priceRange.min));
    } else if (params.has('min') && priceRange.min !== Number(params.get('min'))) {
      params.delete('min');
      params.append('min', String(priceRange.min));
    }

    if (!params.has('max') && priceRange.max !== 1e7) {
      params.append('max', String(priceRange.max));
    } else if (params.has('max') && priceRange.max !== Number(params.get('max'))) {
      params.delete('max');
      params.append('max', String(priceRange.max));
    }

    if (!params.has('tag') && productTag !== 'none') {
      params.append('tag', productTag);
    } else if (params.has('tag') && productTag !== params.get('tag')) {
      params.delete('tag');
      params.append('tag', productTag);
    }
    const href = createUrl(pathname, params);
    router.push(href);
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
        <DrawerContent className="z-[70] ml-2 flex h-[100dvh] max-w-[95svw] flex-col bg-white pb-6 dark:bg-black md:max-w-[40vw]">
          <DrawerHeader className="flex flex-row items-center justify-between bg-accent py-3 dark:bg-slate-800">
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
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))
                    }
                    placeholder={String(priceRange.min)}
                  />
                  <Input
                    className="mx-1"
                    type="number"
                    inputMode="numeric"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    placeholder={String(priceRange.max)}
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
          <DrawerClose>
            <Button className="my-3" onClick={onSubmit}>
              Submit
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
