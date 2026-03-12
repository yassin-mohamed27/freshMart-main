// import FeaturedProductsSliderClient from "./FeaturedProductsSliderClient";

import FeaturedProductsSliderClient from "./FeaturedProductsSliderClient";

export default async function FeaturedProductsSlider() {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/products?limit=12", {
        cache: "no-store",
    });
    const json = await res.json();
    const products = json?.data ?? [];

    return <FeaturedProductsSliderClient products={products} />;
}
