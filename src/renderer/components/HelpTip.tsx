type PropTypes = {
  body: string;
};

export default function HelpTip(props: PropTypes) {
  const { body } = props;

  return (
    <div className="help-tip">
      <p>{body}</p>
    </div>
  );
}
