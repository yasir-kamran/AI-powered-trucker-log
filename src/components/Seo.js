import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Seo({
  title,
  description,
  canonicalPath,
  noindex = false,
  ogImagePath = '/logo512.png',
  structuredData,
}) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const canonicalUrl = origin && canonicalPath ? `${origin}${canonicalPath}` : undefined;
  const ogImageUrl = origin ? `${origin}${ogImagePath}` : undefined;

  const robots = noindex ? 'noindex, nofollow' : 'index, follow';

  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      <meta name="robots" content={robots} />

      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      {title ? <meta property="og:title" content={title} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:type" content="website" />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      {ogImageUrl ? <meta property="og:image" content={ogImageUrl} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      {title ? <meta name="twitter:title" content={title} /> : null}
      {description ? <meta name="twitter:description" content={description} /> : null}
      {ogImageUrl ? <meta name="twitter:image" content={ogImageUrl} /> : null}

      {structuredData ? (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      ) : null}
    </Helmet>
  );
}
