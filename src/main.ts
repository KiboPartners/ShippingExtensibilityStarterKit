
import { RateRequest } from "@kibocommerce/rest-sdk/clients/ShippingStorefront";
import { platformApplicationsInstallImplementation } from "./platformInstall";
import { cancelLabels, getLabels, getManifest, getManifestUrl, getRates } from "./shippingController";
import { CancelLabelRequest, ManifestRequest, ShipmentRequest } from "./types";

/**
 * Modify this list if you need more actions
 */
export enum ActionId {
  "embedded.commerce.catalog.storefront.shipping.shippingExtensibility.main",
  "embedded.platform.applications.install",
}

export type ShippingExtensibilityMainContext = {
  get: {
    request: () => {
      context: any,
      request: any
    }
    method: () => 'rates' | 'labels' | 'manifest' | 'manifest-url' | 'cancel-labels' 
  },
  carrierId: string,
  exec: Record<string, never>
}

export interface ArcFunction {
  actionName: string;
  customFunction: (
    context: any,
    callback: (errorMessage?: string | null, resp?: any) => void
  ) => void;
}

export function createArcFunction(
  actionName: ActionId,
  customFunction: (
    context: any,
    callback: (errorMessage?: string | null, resp?: any) => void
  ) => void
): ArcFunction {
  return { actionName: ActionId[actionName], customFunction: customFunction };
}

const shippingExtensibilityAction = createArcFunction(
  ActionId["embedded.commerce.catalog.storefront.shipping.shippingExtensibility.main"],
  function (context: ShippingExtensibilityMainContext, callback: (error: string | null, resp: any) => void) {

      const requestHolder = context.get.request();
      const requestPayload = requestHolder.request
      const requestContext = requestHolder.context

      console.log('shippingExtensibilityAction2', context.get.method())
      switch(context.get.method()) {
        case 'rates':
          getRates(requestContext, requestPayload as RateRequest).then((resp) => {
            callback(null, resp)
          })
          break;
        
        case 'labels':
          getLabels(requestContext, requestPayload as ShipmentRequest).then((resp) => {
            callback(null, resp)
          })
          break;
      
        case 'manifest':
          getManifest(requestContext, requestPayload as ManifestRequest).then((resp) => {
            callback(null, resp)
          })
          break;
      
        case 'manifest-url':
          getManifestUrl(requestContext, requestPayload as string).then((resp) => {
            callback(null, resp)
          })
          break;
      
        case 'cancel-labels':
          cancelLabels(requestContext, requestPayload as CancelLabelRequest).then((resp) => {
            callback(null, resp)
          })
          break;
      
        default:
          throw new Error('Invalid method provided');
      }
  }
);

const platformApplicationsInstall = createArcFunction(
  ActionId["embedded.platform.applications.install"],
  function (context: any, callback: (errorMessage?: string) => void) {
    console.log("ts installing");
    platformApplicationsInstallImplementation(context, callback).then(() => {
      callback()
    })
  }
);

export default {
  "embedded.commerce.catalog.storefront.shipping.shippingExtensibility.main": shippingExtensibilityAction,
  "embedded.platform.applications.install": platformApplicationsInstall,
}