import { HorizontalHandleLayout } from './HorizontalHandleLayout';
import { VerticalHandleLayout } from './VerticalHandleLayout';

type PropTypes = {
  value: number;
  handleWidth: string;
  handleHeight: string;
  horizontal: boolean;
};

export function HandleLayout(props: PropTypes) {
  const { value, handleWidth, handleHeight, horizontal } = props;

  const Layout = horizontal ? HorizontalHandleLayout : VerticalHandleLayout;

  return (
    <div
      className={`handle-input interactive-indicator${
        horizontal ? ' horizontal' : ''
      }`}
    >
      <Layout
        value={value}
        handleWidth={handleWidth}
        handleHeight={handleHeight}
      />
    </div>
  );
}
