// "use client"

// import { useEffect, useState, Suspense } from "react"
// import { useSearchParams } from "next/navigation"
// import { FacebookIcon, ShieldCheck, Lock, Loader2, ExternalLink } from 'lucide-react'

// function cleanUtmSource(utmSource: string | null): string | null {
//  if (!utmSource) return null
//  const lowerUtmSource = utmSource.toLowerCase()
//  if (lowerUtmSource.startsWith("ig")) return "ig"
//  if (lowerUtmSource.startsWith("fb")) return "FB"
//  return utmSource
// }

// function RedirectPageContent() {
//  const searchParams = useSearchParams()
//  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
//  const [isIframeLoading, setIsIframeLoading] = useState(true)
//  const [errorLoadingEmbed, setErrorLoadingEmbed] = useState<string | null>(null)

//  const baseEmbedUrl = "https://chats-atendimento.com/facebook-ljs20am"

//  useEffect(() => {
//    if (!searchParams) {
//      console.warn("RedirectPageContent: searchParams ainda não disponíveis.")
//      return
//    }
//    console.log("RedirectPageContent: searchParams disponíveis:", searchParams.toString())
//    try {
//      const mutableParams = new URLSearchParams(searchParams.toString())
//      const utmSource = mutableParams.get("utm_source")
//      const cleanedUtmSource = cleanUtmSource(utmSource)
//      if (cleanedUtmSource) {
//        mutableParams.set("utm_source", cleanedUtmSource)
//      }
//      const finalUrl = new URL(baseEmbedUrl)
//      mutableParams.forEach((value, key) => {
//        finalUrl.searchParams.append(key, value)
//      })
//      setEmbedUrl(finalUrl.toString())
//      setIsIframeLoading(true)
//      setErrorLoadingEmbed(null)
//      console.log("Final Embed URL com cleaned utm_source:", finalUrl.toString())
//    } catch (error) {
//      console.error("Erro ao construir a URL do embed:", error)
//      setErrorLoadingEmbed("Ocorreu um erro ao preparar o seu acesso. Tente recarregar a página.")
//      setEmbedUrl(null)
//    }
//  }, [searchParams])

//  if (errorLoadingEmbed) {
//    return (
//      <div className="min-h-screen font-sans text-foreground bg-facebook-gray-bg flex flex-col items-center justify-center p-4 text-center">
//        <FacebookIcon className="h-16 w-16 text-facebook-blue mb-6" />
//        <h1 className="text-2xl font-bold text-red-600 mb-3">Erro ao Carregar</h1>
//        <p className="text-md text-facebook-gray-text mb-6 max-w-md">{errorLoadingEmbed}</p>
//        <p className="text-sm text-facebook-gray-text">Se o problema persistir, entre em contato com o suporte.</p>
//      </div>
//    )
//  }

//  if (!embedUrl) {
//    return (
//      <div className="min-h-screen font-sans text-foreground bg-facebook-gray-bg flex flex-col items-center justify-center p-4">
//        <Loader2 className="h-12 w-12 text-facebook-blue animate-spin" />
//        <p className="mt-4 text-lg text-facebook-gray-text">Preparando seu acesso seguro...</p>
//      </div>
//    )
//  }

//  return (
//    <div className="min-h-screen font-sans text-foreground bg-facebook-gray-bg flex flex-col">
//      {/* Header e Footer podem ser mantidos ou removidos conforme a necessidade de branding na página de embed */}
//      <main className="flex-grow flex flex-col items-center justify-start">
//        <div className="w-full flex-grow relative">
//          {isIframeLoading && embedUrl && (
//            <div className="absolute inset-0 flex flex-col items-center justify-center bg-facebook-gray-bg z-10">
//              <Loader2 className="h-10 w-10 text-facebook-blue animate-spin" />
//              <p className="mt-3 text-md text-facebook-gray-text">Carregando seu portal seguro...</p>
//              <p className="mt-1 text-xs text-facebook-gray-text">(Isso pode levar alguns segundos)</p>
//            </div>
//          )}
//          <iframe
//            src={embedUrl}
//            title="Portal Seguro de Verificação"
//            className={`w-full h-full flex-grow border-0 transition-opacity duration-300 ${isIframeLoading ? "opacity-0" : "opacity-100"}`}
//            onLoad={() => setIsIframeLoading(false)}
//            onError={() => {
//              setIsIframeLoading(false)
//              setErrorLoadingEmbed(
//                "Não foi possível carregar o conteúdo do portal. Verifique sua conexão ou tente novamente mais tarde.",
//              )
//            }}
//            allowFullScreen
//            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
//          >
//            <p className="p-4 text-center text-facebook-gray-text">
//              Seu navegador não suporta iframes ou o conteúdo não pôde ser carregado.
//              <a
//                href={embedUrl}
//                target="_blank"
//                rel="noopener noreferrer"
//                className="text-facebook-blue hover:underline ml-1 inline-flex items-center"
//              >
//                Acessar diretamente <ExternalLink className="h-3 w-3 ml-1" />
//              </a>
//            </p>
//          </iframe>
//        </div>
//      </main>
//    </div>
//  )
// }

// export default function RedirectPage() {
//  return (
//    <Suspense
//      fallback={
//        <div className="min-h-screen font-sans text-foreground bg-facebook-gray-bg flex flex-col items-center justify-center p-4">
//          <Loader2 className="h-12 w-12 text-facebook-blue animate-spin" />
//          <p className="mt-4 text-lg text-facebook-gray-text">Inicializando...</p>
//        </div>
//      }
//    >
//      <RedirectPageContent />
//    </Suspense>
//  )
// }

// Página desativada. O redirecionamento agora é direto do quiz para a URL do embed.
export default function RedirectPageDisabled() {
  return null
}
