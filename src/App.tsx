import React, { useState, useRef } from "react"
import classes from "./App.module.sass"
import { Main } from "./containers/Main/Main"
import { ExchangeScreen } from "./containers/ExchangeScreen/ExchangeScreen"
import { PrintScreen } from "./containers/PrintScreen/PrintScreen"
import { InfoScreen } from "./containers/InfoScreen/InfoScreen"
import useInterval from "@use-it/interval"
import { getStatus, resetPayment } from "./api/jsonRpc"
import { parseHardwareStatus } from "./helpers/parseHardwareStatus"
import { idleTime, webSocketPort } from "./helpers/config"

const socketUrl =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? `ws://192.168.10.146:${webSocketPort}`
    : `ws://${window.location.hostname}:${webSocketPort}`

const socket = new WebSocket(socketUrl)
// const socket = new WebSocket(`ws://192.168.10.146:${webSocketPort}`)
// const socket = new WebSocket(`ws://${window.location.hostname}:${webSocketPort}`)

socket.onopen = () => {
  console.log("connected ")
}
socket.onerror = (err) => {
  console.log("socket error: ", err)
}
socket.onmessage = (msg) => {
  console.log("message: ", msg)
}
socket.addEventListener("message", function (event) {
  console.log("Message from server ", event.data)
})

function App() {
  const [currentScreen, setCurrentScreen] = useState("info")
  const [startCounter, setStartCounter] = useState(0)
  const [delay, setDelay] = useState<number | null>(null)
  const [hwStatusDelay, setHwStatusDelay] = useState<number | null>(0)
  const [idleExchangeScreen, setIdleExchangeScreen] = useState(false)
  const [infoScreenData, setInfoScreenData] = useState({
    isLoading: true,
    header: "Подготовка оборудования",
  })
  const [hardwareStatus, setHardwareStatus] = useState({
    fiscal: false,
    cash: false,
  })

  const idleCounter = useRef(0)

  useInterval(async () => {
    setHwStatusDelay(30 * 1000)
    try {
      const result = await getStatus()
      const { fiscal, cash } = parseHardwareStatus(result)
      if (hardwareStatus.fiscal !== fiscal || hardwareStatus.cash !== cash)
        setHardwareStatus({ fiscal, cash })
      if (currentScreen !== "info") return
      if (cash || fiscal) {
        await resetPayment()
        setCurrentScreen("main")
      } else {
        setInfoScreenData({
          isLoading: false,
          header: "Терминал времмено не работает",
        })
      }
    } catch (error) {
      if (startCounter !== 4) {
        setStartCounter((count) => count + 1)
      } else {
        setInfoScreenData({
          isLoading: false,
          header: "Терминал времмено не работает",
        })
      }
      console.error(error)
    }
  }, hwStatusDelay)

  useInterval(() => {
    idleCounter.current = idleCounter.current + 1
    if (idleCounter.current !== idleTime) return
    if (currentScreen !== "exchange") return setCurrentScreen("main")
    setIdleExchangeScreen(true)
  }, delay)

  const navigate = (route: string): void => {
    setCurrentScreen(route)
  }
  const updateIdle = () => {
    idleCounter.current = 0
  }

  return (
    <div className={classes.App} onClick={updateIdle}>
      {currentScreen === "info" && (
        <InfoScreen
          isLoading={infoScreenData.isLoading}
          header={infoScreenData.header}
        />
      )}
      {currentScreen === "main" && (
        <Main
          onPressHandler={navigate}
          setDelay={setDelay}
          hardwareStatus={hardwareStatus}
          setIdleExchangeScreen={setIdleExchangeScreen}
        />
      )}
      {currentScreen === "exchange" && (
        <ExchangeScreen
          onPressHandler={navigate}
          setDelay={setDelay}
          cashStatus={hardwareStatus.cash}
          idle={idleExchangeScreen}
        />
      )}
      {currentScreen === "print" && (
        <PrintScreen
          onPressHandler={navigate}
          setDelay={setDelay}
          fiscalStatus={hardwareStatus.fiscal}
        />
      )}
    </div>
  )
}

export default App
