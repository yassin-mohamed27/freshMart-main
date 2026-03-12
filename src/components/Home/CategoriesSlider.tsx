import CategoriesSliderClient from "./CategoriesSliderClient";

export default async function CategoriesSlider() {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/categories?limit=20", {
        cache: "no-store",
    });
    const json = await res.json();
    const categories = json?.data ?? [];

    return <CategoriesSliderClient categories={categories} />;
}
