import React from 'react';

/**
 * A simple, centered message
 *
 * @param { object } props Component props
 * @param { string } msg The message to display
 */
export default function BasicMessage(props: { msg: string }) {
  const { msg } = props;
  return (
    <div className="message">
      <p>{msg}</p>
    </div>
  );
}
