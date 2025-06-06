import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const clientes = await prisma.cliente.findMany()
    return res.status(200).json(clientes)
  }

  if (req.method === 'POST') {
    const { nome, email } = req.body
    try {
      const cliente = await prisma.cliente.create({
        data: { nome, email },
      })
      return res.status(201).json(cliente)
    } catch (error) {
      return res.status(400).json({ error: 'Email já cadastrado' })
    }
  }

  if (req.method === 'PUT') {
    const { id, nome, email } = req.body
    try {
      const cliente = await prisma.cliente.update({
        where: { id: parseInt(id) },
        data: { nome, email },
      })
      return res.status(200).json(cliente)
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar cliente' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    try {
      await prisma.cliente.delete({
        where: { id: parseInt(id) },
      })
      return res.status(204).end()
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao excluir cliente' })
    }
  }

  res.status(405).end()
}