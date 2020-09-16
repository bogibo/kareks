import { Actions } from "../types"
import { InitialStateInterface } from "./store"
import {
  SET_CURRENT_SCREEN,
  SET_START_COUNTER,
  SET_DELAY,
  SET_HWSTATUS_DELAY,
  SET_IDLE_EXCHANGE_SCREEN,
  SET_INFO_SCREEN_DATA,
  SET_HARDWARE_STATUS,
} from "../types"

const handlers = {
  [SET_CURRENT_SCREEN]: (state, action) => ({
    ...state,
    currentScreen: action.payload,
  }),
  [SET_START_COUNTER]: (state, action) => ({
    ...state,
    startCounter: action.payload,
  }),
  [SET_DELAY]: (state, action) => ({
    ...state,
    delay: action.payload,
  }),
  [SET_HWSTATUS_DELAY]: (state, action) => ({
    ...state,
    hwStatusDelay: action.payload,
  }),
  [SET_IDLE_EXCHANGE_SCREEN]: (state, action) => ({
    ...state,
    idleExchangeScreen: action.payload,
  }),
  [SET_INFO_SCREEN_DATA]: (state, action) => ({
    ...state,
    infoScreenData: { ...action.payload },
  }),
  [SET_HARDWARE_STATUS]: (state, action) => ({
    ...state,
    hardwareStatus: { ...action.payload },
  }),
  DEFAULT: (state) => state,
}

export const reducer = (state: InitialStateInterface, action: Actions) => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
}
