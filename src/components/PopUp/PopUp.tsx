import React from "react"
import classes from "./PopUp.module.sass"

interface Props {
  title: string
  amount: number
}

export const PopUp = ({ title, amount }: Props) => {
  return (
    <div className={classes.PopUp}>
      <div className={classes.Wrapper}>
        <span className={classes.Title}>{title}</span>
        <div>
          Внесенная сумма: <span className={classes.Amount}>{amount}</span> руб.
        </div>
      </div>
    </div>
  )
}
