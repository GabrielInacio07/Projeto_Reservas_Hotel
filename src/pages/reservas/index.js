import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FaEdit, FaTrash, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'

export default function Reservas() {
  const { data: session } = useSession()
  const router = useRouter()
  const [reservas, setReservas] = useState([])
  const [clientes, setClientes] = useState([])
  const [quartosDisponiveis, setQuartosDisponiveis] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [quartoId, setQuartoId] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/')
      return
    }
    carregarDados()
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

  const carregarDados = async () => {
    setCarregando(true)
    try {
      const [reservasRes, clientesRes] = await Promise.all([
        fetch('/api/reservas'),
        fetch('/api/clientes'),
      ])
      const [reservasData, clientesData] = await Promise.all([
        reservasRes.json(),
        clientesRes.json(),
      ])
      setReservas(reservasData)
      setClientes(clientesData)
    } catch (error) {
      setErro('Erro ao carregar dados')
    } finally {
      setCarregando(false)
    }
  }

  const buscarQuartosDisponiveis = async () => {
    if (!dataInicio || !dataFim) {
      setErro('Selecione as datas de check-in e check-out')
      return
    }
    try {
      setErro('')
      const response = await fetch(
        `/api/quartos/disponiveis?dataInicio=${dataInicio}&dataFim=${dataFim}`
      )
      const data = await response.json()
      setQuartosDisponiveis(data)
    } catch (error) {
      setErro('Erro ao buscar quartos disponíveis')
    }
  }

  const salvarReserva = async () => {
    try {
      setErro('')
      setSucesso('')
      const method = editando ? 'PUT' : 'POST'
      const url = editando ? `/api/reservas` : '/api/reservas'
      const body = editando
        ? {
            id: editando.id,
            clienteId,
            quartoId,
            dataInicio,
            dataFim,
          }
        : { clienteId, quartoId, dataInicio, dataFim }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar reserva')
      }

      setClienteId('')
      setQuartoId('')
      setDataInicio('')
      setDataFim('')
      setEditando(null)
      setQuartosDisponiveis([])
      carregarDados()
      setSucesso('Reserva salva com sucesso!')
    } catch (error) {
      setErro(error.message)
    }
  }

  const editarReserva = (reserva) => {
    setClienteId(reserva.clienteId)
    setQuartoId(reserva.quartoId)
    setDataInicio(reserva.dataInicio.split('T')[0])
    setDataFim(reserva.dataFim.split('T')[0])
    setEditando(reserva)
    setErro('')
    setSucesso('')
  }

  const excluirReserva = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta reserva?')) {
      try {
        setErro('')
        setSucesso('')
        await fetch('/api/reservas', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        carregarDados()
        setSucesso('Reserva excluída com sucesso!')
      } catch (error) {
        setErro('Erro ao excluir reserva')
      }
    }
  }

  const fazerCheckIn = async (id) => {
    try {
      setErro('')
      setSucesso('')
      await fetch('/api/reservas/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      carregarDados()
      setSucesso('Check-in realizado com sucesso!')
    } catch (error) {
      setErro('Erro ao fazer check-in')
    }
  }

  const fazerCheckOut = async (id) => {
    try {
      setErro('')
      setSucesso('')
      await fetch('/api/reservas/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      carregarDados()
      setSucesso('Check-out realizado com sucesso!')
    } catch (error) {
      setErro('Erro ao fazer check-out')
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md py-12">
      <h1 className="text-2xl font-bold text-gray-800">Reservas</h1>
      
      {(erro || sucesso) && (
        <div className={`p-4 my-4 rounded-md ${erro ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {erro || sucesso}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <select
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quarto</label>
            <select
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={quartoId}
              onChange={(e) => setQuartoId(e.target.value)}
              disabled={quartosDisponiveis.length === 0 && !editando}
            >
              <option value="">Selecione um quarto</option>
              {editando ? (
                <option value={editando.quarto.id}>
                  {editando.quarto.numero} ({editando.quarto.tipo})
                </option>
              ) : (
                quartosDisponiveis.map((quarto) => (
                  <option key={quarto.id} value={quarto.id}>
                    {quarto.numero} ({quarto.tipo})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Check-In</label>
            <input
              type="date"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              onBlur={buscarQuartosDisponiveis}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Check-Out</label>
            <input
              type="date"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              onBlur={buscarQuartosDisponiveis}
            />
          </div>
        </div>
        <button
          onClick={salvarReserva}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          disabled={!clienteId || !quartoId || !dataInicio || !dataFim}
        >
          {editando ? 'Atualizar Reserva' : 'Adicionar Reserva'}
        </button>
      </div>

      <div className="mt-8 overflow-x-auto">
        {carregando ? (
          <p>Carregando...</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Reserva</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.id}</td>
                  <td className="px-6 py-4">
                    {reserva.cliente.nome} reservou o quarto {reserva.quarto.numero} ({reserva.quarto.tipo}) de{' '}
                    {new Date(reserva.dataInicio).toLocaleDateString()} até{' '}
                    {new Date(reserva.dataFim).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      reserva.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                      reserva.status === 'Checked-In' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {reserva.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => editarReserva(reserva)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      <FaEdit className="inline-block w-5 h-5" />
                    </button>
                    <button
                      onClick={() => excluirReserva(reserva.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
                    >
                      <FaTrash className="inline-block w-5 h-5" />
                    </button>
                    {reserva.status === 'Pendente' && (
                      <button
                        onClick={() => fazerCheckIn(reserva.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Check-In"
                      >
                        <FaSignInAlt className="inline-block w-5 h-5" />
                      </button>
                    )}
                    {reserva.status === 'Checked-In' && (
                      <button
                        onClick={() => fazerCheckOut(reserva.id)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Check-Out"
                      >
                        <FaSignOutAlt className="inline-block w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}