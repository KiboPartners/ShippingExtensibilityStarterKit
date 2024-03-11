import { ActionId, EstimateTaxContext, createArcFunction } from "./main";
import { ThrirdPartyTaxableOrder, ThrirdPartyOrderTaxContext } from '@kibocommerce/rest-sdk/clients/PricingStorefront/models'
import { spreadTotalsOntoLineItems } from "./utils";

export const estimateTaxes = async (context: EstimateTaxContext): Promise<ThrirdPartyOrderTaxContext> => {
  var resp = context.response.body

  context.response.body.orderTax = (context.request.body.lineItems
    ?.map(l => l.lineItemPrice || 0)
    .reduce((partialSum: number, a) => partialSum + a, 0) || 0) * 0.1

  resp = spreadTotalsOntoLineItems(context.request.body, resp)
  return resp
}

