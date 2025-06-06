import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { id } = req.body

  try {
    const reserva = await prisma.reserva.update({
      where: { id: parseInt(id) },
      data: { status: 'Checked-Out' },
    })
    return res.status(200).json(reserva)
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao fazer check-out' })
  }
}