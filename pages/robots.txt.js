import { SITE_URL } from "../lib/seo.config";

export default function Robots() {}

export async function getServerSideProps({ res }) {
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /checkout
Disallow: /Cart
Disallow: /cart
Disallow: /login
Disallow: /my-account
Disallow: /my-esim
Disallow: /account
Disallow: /p/
Disallow: /test
Disallow: /pending
Disallow: /thank-you
Disallow: /reset-password
Disallow: /profile
Disallow: /wizard
Disallow: /linepay
Disallow: /ecpay

Sitemap: ${SITE_URL}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain");
  res.write(body);
  res.end();

  return { props: {} };
}
