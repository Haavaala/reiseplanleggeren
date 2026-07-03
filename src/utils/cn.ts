/** Join truthy class names into a single string. Tiny classnames() replacement. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
