/* eslint-disable prefer-const */
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import DrawerFilter from 'components/search/drawer-filter';
import PaginationComponent from 'components/search/pagination';
import { defaultSort, sortingSearch } from 'lib/constants';
import { getProductTags, getProducts, getSearchResults } from 'lib/shopify';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue, min, max, tag, after } = searchParams as { [key: string]: any };
  const { sortKey, reverse } = sortingSearch.find((item) => item.slug === sort) || defaultSort;
  const productFilters = [];

  const productTags = await getProductTags({ first: 50 });
  if (min || max) {
    productFilters.push({ price: { max: parseFloat(max), min: parseFloat(min) } });
  }

  if (tag !== 'none') {
    productFilters.push({
      tag: tag
    });
  }

  let { products, pageInfo, totalCount } = await getSearchResults({
    query: searchValue,
    reverse,
    productFilters,
    sortKey,
    after,
  });
  if (products.length === 0 && String(searchValue).length === 13) {
    products = await getProducts({ sortKey, reverse, query: searchValue });
  }

  const resultsText = products.length > 1 ? 'results' : 'result';
  return (
    <>
      <div className="flex w-full flex-col md:flex-row items-center justify-center p-1">
        <div className="flex w-full justify-center md:justify-start items-center h-[50px] flex-row">
          <DrawerFilter productTags={productTags} /> |&nbsp;
          {searchValue ? (
            <p className="p-2mb-4 flex flex-row items-center justify-center">
              {products.length === 0
                ? 'There are no products that match with current set filters'
                : `Showing ${totalCount} ${resultsText} for `}
              <span className="font-bold">&quot;{searchValue}&quot;</span>
            </p>
          ) : null}
        </div>
        <div className="w-full">
          <PaginationComponent pageInfo={pageInfo} />
        </div>
      </div>
      {products.length > 0 ? (
        <Grid className=" grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
      <div className="w-full">
          <PaginationComponent pageInfo={pageInfo} />
        </div>
    </>
  );
}
