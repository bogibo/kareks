import React, { useState, useEffect } from "react"
import classes from "./ExchangeScreen.module.sass"
import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"
import { PopUp } from "../../components/PopUp/PopUp"

interface Props {
  onPressHandler: (action: string) => void
  setDelay: (delay: React.SetStateAction<number | null>) => void
  setIdleCounter: (count: number) => void
}

export const ExchangeScreen = ({ onPressHandler, setDelay, setIdleCounter }: Props) => {
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (amount > 0) setDelay(null)
  }, [amount, setDelay])

  useEffect(() => {
    setIdleCounter(0)
    setDelay(1000)
  }, [setIdleCounter, setDelay])

  return (
    <div className={classes.ExchangeScreen}>
      <PopUp title="Вставьте купюру в купюроприемник" amount={amount} />
      <Header title="Размен денег" />
      <div className={classes.Grid}>
        <Button
          title="Назад"
          color="red"
          action="main"
          disabled={false}
          onPressHandler={onPressHandler}
        />
        <Button
          title="Разменять"
          color="blue"
          action="main"
          disabled={false}
          onPressHandler={() => {}}
        />
      </div>
    </div>
  )
}
