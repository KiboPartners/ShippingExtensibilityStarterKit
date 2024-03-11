import { ThrirdPartyTaxableOrder, ThrirdPartyOrderTaxContext } from '@kibocommerce/rest-sdk/clients/PricingStorefront/models'

/**
 * Wrapper function to make sure all currency rounded correctly. Anytime you do math on currency you need to wrap around this function. In JavaScript adding .1+.2 returns 0.30000000000000004, so you need to make sure you always return rounded values.
 * 
 * @param n Amount to 
 * @returns 
 */
export const safeToCurrency = (n: number | undefined): number => {
  return Number((n || 0).toFixed(2))
}

/**
 * One of the main issues with tax integrations is making sure that the sum of the line item totals equals the order tax. If they do not equal, you could run into issues after the order is submitted, since the shipments will be created from the order line items, and summed to be the new balance.
 * 
 * This function validates that the totals match and will crash otherwise.
 * 
 * @param taxResponse The tax response to be submitted to Kibo
 */
export const validateTotalsMatch = (taxResponse: ThrirdPartyOrderTaxContext) => {
  const taxResponseItemsTotal = safeToCurrency(taxResponse.itemTaxContexts?.map(i => i.tax || 0).reduce((partialSum, a) => partialSum + a, 0))
  const taxResponseItemsShippingTotal = safeToCurrency(taxResponse.itemTaxContexts?.map(i => i.shippingTax || 0).reduce((partialSum, a) => partialSum + a, 0))
  if (taxResponseItemsTotal != taxResponse.orderTax) {
    throw new Error(`Order line item totals do not equal order total. Order line item total: ${taxResponseItemsTotal}. Order tax total: ${taxResponse.orderTax}`)
  }
  if (taxResponseItemsShippingTotal != taxResponse.shippingTax) {
    throw new Error(`Order line item shipping totals do not equal order shipping total. Order line item shipping total: ${taxResponseItemsShippingTotal}. Order shipping tax total: ${taxResponse.shippingTax}`)
  }
}

export const spread = (total: number, count: number): Array<number> => {
  let results: Array<number> = []
  const amountPerItem = Number((total / count).toFixed(2))
  for (let i = 0; i < count; i++) {
    // Take into account penny rounding, put the extra cent in the first payment
    results.push(Number((i == 0 ? amountPerItem + (total - (amountPerItem * count)) : amountPerItem).toFixed(2)))
  }
  return results
}

/**
 * In case there are any floating point rounding issues, we need to fix before sending back to Kibo.
 * 
 * @param taxResponse The tax response to be submitted to Kibo
 * @returns Fixed tax response to be submitted to Kibo
 */
export const roundCurrencyValues = (taxResponse: ThrirdPartyOrderTaxContext): ThrirdPartyOrderTaxContext => {
  taxResponse.orderTax = safeToCurrency(taxResponse.orderTax)
  taxResponse.shippingTax = safeToCurrency(taxResponse.shippingTax)
  taxResponse.handlingFeeTax = safeToCurrency(taxResponse.handlingFeeTax)
  for (let item of taxResponse.itemTaxContexts || []) {
    item.shippingTax = safeToCurrency(item.shippingTax)
    item.tax = safeToCurrency(item.tax)
  }
  return taxResponse
}

/**
 * Fix any penny rounding on line item totals.
 * 
 * @param taxResponse The tax response to be submitted to Kibo
 * @returns Fixed tax response to be submitted to Kibo
 */
export const fixPennyRoundingOnLineItems = (taxResponse: ThrirdPartyOrderTaxContext): ThrirdPartyOrderTaxContext => {
  const lineItemTaxTotals = taxResponse.itemTaxContexts?.map(i => i.tax || 0)?.reduce((partialSum: number, a: number) => partialSum + a, 0) || 0
  const lineItemShippingTotals = taxResponse.itemTaxContexts?.map(i => i.shippingTax || 0)?.reduce((partialSum: number, a: number) => partialSum + a, 0) || 0

  // We adjust the first item to add or remove the penny
  const firstItem = taxResponse.itemTaxContexts?.[0]
  if (firstItem) {
    firstItem.tax = (firstItem.tax || 0) - (lineItemTaxTotals - (taxResponse.orderTax || 0))
    firstItem.shippingTax = (firstItem.shippingTax || 0) - (lineItemShippingTotals - (taxResponse.shippingTax || 0))
  }
  return taxResponse
}

/**
 * Used when you only have an order tax, and need to spread that to the line items.
 * 
 * @param taxResponse The tax response to be submitted to Kibo
 * @returns Fixed tax response to be submitted to Kibo
 */
export const spreadTotalsOntoLineItems = (taxRequest: ThrirdPartyTaxableOrder, taxResponse: ThrirdPartyOrderTaxContext): ThrirdPartyOrderTaxContext => {
  const total = taxRequest.lineItems?.map(l => l.lineItemPrice || 0)?.reduce((partialSum: number, a: number) => partialSum + a, 0) || 0

  for (let item of taxResponse.itemTaxContexts || []) {
    const requestItem = taxRequest.lineItems?.find(l => l.id == item.id)
    if (requestItem) {
      const impact = total / (requestItem.lineItemPrice || 0)
      item.tax = impact * (taxResponse.orderTax || 0)
      item.shippingTax = impact * (taxResponse.shippingTax || 0)
    }
  }
  return roundCurrencyValues(
    fixPennyRoundingOnLineItems(
      roundCurrencyValues(taxResponse)))
}