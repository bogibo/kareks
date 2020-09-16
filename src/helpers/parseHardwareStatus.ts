import { GetStatusInterface } from "../api/interfaces"

interface ResultInterface {
  fiscal: boolean
  cash: {
    cash: boolean
    hopper: boolean
  }
}

export const parseHardwareStatus = (
  status: GetStatusInterface
): ResultInterface => {
  const result = {
    fiscal: false,
    cash: {
      cash: false,
      hopper: false,
    },
  }
  if (
    status.fiscal_device_enabled &&
    (status.fiscal_device_status === 1 ||
      status.fiscal_device_status === 2 ||
      status.fiscal_device_status === 3)
  )
    result.fiscal = true
  if (
    status.cash_code_sm_enabled &&
    (status.cash_code_sm_status === 1 ||
      status.cash_code_sm_status === 2 ||
      status.cash_code_sm_status === 3)
  )
    result.cash.cash = true
  if (
    status.cube_hopper_mk_2_enabled &&
    (status.coin_hoppers_status === 1 ||
      status.coin_hoppers_status === 2 ||
      status.coin_hoppers_status === 3)
  )
    result.cash.hopper = true

  return result
}
