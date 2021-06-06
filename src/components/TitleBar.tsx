import React from 'react';

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
