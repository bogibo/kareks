import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react"
import useInterval from "@use-it/interval"
import classes from "./ExchangeScreen.module.sass"

import { store } from "../../context/data/store"
import {
  SET_INFO_SCREEN_DATA,
  SET_DELAY,
  SET_CURRENT_SCREEN,
} from "../../context/types"

import {
  startChangingSession,
  requestAmount,
  stopMoneyReciving,
  acceptPayment,
  rejectPayment,
} from "../../api/jsonRpc"

import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"
import { PopUp } from "../../components/PopUp/PopUp"
import { Info } from "../../components/Info/Info"

interface Props {
  socket: any
  updateIdle: () => void
}

export const ExchangeScreen = ({ socket, updateIdle }: Props) => {
  const {
    state: { hardwareStatus, infoScreenData, idleExchangeScreen },
    dispatch,
  } = useContext(store)

  const [amount, setAmount] = useState(0)
  const [hwReady, setHwReady] = useState(false)
  const [requestAmountTimer, setRequestAmountTimer] = useState<number | null>(
    null
  )

  const setInfoScreenData = useCallback(
    (data: { isLoading: boolean; header: string }) =>
      dispatch({ type: SET_INFO_SCREEN_DATA, payload: data }),
    [dispatch]
  )
  const setDelay = useCallback(
    (delay: number | null) => dispatch({ type: SET_DELAY, payload: delay }),
    [dispatch]
  )
  const setCurrentScreen = useCallback(
    (screen: string) => dispatch({ type: SET_CURRENT_SCREEN, payload: screen }),
    [dispatch]
  )

  const flag = useRef(true)
  useInterval(async () => {
    if (
      hardwareStatus.cash.cash &&
      hardwareStatus.cash.hopper &&
      !infoScreenData.isLoading &&
      !infoScreenData.header
    ) {
      try {
        const { result, received_amount } = await requestAmount()
        if (result && received_amount !== amount)
          setAmount(received_amount / 100)
      } catch (error) {
        console.log(error)
      }
    }
  }, requestAmountTimer)

  useEffect(() => {
    ;(async () => {
      try {
        const { result } = await startChangingSession()
        if (result) {
          setDelay(1000)
          setRequestAmountTimer(1000)
          setInfoScreenData({ isLoading: false, header: "" })
          setHwReady(true)
          return
        }
        setInfoScreenData({
          isLoading: false,
          header: "Оборудование не готово",
        })
      } catch (error) {
        setInfoScreenData({
          isLoading: false,
          header: "Оборудование не готово",
        })
        console.log("exchange err: ", error)
      }
    })()
  }, [setDelay, setInfoScreenData])

  useEffect(() => {
    if (amount > 0) setDelay(null)
  }, [amount, setDelay])

  const exchangeHandler = useCallback(async () => {
    updateIdle()
    if (amount === 0) {
      setInfoScreenData({ isLoading: false, header: "Внесите наличные" })
      setTimeout(() => {
        setInfoScreenData({ isLoading: false, header: "" })
      }, 2000)
      return
    }
    setRequestAmountTimer(null)
    setInfoScreenData({ isLoading: true, header: "" })
    try {
      const { disabling_money_receiving_result } = await stopMoneyReciving(
        amount * 100
      )
      if (!disabling_money_receiving_result.disabled) {
        setInfoScreenData({ isLoading: false, header: "" })
        setRequestAmountTimer(1000)
        return
      }
      const { result, accept_payment_result } = await acceptPayment()
      if (!result || accept_payment_result !== 1) {
        setInfoScreenData({ isLoading: false, header: "" })
        setRequestAmountTimer(1000)
        return
      }
      setInfoScreenData({ isLoading: false, header: "Успешно!" })
      setTimeout(() => {
        setInfoScreenData({ isLoading: false, header: "" })
        setCurrentScreen("main")
      }, 2000)
    } catch (error) {
      console.log(error)
      setRequestAmountTimer(1000)
      setInfoScreenData({ isLoading: false, header: "" })
    }
  }, [amount, setInfoScreenData, setCurrentScreen, updateIdle])

  const goBackHandler = useCallback(async () => {
    setDelay(null)
    if (amount > 0) return exchangeHandler()
    setInfoScreenData({ isLoading: true, header: "" })
    setRequestAmountTimer(null)
    try {
      const { disabling_money_receiving_result } = await stopMoneyReciving(
        amount * 100
      )
      if (!disabling_money_receiving_result.disabled) {
        setInfoScreenData({ isLoading: false, header: "" })
        setRequestAmountTimer(1000)
        return
      }
      const { result } = await rejectPayment()
      if (!result) {
        setRequestAmountTimer(1000)
        setInfoScreenData({ isLoading: false, header: "" })
        return
      }
      setInfoScreenData({ isLoading: false, header: "" })
      setCurrentScreen("main")
    } catch (error) {
      setInfoScreenData({ isLoading: false, header: "" })
      setRequestAmountTimer(1000)
      console.log(error)
    }
  }, [amount, exchangeHandler, setCurrentScreen, setInfoScreenData, setDelay])

  useEffect(() => {
    ;(async () => {
      // if (!hardwareStatus.cash.cash && hardwareStatus.cash.hopper) {
      //   setDelay(null)
      //   setInfoScreenData({ isLoading: false, header: "Купюроприемник не готов" })
      //   setRequestAmountTimer(null)
      //   if(amount > 0) console.log(await acceptPayment())
      //   setTimeout(() => {
      //     setCurrentScreen("main")
      //   }, 2000)
      // }
      // if (hardwareStatus.cash.cash && !hardwareStatus.cash.hopper) {
      //   setDelay(null)
      //   setInfoScreenData({ isLoading: false, header: "Оборудование не готово" })
      //   setRequestAmountTimer(null)
      //   setTimeout(() => {
      //     setCurrentScreen("main")
      //   }, 2000)
      // }
      if (!hardwareStatus.cash.cash || !hardwareStatus.cash.hopper) {
        setDelay(null)
        setInfoScreenData({
          isLoading: false,
          header: "Оборудование не готово",
        })
        setRequestAmountTimer(null)
        setTimeout(() => {
          setCurrentScreen("main")
        }, 2000)
      }
    })()
  }, [hardwareStatus, setDelay, setInfoScreenData, setCurrentScreen, amount])

  useEffect(() => {
    ;(async () => {
      if (idleExchangeScreen && amount === 0 && flag.current) {
        flag.current = false
        await goBackHandler()
      }
    })()
  }, [idleExchangeScreen, amount, goBackHandler])

  useEffect(() => {
    if (!socket.current) return
    socket.current.onmessage = async (msg) => {
      const action = JSON.parse(msg.data)
      if (action.event === "idle") return
      updateIdle()
      switch (action.button) {
        case "L03":
          await goBackHandler()
          break
        case "R03":
          await exchangeHandler()
          break
      }
    }
  }, [socket, goBackHandler, exchangeHandler, updateIdle])

  return (
    <div className={classes.ExchangeScreen}>
      {(infoScreenData.isLoading || infoScreenData.header) && (
        <>
          <Header title="Размен денег" />
          <Info
            header={infoScreenData.header}
            isLoading={infoScreenData.isLoading}
            small={true}
            button={!hwReady}
            onPressHandler={setCurrentScreen}
          />
        </>
      )}
      {!infoScreenData.isLoading && !infoScreenData.header && (
        <>
          <PopUp title="Вставьте купюру в купюроприемник" amount={amount} />
          <Header title="Размен денег" />
          <div className={classes.Grid}>
            <Button
              title="Назад"
              color="red"
              action="main"
              disabled={false}
              onPressHandler={goBackHandler}
            />
            <Button
              title="Разменять"
              color="blue"
              action="main"
              disabled={false}
              onPressHandler={exchangeHandler}
            />
          </div>
        </>
      )}
    </div>
  )
}
