import productFragment from './product';

const searchFragment = /* GraphQL */ `
  fragment search on Search {
    edges {
      node {
        ... on Product {
          id
          title
        }
      }
    }
  }
  ${productFragment}
`;

export default searchFragment;
