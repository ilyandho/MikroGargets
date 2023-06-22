import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_SECRET_KEY, // Note: this is the API Secret Key, NOT the API access token
  apiVersion: ApiVersion.April23,
  isCustomStoreApp: true, // this MUST be set to true (default is false)
  adminApiAccessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN, // Note: this is the API access token, NOT the API Secret Key
  isEmbeddedApp: false,
  hostName: process.env.SHOP,
  restResources,
});

const session = shopify.session.customAppSession(process.env.SHOPIFY_SHOP);

const client = new shopify.clients.Graphql({ session });

export default async function handler(req, res) {
  const products_query = `{
    products (first: 10) {

      edges {
        node {
          id
          title
        }
      }
    }
  }`;
  const response = await client.query({ data: products_query });

  const {
    body: {
      data: {
        products: { edges },
      },
    },
  } = response;

  console.log(edges);
  res.status(200).json({
    data: edges,
  });
}
