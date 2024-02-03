'use server';
import { currentUser } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';
import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import { ensureStartsWith } from 'lib/utils';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  addToCartMutation,
  createCartMutationWOUser,
  createCartMutationWUser,
  editCartItemsMutation,
  removeFromCartMutation,
  updateCartBuyerIdentity
} from './mutations/cart';
import { createCustomer, customerAccessTokenCreate } from './mutations/customer';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery
} from './queries/product';
import { getSearchResultsQuery } from './queries/search';
import {
  Cart,
  Collection,
  Connection,
  CustomerAccessTokenCreateInput,
  CustomerAccessTokenOperation,
  Image,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperationOne as ShopifyCreateCartOperationWOUser,
  ShopifyCreateCartOperationTwo as ShopifyCreateCartOperationWUser,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifySearchOperation,
  ShopifyUpdateBuyerIdentityOperation,
  ShopifyUpdateCartOperation,
  createCustomerInput,
  createCustomerOperation
} from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: 'USD'
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true) => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart | undefined> {
  const prisma = new PrismaClient();
  const user = await currentUser();
  let userDetails = undefined;
  console.log(`USER IN CREATE CART: ${user}`);
  if (user !== null) {
    userDetails = await prisma.user.findUnique({
      where: {
        email: user.emailAddresses[0]?.emailAddress
      }
    });
  }
  console.log(`IN CART: ${userDetails?.accessToken}`);
  let res;
  if (userDetails?.accessToken !== undefined && user !== null) {
    res = await shopifyFetch<ShopifyCreateCartOperationWUser>({
      query: createCartMutationWUser,
      variables: {
        buyerIdentity: {
          email: user.emailAddresses[0]?.emailAddress || '',
          customerAccessToken: userDetails?.accessToken || '',
          phone: user.phoneNumbers[0]?.phoneNumber || ''
        }
      },
      cache: 'no-store'
    });
  } else {
    res = await shopifyFetch<ShopifyCreateCartOperationWOUser>({
      query: createCartMutationWOUser,
      cache: 'no-store'
    });
  }

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}
export async function updateCartBuyer(cartId: string) {
  const prisma = new PrismaClient();
  const user = await currentUser();
  let userDetails = undefined;
  console.log(`USER IN CREATE CART: ${user}`);

  if (user !== null) {
    try {
      userDetails = await prisma.user.findUnique({
        where: {
          email: user.emailAddresses[0]?.emailAddress
        }
      });
    } catch (error) {
      console.log(`Error while fetching user data, ${user.emailAddresses[0]?.emailAddress}`);
    }

    await shopifyFetch<ShopifyUpdateBuyerIdentityOperation>({
      query: updateCartBuyerIdentity,
      variables: {
        cartId,
        buyerIdentity: {
          email: user.emailAddresses[0]?.emailAddress || '',
          customerAccessToken: userDetails?.accessToken || '',
          phone: '+18036165148'
        }
      },
      cache: 'no-store'
    });
  }
  console.log(`IN CART: ${userDetails?.accessToken}`);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
    cache: 'no-store'
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }
  // console.log(res.body.data.cart.buyerIdentity);
  return reshapeCart(res.body.data.cart);
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
}

export async function getCollections(query: string): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
    variables: {
      query: query
    }
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });
  return (
    res.body?.data?.menu?.items.map((item) => {
      const itemSitem =
        item.items.length === 0
          ? []
          : item.items.map((item) => ({
              url: item.url.replace(domain, '').replace('/collections', '/search'),
              title: item.title
            }));
      return {
        title: item.title,
        url: item.url.replace(domain, '').replace('/collections', '/search'),
        items: itemSitem
      };
    }) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle
    }
  });
  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey
    }
  });
  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

// MY OWN MAGIC
/**
 * updates customer access token using Shopify query "customerAccessTokenCreate" and saving it in database using prisma.
 * @param email User's Email
 * @param password Users password
 * @returns void

 */
export async function updateCustomerAccessToken({
  email,
  password
}: CustomerAccessTokenCreateInput) {
  console.log('entering updateCustomer');
  const returnedData = await shopifyFetch<CustomerAccessTokenOperation>({
    query: customerAccessTokenCreate,
    variables: {
      input: { email, password }
    }
  });
  console.log(
    `creating customer token using shopify API : ${JSON.stringify(returnedData.body.data)}`
  );
  if (returnedData !== undefined) {
    const { accessToken, expiresAt } =
      returnedData.body.data.customerAccessTokenCreate.customerAccessToken;
    let userUpdated;
    try {
      const prisma = new PrismaClient();
      userUpdated = await prisma.user.update({
        where: {
          email: email
        },
        data: {
          accessToken: accessToken,
          expiresAt: expiresAt
        }
      });
      console.log(`User token has been updated: ${userUpdated}`);
    } catch (error) {
      console.log('error in saving token');
    }
  }
}

export async function createCustomerFunction(props: createCustomerInput) {
  const req = await shopifyFetch<createCustomerOperation>({
    query: createCustomer,
    variables: { input: props }
  });
  console.log(JSON.stringify(req.body.data));
  return req.body.data;
}

export async function getSearchResults({
  query,
  first = 50,
  productFilters = [{ available: true }, { price: { max: 1100.0, min: 500.0 } }]
}: {
  query?: string;
  first?: number;
  productFilters?: any;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifySearchOperation>({
    query: getSearchResultsQuery,
    variables: {
      query,
      first,
      productFilters
    }
  });
  return reshapeProducts(removeEdgesAndNodes(res.body.data.search));
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  const topic = headers().get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
