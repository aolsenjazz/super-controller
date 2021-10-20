import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

/**
 * The uppermost gray bar. Draggable
 */
export default function TitleBar() {
  const [title, setTitle] = useState('Untitled Project');

  /* Listen to changes to available MIDI ports */
  useEffect(() => {
    const cb = (_e: Event, tit: string) => {
      setTitle(tit);
    };

    ipcRenderer.on('title', cb);
    return () => {
      ipcRenderer.removeListener('title', cb);
    };
  });

  return (
    <div id="title-bar">
      <div id="no-shadow" />
      <h1 id="title">{title}</h1>
      <div id="shadow" />
    </div>
  );
}
