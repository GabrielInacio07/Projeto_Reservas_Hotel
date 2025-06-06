import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao cadastrar usuário')
      }

      // Após cadastro bem-sucedido, faz login automaticamente
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-hotel-beige py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl border border-hotel-gray animate-fade-in">
        <h2 className="text-4xl font-hotel text-hotel-blue text-center">Criar Conta no Hotel</h2>
        {error && <div className="p-4 text-red-700 bg-red-100 rounded-md animate-pulse">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-hotel-blue">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 mt-1 border border-hotel-gray rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-gold focus:border-hotel-gold transition duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-hotel-blue">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 mt-1 border border-hotel-gray rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-gold focus:border-hotel-gold transition duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-hotel-blue rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-hotel-gold focus:ring-offset-2 transition duration-300 animate-bounce-once"
            >
              Cadastrar
            </button>
            <p className="text-sm text-hotel-blue text-center mt-4">
              Já tem uma conta?{' '}
              <a href="/" className="font-medium text-hotel-gold hover:underline">
                Fazer login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}