import fastify from 'fastify'
import multipart from '@fastify/multipart'
import { tasksRoutes } from './routes/tasks'

export const app = fastify()

app.register(multipart)

app.register(tasksRoutes, {
  prefix: 'tasks',
})
