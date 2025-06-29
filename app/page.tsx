"use client"

import Link from "next/link"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AlertTriangleIcon, ChevronRightIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FacebookLogo } from "@/components/facebook-logo"

function HomePageContent() {
  const searchParams = useSearchParams()
  const queryParams = new URLSearchParams(searchParams.toString())
  const quizLink = `/quiz?${queryParams.toString()}`

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FacebookLogo className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-medium text-slate-800">Central de Ressarcimento</h1>
              <p className="text-xs text-slate-500">Verificação de Elegibilidade</p>
            </div>
          </div>
          <div className="bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-medium flex items-center gap-1">
            <AlertTriangleIcon className="h-3 w-3" />
            <span>Prazo: 24h</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Verificação de Direito à Compensação</h2>
          <p className="text-slate-600 leading-relaxed">
            Se você foi prejudicado por golpes, anúncios enganosos ou falhas de segurança no Facebook, pode ter direito
            a uma compensação financeira através do processo judicial nº 2024-7845.89.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
          <h3 className="font-medium text-slate-800 mb-3">Como funciona:</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p>1. Responda algumas perguntas sobre sua situação</p>
            <p>2. Sistema verifica sua elegibilidade</p>
            <p>3. Receba instruções para prosseguir</p>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md"
            asChild
          >
            <Link href={quizLink}>
              Verificar Meu Direito
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <p className="text-xs text-slate-500 mt-4">Processo gratuito • Dados protegidos pela LGPD</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} Central de Ressarcimento Judicial</p>
        </div>
      </footer>
    </div>
  )
}

export default function InitialPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  )
}
