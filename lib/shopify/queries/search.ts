import imageFragment from '../fragments/image';
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

export const getPredictiveSearchResultsQuery = /* GraphQL */ `
  query suggestions($query: String!) {
    predictiveSearch(query: $query, limitScope: EACH, limit: 5) {
      queries {
        text
      }
      collections {
        handle
        title
        description
        image {
          height
          width
          altText
          url
        }
      }
      products {
        handle
        availableForSale
        title
        description
        featuredImage {
          ...image
        }
        priceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
  ${imageFragment}
`;
