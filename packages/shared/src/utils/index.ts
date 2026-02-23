/**
 * Formats a date into a human-readable string (e.g., "Jan 1, 2024").
 * @param date - The date to format (Date object or ISO string)
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Filters out falsy values and joins remaining class names with spaces.
 * @param classes - Array of class name candidates (strings, booleans, undefined, or null)
 * @returns Space-separated class names string
 */
export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
