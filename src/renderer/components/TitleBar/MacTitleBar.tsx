import { useEffect, useState } from 'react';

const { projectService } = window;

/**
 * On mac, stoplight controls are overlaid over this draggable title bar
 */
export default function TitleBar() {
  const [title, setTitle] = useState('Untitled Project');

  /* Listen to changes to available MIDI ports */
  useEffect(() => {
    const cb = (tit: string) => setTitle(tit);
    const unsubscribe = projectService.onTitleChange(cb);
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
