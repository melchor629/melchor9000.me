export const publicHost =
  process.env.PUBLIC_URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  `localhost:${process.env.PORT || 3000}`

export const publicUrl = new URL(
  `http${publicHost.startsWith('localhost') ? '' : 's'}://${publicHost}`,
)
