import React, { useEffect, useContext, useCallback } from "react"
import classes from "./Main.module.sass"

import { store } from "../../context/data/store"
import {
  SET_DELAY,
  SET_IDLE_EXCHANGE_SCREEN,
  SET_CURRENT_SCREEN,
  SET_INFO_SCREEN_DATA,
} from "../../context/types"

import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"

interface Props {
  socket: any
  updateIdle: () => void
}

export const Main = ({ socket, updateIdle }: Props) => {
  const {
    state: { hardwareStatus },
    dispatch,
  } = useContext(store)

  const setDelay = useCallback(
    (delay: number | null) => dispatch({ type: SET_DELAY, payload: delay }),
    [dispatch]
  )
  const setIdleExchangeScreen = useCallback(
    (value: boolean) =>
      dispatch({ type: SET_IDLE_EXCHANGE_SCREEN, payload: value }),
    [dispatch]
  )
  const setCurrentScreen = useCallback(
    (screen: string) => {
      dispatch({
        type: SET_INFO_SCREEN_DATA,
        payload: { isLoading: true, header: "" },
      })
      dispatch({ type: SET_CURRENT_SCREEN, payload: screen })
    },
    [dispatch]
  )
  
  useEffect(() => {
    updateIdle()
    setDelay(null)
    setIdleExchangeScreen(false)
  }, [setDelay, setIdleExchangeScreen, updateIdle])

  useEffect(() => {
    if (!socket.current) return
    socket.current.onmessage = (msg) => {
      const action = JSON.parse(msg.data)
      if (action.event === "idle") return
      updateIdle()
      switch (action.button) {
        case "L03":
          if (!hardwareStatus.cash.cash || !hardwareStatus.cash.hopper) return
          setCurrentScreen("exchange")
          break
        case "R03":
          if (!hardwareStatus.fiscal) return
          setCurrentScreen("print")
          break
      }
    }
  }, [socket, setCurrentScreen, hardwareStatus, updateIdle])

  useEffect(() => {
    if (
      (!hardwareStatus.cash.cash || !hardwareStatus.cash.hopper) &&
      !hardwareStatus.fiscal
    )
      setCurrentScreen("info")
  }, [hardwareStatus, setCurrentScreen])

  return (
    <div className={classes.Main}>
      <Header title="Размен денег" subTitle="Печать чеков" />
      <div className={classes.Grid}>
        <Button
          title="Разменять купюру"
          color="blue"
          action="exchange"
          disabled={
            !hardwareStatus.cash.cash || !hardwareStatus.cash.hopper
          }
          onPressHandler={setCurrentScreen}
        />
        <Button
          title="Распечатать чек"
          color="blue"
          action="print"
          disabled={!hardwareStatus.fiscal}
          onPressHandler={setCurrentScreen}
        />
      </div>
    </div>
  )
}
