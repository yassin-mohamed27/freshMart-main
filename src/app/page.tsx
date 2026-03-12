import Hero from "@/components/Hero/Hero";
import CategoriesSlider from "@/components/Home/CategoriesSlider";
import DealsSlider from "@/components/Home/DealsSlider";
import ServicesStrip from "@/components/Home/ServicesStrip";

export default function HomeSections() {
  return <>
    <Hero/>
      <ServicesStrip />
      <CategoriesSlider />
      <DealsSlider />
    </>
}