import React, { useState } from "react"
import classes from "./App.module.sass"
import { Main } from "./containers/Main/Main"
import { ExchangeScreen } from "./containers/ExchangeScreen/ExchangeScreen"
import { PrintScreen } from "./containers/PrintScreen/PrintScreen"

function App() {
  const [currentScreen, setCurrentScreen] = useState("main")
  const navigate = (route: string): void => {
    setCurrentScreen(route)
  }
  return (
    <div className={classes.App}>
      {currentScreen === "main" && <Main onPressHandler={navigate} />}
      {currentScreen === "exchange" && <ExchangeScreen onPressHandler={navigate} />}
      {currentScreen === "print" && <PrintScreen onPressHandler={navigate} />}
    </div>
  )
}

export default App
