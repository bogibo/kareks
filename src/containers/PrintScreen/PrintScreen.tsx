import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react"
import classes from "./PrintScreen.module.sass"

import { store } from "../../context/data/store"
import {
  SET_INFO_SCREEN_DATA,
  SET_DELAY,
  SET_CURRENT_SCREEN,
} from "../../context/types"

import { getFiscalizedChecks, printFiscalizedCheck } from "../../api/jsonRpc"

import { Header } from "../../components/Header/Header"
import { Button } from "../../components/Button/Button"
import { Info } from "../../components/Info/Info"
import { CheckData } from "../../api/interfaces"
import { buttonMap } from "../../helpers/config"

interface Props {
  socket: any
  updateIdle: () => void
}

export const PrintScreen = ({ socket, updateIdle }: Props) => {
  const {
    state: { hardwareStatus, infoScreenData },
    dispatch,
  } = useContext(store)

  const [currentPage, setCurrnetPage] = useState(1)
  const [pageContent, setPageContent] = useState<CheckData[]>()
  const [lastPageIndex, setLastPageIndex] = useState(2)
  const cls = [classes.PrintScreen]

  const setInfoScreenData = useCallback(
    (data: { isLoading: boolean; header: string }) =>
      dispatch({ type: SET_INFO_SCREEN_DATA, payload: data }),
    [dispatch]
  )
  const setDelay = useCallback(
    (delay: number | null) => dispatch({ type: SET_DELAY, payload: delay }),
    [dispatch]
  )
  const setCurrentScreen = useCallback(
    (screen: string) => dispatch({ type: SET_CURRENT_SCREEN, payload: screen }),
    [dispatch]
  )

  if (currentPage !== 1) cls.push(classes.NextPage)

  const wsActionId = useRef<string[] | null>(null)
  useEffect(() => {
    ;(() => {
      if (!pageContent) return (wsActionId.current = null)
      wsActionId.current = pageContent.map((item) => {
        const id = item.payment_id
        return id
      })
      const expectedLength = 5
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
    if (!hardwareStatus.fiscal) {
      setInfoScreenData({ isLoading: false, header: "Оборудование не готово" })
      setTimeout(() => {
        setCurrentScreen("main")
      }, 2000)
    }
  }, [hardwareStatus, setInfoScreenData, setCurrentScreen])

  const firstLoad = useRef(true)

  useEffect(() => {
    ;(async () => {
      if (!firstLoad.current) return
      firstLoad.current = false
      try {
        const { result, data } = await getFiscalizedChecks(0, 3)
        if (result) {
          setPageContent(data)
          setInfoScreenData({ isLoading: false, header: "" })
          return
        }
        setInfoScreenData({
          isLoading: false,
          header: "Оборудование не готово",
        })
        setTimeout(() => {
          setCurrentScreen("main")
        }, 2000)
      } catch (error) {
        console.log(error)
        setInfoScreenData({
          isLoading: false,
          header: "Оборудование не готово",
        })
        setTimeout(() => {
          setCurrentScreen("main")
        }, 2000)
      }
    })()
  }, [setCurrentScreen, setInfoScreenData])

  const nextPageHandler = useCallback(async () => {
    updateIdle()
    if (
      (pageContent && pageContent.length < 5 && currentPage !== 1) ||
      !pageContent
    )
      return
    const currentPageIndex = lastPageIndex
    setInfoScreenData({ isLoading: true, header: "" })
    setLastPageIndex((lastIndex) => lastIndex + 5)
    try {
      const { result, data } = await getFiscalizedChecks(
        currentPageIndex + 1,
        5
      )
      setInfoScreenData({ isLoading: false, header: "" })
      if (!result) {
        setPageContent([])
        setCurrnetPage((page) => page + 1)
        return
      }
      setPageContent(data)
      setCurrnetPage((page) => page + 1)
    } catch (error) {
      setInfoScreenData({ isLoading: false, header: "" })
      console.log(error)
    }
  }, [currentPage, lastPageIndex, pageContent, setInfoScreenData, updateIdle])

  const prevPageHandler = useCallback(async () => {
    updateIdle()
    if (currentPage === 1) return
    const currentPageIndex = lastPageIndex
    const page = currentPage
    setInfoScreenData({ isLoading: true, header: "" })
    if (page - 1 === 1) {
      setLastPageIndex(2)
    } else {
      setLastPageIndex((lastIndex) => lastIndex - 5)
    }
    try {
      const { result, data } = await getFiscalizedChecks(
        page - 1 === 1 ? 0 : currentPageIndex - 9,
        page - 1 === 1 ? 3 : 5
      )
      setInfoScreenData({ isLoading: false, header: "" })
      if (!result) {
        setPageContent([])
        setCurrnetPage((page) => page - 1)
        return
      }
      setPageContent(data)
      setCurrnetPage((page) => page - 1)
    } catch (error) {
      setInfoScreenData({ isLoading: false, header: "" })
      console.log(error)
    }
  }, [currentPage, lastPageIndex, setInfoScreenData, updateIdle])

  const PrintCheckHandler = useCallback(
    async (checkId: string) => {
      updateIdle()
      if (!checkId) return
      setInfoScreenData({ isLoading: true, header: "" })
      setDelay(null)
      try {
        const { result } = await printFiscalizedCheck(checkId)
        if (result) {
          setInfoScreenData({ isLoading: false, header: "Готово" })
        } else {
          setInfoScreenData({ isLoading: false, header: "Что то пошло не так" })
        }
        setTimeout(() => {
          setCurrentScreen("main")
        }, 2000)
      } catch (error) {
        setInfoScreenData({ isLoading: false, header: "Что то пошло не так" })
        console.log(error)
        setTimeout(() => {
          setCurrentScreen("main")
        }, 2000)
      }
    },
    [setCurrentScreen, setInfoScreenData, setDelay, updateIdle]
  )

  useEffect(() => {
    if (!hardwareStatus.fiscal) return
    if (!socket.current) return
    socket.current.onmessage = async (msg) => {
      const action = JSON.parse(msg.data)
      if (action.event === "idle") return
      let index
      let paymentId
      switch (action.button) {
        case "L03":
          setCurrentScreen("main")
          break
        case "R02":
          await nextPageHandler()
          break
        case "R03":
          await prevPageHandler()
          break
        case "L00":
          index = buttonMap.indexOf("L00")
          if (index < 0 || !wsActionId.current) return
          paymentId = wsActionId.current[index]
          await PrintCheckHandler(paymentId)
          break
        case "L01":
          index = buttonMap.indexOf("L01")
          if (index < 0 || !wsActionId.current) return
          paymentId = wsActionId.current[index]
          await PrintCheckHandler(paymentId)
          break
        case "L02":
          index = buttonMap.indexOf("L02")
          if (index < 0 || !wsActionId.current) return
          paymentId = wsActionId.current[index]
          await PrintCheckHandler(paymentId)
          break
        case "R00":
          index = buttonMap.indexOf("R00")
          if (index < 0 || !wsActionId.current) return
          paymentId = wsActionId.current[index]
          await PrintCheckHandler(paymentId)
          break
        case "R01":
          index = buttonMap.indexOf("R01")
          if (index < 0 || !wsActionId.current) return
          paymentId = wsActionId.current[index]
          await PrintCheckHandler(paymentId)
          break
      }
    }
  }, [
    socket,
    hardwareStatus,
    nextPageHandler,
    prevPageHandler,
    PrintCheckHandler,
    updateIdle,
    setCurrentScreen,
  ])

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
      {(infoScreenData.isLoading || infoScreenData.header.length > 0) && (
        <Info
          isLoading={infoScreenData.isLoading}
          header={infoScreenData.header}
          small={true}
          button={!hardwareStatus.fiscal}
          onPressHandler={setCurrentScreen}
        />
      )}
      {!infoScreenData.isLoading && pageContent && !infoScreenData.header && (
        <div className={classes.Grid}>
          {showDiv() && <div></div>}
          {pageContent.length > 0 &&
            pageContent.map((item) => (
              <Button
                title={new Date(item.timestamp).toLocaleTimeString("ru-RU")}
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
            onPressHandler={setCurrentScreen}
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
