import { EstimateTaxContext } from "./main";
import { ThrirdPartyOrderTaxContext } from '@kibocommerce/rest-sdk/clients/PricingStorefront/models'
import { createBlankResponse, spreadTotalsOntoLineItems } from "./utils";

/**
 * Main entrance point to implement your tax logic
 * 
 * @param context API Extension Context
 * @returns ThrirdPartyOrderTaxContext
 */
export const estimateTaxes = async (context: EstimateTaxContext): Promise<ThrirdPartyOrderTaxContext> => {
  const request = context.request.body
  let resp = createBlankResponse(context.request.body)

  /* Flat 10% tax */
  resp.orderTax = (request.lineItems
    ?.map(l => l.lineItemPrice || 0)
    .reduce((partialSum: number, a) => partialSum + a, 0) || 0) * 0.1

  resp = spreadTotalsOntoLineItems(request, resp)
  
  return resp
}

