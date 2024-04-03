export const CustomerQuery = /**  GraphQL */ `
query {
  customer(customerAccessToken: "token") {
    id
    firstName
    lastName
    acceptsMarketing
    email
    phone
  }
}
`;
