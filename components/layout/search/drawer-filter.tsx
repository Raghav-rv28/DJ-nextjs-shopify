'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from 'components/ui/accordion';
import { Checkbox } from 'components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger
} from 'components/ui/drawer';
import { SlidersHorizontal, X } from 'lucide-react';
import React from 'react';

export default function DrawerFilter() {
  const [jewelleryTypes, setJewelleryTypes] = React.useState(['Gold']);

  const mutateJewelleryTypeFilter = (val: string | boolean, type: string) => {
    if (!jewelleryTypes.includes(type) && !!val) setJewelleryTypes((prev) => prev.concat([type]));
    if (jewelleryTypes.includes(type) && !!!val)
      setJewelleryTypes((prev) => prev.filter((jType) => jType !== type));
  };

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
                <AccordionTrigger>Jewellery Type</AccordionTrigger>
                <AccordionContent>
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
              </AccordionItem>
            </Accordion>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
