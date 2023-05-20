'use strict';

import { UserPreferences } from './UserPreferences';
import { eksiDomains } from './constants';
import { isEksi } from './helpers/isEksi';
import { imageMutations } from './mutations/imageMutations';
import { topicListMutations } from './mutations/topicListMutations';
import { topicMutations } from './mutations/topicMutations';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

if (isEksi) {
  console.log("Eksi Enhancement Suite'e hos geldin!");

  topicListMutations();
  topicMutations();
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
