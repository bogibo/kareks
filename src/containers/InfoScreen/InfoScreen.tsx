import React from "react"
import classes from "./InfoScreen.module.sass"
import { Info } from "../../components/Info/Info"

interface Props {
  isLoading: boolean
  header: string
}

export const InfoScreen = ({ isLoading, header }: Props) => {
  return (
    <div className={classes.InfoScreen}>
      <Info isLoading={isLoading} header={header} />
    </div>
  )
}
