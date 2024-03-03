// server.ts
import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import { createDatabase } from './db'

const bootstrap = async () => {
  await createDatabase()

  const prisma = new PrismaClient()
  const app = express()

  app.use(express.json())

  // Endpoint to create a new form template
  app.post('/form-templates', async (req: Request, res: Response) => {
    try {
      const { name, description, fields } = req.body

      const formTemplate = await prisma.formTemplate.create({
        data: {
          name,
          description,
          fields: {
            createMany: {
              data: fields,
            },
          },
        },
        include: {
          fields: true,
        },
      })

      res.json(formTemplate)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  // Endpoint to retrieve all form templates
  app.get('/form-templates', async (_req: Request, res: Response) => {
    try {
      const formTemplates = await prisma.formTemplate.findMany({
        include: {
          fields: true,
        },
      })

      res.json(formTemplates)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  // Endpoint to create a new form instance
  app.post('/forms', async (req: Request, res: Response) => {
    try {
      const { templateId, name, fields } = req.body

      const form = await prisma.form.create({
        data: {
          formTemplateId: templateId,
          name,
          fields: {
            createMany: {
              data: fields,
            },
          },
        },
        include: {
          fields: true,
        },
      })

      res.json(form)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  // Endpoint to retrieve all form instances
  app.get('/forms', async (_req: Request, res: Response) => {
    try {
      const forms = await prisma.form.findMany({
        include: {
          fields: true,
        },
      })

      res.json(forms)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

bootstrap()
