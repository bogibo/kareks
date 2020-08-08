import React from "react"
import classes from "./PrintScreen.module.sass"
import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"

interface Props {
  onPressHandler: (action: string) => void
}

export const PrintScreen = ({ onPressHandler }: Props) => {
  return (
    <div className={classes.PrintScreen}>
      <Header title="Печать чеков" />
      <div className={classes.Grid}>
        <Button
          title="Чек с поста №1"
          subTitle="11:00"
          color="white"
          action="main"
          onPressHandler={() => {}}
        />
        <Button
          title="Чек с поста №2"
          subTitle="10:40"
          color="white"
          action="main"
          onPressHandler={() => {}}
        />
        <Button
          title="Чек с поста №1"
          subTitle="10:30"
          color="white"
          action="main"
          onPressHandler={() => {}}
        />
        <Button
          title="Листать вперед"
          color="blue"
          action="main"
          onPressHandler={() => {}}
        />
        <Button
          title="Назад"
          color="red"
          action="main"
          onPressHandler={onPressHandler}
        />
        <Button
          title="Листать назад"
          color="blue"
          action="main"
          onPressHandler={() => {}}
        />
      </div>
    </div>
  )
}
