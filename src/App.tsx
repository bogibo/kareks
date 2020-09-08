import React, { useState, useEffect } from "react"
import classes from "./App.module.sass"
import { Main } from "./containers/Main/Main"
import { ExchangeScreen } from "./containers/ExchangeScreen/ExchangeScreen"
import { PrintScreen } from "./containers/PrintScreen/PrintScreen"
import { InfoScreen } from "./containers/InfoScreen/InfoScreen"
import useInterval from "@use-it/interval"
import { getStatus } from "./api/jsonRpc"
import { parseHardwareStatus } from "./helpers/parseHardwareStatus"

function App() {
  const [currentScreen, setCurrentScreen] = useState("info")
  const [idleCounter, setIdleCounter] = useState(0)
  const [delay, setDelay] = useState<number | null>(null)
  const [hwStatusDelay, setHwStatusDelay] = useState(0)
  const [infoScreenData, setInfoScreenData] = useState({
    isLoading: true,
    header: "Подготовка оборудования",
  })
  const [hardwareStatus, setHardwareStatus] = useState({
    fiscal: false,
    cash: false,
  })

  // useEffect(() => {
  //   const statusRequest = async () => {
  //     try {
  //       const result = await getStatus()
  //       console.log("result: ", result)
  //       const { fiscal, cash } = parseHardwareStatus(result)
  //       setHardwareStatus({ fiscal, cash })
  //       if (cash || fiscal) {
  //         setCurrentScreen("main")
  //       } else {
  //         setInfoScreenData({
  //           isLoading: false,
  //           header: "Терминал времмено не работает",
  //         })
  //       }
  //     } catch (error) {
  //       //заглушка
  //       setTimeout(() => {
  //         setInfoScreenData({
  //           isLoading: false,
  //           header: "Терминал времмено не работает",
  //         })
  //       }, 2000)
  //       console.error(error)
  //     }
  //   }
  //   statusRequest()
  // }, [])

  useInterval(async() => {
    setHwStatusDelay(30 * 1000)
    try {
      const result = await getStatus()
      console.log("result: ", result)
      const { fiscal, cash } = parseHardwareStatus(result)
      setHardwareStatus({ fiscal, cash })
      if (cash || fiscal) {
        setCurrentScreen("main")
      } else {
        setInfoScreenData({
          isLoading: false,
          header: "Терминал времмено не работает",
        })
      }
    } catch (error) {
      //заглушка
      setTimeout(() => {
        setInfoScreenData({
          isLoading: false,
          header: "Терминал времмено не работает",
        })
      }, 2000)
      console.error(error)
    }
  }, hwStatusDelay)

  useInterval(() => {
    setIdleCounter((count) => count + 1)
  }, delay)
  useEffect(() => {
    if (idleCounter === 5) setCurrentScreen("main")
  }, [idleCounter])

  const navigate = (route: string): void => {
    setCurrentScreen(route)
  }
  const updateIdle = () => {
    setIdleCounter(0)
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
        />
      )}
      {currentScreen === "exchange" && (
        <ExchangeScreen
          onPressHandler={navigate}
          setDelay={setDelay}
          setIdleCounter={setIdleCounter}
        />
      )}
      {currentScreen === "print" && (
        <PrintScreen
          onPressHandler={navigate}
          setDelay={setDelay}
          setIdleCounter={setIdleCounter}
        />
      )}
    </div>
  )
}

export default App
