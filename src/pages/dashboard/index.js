import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Carregando...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md py-12">
      <h1 className="text-2xl font-bold text-gray-800">Bem-vindo, {session.user.email}</h1>
      <p className="mt-2 text-gray-600">Painel de Gerenciamento do Hotel</p>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  )
}