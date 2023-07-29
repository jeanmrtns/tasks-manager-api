import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe('Tasks routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create new task', async () => {
    await supertest(app.server)
      .post('/tasks')
      .send({
        title: 'Test task',
        description: 'This is a test',
      })
      .expect(201)
  })

  it('should be able to list all tasks', async () => {
    await supertest(app.server).post('/tasks').send({
      title: 'Test task',
      description: 'This is a test',
    })

    await supertest(app.server).post('/tasks').send({
      title: 'Test task2',
      description: 'This is a second test',
    })

    const getTasksResponse = await supertest(app.server).get('/tasks')

    expect(getTasksResponse.body.tasks).toHaveLength(2)
  })
})
