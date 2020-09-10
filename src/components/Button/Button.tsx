import React from "react"
import classes from "./Button.module.sass"

interface Props {
  title: string
  subTitle?: string
  color: string
  action: string
  disabled: boolean
  paymentId?: string
  onPressHandler: (action: string) => void
}

export const Button = ({
  title,
  subTitle,
  color,
  action,
  disabled,
  paymentId,
  onPressHandler,
}: Props) => {
  const cls = [classes.Button, classes.ButtonText]
  const chooseButtonColor = (color: string) => {
    switch (color) {
      case "white":
        cls.push(classes.White)
        break
      case "blue":
        cls.push(classes.Blue)
        break
      case "red":
        cls.push(classes.Red)
        break
    }
  }
  chooseButtonColor(color)
  if (disabled) cls.push(classes.Disabled)
  return (
    <div
      className={cls.join(" ")}
      onClick={() => {
        if (!disabled) onPressHandler(paymentId ? paymentId : action)
      }}
    >
      <span>{title}</span>
      {subTitle && <span>{subTitle}</span>}
    </div>
  )
}
