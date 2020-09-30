import React, { useRef, useEffect, useContext, useCallback } from "react"
import useInterval from "@use-it/interval"
import classes from "./InitContainer.module.sass"

import { store } from "../../context/data/store"
import {
  SET_HWSTATUS_DELAY,
  SET_HARDWARE_STATUS,
  SET_CURRENT_SCREEN,
  SET_INFO_SCREEN_DATA,
  SET_START_COUNTER,
  SET_IDLE_EXCHANGE_SCREEN,
} from "../../context/types"

import { Main } from "../../containers/Main/Main"
import { ExchangeScreen } from "../../containers/ExchangeScreen/ExchangeScreen"
import { PrintScreen } from "../../containers/PrintScreen/PrintScreen"
import { InfoScreen } from "../../containers/InfoScreen/InfoScreen"

import { getStatus, resetPayment } from "../../api/jsonRpc"
import { parseHardwareStatus } from "../../helpers/parseHardwareStatus"
import { idleTime, webSocketPort } from "../../helpers/config"

const socketUrl =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? `ws://192.168.10.146:${webSocketPort}`
    : `ws://${window.location.hostname}:${webSocketPort}`

export const InitContainer = () => {
  const {
    state: {
      currentScreen,
      startCounter,
      delay,
      hwStatusDelay,
      hardwareStatus,
      infoScreenData,
    },
    dispatch,
  } = useContext(store)

  const setHwStatusDelay = useCallback(
    (hwStatus: number | null) =>
      dispatch({ type: SET_HWSTATUS_DELAY, payload: hwStatus }),
    [dispatch]
  )
  const setHardwareStatus = useCallback(
    (status: { fiscal: boolean; cash: { cash: boolean; hopper: boolean } }) =>
      dispatch({ type: SET_HARDWARE_STATUS, payload: status }),
    [dispatch]
  )
  const setCurrentScreen = useCallback(
    (screen: string) => dispatch({ type: SET_CURRENT_SCREEN, payload: screen }),
    [dispatch]
  )
  const setInfoScreenData = useCallback(
    (infoScreenData: { isLoading: boolean; header: string }) =>
      dispatch({ type: SET_INFO_SCREEN_DATA, payload: infoScreenData }),
    [dispatch]
  )
  const setStartCounter = useCallback(
    (startCounter: number) =>
      dispatch({ type: SET_START_COUNTER, payload: startCounter }),
    [dispatch]
  )
  const setIdleExchangeScreen = useCallback(
    (value: boolean) =>
      dispatch({ type: SET_IDLE_EXCHANGE_SCREEN, payload: value }),
    [dispatch]
  )

  const idleCounter = useRef(0)
  const socket: any = useRef(null)

  const updateIdle = useCallback(() => {
    idleCounter.current = 0
  }, [])

  useEffect(() => {
    if (!socket.current) {
      socket.current = new WebSocket(socketUrl)
      socket.current.onopen = () => {}
    }
  }, [socket])

  const socketDelay = useRef<number | null>(null)

  useInterval(() => {
    if (socket.current.readyState !== 1) {
      socket.current = new WebSocket(socketUrl)
    }
  }, socketDelay.current)

  useInterval(async () => {
    setHwStatusDelay(10 * 1000)
    try {
      const result = await getStatus()
      const { fiscal, cash } = parseHardwareStatus(result)
      if (
        hardwareStatus.fiscal !== fiscal ||
        hardwareStatus.cash.cash !== cash.cash ||
        hardwareStatus.cash.hopper !== cash.hopper
      )
        setHardwareStatus({ fiscal, cash })
      if (currentScreen !== "info") return
      if ((cash.cash && cash.hopper) || fiscal) {
        await resetPayment()
        if (!socket || socket.current.readyState !== 1) {
          socket.current = new WebSocket(socketUrl)
        }
        socketDelay.current = 30 * 1000
        setInfoScreenData({
          isLoading: false,
          header: "",
        })
        setCurrentScreen("main")
      } else {
        setInfoScreenData({
          isLoading: false,
          header: "Терминал временно не работает",
        })
      }
    } catch (error) {
      if (startCounter !== 13) {
        setStartCounter(startCounter + 1)
      } else {
        setInfoScreenData({
          isLoading: false,
          header: "Терминал временно не работает",
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

  return (
    <div className={classes.InitContainer}>
      {currentScreen === "info" && (
        <InfoScreen
          isLoading={infoScreenData.isLoading}
          header={infoScreenData.header}
        />
      )}
      {currentScreen === "main" && (
        <Main socket={socket} updateIdle={updateIdle} />
      )}
      {currentScreen === "exchange" && (
        <ExchangeScreen socket={socket} updateIdle={updateIdle} />
      )}
      {currentScreen === "print" && (
        <PrintScreen socket={socket} updateIdle={updateIdle} />
      )}
    </div>
  )
}
