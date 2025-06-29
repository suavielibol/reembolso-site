// ==================================================
// CONFIGURAÇÕES:
// ==================================================
const config = {
  useInstantPixel: false,
  productName: "37930",
  productID: "",
  apiURL: "https://api.hot-news-ofc.shop",
  siteDomain: "consulta.hot-news-ofc.shop",
  origin: "utm_source",
}
const pageRules = []
const forms = {
  email: ["email", "form_fields[email]"],
  phone: ["tel", "telefone", "phone", "form_fields[phone]"],
  firstName: ["nome", "name", "form_fields[name]", "form_fields[firstname]"],
  lastName: ["sobrenome", "lastname", "form_fields[lastname]"],
}
// ==================================================

function getCookie(name) {
  if (typeof document === "undefined") return null
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=")
    if (key === name) return value
  }
  return null
}

function getLongExpires() {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 100)
  return `expires=${date.toUTCString()}; path=/`
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

let userData = {} // Definido no escopo do módulo para ser acessível por todas as funções
let userId, fbc, fbp, fn, ln, em, ph // Variáveis de usuário no escopo do módulo

async function sendEvent(eventType, data = {}) {
  // ----------- NOVO BLOCO --------------
  // Evita chamadas para a API em ambientes de preview (v0.dev / vercel.app / localhost)
  function shouldSkipApiCalls() {
    if (typeof window === "undefined") return false
    const host = window.location.hostname
    return host === "localhost" || host.endsWith(".vercel.app") || host.includes("v0.dev")
  }
  if (shouldSkipApiCalls()) {
    console.warn(`TrackingLogic: API calls skipped in preview/local environment for event ${eventType}.`)
    // Para o Init precisamos devolver um objeto vazio para não interromper a inicialização
    return eventType === "Init" ? {} : undefined
  }
  // ----------- FIM DO NOVO BLOCO --------------
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.log(`TrackingLogic: sendEvent(${eventType}) skipped (no window/document).`)
    return eventType === "Init" ? { error: true, reason: "no window/document" } : undefined
  }

  const contentName = config.productName
  const contentId = config.productID
  const eventId = generateUUID()

  const customEvents = [
    "Scroll_25",
    "Scroll_50",
    "Scroll_75",
    "Scroll_90",
    "Timer_1min",
    "PlayVideo",
    "ViewVideo_25",
    "ViewVideo_50",
    "ViewVideo_75",
    "ViewVideo_90",
  ]
  const specialEvents = ["AddToCart", "Lead", "InitiateCheckout", "Purchase"]

  if (specialEvents.includes(eventType)) updateUserDataFromForm()

  const _customData = {
    content_name: contentName,
    content_ids: contentId,
    content_type: "product",
    ...(specialEvents.includes(eventType) &&
      data.value !== undefined && {
        value: data.value,
        currency: data.currency || "BRL",
      }),
  }

  const _userData = { eventID: eventId, ...userData }

  if (window.fbq) {
    if (eventType !== "Init" && eventType !== "UpdateUserData" && !customEvents.includes(eventType)) {
      window.fbq("track", eventType, _customData, _userData)
    } else if (eventType !== "Init" && eventType !== "UpdateUserData") {
      window.fbq("trackCustom", eventType, _customData, _userData)
    }
  }

  try {
    const URL = window.location.href
    const payload = {
      userId: getCookie("userId"), // Garante que está pegando o userId atual dos cookies
      contentName,
      contentId,
      eventType,
      eventId,
      URL,
      price: data.value || null,
      currency: data.currency || "BRL",
      fbc: userData.fbc || getCookie("_fbc") || null,
      fbp: userData.fbp || getCookie("_fbp") || null,
      fn: userData.fn || getCookie("fn") || null,
      ln: userData.ln || getCookie("ln") || null,
      em: userData.em || getCookie("em") || null,
      ph: userData.ph || getCookie("ph") || null,
    }
    console.log(`TrackingLogic: Sending event ${eventType} to ${config.apiURL}/events/send`, payload)
    const response = await fetch(config.apiURL + "/events/send", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    console.log(`TrackingLogic: Response status for ${eventType}: ${response.status}`)
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`TrackingLogic: API error for ${eventType}: ${response.status}`, errorText)
      if (eventType === "Init") return { error: true, status: response.status, message: errorText }
      return // Não retorna nada para outros eventos em caso de erro de API
    }

    if (eventType === "Init") {
      const responseData = await response.json()
      console.log("TrackingLogic: Init event responseData:", responseData)
      return responseData
    }
  } catch (e) {
    console.error(`TrackingLogic: Fetch error during sendEvent(${eventType}):`, e)
    if (eventType === "Init") return { error: true, exception: e.message, reason: "fetch_exception" }
    // Não retorna nada para outros eventos em caso de exceção no fetch
  }
}

