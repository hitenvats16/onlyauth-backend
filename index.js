import os from 'os'
import e from 'express'
import morgan from 'morgan'
import cors from 'cors'

import config from './common/config.js'

import userRouter from './modules/user/router.js'
import dashboardRouter from './modules/dashboard/router.js'
import operationRouter from './modules/operations/router.js'
import resourceRouter from './modules/resources/router.js'

const app = e()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(cors())

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
app.use('/dashboard', dashboardRouter)

app.use('/o', operationRouter)
app.use('/r', resourceRouter)

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})
