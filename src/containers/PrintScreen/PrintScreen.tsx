import React, { useState, useEffect } from "react"
import classes from "./PrintScreen.module.sass"
import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"

import {
  paginationPage1,
  paginationPage2,
  paginationPage3,
} from "./paginationPages"

interface Props {
  onPressHandler: (action: string) => void
  setDelay: (delay: React.SetStateAction<number | null>) => void
  setIdleCounter: (count: number) => void
}

export const PrintScreen = ({
  onPressHandler,
  setDelay,
  setIdleCounter,
}: Props) => {
  const [currentPage, setCurrnetPage] = useState(1)
  const [pageContent, setPageContent] = useState(paginationPage1)
  const cls = [classes.PrintScreen]
  if (currentPage !== 1) cls.push(classes.NextPage)

  useEffect(() => {
    setIdleCounter(0)
    setDelay(1000)
  }, [setIdleCounter, setDelay])

  const content = [paginationPage1, paginationPage2, paginationPage3]
  const nextPageHandler = () => {
    if (currentPage !== 3) {
      setPageContent(content[currentPage])
      setCurrnetPage((page) => page + 1)
      setIdleCounter(0)
    }
  }
  const prevPageHandler = () => {
    if (currentPage !== 1) {
      setPageContent(content[currentPage - 2])
      setCurrnetPage(currentPage - 1)
      setIdleCounter(0)
    }
  }

  return (
    <div className={cls.join(" ")}>
      {currentPage === 1 && <Header title="Печать чеков" />}

      <div className={classes.Grid}>
        {pageContent.bill.map((item) => (
          <Button
            title={item.title}
            subTitle={item.timestamp}
            color="white"
            action="main"
            disabled={false}
            onPressHandler={() => {}}
            key={item.id}
          />
        ))}
        <Button
          title="Листать вперед"
          color="blue"
          action="main"
          disabled={false}
          onPressHandler={nextPageHandler}
        />
        <Button
          title="Назад"
          color="red"
          action="main"
          disabled={false}
          onPressHandler={onPressHandler}
        />
        <Button
          title="Листать назад"
          color="blue"
          action="main"
          disabled={false}
          onPressHandler={prevPageHandler}
        />
      </div>
    </div>
  )
}
