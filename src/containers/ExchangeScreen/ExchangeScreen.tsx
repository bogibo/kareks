import React, { useState } from "react"
import classes from "./ExchangeScreen.module.sass"
import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"
import { PopUp } from "../../components/PopUp/PopUp"

interface Props {
  onPressHandler: (action: string) => void
}

export const ExchangeScreen = ({ onPressHandler }: Props) => {
  const [amount, setAmount] = useState(0)
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
          onPressHandler={()=>{}}
        />
      </div>
    </div>
  )
}
