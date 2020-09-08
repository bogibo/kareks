import React from "react"
import classes from "./Info.module.sass"
import { Loader } from "../Loader/Loader"

interface Props {
  isLoading: boolean
  header: string
}

export const Info = ({ isLoading, header }: Props) => {
  return (
    <div className={classes.Info}>
      {header}
      {isLoading && <Loader />}
    </div>
  )
}
