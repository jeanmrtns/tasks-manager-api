import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../infra/database/knex'
import { parse } from 'csv-parse'

export async function tasksRoutes(app: FastifyInstance) {
  app.get('/', async (request) => {
    const filterTasksSchema = z.object({
      title: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
    })
    const { title, description } = filterTasksSchema.parse(request.query)
    let tasks = []

    if (title || description) {
      tasks = await knex('tasks')
        .select('*')
        .where('title', 'like', `%${title}%`)
        .orWhere('description', 'like', `%${description}%`)
    } else {
      tasks = await knex('tasks').select('*')
    }

    return { tasks }
  })

  app.post('/', async (request, reply) => {
    const createTaskSchema = z.object({
      title: z.string(),
      description: z.string(),
    })

    const { title, description } = createTaskSchema.parse(request.body)

    await knex('tasks').insert({
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
    })

    return reply.status(201).send()
  })

  app.post('/upload', async (request, reply) => {
    const data = await request.file()

    if (!data?.file) return { error: 'no csv file was found' }

    const parser = data.file.pipe(
      parse({
        fromLine: 2,
      }),
    )

    for await (const chunk of parser) {
      const [title, description] = chunk
      await knex('tasks').insert({
        id: randomUUID(),
        title,
        description,
        created_at: new Date().toString(),
        updated_at: new Date().toString(),
        completed_at: null,
      })
    }

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const requestParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = requestParamsSchema.parse(request.params)
    const task = await knex('tasks').where('id', id).first()

    if (!task) {
      return reply.status(400).send({
        error: 'Task does not exists',
      })
    }
    const updateTaskSchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    })

    const { title, description } = updateTaskSchema.parse(request.body)
    await knex('tasks')
      .where('id', id)
      .first()
      .update({
        description: description || task.description,
        title: title || task.title,
      })

    return reply.status(204).send()
  })

  app.delete('/:id', async (request, reply) => {
    const requestParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = requestParamsSchema.parse(request.params)
    const task = await knex('tasks').where('id', id).first()

    if (!task) {
      return reply.status(400).send({
        error: 'Task does not exists',
      })
    }

    await knex('tasks').where('id', id).first().del()

    return reply.status(204).send()
  })

  app.patch('/:id/complete', async (request, reply) => {
    const requestParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = requestParamsSchema.parse(request.params)
    const task = await knex('tasks').where('id', id).first()

    if (!task) {
      return reply.status(400).send({
        error: 'Task does not exists',
      })
    }
    await knex('tasks')
      .where('id', id)
      .first()
      .update({
        completed_at: task.completed_at ? null : new Date().toString(),
      })

    return reply.status(204).send()
  })
}
