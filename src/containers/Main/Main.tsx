import React from "react"
import classes from "./Main.module.sass"
import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"

interface Props {
  onPressHandler: (action: string) => void
}

export const Main = ({ onPressHandler }: Props) => {
  return (
    <div className={classes.Main}>
      <Header title="Размен денег" subTitle="Печать чеков" />
      <div className={classes.Grid}>
        <Button
          title="Разменять купюру"
          color="blue"
          action="exchange"
          onPressHandler={onPressHandler}
        />
        <Button
          title="Распечатать чек"
          color="blue"
          action="print"
          onPressHandler={onPressHandler}
        />
      </div>
    </div>
  )
}
