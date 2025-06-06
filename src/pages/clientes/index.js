import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FaEdit, FaTrash } from 'react-icons/fa'

export default function Clientes() {
  const { data: session } = useSession()
  const router = useRouter()
  const [clientes, setClientes] = useState([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    if (!session) {
      router.push('/')
      return
    }
    carregarClientes()
  }, [session])

  useEffect(() => {
    if (erro || sucesso) {
      const timer = setTimeout(() => {
        setErro('')
        setSucesso('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [erro, sucesso])

  const carregarClientes = async () => {
    const response = await fetch('/api/clientes')
    const data = await response.json()
    setClientes(data)
  }

  const salvarCliente = async () => {
    try {
      setErro('')
      setSucesso('')
      const method = editando ? 'PUT' : 'POST'
      const url = editando ? `/api/clientes` : '/api/clientes'
      const body = editando 
        ? { id: editando.id, nome, email } 
        : { nome, email }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar cliente')
      }

      setNome('')
      setEmail('')
      setEditando(null)
      carregarClientes()
      setSucesso('Cliente salvo com sucesso!')
    } catch (error) {
      setErro(error.message)
    }
  }

  const editarCliente = (cliente) => {
    setNome(cliente.nome)
    setEmail(cliente.email)
    setEditando(cliente)
    setErro('')
    setSucesso('')
  }

  const excluirCliente = async (id) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        setErro('')
        setSucesso('')
        await fetch('/api/clientes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        carregarClientes()
        setSucesso('Cliente excluído com sucesso!')
      } catch (error) {
        setErro('Erro ao excluir cliente')
      }
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md py-12">
      <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
      
      {(erro || sucesso) && (
        <div className={`p-4 my-4 rounded-md ${erro ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {erro || sucesso}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={salvarCliente}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {editando ? 'Atualizar Cliente' : 'Adicionar Cliente'}
        </button>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.email}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => editarCliente(cliente)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Editar"
                  >
                    <FaEdit className="inline-block w-5 h-5" />
                  </button>
                  <button
                    onClick={() => excluirCliente(cliente.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Excluir"
                  >
                    <FaTrash className="inline-block w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}