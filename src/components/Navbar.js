import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'

export default function Navbar() {
  const router = useRouter()

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/clientes', label: 'Clientes' },
    { href: '/quartos', label: 'Quartos' },
    { href: '/reservas', label: 'Reservas' },
    { href: '/register', label: 'Cadastrar' }
  ]

  return (
    <nav className="bg-gradient-to-r from-hotel-blue to-blue-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-hotel text-hotel-gold">Hotel Management</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    router.pathname === link.href
                      ? 'border-hotel-gold text-white'
                      : 'border-transparent text-gray-200 hover:border-hotel-gold hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-300`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={() => signOut()}
              className="px-3 py-2 text-sm font-medium text-gray-200 hover:text-hotel-gold transition duration-300"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}