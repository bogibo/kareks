import React from "react"
import classes from "./Header.module.sass"

interface Props {
  title: string
  subTitle?: string
}

export const Header = ({ title, subTitle }: Props) => {
  return (
    <div className={classes.Header}>
      <div className={classes.HeaderWrapper}>
        <img src="/assets/icons/logo.png" alt="logo" />
        <span className={classes.Description}>{title}<br />{subTitle}</span>
      </div>
    </div>
  )
}
