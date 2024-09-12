import randomstring from 'randomstring';

/**
 * Convenience function to generate a pseudo-random string for identifying
 * and differentiating plugin instances
 */
export function generateId(title: string) {
  return `${title}-${randomstring.generate()}`;
}
