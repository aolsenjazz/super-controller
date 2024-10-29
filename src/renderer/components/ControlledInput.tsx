import React, { useEffect, useRef, useState } from 'react';

type InputProps = React.ComponentProps<'input'>;

/**
 * Keep track of the cursor position so that the value can be updated and
 * reflected asynchronously without the cursor jumping
 */
export default function ControllerInput(props: InputProps) {
  // eslint-disable-next-line react/prop-types
  const { value, onChange, ...rest } = props;
  const [cursor, setCursor] = useState<number | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.setSelectionRange(cursor, cursor);
  }, [ref, cursor, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCursor(e.target.selectionStart);
    onChange?.(e);
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <input ref={ref} value={value} onChange={handleChange} {...rest} />;
}
