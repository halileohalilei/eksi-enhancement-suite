import { eksiDomains } from '../constants';
import { getCurrentUrl } from './getCurrentUrl';

const currentUrl = getCurrentUrl();
export const isEksi = eksiDomains.includes(currentUrl.hostname);
