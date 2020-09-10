import { RequestManager, Client, HTTPTransport } from "@open-rpc/client-js"
import {
  GetStatusInterface,
  MoneyChangingSessionInterface,
  RequestAmountInterface,
  StopMoneyRecivingInterface,
  AcceptPaymentInterface,
  RejectPaymentInterface,
  CheckResultInterface,
  BaseResultInterface,
} from "./interfaces"
import { jsonRpcPort } from "../helpers/config"

const jsonRpcEndpoint =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? `http://192.168.10.146:${jsonRpcPort}`
    : `http://${window.location.hostname}:${jsonRpcPort}`

const transport = new HTTPTransport(jsonRpcEndpoint)
const requestManager = new RequestManager([transport])
const client = new Client(requestManager)

export const getStatus = (): Promise<GetStatusInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: GetStatusInterface = await client.request({
        method: "get_status",
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const startChangingSession = (): Promise<
  MoneyChangingSessionInterface
> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: MoneyChangingSessionInterface = await client.request({
        method: "start_money_changing_session",
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const requestAmount = (): Promise<RequestAmountInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: RequestAmountInterface = await client.request({
        method: "request_amount",
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const stopMoneyReciving = (
  currentAmount: number
): Promise<StopMoneyRecivingInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: StopMoneyRecivingInterface = await client.request({
        method: "stop_money_receiving_with_check_amount",
        params: [currentAmount],
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const acceptPayment = (): Promise<AcceptPaymentInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: AcceptPaymentInterface = await client.request({
        method: "accept_payment",
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const rejectPayment = (): Promise<RejectPaymentInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: RejectPaymentInterface = await client.request({
        method: "reject_payment",
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const resetPayment = (): Promise<RejectPaymentInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: RejectPaymentInterface = await client.request({
        method: "reset_payment",
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const getFiscalizedChecks = (
  startIndex: number,
  quantity: number
): Promise<CheckResultInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: CheckResultInterface = await client.request({
        method: "get_fiscalized_checks",
        params: [startIndex, quantity],
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const printFiscalizedCheck = (
  paymentSyncId: string
): Promise<BaseResultInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: BaseResultInterface = await client.request({
        method: "print_fiscalized_check",
        params: [paymentSyncId],
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
