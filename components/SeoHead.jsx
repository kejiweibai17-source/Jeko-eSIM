import Head from "next/head";
import {
  SITE_NAME,
  SITE_NAME_FULL,
  BRAND,
  formatTitle,
  absoluteUrl,
  buildJsonLdGraph,
} from "../lib/seo.config";
import { SITE_FAVICON } from "../lib/pwaConfig";

/**
 * 全站統一 SEO Head：title / description / keywords / OG / Twitter / canonical / GEO / JSON-LD
 */
export default function SeoHead({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = "website",
  robots = "index, follow",
  breadcrumbs,
  jsonLd,
  jsonLdTypes,
  noindex = false,
  articlePublishedTime,
  articleModifiedTime,
}) {
  const pageTitle = formatTitle(title);
  const metaDescription = description || "";
  const metaKeywords = keywords || "";
  const canonicalUrl = canonical || absoluteUrl("/");
  const imageUrl = ogImage ? absoluteUrl(ogImage) : absoluteUrl("/icons/icon-512x512.png");
  const robotsContent = noindex ? "noindex, nofollow" : robots;

  const ldGraph = buildJsonLdGraph({
    breadcrumbs,
    jsonLd,
    jsonLdTypes,
  });

  return (
    <Head>
      <title>{pageTitle}</title>
      {metaDescription && (
        <meta name="description" content={metaDescription} />
      )}
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <meta name="author" content={SITE_NAME_FULL} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* GEO / 地區語系 */}
      <meta name="geo.region" content={BRAND.region} />
      <meta name="geo.placename" content={BRAND.placename} />
      <meta httpEquiv="content-language" content={BRAND.language} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="zh-TW" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:locale" content="zh_TW" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      {metaDescription && (
        <meta property="og:description" content={metaDescription} />
      )}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />

      {ogType === "article" && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {ogType === "article" && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {metaDescription && (
        <meta name="twitter:description" content={metaDescription} />
      )}
      <meta name="twitter:image" content={imageUrl} />

      <link rel="icon" href={SITE_FAVICON} />

      {/* 結構化資料 @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldGraph) }}
      />
    </Head>
  );
}
