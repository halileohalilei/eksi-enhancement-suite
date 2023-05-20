import { PrefName, UserPreferences } from '../UserPreferences';

export const topicMutations = () => {
  //find element with id topic
  const topicElement = document.getElementById('topic');

  // find topicElement's child h1 with id title
  const titleElements = topicElement?.querySelectorAll('h1#title');

  // decorate each titleElement
  titleElements?.forEach(decorateTitleElement);
};

const decorateTitleElement = (titleElement: Element) => {
  // find href of titleElement's child a
  const titleHref = titleElement?.querySelector('a')?.href as string;
  const titleHrefUrl = new URL(titleHref);
  const titleHrefPathname = titleHrefUrl.pathname;

  const isIgnored = UserPreferences.getInstance().is(
    titleHrefPathname,
    'ignored'
  );

  const isFavorited = UserPreferences.getInstance().is(
    titleHrefPathname,
    'favorite'
  );

  // try to find a div with class sub-title-container, which is a sibling to titleElement
  const subTitleContainer = titleElement?.parentElement?.querySelector(
    'div.sub-title-container'
  );

  if (!isIgnored) {
    const favoriteAnchor = createToggleAnchor(titleHrefPathname, 'favorite');
    favoriteAnchor.innerHTML = isFavorited ? 'iyi değilmiş' : 'iyiymiş';
    favoriteAnchor.title = isFavorited
      ? 'vazgeçtim öne çıkarma'
      : "bunu sol frame'de öne çıkar";

    if (subTitleContainer) {
      const subTitleMenu =
        subTitleContainer?.querySelector('div.sub-title-menu');
      subTitleMenu?.appendChild(favoriteAnchor);
    } else {
      titleElement?.insertAdjacentElement('afterend', favoriteAnchor);
    }
  }

  // create an ignore toggle anchor
  const ignoreAnchor = createToggleAnchor(titleHrefPathname, 'ignored');
  ignoreAnchor.innerHTML = isIgnored ? 'gizleme' : 'gizle';
  ignoreAnchor.title = isIgnored
    ? "neyse tamam sol frame'de göster"
    : "gözüm görmesin bunu sol frame'de";

  if (subTitleContainer) {
    const subTitleMenu = subTitleContainer?.querySelector('div.sub-title-menu');
    subTitleMenu?.appendChild(ignoreAnchor);
  } else {
    ignoreAnchor.style.marginRight = '10px';
    titleElement?.insertAdjacentElement('afterend', ignoreAnchor);
  }
};

const createToggleAnchor = (titleHrefPathname: string, prefName: PrefName) => {
  const anchor = document.createElement('a');

  anchor.addEventListener('click', () => {
    if (UserPreferences.getInstance().is(titleHrefPathname, prefName)) {
      UserPreferences.getInstance().remove(titleHrefPathname, prefName);
    } else {
      UserPreferences.getInstance().add(titleHrefPathname, prefName);
    }
    window.location.reload();
  });

  return anchor;
};
