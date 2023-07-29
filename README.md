# Tasks Manager API

This API gives all the REST options for a Task management.

Installation and running:

Be sure to create the .env and .env.test files before running
```bash
  npm install # install all dependencies
  npm run dev # run the application on port 3333
```
<small>ps. You can change the port by changing it in server.ts file</small>

Testing:
```
npm test
```


Routes:
- [x] GET all tasks: `/tasks`
- [x] GET all tasks with title or description filter: `/tasks?title=hey`
- [x] POST one task: `/tasks`
- [x] POST upload .csv file with a list of tasks: `/tasks/upload`
- [x] PUT update one task by its ID: `/tasks/:id`
- [x] PATCH mark a task as completed: `/tasks/:id`
- [x] DELETE a task: `/tasks/:id`

POST task and PUT need only the title and description on the request body (PUT needs only one of them)

Tasks format:
```json
{
  id: string,
  title: string,
  description: string,
  created_at: string,
  updated_at: string,
  completed_at: string,
}
```

<br />

Tools used:
- fastify: manage app routes
- zod: data validation
- knex: database query builder
- typescript: type checking
- eslint: code checking
- csv-parse: manage csv files
- vitest: testing
- supertest: test app routes