/**
 * A simple, centered message
 *
 * @param props Component props
 * @param props.msg The message to display
 */
export default function BasicMessage(props: { msg: string }) {
  const { msg } = props;
  return (
    <div className="message">
      <p>{msg}</p>
    </div>
  );
}
