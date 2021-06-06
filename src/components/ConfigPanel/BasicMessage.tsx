import React from 'react';

export default function BasicMessage(props: { msg: string }) {
  const { msg } = props;
  return (
    <div className="message">
      <p>{msg}</p>
    </div>
  );
}
