export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
  cursor: string;
};

export type Cart = Omit<ShopifyCart, 'lines'> & {
  lines: CartItem[];
};

export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: Product;
  };
};

export type Collection = ShopifyCollection & {
  path: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Menu = {
  title: string;
  url: string;
  items: {
    title: string;
    url: string;
  }[];
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = Omit<ShopifyProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type SEO = {
  title: string;
  description: string;
};

export type ShopifyCart = {
  id: string;
  buyerIdentity: {
    email: string;
  };
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
  image?: {
    height: number;
    width: number;
    altText: string;
    url: any;
  };
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  compareAtPriceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  metafields: {
    id: string;
    key: string;
    value: string;
    type: string;
    namespace: string;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperationOne = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyCreateCartOperationTwo = {
  data: { cartCreate: { cart: ShopifyCart } };
  variables: {
    buyerIdentity: {
      email: string;
      customerAccessToken: string;
      phone: string;
    };
  };
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyUpdateBuyerIdentityOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
    buyerIdentity: {
      email: string;
      customerAccessToken: string;
      phone: string;
    };
  };
};

export type ShopifyCollectionOperation = {
  data: {
    collection: ShopifyCollection;
  };
  variables: {
    handle: string;
  };
};

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
  variables: {
    query: string;
  };
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: Menu[];
    };
  };
  variables: {
    handle: string;
  };
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};
// MY OWN MAGIC
export type CustomerAccessTokenCreateInput = {
  email: string;
  password: string;
};

export type CustomerAccessToken = {
  accessToken: string;
  expiresAt: Date;
};
export type CustomerAccessTokenOperation = {
  data: {
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken;
      customerUserErrors: {
        code: string;
        field: string;
        message: string;
      };
    };
  };
  variables: {
    input: CustomerAccessTokenCreateInput;
  };
};

export type createCustomerInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
};

export type createCustomerOperation = {
  data: any;
  variables: {
    input: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone: string;
    };
  };
};

export type buyerIdentityInput = {};

export type ShopifySearchOperation = {
  data: any;
  variables: {
    query?: string;
    sortKey: string;
    first?: number;
    last?: number;
    reverse: boolean;
    productFilters?: any;
    after?: string;
    before?: string;
  };
};

export type ShopifyPredictiveSearchOperation = {
  data: {
    predictiveSearch: {
      queries: any[],
      collections: any[],
      products: any[],
    }
  };
  variables: {
    query?: string;
  };
};

export type ShopifyProductTagsRetrieveOperation = {
  data: {
    productTags: { edges: { node: string; cursor: string }[] };
  };
  variables: {
    first: number;
  };
};
