import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' })
  }

  try {
    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar novo usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: { id: user.id, email: user.email } })
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao cadastrar usuário' })
  }
}