import {
  favoriteTopicsLocalStorageKey,
  ignoredTopicsLocalStorageKey,
} from './constants';

const prefConfig: {
  [N in PrefName]: { default: string[]; localStorageKey: string };
} = {
  ignored: {
    default: [],
    localStorageKey: ignoredTopicsLocalStorageKey,
  },
  favorite: {
    default: [],
    localStorageKey: favoriteTopicsLocalStorageKey,
  },
};

export type PrefName = 'ignored' | 'favorite';

export class UserPreferences {
  private static instance: UserPreferences;

  private ignoredTopicHrefs: string[] = [];
  private favoriteTopicHrefs: string[] = [];

  prefMap: {
    [N in PrefName]: string[];
  } = {
    ignored: this.ignoredTopicHrefs,
    favorite: this.favoriteTopicHrefs,
  };

  private constructor() {
    Object.keys(prefConfig).forEach((prefName) => {
      const { default: defaultValue, localStorageKey } =
        prefConfig[prefName as PrefName];
      const pref = localStorage.getItem(localStorageKey);
      if (pref) {
        this.prefMap[prefName as PrefName] = JSON.parse(pref);
      } else {
        this.prefMap[prefName as PrefName] = defaultValue;
      }
    });
  }

  static getInstance(): UserPreferences {
    if (!UserPreferences.instance) {
      UserPreferences.instance = new UserPreferences();
    }
    return UserPreferences.instance;
  }

  is(href: string, prefName: PrefName): boolean {
    return this.prefMap[prefName].includes(href);
  }

  add(href: string, prefName: PrefName): void {
    const pref = this.prefMap[prefName];
    if (!pref.includes(href)) {
      pref.push(href);
    }
    localStorage.setItem(
      prefName === 'ignored'
        ? ignoredTopicsLocalStorageKey
        : favoriteTopicsLocalStorageKey,
      JSON.stringify(pref)
    );
  }

  remove(href: string, prefName: PrefName): void {
    const pref = this.prefMap[prefName];
    const index = pref.indexOf(href);
    if (index > -1) {
      pref.splice(index, 1);
    }
    localStorage.setItem(
      prefName === 'ignored'
        ? ignoredTopicsLocalStorageKey
        : favoriteTopicsLocalStorageKey,
      JSON.stringify(pref)
    );
  }
}
