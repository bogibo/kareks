interface SetCurrentScreen {
  type: "SET_CURRENT_SCREEN"
  payload: string
}
interface SetStartCounter {
  type: "SET_START_COUNTER"
  payload: number
}
interface SetDelay {
  type: "SET_DELAY"
  payload: number | null
}
interface SetHwstatusDelay {
  type: "SET_HWSTATUS_DELAY"
  payload: number | null
}
interface SetIdleExchangeScreen {
  type: "SET_IDLE_EXCHANGE_SCREEN"
  payload: boolean
}
interface SetInfoScreenData {
  type: "SET_INFO_SCREEN_DATA"
  payload: {
    isLoading: boolean
    header: string
  }
}
interface SetHardwareStatus {
  type: "SET_HARDWARE_STATUS"
  payload: { fiscal: boolean; cash: { cash: boolean; hopper: boolean } }
}

export type Actions =
  | SetCurrentScreen
  | SetStartCounter
  | SetDelay
  | SetHwstatusDelay
  | SetIdleExchangeScreen
  | SetInfoScreenData
  | SetHardwareStatus

export const SET_CURRENT_SCREEN = "SET_CURRENT_SCREEN"
export const SET_START_COUNTER = "SET_START_COUNTER"
export const SET_DELAY = "SET_DELAY"
export const SET_HWSTATUS_DELAY = "SET_HWSTATUS_DELAY"
export const SET_IDLE_EXCHANGE_SCREEN = "SET_IDLE_EXCHANGE_SCREEN"
export const SET_INFO_SCREEN_DATA = "SET_INFO_SCREEN_DATA"
export const SET_HARDWARE_STATUS = "SET_HARDWARE_STATUS"
