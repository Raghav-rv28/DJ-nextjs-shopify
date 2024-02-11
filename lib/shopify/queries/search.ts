import productFragment from '../fragments/product';

export const getSearchResultsQuery = /* GraphQL */ `
  query searchProducts(
    $query: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
    $productFilters: [ProductFilter!]
    $sortKey: SearchSortKeys
    $reverse: Boolean
  ) {
    search(
      query: $query
      first: $first
      last: $last
      productFilters: $productFilters
      sortKey: $sortKey
      reverse: $reverse
      after: $after
      before: $before
    ) {
      edges {
        node {
          ... on Product {
            ...product
          }
        }
        cursor
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
