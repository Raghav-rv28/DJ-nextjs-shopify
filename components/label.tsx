import clsx from 'clsx';
import { AddToCartHover } from './cart/add-to-cart-hover';
import Price from './price';

const Label = ({
  title,
  amount,
  currencyCode,
  position = 'bottom',
  availableForSale,
  variants
}: {
  title: string;
  amount: string;
  currencyCode: string;
  availableForSale: boolean;
  variants: any;
  position?: 'bottom' | 'center';
}) => {
  return (
    <div
      className={clsx('@container/label absolute bottom-0 left-0 flex w-full px-4 pb-4', {
        'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="mr-4 line-clamp-2 flex-grow whitespace-nowrap pl-2 leading-none tracking-tight">
          {title}
        </h3>
        <Price
          className="flex-none rounded-full bg-accent p-2 text-white"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
        {variants !== undefined ? (
          <div className="group ml-2">
            <AddToCartHover variants={variants} availableForSale={availableForSale} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Label;
