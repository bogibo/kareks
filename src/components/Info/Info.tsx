import React from "react"
import classes from "./Info.module.sass"
import { Loader } from "../Loader/Loader"
import { Button } from "../Button/Button"

interface Props {
  isLoading: boolean
  header: string
  small?: boolean
  button?: boolean
  onPressHandler?: (action: string) => void
}

export const Info = ({
  isLoading,
  header,
  small,
  button,
  onPressHandler,
}: Props) => {
  const cls = [classes.Info]
  if (small) cls.push(classes.Small)
  return (
    <div className={cls.join(" ")}>
      {header}
      {isLoading && <Loader />}
      {button && !isLoading && (
        <div className={classes.btn}>
          <Button
            title="Назад"
            color="red"
            action="main"
            disabled={false}
            onPressHandler={onPressHandler ? onPressHandler : () => {}}
          />
        </div>
      )}
    </div>
  )
}
