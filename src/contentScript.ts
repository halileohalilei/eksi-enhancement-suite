'use strict';

import { eksiDomains } from './constants';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

const currentUrl = new URL(document.location.href);
const isEksi = eksiDomains.includes(currentUrl.hostname);
if (isEksi) {
  console.log("Eksi Enhancement Suite'e hos geldin!");
}

let globalTopicList: HTMLUListElement;

const filterTopics = (topicList: HTMLUListElement) => {
  for (let i = 0; i < topicList.children.length; i += 1) {
    const listItem = topicList.children.item(i);
    const anchor = listItem?.children.item(0) as HTMLAnchorElement;
    // if (anchor.innerText.includes('a')) {
    //   listItem?.removeChild(anchor);
    // }
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
  // console.log(topicList.children);
}

// // Communicate with background file by sending a message
// chrome.runtime.sendMessage(
//   {
//     type: 'GREETINGS',
//     payload: {
//       message: 'Hello, my name is Con. I am from ContentScript.',
//     },
//   },
//   (response) => {
//     console.log(response.message);
//   }
// );

// // Listen for message
// chrome.runtime.onMessage.addListener((request, sender: chrome.runtime.MessageSender, sendResponse) => {
//   if (request.type === 'COUNT') {
//     console.log(`Current count is ${request.payload.count}`);
//   }

//   // Send an empty response
//   // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
//   sendResponse({});
//   return true;
// });
