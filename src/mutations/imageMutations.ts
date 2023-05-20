import { getCurrentUrl } from '../helpers/getCurrentUrl';

const resolveImageDomain = (imageUrl: string) => {
  const currentUrl = getCurrentUrl();
  const url = new URL(imageUrl);
  const hostname = url.hostname;
  if (hostname === 'soz.lk') {
    const imageId = url.pathname.split('/')[2];
    return new URL(`/img/${imageId}`, currentUrl.origin);
  }

  return null;
};

export const imageMutations = () => {
  // find anchors that have soz.lk in their href
  const imageAnchors = document.querySelectorAll(
    'a[href*="soz.lk"]'
  ) as NodeListOf<HTMLAnchorElement>;
  console.log(imageAnchors);
  imageAnchors.forEach((imageAnchor) => {
    const imageUrl = imageAnchor.href;
    const resolvedImageUrl = resolveImageDomain(imageUrl);
    if (resolvedImageUrl) {
      fetch(resolvedImageUrl.href)
        .then((htmlResponse) => {
          return htmlResponse.text();
        })
        .then((htmlText) => {
          const parser = new DOMParser();
          const htmlDocument = parser.parseFromString(htmlText, 'text/html');
          const imageElement = htmlDocument.querySelector('img');
          imageElement?.setAttribute(
            'style',
            'max-width: 100%;height: 100%;max-height:400px;display: block;'
          );

          imageAnchor?.parentElement?.setAttribute(
            'style',
            'max-height: unset'
          );
          if (imageElement) {
            imageAnchor.replaceChildren(imageElement);
          }
        });
    }
  });
};
