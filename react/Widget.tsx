import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";
import { useRuntime } from "vtex.render-runtime";
import { ProductContextState } from "vtex.product-context/react/ProductContextProvider";
import { RenderRuntime } from "vtex.render-runtime/react/typings/runtime";

interface WidgetProps {
  widgetId: string;
  areProductTypesActive: boolean;
}

window.photoSlurpWidgetSettings = window.photoSlurpWidgetSettings || {};

const Widget: StorefrontFunctionComponent<WidgetProps> = (props) => {
  const { widgetId, areProductTypesActive } = props;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);

  const productContextValue: Partial<ProductContextState> = useProduct() ?? {};
  const runTime: RenderRuntime = useRuntime();

  const { photoSlurpWidgetSettings } = window;

  const psWidget = React.createElement("ps-widget", {
    "data-config": widgetId,
  });

  useEffect(() => {
    photoSlurpWidgetSettings[widgetId] = {
      lang: runTime.culture.language,
      productType: areProductTypesActive
        ? [runTime.route?.params?.category]
        : undefined,
    };

    const hasProductData = !!Object.keys(productContextValue).length;

    // If true is a product page
    if (hasProductData) {
      const productCategories = productContextValue.product?.categoryTree;
      if (productCategories) {
        const sku = productContextValue.product?.productReference;
        const productTypes: string[] = productCategories.map(
          (category) => category.name
        );

        photoSlurpWidgetSettings[widgetId].productId = sku;
        photoSlurpWidgetSettings[widgetId].productType = areProductTypesActive
          ? productTypes
          : undefined;

        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [productContextValue]);

  useEffect(() => {
    if (!isLoading && !isScriptLoaded) {
      const script = document.createElement("script");

      script.src = "https://static.photoslurp.com/widget/v3/loader.js";
      script.async = true;

      document.body.appendChild(script);
      setIsScriptLoaded(true);
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return <div className="ps-container">{psWidget}</div>;
};

Widget.schema = {
  title: "editor.widget.title",
  description: "editor.widget.description",
  type: "object",
  properties: {
    widgetId: {
      title: "Widget ID",
      type: "string",
      default: null,
    },
    areProductTypesActive: {
      title: "Enable Product Types",
      type: "boolean",
      default: false,
    },
  },
};

export default Widget;