function sendEventsByURLMatch() {
  if (typeof window === "undefined") return
  const url = window.location.href.toLowerCase()
  const hostname = window.location.hostname.toLowerCase()

  pageRules.forEach((rule) => {
    if (!rule.page || !rule.event) return
    if (url.includes(rule.page) || hostname.includes(rule.page)) {
      const eventData = {}
      if (rule.value !== undefined) {
        eventData.value = Number.parseFloat(rule.value).toFixed(2)
        eventData.currency = rule.currency || "BRL"
      }
      sendEvent(rule.event, eventData)
    }
  })
}

function updateUserDataFromForm() {
  if (typeof document === "undefined") return
  let currentFn, currentLn, currentEm, currentPh // Use nomes diferentes para evitar sombreamento
  const inputs = document.querySelectorAll("input, textarea")

  inputs.forEach((input) => {
    const nameAttr = input.name?.toLowerCase()
    const value = input.value?.trim()
    if (!value || !nameAttr) return

    if (!currentEm && forms.email.some((attr) => nameAttr.includes(attr))) {
      currentEm = value.toLowerCase()
    } else if (!currentPh && forms.phone.some((attr) => nameAttr.includes(attr))) {
      currentPh = value.replace(/\s|-/g, "")
    } else if (!currentFn && forms.firstName.some((attr) => nameAttr.includes(attr))) {
      const nameParts = value.toLowerCase().split(" ")
      currentFn = nameParts[0]
      if (!currentLn && nameParts.length > 1) currentLn = nameParts[nameParts.length - 1]
    } else if (!currentLn && forms.lastName.some((attr) => nameAttr.includes(attr))) {
      currentLn = value.toLowerCase()
    }
  })

  const expires = getLongExpires()
  if (currentFn) {
    document.cookie = "fn=" + currentFn + "; " + expires
    fn = currentFn
  }
  if (currentLn) {
    document.cookie = "ln=" + currentLn + "; " + expires
    ln = currentLn
  }
  if (currentEm) {
    document.cookie = "em=" + currentEm + "; " + expires
    em = currentEm
  }
  if (currentPh) {
    document.cookie = "ph=" + currentPh + "; " + expires
    ph = currentPh
  }

  userData = {
    // Atualiza o userData global
    ...userData,
    ...(fn && { fn }),
    ...(ln && { ln }),
    ...(em && { em }),
    ...(ph && { ph }),
  }
}

async function instantPixel() {
  if (typeof window === "undefined" || typeof document === "undefined") return
  console.log("TrackingLogic: instantPixel called")
  const urlParams = new URLSearchParams(window.location.search)
  const hasFbclid = urlParams.has("fbclid")

  sendEvent("PageView")
  sendEventsByURLMatch()

  const currentFbc = getCookie("_fbc")
  const currentFbp = getCookie("_fbp")
  userData = { ...userData, ...(currentFbc && { fbc: currentFbc }), ...(currentFbp && { fbp: currentFbp }) }

  if (!hasFbclid) {
    await sendEvent("UpdateUserData")
    return
  }

  // Se fbclid está presente, esperamos um pouco pelos cookies _fbc e _fbp serem setados pelo script do FB
  let waited = 0
  const checkInterval = 100
  const maxWaitTime = 5000 // Espera até 5 segundos

  const interval = setInterval(async () => {
    const fbcFromCookie = getCookie("_fbc")
    const fbpFromCookie = getCookie("_fbp")

    if (fbcFromCookie && fbcFromCookie.trim() !== "" && fbpFromCookie && fbpFromCookie.trim() !== "") {
      clearInterval(interval)
      userData = { ...userData, fbc: fbcFromCookie, fbp: fbpFromCookie }
      console.log("TrackingLogic: _fbc and _fbp found after fbclid.", userData)
      await sendEvent("UpdateUserData")
    } else {
      waited += checkInterval
      if (waited >= maxWaitTime) {
        clearInterval(interval)
        console.warn("TrackingLogic: _fbc and _fbp not found within expected time after fbclid.")
        // Envia UpdateUserData mesmo assim, com o que tiver
        await sendEvent("UpdateUserData")
      }
    }
  }, checkInterval)
}

async function waitForCookiesAndSendEvent() {
  if (typeof window === "undefined" || typeof document === "undefined") return
  console.log("TrackingLogic: waitForCookiesAndSendEvent called")
  const urlParams = new URLSearchParams(window.location.search)
  const hasFbclid = urlParams.has("fbclid")

  if (window.fbq) {
    window.fbq("trackCustom", "createCookies")
  }

  const currentFbc = getCookie("_fbc")
  const currentFbp = getCookie("_fbp")
  userData = { ...userData, ...(currentFbc && { fbc: currentFbc }), ...(currentFbp && { fbp: currentFbp }) }

  if (!hasFbclid) {
    await sendEvent("PageView")
    sendEventsByURLMatch()
    return
  }

  // Se fbclid está presente, esperamos um pouco pelos cookies _fbc e _fbp
  let waited = 0
  const checkInterval = 100
  const maxWaitTime = 5000

  const interval = setInterval(async () => {
    const fbcFromCookie = getCookie("_fbc")
    const fbpFromCookie = getCookie("_fbp")

    if (fbcFromCookie && fbcFromCookie.trim() !== "" && fbpFromCookie && fbpFromCookie.trim() !== "") {
      clearInterval(interval)
      userData = { ...userData, fbc: fbcFromCookie, fbp: fbpFromCookie }
      console.log("TrackingLogic: _fbc and _fbp found after fbclid (waitForCookies).", userData)
      await sendEvent("PageView")
      sendEventsByURLMatch()
    } else {
      waited += checkInterval
      if (waited >= maxWaitTime) {
        clearInterval(interval)
        console.warn("TrackingLogic: _fbc and _fbp not found (waitForCookies).")
        await sendEvent("PageView") // Envia PageView mesmo assim
        sendEventsByURLMatch()
      }
    }
  }, checkInterval)
}

