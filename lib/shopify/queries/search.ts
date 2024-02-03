import productFragment from '../fragments/product';

export const getSearchResultsQuery = /* GraphQL */ `
  query searchProducts($query: String!, $first: Int) {
    search(query: $query, first: $first, types: PRODUCT) {
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
