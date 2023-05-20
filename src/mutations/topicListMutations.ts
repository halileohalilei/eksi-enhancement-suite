import { UserPreferences } from '../UserPreferences';
import { getCurrentUrl } from '../helpers/getCurrentUrl';

let globalTopicList: HTMLUListElement;

export const topicListMutations = () => {
  const currentUrl = getCurrentUrl();
  const filterTopics = (topicList: HTMLUListElement) => {
    for (let i = 0; i < topicList.children.length; i += 1) {
      const listItem = topicList.children.item(i);
      const anchor = listItem?.children.item(0) as HTMLAnchorElement;

      // create a URL variable to hold the href value
      const topicHref = new URL(anchor.href, currentUrl.origin).pathname;

      if (UserPreferences.getInstance().is(topicHref, 'ignored')) {
        listItem?.remove();
      } else if (UserPreferences.getInstance().is(topicHref, 'favorite')) {
        // make anchor's text bold
        anchor.style.fontWeight = 'bold';
      }
    }
  };

  let topicListObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList') {
        const children = mutation.target.childNodes;
        for (const node of children) {
          if (node.nodeName === 'UL') {
            const topicList = node as HTMLUListElement;
            if (!globalTopicList) {
              globalTopicList = topicList;
            }
            filterTopics(topicList);
          }
        }
      }
    });
  });

  const topicListElements = document.getElementsByClassName('topic-list');
  if (topicListElements.length > 0) {
    globalTopicList = topicListElements.item(0) as HTMLUListElement;
    filterTopics(globalTopicList);

    if (globalTopicList.parentNode) {
      topicListObserver.observe(globalTopicList.parentNode, {
        childList: true,
      });
    }
  }
};
