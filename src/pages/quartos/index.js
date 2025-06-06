import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FaEdit, FaTrash } from 'react-icons/fa'

export default function Quartos() {
  const { data: session } = useSession()
  const router = useRouter()
  const [quartos, setQuartos] = useState([])
  const [numero, setNumero] = useState('')
  const [tipo, setTipo] = useState('')
  const [preco, setPreco] = useState('')
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    if (!session) {
      router.push('/')
      return
    }
    carregarQuartos()
  }, [session])

  useEffect(() => {
    if (erro || sucesso) {
      const timer = setTimeout(() => {
        setErro('')
        setSucesso('')
      }, 3000) // Limpa após 3 segundos
      return () => clearTimeout(timer)
    }
  }, [erro, sucesso])

  const carregarQuartos = async () => {
    const response = await fetch('/api/quartos')
    const data = await response.json()
    setQuartos(data)
  }

  const salvarQuarto = async () => {
    try {
      setErro('')
      setSucesso('')
      const method = editando ? 'PUT' : 'POST'
      const url = editando ? `/api/quartos` : '/api/quartos'
      const body = editando 
        ? { id: editando.id, numero, tipo, preco } 
        : { numero, tipo, preco }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar quarto')
      }

      setNumero('')
      setTipo('')
      setPreco('')
      setEditando(null)
      carregarQuartos()
      setSucesso('Quarto salvo com sucesso!')
    } catch (error) {
      setErro(error.message)
    }
  }

  const editarQuarto = (quarto) => {
    setNumero(quarto.numero)
    setTipo(quarto.tipo)
    setPreco(quarto.preco)
    setEditando(quarto)
    setErro('')
    setSucesso('')
  }

  const excluirQuarto = async (id) => {
    if (confirm('Tem certeza que deseja excluir este quarto?')) {
      try {
        setErro('')
        setSucesso('')
        await fetch('/api/quartos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        carregarQuartos()
        setSucesso('Quarto excluído com sucesso!')
      } catch (error) {
        setErro('Erro ao excluir quarto')
      }
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md py-12">
      <h1 className="text-2xl font-bold text-gray-800">Quartos</h1>
      
      {(erro || sucesso) && (
        <div className={`p-4 my-4 rounded-md ${erro ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {erro || sucesso}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Número</label>
            <input
              type="number"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <input
              type="text"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={salvarQuarto}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {editando ? 'Atualizar Quarto' : 'Adicionar Quarto'}
        </button>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Número</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Preço</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quartos.map((quarto) => (
              <tr key={quarto.id}>
                <td className="px-6 py-4 whitespace-nowrap">{quarto.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{quarto.numero}</td>
                <td className="px-6 py-4 whitespace-nowrap">{quarto.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{quarto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => editarQuarto(quarto)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Editar"
                  >
                    <FaEdit className="inline-block w-5 h-5" />
                  </button>
                  <button
                    onClick={() => excluirQuarto(quarto.id)}
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