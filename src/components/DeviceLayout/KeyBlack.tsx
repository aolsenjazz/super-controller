import React from 'react';

type PropTypes = {
  fundamental: number;
};

/* Basic non-interactive black key */
export default function KeyBlack(props: PropTypes) {
  const { fundamental } = props;

  const numKeysFromLeft = 0.5 + Math.floor(fundamental / 2);
  const adjustment = fundamental * Math.floor(fundamental / 6) * 1;

  return (
    <div
      className="key-black key"
      style={{
        left: `${16.2 * numKeysFromLeft - adjustment}%`,
      }}
    />
  );
}
