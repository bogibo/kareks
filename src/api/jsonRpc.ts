import JsonRpcClient from "./jsonrpcclient"
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

const client = new JsonRpcClient({
  endpoint: "http://localhost:4431", config: {}
})

export const getStatus = (): Promise<GetStatusInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: GetStatusInterface = await client.request("get_status")
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
      const response: MoneyChangingSessionInterface = await client.request(
        "start_money_changing_session"
      )
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const requestAmount = (): Promise<RequestAmountInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: RequestAmountInterface = await client.request(
        "request_amount"
      )
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
      const response: StopMoneyRecivingInterface = await client.request(
        "stop_money_receiving_with_check_amount",
        currentAmount
      )
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const acceptPayment = (): Promise<AcceptPaymentInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: AcceptPaymentInterface = await client.request(
        "accept_payment"
      )
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const rejectPayment = (): Promise<RejectPaymentInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: RejectPaymentInterface = await client.request(
        "reject_payment"
      )
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export const resetPayment = (): Promise<RejectPaymentInterface> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: RejectPaymentInterface = await client.request(
        "reset_payment"
      )
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
      const response: CheckResultInterface = await client.request(
        "get_fiscalized_checks",
        startIndex,
        quantity
      )
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
      const response: BaseResultInterface = await client.request(
        "print_fiscalized_check",
        paymentSyncId
      )
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
