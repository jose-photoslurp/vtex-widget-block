export interface TimeSplit {
  hours: string;
  minutes: string;
  seconds: string;
}

declare global {
  interface Window {
    photoSlurpWidgetSettings: {
      [key: string]: {
        productType?: string[];
        lang?: string;
        productId?: number | string;
      };
    };
  }
}
