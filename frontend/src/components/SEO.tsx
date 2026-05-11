import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO = ({ 
  title = 'KALEIDO | Multi-Dimensional Marketplace', 
  description = 'Experience the next generation of e-commerce with KALEIDO. A high-fidelity, multi-vendor marketplace bridging digital and physical artifacts.',
  keywords = 'ecommerce, marketplace, technology, premium, kaleido, future, artifact',
  image = '/og-image.jpg',
  url = 'https://kaleido.io'
}: SEOProps) => {
  const siteTitle = title.includes('KALEIDO') ? title : `${title} | KALEIDO`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
