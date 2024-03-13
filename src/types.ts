
import { Measurement, Carrier, CustomAttribute, RateRequest } from '@kibocommerce/rest-sdk/clients/ShippingStorefront'
import { Contact, Category } from '@kibocommerce/rest-sdk/clients/Commerce'

export interface CancelLabelRequest {
  integratorIds?: string[];
  carrierId?: string;
  fulfillmentLocationCode?: string;
}

export interface CancelLabelResponse {
  labelStatus: LabelStatus[];
  messages: Notification[];
  isSuccessful: boolean;
}

export interface CarrierMethods {
  carrierId: string;
  shippingMethods: string[];
}

export interface CarrierRatesResponse {
  carrierId: string;
  shippingRates: ShippingRate[];
  customAttributes: CustomAttribute[];
}

export interface CarrierResponse {
  carriers: Carrier[];
}

export interface CustomerReferences {
  key: string;
  value: string;
}
export interface ExternalRateRequest extends RateRequest {
  carrierRates: CarrierMethods[];
}
export interface ItemMeasurements {
  height: Measurement;
  width: Measurement;
  length: Measurement;
  weight: Measurement;
  girth?: number;
}

export interface LabelRequest {
  carrierId: string;
  labelFormat: string;
  trackingNumber: string;
  packageTrackingNumber: string;
}

export interface LabelResponse {
  trackingNumber: string;
  packageLabels: PackageLabelResponse[];
}

export interface LabelStatus {
  integratorId: string;
  refundStatus: string;
}

export interface ManifestRequest {
  carrierId: string;
  includedShipments: ManifestShipment[];
  locationCode: string;
}

export interface ManifestResponse {
  manifestId: string;
  manifestUrl: string;
  carrierId: string;
  locationCode: string;
  includedShipments: ManifestShipment[];
  messages: Notification[];
  isSuccessful: boolean;
}

export interface ManifestShipment {
  shipmentNumber: number;
  integratorIds: string[];
}

export interface Money {
  currencyCode: string;
  value: number;
}

export interface Notification {
  source: string;
  message: string;
  code: string;
}

export interface Package {
  id: string;
  contentsValue?: number;
  measurements: PackageMeasurements;
  isGift?: boolean;
  customAttributes: CustomAttribute[];
  requiresSignature?: boolean;
  packagingType: string;
  productSummaries: ProductSummary[];
}

export interface PackageLabelResponse {
  trackingNumber: string;
  label: ShippingLabel;
}

export interface PackageMeasurements {
  height: Measurement;
  width: Measurement;
  length: Measurement;
  weight: Measurement;
}

export interface ProductSummary {
  productCode: string;
  productType: string;
  categories: Category[];
  unitMeasurements: ItemMeasurements;
  properties: ProductProperty[];
  options: ProductOption[];
  productDescription: string;
  quantity: number;
  price: number;
}

export interface ProductProperty {
  attributeFQN: string;
  dataType: string;
  values: Array<any>;
}

export interface ProductOption {
  attributeFQN: string;
  dataType: string;
  value: any;
}

export interface RateRequestGroup {
  rateRequests: RateRequest[];
  id: string;
}

export interface RateRequestItem {
  itemId: string;
  shipsByItself?: boolean;
  productSummaries: ProductSummary[];
  unitMeasurements: ItemMeasurements;
  quantity?: number;
  data: any;
}

export interface RatesResponse {
  id: string;
  resolvedShippingZoneCode: string;
  shippingZoneCodes: string[];
  rates: CarrierRatesResponse[];
}

export interface RatesResponseGroup {
  id: string;
  ratesResponse: RatesResponse;
  componentRates: RatesResponse[];
}

export interface Shipment {
  orderTotal?: number;
  origin: Contact;
  destination: Contact;
  fulfillmentLocationCode: string;
  packages: Package[];
  shippingMethodCodes: string[];
  customAttributes: CustomAttribute[];
  estimatedShipmentDate: Date;
}

export interface ShipmentPackageRequest {
  carrierId: string;
  serviceType: string;
  items: RateRequestItem[];
}

export interface ShipmentPackageResponse {
  carrierId: string;
  packages: Package[];
}

export interface ShipmentRequest {
  iSOCurrencyCode: string;
  shipment: Shipment;
  customAttributes: CustomAttribute[];
  carrierId: string;
  shippingServiceType: string;
  shipmentRequestType: string;
  requiresSignature?: boolean;
  labelFormat: string;
  customerReferences: CustomerReferences[];
  relatedOrderId: string;
  relatedOrderNumber?: number;
  relatedShipmentNumber?: number;
}

export interface PackageResponse {
  id: string;
  trackingNumber: string;
  label: ShippingLabel;
  customAttributes: CustomAttribute[];
  integratorId?: string;
}

export interface ShipmentResponse {
  shippingTotal: Money;
  trackingNumber: string;
  packageResponses: PackageResponse[];
  customAttributes: CustomAttribute[];
  messages: Notification[];
  isSuccessful: boolean;
}

export interface ShippingItemRate {
  itemId: string;
  quantity?: number;
  amount?: number;
}

export interface ShippingLabel {
  imageFormat: string;
  imageData: number[] | string;
  labelUrl?: string | null;
}

export interface ShippingRate {
  code: string;
  content?: ShippingRateLocalizedContent
  amount?: number;
  daysInTransit?: number;
  shippingItemRates: ShippingItemRate[];
  customAttributes: CustomAttribute[];
  messages?: ShippingRateValidationMessage[];
  data?: any;
}

export interface ShippingRateLocalizedContent {
  localeCode: string;
  name: string;
}

export interface ShippingRateValidationMessage {
  severity: string;
  message: string;
  helpLink: string;
}
