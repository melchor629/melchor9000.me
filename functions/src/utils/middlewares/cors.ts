import cors from 'cors'
import os from 'node:os'

export default (extraHosts?: Array<string | RegExp>) => cors({
  origin: [
    ...(
      process.env.NODE_ENV === 'production'
        ? ['https://melchor9000.me']
        : ['http://localhost:3000', `http://${os.hostname}:3000`]
    ),
    ...(extraHosts ?? []),
  ],
})
