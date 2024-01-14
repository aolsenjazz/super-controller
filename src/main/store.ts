import ElectronStore from 'electron-store';

const store = new ElectronStore();

type PanelParams = {
  open: boolean;
};

export type LayoutParams = {
  leftPanel: PanelParams;
  rightPanel: PanelParams;
};

export const Store = {
  getLayoutItem(s: string) {
    return store.get(s);
  },

  setLayoutItem(s: string, v: string) {
    store.set(s, v);
  },

  getLayoutParams(): LayoutParams {
    const defaultLayoutParams = {
      leftPanel: {
        show: true,
      },
      rightPanel: {
        show: true,
      },
    };

    return (store.get('layout') as LayoutParams) || defaultLayoutParams;
  },

  setLayoutParams(lp: LayoutParams) {
    store.set('layout', lp);
  },
};
