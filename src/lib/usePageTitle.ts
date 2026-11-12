import { useEffect } from 'react';

const SITE = 'https://icaropintolira.vercel.app';
const PERSON_ID = `${SITE}/#person`;

type PageSEO = {
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  structuredData?: Record<string, unknown>;
};

function setMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(url: string): void {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = url;
}

export function usePageTitle(title: string, seo: PageSEO = {}): void {
  useEffect(() => {
    const pageTitle = title === 'Início' ? 'Ícaro Pinto Lira — Ciência da Computação, UFCG' : `${title} — Ícaro Pinto Lira`;
    const description = seo.description ?? 'Portfólio de Ícaro Pinto Lira: Ciência da Computação na UFCG, projetos autorais, programação competitiva e conquistas.';
    const canonical = `${SITE}${seo.path ?? window.location.pathname}`;
    const image = seo.image ? (seo.image.startsWith('http') ? seo.image : `${SITE}${seo.image.startsWith('/') ? '' : '/'}${seo.image}`) : `${SITE}/assets/icaro-pinto-lira.jpg`;
    const imageAlt = seo.imageAlt ?? 'Ícaro Pinto Lira, estudante de Ciência da Computação da UFCG';

    document.title = pageTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', 'index,follow,max-image-preview:large');
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'Ícaro Pinto Lira');
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:image:alt', imageAlt);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'twitter:image:alt', imageAlt);
    setCanonical(canonical);

    let script = document.getElementById('page-seo-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'page-seo-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    const pageData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: pageTitle,
      description,
      inLanguage: 'pt-BR',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': PERSON_ID },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        contentUrl: image,
        caption: imageAlt,
        representativeOfPage: true,
        creator: { '@id': PERSON_ID }
      },
      ...(seo.structuredData ? { mainEntity: seo.structuredData } : {})
    };
    script.textContent = JSON.stringify(pageData);
  }, [title, seo.description, seo.path, seo.image, seo.imageAlt, seo.structuredData]);
}