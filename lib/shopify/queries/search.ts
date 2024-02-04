import productFragment from '../fragments/product';

export const getSearchResultsQuery = /* GraphQL */ `
  query searchProducts(
    $query: String!
    $first: Int
    $productFilters: [ProductFilter!]
    $sortKey: SearchSortKeys
    $reverse: Boolean
  ) {
    search(
      query: $query
      first: $first
      productFilters: $productFilters
      sortKey: $sortKey
      reverse: $reverse
    ) {
      edges {
        node {
          ... on Product {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;
