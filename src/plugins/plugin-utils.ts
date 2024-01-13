import randomstring from 'randomstring';

export function generateId(title: string) {
  return `${title}-${randomstring.generate()}`;
}
