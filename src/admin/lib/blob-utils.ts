/**
 * Converts a Blob to a base64 data URL for use with @react-pdf/renderer Image.
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert blob to base64'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

/**
 * Formats a number as Hungarian currency with space as thousands separator.
 * Example: 1200000 -> "1 200 000 Ft"
 */
export function formatHuf(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${formatted} Ft`
}

/**
 * Formats a number in "ezer Ft" (thousands of HUF) with space separator.
 * Example: 1200000 -> "1 200 ezer Ft"
 */
export function formatHufThousands(amount: number): string {
  const thousands = Math.round(amount / 1000)
  const formatted = thousands
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${formatted} ezer Ft`
}

/**
 * Formats a Date as Hungarian date string.
 * Example: new Date('2026-02-24') -> "2026. februar 24."
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const MONTHS = [
    'januar',
    'februar',
    'marcius',
    'aprilis',
    'majus',
    'junius',
    'julius',
    'augusztus',
    'szeptember',
    'oktober',
    'november',
    'december',
  ]

  const year = d.getFullYear()
  const month = MONTHS[d.getMonth()]
  const day = d.getDate()

  return `${year}. ${month} ${day}.`
}
