import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <Image
        src="/images/banner.png"
        alt="Truck tire background"
        layout="fill"
        objectFit="cover"
        priority
      />

      <div className="absolute inset-0 bg-black/40 flex items-center mx-auto  text-center px-4">
        <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight">
          Грузовые шины и диски <br /> под ваши задачи
        </h1>
      </div>
    </section>
  );
}
