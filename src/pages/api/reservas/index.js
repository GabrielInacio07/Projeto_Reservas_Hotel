import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const reservas = await prisma.reserva.findMany({
      include: {
        cliente: true,
        quarto: true,
      },
      orderBy: {
        dataInicio: 'asc',
      },
    })
    return res.status(200).json(reservas)
  }

  if (req.method === 'POST') {
    const { clienteId, quartoId, dataInicio, dataFim } = req.body
    const inicio = new Date(dataInicio)
    const fim = new Date(dataFim)

    // Verificar conflitos de reserva
    const conflito = await prisma.reserva.findFirst({
      where: {
        quartoId: parseInt(quartoId),
        AND: [
          { dataInicio: { lt: fim } },
          { dataFim: { gt: inicio } },
        ],
      },
    })

    if (conflito) {
      return res.status(400).json({ error: 'Este quarto já está reservado neste período.' })
    }

    try {
      const reserva = await prisma.reserva.create({
        data: {
          clienteId: parseInt(clienteId),
          quartoId: parseInt(quartoId),
          dataInicio: inicio,
          dataFim: fim,
        },
        include: {
          cliente: true,
          quarto: true,
        },
      })
      return res.status(201).json(reserva)
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar reserva' })
    }
  }

  if (req.method === 'PUT') {
    const { id, clienteId, quartoId, dataInicio, dataFim } = req.body
    const inicio = new Date(dataInicio)
    const fim = new Date(dataFim)

    // Verificar conflitos de reserva (excluindo a própria reserva)
    const conflito = await prisma.reserva.findFirst({
      where: {
        quartoId: parseInt(quartoId),
        id: { not: parseInt(id) },
        AND: [
          { dataInicio: { lt: fim } },
          { dataFim: { gt: inicio } },
        ],
      },
    })

    if (conflito) {
      return res.status(400).json({ error: 'Este quarto já está reservado neste período.' })
    }

    try {
      const reserva = await prisma.reserva.update({
        where: { id: parseInt(id) },
        data: {
          clienteId: parseInt(clienteId),
          quartoId: parseInt(quartoId),
          dataInicio: inicio,
          dataFim: fim,
        },
        include: {
          cliente: true,
          quarto: true,
        },
      })
      return res.status(200).json(reserva)
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar reserva' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    try {
      await prisma.reserva.delete({
        where: { id: parseInt(id) },
      })
      return res.status(204).end()
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao excluir reserva' })
    }
  }

  res.status(405).end()
}