const isDev = import.meta.env.DEV

const sanitize = (error) => {
  if (!error) return 'Unknown error'
  if (isDev) return error
  if (error?.code) return `[${error.code}]`
  return 'An error occurred'
}

export const logError = (context, error) => {
  if (isDev) {
    console.error(`[${context}]`, error)
  }
}

export const logWarn = (context, error) => {
  if (isDev) {
    console.warn(`[${context}]`, error)
  }
}

export { sanitize }
