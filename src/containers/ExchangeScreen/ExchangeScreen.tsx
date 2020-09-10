import React, { useState, useEffect, useRef } from "react"
import classes from "./ExchangeScreen.module.sass"
import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"
import { PopUp } from "../../components/PopUp/PopUp"
import {
  startChangingSession,
  requestAmount,
  stopMoneyReciving,
  acceptPayment,
  rejectPayment,
} from "../../api/jsonRpc"
import { Info } from "../../components/Info/Info"
import useInterval from "@use-it/interval"

interface Props {
  onPressHandler: (action: string) => void
  setDelay: (delay: React.SetStateAction<number | null>) => void
  cashStatus: boolean
  idle: boolean
}


export const ExchangeScreen = ({
  onPressHandler,
  setDelay,
  cashStatus,
  idle,
}: Props) => {
  const [amount, setAmount] = useState(0)
  const [infoText, setInfoText] = useState("")
  const [loading, setLoading] = useState(true)
  const [hwReady, setHwReady] = useState(false)
  const [requestAmountTimer, setRequestAmountTimer] = useState<number | null>(
    null
  )

  const flag = useRef(true)

  useInterval(async () => {
    if (cashStatus && !loading && !infoText) {
      try {
        const { result, received_amount } = await requestAmount()
        if (result && received_amount !== amount) setAmount(amount => amount + (received_amount / 100))
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
          setLoading(false)
          setHwReady(true)
          return
        }
        setInfoText("Оборудование не готово")
        setLoading(false)
      } catch (error) {
        setInfoText("Оборудование не готово")
        setLoading(false)
        console.log("exchange err: ", error)
      }
    })()
  }, [setDelay])

  useEffect(() => {
    if (amount > 0) setDelay(null)
  }, [amount, setDelay])

  useEffect(() => {
    if (!cashStatus) {
      setDelay(null)
      setLoading(false)
      setRequestAmountTimer(null)
      setInfoText("Оборудование не готово")
    }
  }, [cashStatus, setDelay])

  const exchangeHandler = async () => {
    if (amount === 0) {
      setInfoText("Внесите наличные")
      setTimeout(() => {
        setInfoText("")
      }, 2000)
      return
    }
    setRequestAmountTimer(null)
    // setInfoText("Подождите")
    setLoading(true)
    try {
      const { disabling_money_receiving_result } = await stopMoneyReciving(
        amount * 100
      )
      if (!disabling_money_receiving_result.disabled) {
        setInfoText("")
        setLoading(false)
        setRequestAmountTimer(1000)
        return
      }
      const { result, accept_payment_result } = await acceptPayment()
      if (!result || accept_payment_result !== 1) {
        setInfoText("")
        setLoading(false)
        setRequestAmountTimer(1000)
        return
      }
      setLoading(false)
      setInfoText("Успешно!")
      setTimeout(() => {
        setInfoText("")
        onPressHandler("main")
      }, 2000)
    } catch (error) {
      console.log(error)
      setRequestAmountTimer(1000)
      setLoading(false)
    }
  }

  const goBackHandler = async () => {
    if (amount > 0) return exchangeHandler()
    setLoading(true)
    setRequestAmountTimer(null)
    try {
      const { disabling_money_receiving_result } = await stopMoneyReciving(
        amount * 100
      )
      if (!disabling_money_receiving_result.disabled) {
        setLoading(false)
        setRequestAmountTimer(1000)
        return
      }
      const { result } = await rejectPayment()
      if (!result) {
        setRequestAmountTimer(1000)
        setLoading(false)
        return
      }
      setLoading(false)
      onPressHandler("main")
    } catch (error) {
      setLoading(false)
      setRequestAmountTimer(1000)
      console.log(error)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (idle && amount === 0 && flag.current) {
        flag.current = false
        setLoading(true)
        setRequestAmountTimer(null)
        try {
          const { disabling_money_receiving_result } = await stopMoneyReciving(
            amount * 100
          )
          if (!disabling_money_receiving_result.disabled) {
            setLoading(false)
            setRequestAmountTimer(1000)
            return
          }
          const { result } = await rejectPayment()
          if (!result) {
            setRequestAmountTimer(1000)
            setLoading(false)
            return
          }
          setLoading(false)
          onPressHandler("main")
        } catch (error) {
          setLoading(false)
          setRequestAmountTimer(1000)
          console.log(error)
        }
      }
    })()
  }, [idle, amount, onPressHandler])

  return (
    <div className={classes.ExchangeScreen}>
      {(loading || infoText) && (
        <>
          <Header title="Размен денег" />
          <Info
            header={infoText}
            isLoading={loading}
            small={true}
            button={!hwReady}
            onPressHandler={onPressHandler}
          />
        </>
      )}
      {!loading && !infoText && (
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
