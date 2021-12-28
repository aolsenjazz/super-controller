import { useEffect, useState } from 'react';
const ipcRenderer = window.ipcRenderer;

/**
 * The uppermost gray bar. Draggable
 */
export default function TitleBar() {
  const [title, setTitle] = useState('Untitled Project');

  /* Listen to changes to available MIDI ports */
  useEffect(() => {
    const cb = (_e: Event, tit: string) => setTitle(tit);
    const unsubscribe = ipcRenderer.on('title', cb);
    return () => unsubscribe();
  });

  return (
    <div id="title-bar">
      <div id="no-shadow" />
      <h1 id="title">{title}</h1>
      <div id="shadow" />
    </div>
  );
}
