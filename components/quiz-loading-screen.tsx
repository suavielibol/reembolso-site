"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Loader2, ShieldCheck, UserCheck, MessageSquareText, CheckCircle2 } from "lucide-react"

// Initial steps before showing the attendant screen
const initialLoadingSteps = [
  { text: "Analisando suas respostas...", icon: MessageSquareText, duration: 1500 },
  { text: "Verificando elegibilidade no sistema...", icon: UserCheck, duration: 2000 },
  { text: "Cruzando informações com o processo...", icon: ShieldCheck, duration: 1500 },
]

export function QuizLoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [initialProgress, setInitialProgress] = useState(0)
  const [showAttendantInfo, setShowAttendantInfo] = useState(false)
  const [chatConnectProgress, setChatConnectProgress] = useState(0)

  const protocolId = useMemo(() => `FB-${Math.floor(100000 + Math.random() * 900000)}`, [])

  // Effect for initial loading steps
  useEffect(() => {
    if (currentStepIndex < initialLoadingSteps.length) {
      const stepDuration = initialLoadingSteps[currentStepIndex].duration
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1)
        setInitialProgress(0)
      }, stepDuration)

      let progressInterval: NodeJS.Timeout | undefined
      if (stepDuration > 0) {
        const increment = 100 / (stepDuration / 100)
        progressInterval = setInterval(() => {
          setInitialProgress((prev) => Math.min(prev + increment, 100))
        }, 100)
      }
      return () => {
        clearTimeout(timer)
        if (progressInterval) clearInterval(progressInterval)
      }
    } else if (!showAttendantInfo) {
      setShowAttendantInfo(true) // Transition to attendant info screen
    }
  }, [currentStepIndex, showAttendantInfo])

  // Effect for the 8-second attendant screen
  useEffect(() => {
    if (showAttendantInfo) {
      const chatConnectDuration = 8000 // 8 seconds
      let progressInterval: NodeJS.Timeout | undefined

      const startTime = Date.now()

      progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime
        const progress = Math.min((elapsedTime / chatConnectDuration) * 100, 100)
        setChatConnectProgress(progress)

        if (elapsedTime >= chatConnectDuration) {
          if (progressInterval) clearInterval(progressInterval)
          onLoadingComplete()
        }
      }, 100)

      return () => {
        if (progressInterval) clearInterval(progressInterval)
      }
    }
  }, [showAttendantInfo, onLoadingComplete])

  // Render Attendant Screen
  if (showAttendantInfo) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <Image
                src="/images/robo-atendente.png" // CAMINHO DA NOVA IMAGEM
                alt="Assistente Virtual"
                width={80}
                height={80}
                className="rounded-full border-2 border-white shadow-md object-cover" // Adicionado object-cover para melhor ajuste
              />
              <div className="absolute bottom-0 right-0 flex items-center space-x-1 bg-green-500 text-white text-[0.55rem] px-1.5 py-0.5 rounded-full border border-white">
                <CheckCircle2 className="h-2 w-2" />
                <span>Online</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 text-left">Assistente disponível:</p>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-left">IA Assistant</h1>
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm mb-4 w-full">
            <span className="font-semibold text-slate-600">Protocolo:</span>
            <span className="font-mono text-facebook-blue ml-2">{protocolId}</span>
          </div>

          <div className="w-full mt-2">
            <p className="text-sm font-medium text-facebook-blue mb-1.5">Conectando ao chat seguro...</p>
            <div className="w-full bg-slate-200 rounded-full h-2.5 sm:h-3 mb-1 overflow-hidden">
              <div
                className="bg-facebook-blue h-full rounded-full transition-width duration-100 ease-linear"
                style={{ width: `${chatConnectProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500">{Math.round(chatConnectProgress)}%</p>
          </div>
        </div>
      </div>
    )
  }

  // Render Initial Loading Steps
  const currentStep = initialLoadingSteps[currentStepIndex]
  const ActiveIcon = currentStep?.icon || Loader2

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-facebook-gray-bg p-3 sm:p-4 text-center">
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <ActiveIcon className="h-10 w-10 sm:h-12 sm:h-12 md:h-14 md:w-14 mx-auto mb-4 sm:mb-5 md:mb-6 text-facebook-blue animate-pulse" />
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
          {currentStep?.text || "Carregando..."}
        </h1>
        <p className="text-xs sm:text-sm text-facebook-gray-text mb-4 sm:mb-6">
          Por favor, aguarde. Estamos preparando tudo para você.
        </p>
        <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5 md:h-3 mb-1.5 sm:mb-2 overflow-hidden">
          <div
            className="bg-facebook-blue h-full rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${initialProgress}%` }}
          ></div>
        </div>
        <p className="text-[0.65rem] sm:text-xs text-slate-500">
          Passo {Math.min(currentStepIndex + 1, initialLoadingSteps.length)} de {initialLoadingSteps.length}
        </p>
      </div>
      <p className="text-[0.65rem] sm:text-xs text-facebook-gray-text mt-6 sm:mt-8">
        Você está em um ambiente seguro. Seus dados estão protegidos.
      </p>
    </div>
  )
}
