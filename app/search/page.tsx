import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import DrawerFilter from 'components/layout/search/drawer-filter';
import { defaultSort, sorting } from 'lib/constants';
import { getProductTags, getSearchResults } from 'lib/shopify';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue, min, max, tag } = searchParams as { [key: string]: any };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  // let products;
  const productFilters = [];

  const productTags = await getProductTags({ first: 50 });
  if (min || max) {
    productFilters.push({ price: { max: parseFloat(max), min: parseFloat(min) } });
  }

  productFilters.push({
    tag: tag
  });

  const products = await getSearchResults({
    query: searchValue,
    productFilters
  });
  // if (products.length === 0) {
  //   products = await getProducts({ sortKey, reverse, query: searchValue });
  // }

  const resultsText = products.length > 1 ? 'results' : 'result';
  // console.log(
  //   products
  //     .filter((product) => product.metafields[0] !== null)
  //     .map((product) => product.metafields)
  // );
  return (
    <>
      <div className="flex w-full items-center justify-start p-1">
        <DrawerFilter productTags={productTags} /> |&nbsp;&nbsp;
        {searchValue ? (
          <p className="p-2mb-4 flex flex-row items-center justify-center">
            {products.length === 0
              ? 'There are no products that match with current set filters'
              : `Showing ${products.length} ${resultsText} for `}
            <span className="font-bold">&quot;{searchValue}&quot;</span>
          </p>
        ) : null}
      </div>
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
