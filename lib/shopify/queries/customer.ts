export const CustomerQuery = /**  GraphQL */ `
query {
  customer(customerAccessToken: "token") {
    id
    firstName
    lastName
    acceptsMarketing
    email
    phone
    orders {
      nodes {
        currentTotalPrice {
           amount
          currencyCode
        }
        statusUrl
        shippingAddress {
          address1
          city
          country
        }
        name
        processedAt
      }
    }
  }
}
`;
