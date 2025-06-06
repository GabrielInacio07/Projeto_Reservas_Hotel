import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const quartos = await prisma.quarto.findMany()
    return res.status(200).json(quartos)
  }

  if (req.method === 'POST') {
    const { numero, tipo, preco } = req.body
    try {
      const quarto = await prisma.quarto.create({
        data: { 
          numero: parseInt(numero),
          tipo,
          preco: parseFloat(preco),
        },
      })
      return res.status(201).json(quarto)
    } catch (error) {
      return res.status(400).json({ error: 'Número de quarto já existe' })
    }
  }

  if (req.method === 'PUT') {
    const { id, numero, tipo, preco } = req.body
    try {
      const quarto = await prisma.quarto.update({
        where: { id: parseInt(id) },
        data: { 
          numero: parseInt(numero),
          tipo,
          preco: parseFloat(preco),
        },
      })
      return res.status(200).json(quarto)
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar quarto' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    try {
      await prisma.quarto.delete({
        where: { id: parseInt(id) },
      })
      return res.status(204).end()
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao excluir quarto' })
    }
  }

  res.status(405).end()
}