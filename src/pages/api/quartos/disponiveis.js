import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { dataInicio, dataFim } = req.query

  if (!dataInicio || !dataFim) {
    return res.status(400).json({ error: 'Datas de início e fim são obrigatórias' })
  }

  try {
    const quartosOcupados = await prisma.reserva.findMany({
      where: {
        AND: [
          { dataInicio: { lt: new Date(dataFim) } },
          { dataFim: { gt: new Date(dataInicio) } },
        ],
      },
      select: { quartoId: true },
    })

    const idsQuartosOcupados = quartosOcupados.map(r => r.quartoId)

    const quartosDisponiveis = await prisma.quarto.findMany({
      where: {
        id: { notIn: idsQuartosOcupados },
      },
    })

    return res.status(200).json(quartosDisponiveis)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar quartos disponíveis' })
  }
}