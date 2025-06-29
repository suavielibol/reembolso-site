"use client"

import type React from "react"
import {
  FacebookIcon,
  SearchIcon,
  HomeIcon,
  UsersIcon,
  PlaySquareIcon,
  StoreIcon,
  Gamepad2Icon,
  MenuIcon,
  MegaphoneIcon,
} from "lucide-react"
import Link from "next/link"

export function FacebookLayout({
  children,
  hidePageSpecificBar = false,
  quizLink = "/quiz",
}: {
  children: React.ReactNode
  hidePageSpecificBar?: boolean
  quizLink?: string
}) {
  return (
    <div className="min-h-screen bg-facebook-gray-bg flex flex-col">
      {/* Facebook Top Navigation Bar */}
      <header className="bg-white shadow-md sticky top-0 z-50 h-[52px] sm:h-[56px] flex items-center px-2 sm:px-4">
        <div className="flex items-center">
          <Link href="/" aria-label="Página inicial do Facebook" className="flex items-center">
            <FacebookIcon className="h-9 w-9 sm:h-10 sm:w-10 text-facebook-blue" />
          </Link>
          <Link href={quizLink} className="ml-2 relative hidden sm:block group">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-facebook-gray-icon group-hover:text-facebook-blue" />
            <div className="bg-facebook-gray-bg rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-facebook-gray-text w-52 xl:w-60 cursor-pointer group-hover:bg-slate-200 transition-colors">
              Pesquisar no Facebook
            </div>
          </Link>
        </div>

        <nav className="flex-grow justify-center items-center hidden lg:flex space-x-1 xl:space-x-2">
          {[HomeIcon, UsersIcon, PlaySquareIcon, StoreIcon, Gamepad2Icon].map((Icon, idx) => (
            <button
              key={idx}
              className="p-2.5 sm:p-3 h-11 sm:h-12 w-14 sm:w-16 xl:w-24 hover:bg-facebook-gray-bg rounded-lg flex items-center justify-center group"
              aria-label={`Navegação ${idx + 1}`}
            >
              <Icon className="h-5 sm:h-6 xl:h-7 w-5 sm:w-6 xl:w-7 text-facebook-gray-icon group-hover:text-facebook-blue" />
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-1 sm:space-x-1.5 ml-auto">
          <Link
            href={quizLink}
            className="bg-facebook-gray-bg hover:bg-slate-300 rounded-full p-1.5 sm:p-2 flex items-center justify-center lg:hidden"
            aria-label="Pesquisar"
          >
            <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
          </Link>
          <Link
            href={quizLink}
            className="bg-facebook-gray-bg hover:bg-slate-300 rounded-full p-1.5 sm:p-2 flex items-center justify-center"
            aria-label="Menu"
          >
            <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
          </Link>
        </div>
      </header>

      {!hidePageSpecificBar && (
        <div className="bg-blue-700 text-white py-1.5 sm:py-2 shadow-md">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-left px-2 sm:px-3">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-0">
              <MegaphoneIcon className="h-4 w-4 sm:h-5 sm:w-6 text-blue-100" />
              <span className="font-semibold text-[0.7rem] sm:text-xs md:text-sm">
                Comunicado Oficial: Últimos dias para solicitar sua compensação.
              </span>
            </div>
            <span className="text-blue-200 text-[0.6rem] sm:text-[0.7rem] md:text-xs font-medium bg-blue-600 px-1.5 sm:px-2 py-0.5 rounded-md">
              Vagas limitadas pelo sistema.
            </span>
          </div>
        </div>
      )}

      <main className="flex-grow py-2.5 sm:py-3 md:py-4">{children}</main>

      {!hidePageSpecificBar && (
        <footer className="bg-facebook-gray-bg border-t border-facebook-gray-border text-facebook-gray-text py-3 text-[0.65rem] sm:text-xs">
          <div className="container mx-auto px-2 sm:px-3 text-center">
            <p>&copy; {new Date().getFullYear()} Meta Platforms, Inc. Todos os direitos reservados.</p>
            <p className="text-slate-500 text-[0.6rem] sm:text-[0.65rem] mt-0.5">
              Este portal é um canal informativo oficial referente ao programa de reembolso judicial.
            </p>
          </div>
        </footer>
      )}
    </div>
  )
}
