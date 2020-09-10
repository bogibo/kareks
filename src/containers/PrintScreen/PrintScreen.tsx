import React, { useState, useEffect, useRef } from "react"
import classes from "./PrintScreen.module.sass"
import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"
import { getFiscalizedChecks, printFiscalizedCheck } from "../../api/jsonRpc"
import { Info } from "../../components/Info/Info"
import { CheckData } from "../../api/interfaces"

interface Props {
  onPressHandler: (action: string) => void
  setDelay: (delay: React.SetStateAction<number | null>) => void
  fiscalStatus: boolean
}

export const PrintScreen = ({
  onPressHandler,
  setDelay,
  fiscalStatus,
}: Props) => {
  const [currentPage, setCurrnetPage] = useState(1)
  const [pageContent, setPageContent] = useState<CheckData[]>()
  const [infoText, setInfoText] = useState("")
  const [loading, setLoading] = useState(true)
  const [lastPageIndex, setLastPageIndex] = useState(2)
  const cls = [classes.PrintScreen]
  if (currentPage !== 1) cls.push(classes.NextPage)

  const wsActionId = useRef<string[] | null>(null)
  useEffect(() => {
    ;(() => {
      if (!pageContent) return (wsActionId.current = null)
      wsActionId.current = pageContent.map((item) => {
        const id = item.payment_id
        return id
      })
      const expectedLength = currentPage === 1 ? 3 : 5
      if (wsActionId.current.length < expectedLength) {
        const strArr = new Array(expectedLength - wsActionId.current.length)
        strArr.fill("")
        wsActionId.current.splice(0, 0, ...strArr)
      }
    })()
  }, [pageContent, currentPage])

  useEffect(() => {
    setDelay(1000)
  }, [setDelay])
  useEffect(() => {
    if (!fiscalStatus) {
      setInfoText("Оборудование не готово")
    }
  }, [fiscalStatus])

  useEffect(() => {
    ;(async () => {
      try {
        const { result, data } = await getFiscalizedChecks(0, 3)
        if (result) {
          setPageContent(data)
          setLoading(false)
          return
        }
        setInfoText("Оборудование не готово")
        setLoading(false)
      } catch (error) {
        setInfoText("Оборудование не готово")
        setLoading(false)
        console.log(error)
      }
    })()
  }, [])

  const nextPageHandler = async () => {
    const currentPageIndex = lastPageIndex
    setLoading(true)
    setLastPageIndex((lastIndex) =>
      currentPage === 1 ? lastIndex + 3 : lastIndex + 5
    )
    try {
      const { result, data } = await getFiscalizedChecks(
        currentPageIndex + 1,
        5
      )
      console.log("data: ", data)
      setLoading(false)
      if (!result) {
        setPageContent([])
        setCurrnetPage((page) => page + 1)
        return
      }
      setPageContent(data)
      setCurrnetPage((page) => page + 1)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const prevPageHandler = async () => {
    if (currentPage === 1) return
    const currentPageIndex = lastPageIndex
    const page = currentPage
    setLoading(true)
    if (page - 1 === 1) {
      setLastPageIndex(2)
    } else {
      setLastPageIndex((lastIndex) => lastIndex - 5)
    }
    try {
      const { result, data } = await getFiscalizedChecks(
        currentPage === 1 ? 0 : currentPageIndex - 5,
        page - 1 === 1 ? 3 : 5
      )
      setLoading(false)
      if (!result) {
        setPageContent([])
        setCurrnetPage((page) => page - 1)
        return
      }
      setPageContent(data)
      setCurrnetPage((page) => page - 1)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  const PrintCheckHandler = async (checkId: string) => {
    if (!checkId) return
    setLoading(true)
    // setInfoText("Идет печать")
    setDelay(null)
    try {
      const { result } = await printFiscalizedCheck(checkId)
      if (result) {
        setInfoText("Готово")
      } else {
        setInfoText("Что то пошло не так")
      }
      setLoading(false)
      setTimeout(() => {
        onPressHandler("main")
      }, 2000)
    } catch (error) {
      setLoading(false)
      setInfoText("Что то пошло не так")
      console.log(error)
      setTimeout(() => {
        onPressHandler("main")
      }, 2000)
    }
  }
  const showDiv = () => {
    if (pageContent && pageContent.length === 0) return true
    if (currentPage === 1 && pageContent) {
      if (pageContent.length < 3 && !(pageContent.length % 2)) return true
      return false
    }
    if (pageContent && pageContent.length < 5 && !(pageContent.length % 2))
      return true
    return false
  }

  return (
    <div className={cls.join(" ")}>
      {currentPage === 1 && <Header title="Печать чеков" />}
      {(loading || infoText.length > 0) && (
        <Info
          isLoading={loading}
          header={infoText}
          small={true}
          button={!fiscalStatus}
          onPressHandler={onPressHandler}
        />
      )}
      {!loading && pageContent && !infoText && (
        <div className={classes.Grid}>
          {showDiv() && <div></div>}
          {pageContent.length > 0 &&
            pageContent.map((item) => (
              <Button
                title={new Date(item.timestamp).toLocaleTimeString()}
                subTitle={(item.price / 100).toString() + " руб"}
                paymentId={item.payment_id}
                color="white"
                action="main"
                disabled={false}
                onPressHandler={PrintCheckHandler}
                key={item.payment_id}
              />
            ))}
          <Button
            title="Листать вперед"
            color="blue"
            action="main"
            disabled={
              currentPage !== 1 && pageContent.length < 5 ? true : false
            }
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
            disabled={currentPage === 1 ? true : false}
            onPressHandler={prevPageHandler}
          />
        </div>
      )}
    </div>
  )
}
