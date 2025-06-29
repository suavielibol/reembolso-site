"use client"

import { useEffect } from "react"
// Certifique-se que o caminho para tracking-logic.js está correto.
// Se 'lib' está na raiz do projeto (ao lado de 'app' e 'components'), este caminho está correto.
import { initializeTracking } from "@/lib/tracking-logic"

export function TrackingInitializer() {
  useEffect(() => {
    console.log("TrackingInitializer: Component mounted. Attempting to initialize tracking...")
    initializeTracking()
      .then(() => {
        console.log("TrackingInitializer: initializeTracking promise resolved successfully.")
      })
      .catch((error) => {
        console.error("TrackingInitializer: Error caught during initializeTracking execution:", error)
      })
  }, []) // Executa uma vez após a montagem do componente

  return null // Este componente não renderiza nada visualmente
}
