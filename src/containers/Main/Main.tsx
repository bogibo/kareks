import React, { useEffect } from "react"
import classes from "./Main.module.sass"
import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"

interface Props {
  onPressHandler: (action: string) => void
  setDelay: (delay: React.SetStateAction<number | null>) => void
  hardwareStatus: {
    fiscal: boolean
    cash: boolean
  }
}

export const Main = ({ onPressHandler, setDelay, hardwareStatus }: Props) => {
  useEffect(() => {
    setDelay(null)
  }, [setDelay])

  return (
    <div className={classes.Main}>
      <Header title="Размен денег" subTitle="Печать чеков" />
      <div className={classes.Grid}>
        <Button
          title="Разменять купюру"
          color="blue"
          action="exchange"
          disabled={!hardwareStatus.cash}
          onPressHandler={onPressHandler}
        />
        <Button
          title="Распечатать чек"
          color="blue"
          action="print"
          disabled={!hardwareStatus.fiscal}
          onPressHandler={onPressHandler}
        />
      </div>
    </div>
  )
}
