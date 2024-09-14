import os from 'os'
import e from 'express'

import config from './common/config.js'
import userRouter from './modules/user/router.js'
import morgan from 'morgan'

const app = e()

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(e.json())

app.get('/', (req, res) => {
  res.json({
    server: {
      hostname: os.hostname(),
      uptime: os.uptime(),
      cpus: os.cpus().length,
      totalmem: os.totalmem(),
      freemem: os.freemem(),
    },
    time: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
  })
})

app.use('/user', userRouter)

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})
