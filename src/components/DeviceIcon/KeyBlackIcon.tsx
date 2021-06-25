import React from 'react';

type PropTypes = {
  fundamental: number;
  active: boolean;
};

/**
 * Simplified graphical representation of a black key
 *
 * @param { object } props Component props
 * @param { number } props.fundamental Zero-based offset from C in the same octave (1,3,6,8 or 10)
 * @param { boolean } props.active Should the key be highlighted?
 */
export default function KeyBlackIcon(props: PropTypes) {
  const { fundamental, active } = props;

  const numKeysFromLeft = 0.5 + Math.floor(fundamental / 2);
  const adjustment = fundamental * Math.floor(fundamental / 6) * 1;

  return (
    <div
      className={`key-black key ${active ? 'active' : ''}`}
      style={{
        left: `${16.2 * numKeysFromLeft - adjustment}%`,
      }}
    />
  );
}
