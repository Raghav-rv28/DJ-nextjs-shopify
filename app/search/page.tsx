import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import DrawerFilter from 'components/layout/search/drawer-filter';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts, getSearchResults } from 'lib/shopify';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const productsSearchQuery = await getSearchResults({ query: searchValue });
  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <>
      <div className="flex w-full items-center justify-start p-1">
        <DrawerFilter /> |&nbsp;&nbsp;
        {searchValue ? (
          <p className="p-2mb-4 flex flex-row items-center justify-center">
            {products.length === 0
              ? 'There are no products that match '
              : `Showing ${products.length} ${resultsText} for `}
            <span className="font-bold">&quot;{searchValue}&quot;</span>
          </p>
        ) : null}
      </div>

      {productsSearchQuery.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={productsSearchQuery} />
        </Grid>
      ) : null}
      {productsSearchQuery.length === 0 && products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
