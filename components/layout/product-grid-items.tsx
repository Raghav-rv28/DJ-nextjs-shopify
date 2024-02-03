import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/shopify/types';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products
        .filter((product) => product.id !== undefined)
        .map((product) => {
          return (
            <Grid.Item key={product.handle} className="animate-fadeIn">
              <div className="relative inline-block h-full w-full">
                <GridTileImage
                  alt={product.title}
                  label={{
                    url: `/product/${product.handle}`,
                    title: product.title,
                    amount: product.priceRange.maxVariantPrice.amount,
                    currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                    variants: product.variants,
                    availableForSale: product.availableForSale
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
            </Grid.Item>
          );
        })}
    </>
  );
}
