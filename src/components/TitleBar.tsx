import React from 'react';

/**
 * The uppermost gray bar. Draggable
 *
 * @param { string } title The title of the window, probably the Project name
 */
export default function TitleBar(props: { title: string }) {
  const { title } = props;

  return (
    <div id="title-bar">
      <div id="no-shadow" />
      <h1 id="title">{title}</h1>
      <div id="shadow" />
    </div>
  );
}
