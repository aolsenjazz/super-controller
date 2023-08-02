import { HorizontalHandleLayout } from './HorizontalHandleLayout';
import { VerticalHandleLayout } from './VerticalHandleLayout';

type PropTypes = {
  value: number;
  handleWidth: string;
  handleHeight: string;
  horizontal: boolean;
  inverted: boolean;
};

export function HandleLayout(props: PropTypes) {
  const { value, handleWidth, handleHeight, horizontal, inverted } = props;

  const Layout = horizontal ? HorizontalHandleLayout : VerticalHandleLayout;

  return (
    <div
      className={`handle-input interactive-indicator${
        horizontal ? ' horizontal' : ''
      }`}
    >
      <Layout
        value={inverted ? 127 - value : value}
        handleWidth={handleWidth}
        handleHeight={handleHeight}
      />
    </div>
  );
}
