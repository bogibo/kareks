import React, { createContext, useReducer } from "react"
import { Actions } from "../types"
import { reducer } from "./dataReducer"

export interface InitialStateInterface {
  currentScreen: string
  startCounter: number
  delay: number | null
  hwStatusDelay: number | null
  idleExchangeScreen: boolean
  infoScreenData: {
    isLoading: boolean
    header: string
  }
  hardwareStatus: {
    fiscal: boolean
    cash: {
      cash: boolean
      hopper: boolean
    }
  }
}

const initialState = {
  currentScreen: "info",
  startCounter: 0,
  delay: null,
  hwStatusDelay: 0,
  idleExchangeScreen: false,
  infoScreenData: {
    isLoading: true,
    header: "Подготовка оборудования",
  },
  hardwareStatus: {
    fiscal: false,
    cash: {
      cash: false,
      hopper: false,
    },
  },
}

interface StoreInterface {
  state: InitialStateInterface
  dispatch: React.Dispatch<Actions>
}

export const store = createContext<StoreInterface>({
  state: initialState,
  dispatch: () => null,
})

const { Provider } = store

export const AppProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <Provider value={{ state, dispatch }}>{children}</Provider>
}
