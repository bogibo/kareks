import React, { useState, useEffect } from "react"
import classes from "./ExchangeScreen.module.sass"
import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"
import { PopUp } from "../../components/PopUp/PopUp"
import useInterval from "@use-it/interval"

interface Props {
  onPressHandler: (action: string) => void
}

export const ExchangeScreen = ({ onPressHandler }: Props) => {
  const [amount, setAmount] = useState(0)
  const [counter, setCounter] = useState(0)
  //---------idle----------
  let delay = amount > 0 ? null : 1000
  useInterval(() => {
    setCounter((currentCount) => currentCount + 1)
  }, delay)
  useEffect(() => {
    if (counter === 5) onPressHandler("main")
  }, [counter, onPressHandler])
  //---------idle----------
  return (
    <div className={classes.ExchangeScreen}>
      <PopUp title="Вставьте купюру в купюроприемник" amount={amount} />
      <Header title="Размен денег" />
      <div className={classes.Grid}>
        <Button
          title="Назад"
          color="red"
          action="main"
          onPressHandler={onPressHandler}
        />
        <Button
          title="Разменять"
          color="blue"
          action="main"
          onPressHandler={() => {}}
        />
      </div>
    </div>
  )
}
