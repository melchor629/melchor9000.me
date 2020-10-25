// eslint-disable-next-line import/prefer-default-export
export const runOnEnter = (callback: (e: any) => void) => (
  (e: KeyboardEvent | React.KeyboardEvent) => {
    if (e.key.toLowerCase() === 'enter') {
      callback(e)
    }
  }
)
