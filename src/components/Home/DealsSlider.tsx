
import DealsSliderClient from "./DealsSliderClient";
export default async function DealsSlider() {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/products?limit=40", {
        cache: "no-store",
    });
    const json = await res.json();
    const products = json?.data ?? [];

    const deals = products.filter((p: any) => p.priceAfterDiscount).slice(0, 12);

    return <DealsSliderClient products={deals} />;
}
