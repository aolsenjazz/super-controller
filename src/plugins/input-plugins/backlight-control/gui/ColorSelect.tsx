import type { Color } from '@shared/driver-types/color';

function colorDisplayName(c: Color) {
  return `${c.name}${c.modifier ? ` (${c.modifier})` : ''}`;
}

type PropTypes = {
  availableColors: Color[];
  state: number;
  onChange: (state: number, color: Color) => void;
  color?: Color;
};

export default function ColorSelect(props: PropTypes) {
  const { availableColors, color, state, onChange } = props;

  const value = color ? colorDisplayName(color) : 'unset';
  const options: JSX.Element[] = [];

  if (!color)
    options.push(
      <option disabled hidden value={value}>
        Unset
      </option>
    );

  availableColors.forEach((c) => {
    options.push(
      <option value={colorDisplayName(c)} key={colorDisplayName(c)}>
        {colorDisplayName(c)}
      </option>
    );
  });

  const innerChange = (newColorDisplayName: string) => {
    const newColor = availableColors.find(
      (c) => colorDisplayName(c) === newColorDisplayName
    );

    if (!newColor) throw new Error('Unabled to find color in AvailableColors');

    onChange(state, newColor);
  };

  return (
    <div className="color-select-container">
      <p>Color:</p>
      <div
        className="color-sample"
        style={{ backgroundColor: color?.string || '' }}
      />
      <select
        value={value}
        onChange={(e) => innerChange(e.target.value)}
        style={{ color: value === 'unset' ? 'gray' : '' }}
      >
        {options}
      </select>
    </div>
  );
}