export async function initializeTracking() {
  console.log("TrackingLogic: initializeTracking called.")
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.log("TrackingLogic: Initialization skipped (server-side or no document/window).")
    return
  }

  // Inicializa variáveis de usuário globais do módulo
  userId = getCookie("userId")
  fbc = getCookie("_fbc")
  fbp = getCookie("_fbp")
  fn = getCookie("fn")
  ln = getCookie("ln")
  em = getCookie("em")
  ph = getCookie("ph")

  if (!userId) {
    userId = generateUUID()
    const date = new Date()
    date.setFullYear(date.getFullYear() + 100)
    document.cookie = `userId=${userId}; expires=${date.toUTCString()}; path=/`
    console.log("TrackingLogic: New userId generated:", userId)
  } else {
    console.log("TrackingLogic: Existing userId found:", userId)
  }

  console.log("TrackingLogic: Attempting to send Init event.")
  const initData = (await sendEvent("Init")) || {} // Garante que initData seja um objeto
  console.log("TrackingLogic: Data from Init event:", initData)

  if (initData.error) {
    console.error(
      "TrackingLogic: Failed to initialize due to Init event error. Tracking might be incomplete.",
      initData,
    )
    // Considerar se deve parar aqui ou continuar com dados parciais
  }

  // Atualiza o userData global com dados do Init e cookies
  userData = {
    ...(initData.ct && { ct: initData.ct }),
    ...(initData.st && { st: initData.st }),
    ...(initData.zp && { zp: initData.zp }),
    ...(initData.country && { country: initData.country }),
    ...(initData.client_ip_address && { client_ip_address: initData.client_ip_address }),
    ...(initData.client_user_agent && { client_user_agent: initData.client_user_agent }),
    ...(initData.fbc || fbc ? { fbc: initData.fbc || fbc } : {}),
    ...(initData.fbp || fbp ? { fbp: initData.fbp || fbp } : {}),
    ...(userId && { external_id: userId }),
    ...(fn && { fn }),
    ...(ln && { ln }),
    ...(em && { em }),
    ...(ph && { ph }),
  }
  console.log("TrackingLogic: userData after Init and cookies:", userData)
  // Load Facebook Pixel
  ;((f, b, e, v, n, t, s) => {
    if (f.fbq) {
      console.log("TrackingLogic: FB Pixel already loaded.")
      return
    }
    n = f.fbq = () => {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = "2.0"
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    if (s && s.parentNode) {
      s.parentNode.insertBefore(t, s)
    } else {
      console.warn("TrackingLogic: Could not find a script tag to insert FB Pixel before. Appending to head.")
      b.head.appendChild(t) // Fallback
    }
    console.log("TrackingLogic: FB Pixel script added to page.")
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js")

  if (window.fbq) {
    console.log("TrackingLogic: Initializing FB Pixel with ID 1880002242585985 and userData:", userData)
    window.fbq("init", "1880002242585985", userData) // Use your Pixel ID
  } else {
    console.error("TrackingLogic: window.fbq not available after loading script.")
  }

  if (config.useInstantPixel) {
    instantPixel()
  } else {
    waitForCookiesAndSendEvent()
  }

  document.addEventListener("DOMContentLoaded", () => {
    console.log("TrackingLogic: DOMContentLoaded event fired.")
    const currentUserIdForLinks = getCookie("userId") // Pega o userId mais recente
    if (!currentUserIdForLinks) {
      console.warn("TrackingLogic: No userId found for link modification on DOMContentLoaded.")
      return
    }

    document.querySelectorAll("a[href]").forEach((link) => {
      try {
        const url = new URL(link.href, window.location.origin)
        const params = url.searchParams
        if (!params.has(config.origin) || params.get(config.origin) !== currentUserIdForLinks) {
          params.set(config.origin, currentUserIdForLinks)
          url.search = params.toString()
          link.href = url.toString()
          // console.log("TrackingLogic: Modified link:", link.href);
        }
      } catch (e) {
        // console.warn('TrackingLogic: Link ignored (error constructing URL or other):', link.href, e);
      }
    })
  })
  console.log("TrackingLogic: initializeTracking finished.")
}
