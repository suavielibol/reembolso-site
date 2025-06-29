/**
 * Fallback global exibido enquanto segmentos que usam <Suspense>
 * (por exemplo, páginas que chamam useSearchParams) são carregados.
 * Mantenha-o simples para não impactar o TTFB.
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-facebook-gray-bg">
      <p className="text-sm text-facebook-gray-text">Carregando…</p>
    </div>
  )
}
