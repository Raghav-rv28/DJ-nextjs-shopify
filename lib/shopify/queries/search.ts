import productFragment from '../fragments/product';

export const getSearchResultsQuery = /* GraphQL */ `
  query searchProducts($query: String!, $first: Int, $productFilters: [ProductFilter!]) {
    search(query: $query, first: $first, productFilters: $productFilters) {
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
