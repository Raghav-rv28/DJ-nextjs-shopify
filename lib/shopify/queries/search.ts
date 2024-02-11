import productFragment from '../fragments/product';

export const getSearchResultsQuery = /* GraphQL */ `
  query searchProducts(
    $query: String!
    $first: Int
    $after: String
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
      after: $after
    ) {
      edges {
        node {
          ... on Product {
            ...product
          }
        }
      }
      pageInfo { 
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
  ${productFragment}
`;


// export const getSearchResultsQuery = /* GraphQL */ `
//   query searchProducts(
//     $query: String!
//     $first: Int
//     $after: String
//     $productFilters: [ProductFilter!]
//     $sortKey: SearchSortKeys
//     $reverse: Boolean
//   ) {
//     search(
//       query: $query
//       first: $first
//       productFilters: $productFilters
//       sortKey: $sortKey
//       reverse: $reverse
//       ?after: $after
//     ) {
//       edges {
//         node {
//           ... on Product {
//             ...product
//           }
//         }
//       }
//       pageInfo { 
//         endCursor
//         hasNextPage
//         hasPreviousPage
//         startCursor
//       }
//     }
//   }
//   ${productFragment}
// `;
