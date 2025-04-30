import BecomeDealer from "@/sections/BecomeDealer";
import Brands from "@/sections/Brands";
import Catalog from "@/sections/Catalog";

import Hero from "@/sections/Hero";
import PopularModels from "@/sections/PopularModels";

export default function Home() {
  // grid grid-rows-[100px_1fr_30px]
  return (
    <div className=" min-h-screen">
      <Hero />
      <PopularModels />
      <Catalog />
      <Brands />
      <BecomeDealer />
    </div>
  );
}
