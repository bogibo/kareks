export interface GetStatusInterface {
  jcm_ipro_100_enabled: boolean
  jcm_ipro_100_status: number
  fiscal_device_enabled: boolean
  fiscal_device_status: number
  cash_code_sm_enabled: boolean
  cash_code_sm_status: number
  microcoin_sp_enabled: boolean
  microcoin_sp_status: number
  puloon_lcdm_2000_enabled: boolean
  puloon_lcdm_2000_status: number
  puloon_lcdm_1000_enabled: boolean
  puloon_lcdm_1000_status: number
  cube_hopper_mk_2_enabled: boolean
  cube_hopper_mk_2_status: number
  qiwi_processing_enabled: boolean
  qiwi_processing_status: number
  kassa24_kz_enabled: boolean
  kassa24_kz_status: number
  general_status: number
  last_payment_finish_result: boolean
  last_accept_payment_result: number
  all_generic_printers_ok: boolean
  bank_card_reader_enabled: boolean
  bank_card_reader_status: number
  coin_hoppers_enabled: boolean
  token_hoppers_enabled: boolean
  coin_hoppers_status: number
  token_hoppers_status: number
  processing_service_enable: boolean
  processing_service_status: number
  coin_hoppers_list: any[]
  token_hoppers_list: any[]
  command: string
  core_payment_state: number
  result: boolean
}
export interface MoneyChangingSessionInterface {
  command: string
  core_payment_state: number
  result: boolean
}
export interface RequestAmountInterface {
  received_amount: number
  rejected_denomination_amounts: {}
  could_total_amount_be_dispensed: boolean
  command: string
  core_payment_state: number
  result: boolean
}
export interface StopMoneyRecivingInterface {
  disabling_money_receiving_result: {
    disabled: boolean
    received_amount: number
  }
  command: string
  core_payment_state: number
  result: boolean
}
export interface AcceptPaymentInterface {
  accept_payment_result: number
  command: string
  core_payment_state: number
  result: boolean
}
export interface RejectPaymentInterface {
  command: string
  core_payment_state: number
  result: boolean
}
export interface CheckResultInterface {
  command: string
  core_payment_state: any
  result: boolean
  data: {
    terminal_id: string
    timestamp: Date
    payment_id: string
    price: number
  }
  checksTotal: number
}
export interface BaseResultInterface {
  command: string
	core_payment_state: any
	result: boolean
}
