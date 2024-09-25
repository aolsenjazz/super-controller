export function toString(msg: NumberArrayWithStatus) {
  return msg.reduce((a, b) => `${a}.${b}`, '').substring(1);
}
