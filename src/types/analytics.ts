/**
 * IziAnalytics - Analytics & Multi-Site TypeScript Definitions
 */

export interface HourlyTrafficPoint {
  time?: string;
  label?: string;
  visitors: number;
  sales: number;
}

export interface GatewayShare {
  name: string;
  sharePct: number;
  color: string;
}

export interface SiteStats {
  uniqueVisitors: number;
  visitorsChangePct: number;
  yesterdayVisitors?: number;
  topSource: string;
  topSourceClicks: number;
  revenue: number;
  currency: string;
  salesCount: number;
  conversionRate: number;
  gateways: GatewayShare[];
  hourlyTraffic: HourlyTrafficPoint[];
}

export interface Site {
  id: string;
  name: string;
  domain: string;
  trackingId: string;
  currency: string;
  createdAt: string;
  isConnected: boolean;
  stats: SiteStats;
}

export type PlanType = "starter" | "founder_annual" | "founder_monthly";

export type PaymentGatewayType = "wave" | "orange_money" | "mtn" | "stripe";

export interface ProLicense {
  key: string;
  plan: PlanType | string;
  orderBump: boolean;
  amountPaid: number;
  currency: string;
  paymentMethod: PaymentGatewayType | string;
  payerContact?: string;
  activatedAt: string;
}

export interface PlanConfig {
  id: PlanType;
  name: string;
  price: number;
  periodLabel: string;
  currency: string;
  badge?: string;
  description: string;
  features: string[];
}
