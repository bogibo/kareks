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
  setIdleExchangeScreen: (param: boolean) => void
}

export const Main = ({ onPressHandler, setDelay, hardwareStatus, setIdleExchangeScreen }: Props) => {
  useEffect(() => {
    setDelay(null)
    setIdleExchangeScreen(false)
  }, [setDelay, setIdleExchangeScreen])
  
  useEffect(() => {
    if (!hardwareStatus.cash && !hardwareStatus.fiscal) onPressHandler("info")
  }, [hardwareStatus, onPressHandler])

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
