import React from "react"
import { AppProvider } from "./context/data/store"
import { InitContainer } from "./containers/InitContainer/InitContainer"

function App() {
  return (
    <AppProvider>
      <InitContainer />
    </AppProvider>
  )
}

export default App
