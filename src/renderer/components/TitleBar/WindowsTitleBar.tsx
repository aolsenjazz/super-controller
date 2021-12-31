import { useEffect, useState } from 'react';

const { ipcRenderer } = window;

/**
 * On Windows, don't show an additional title bar because we use the native one.
 */
export default function WindowsTitleBar() {
  const [title, setTitle] = useState('Untitled Project');

  /* Listen to changes to available MIDI ports */
  useEffect(() => {
    const cb = (_e: Event, tit: string) => setTitle(tit);
    const unsubscribe = ipcRenderer.on('title', cb);
    return () => unsubscribe();
  });

  return <title>{title}</title>;
}
