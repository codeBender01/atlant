import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <Image
        src="/images/banner.png"
        alt="Truck tire"
        layout="fill"
        objectFit="cover"
        priority
      />

      <div className="absolute inset-0 bg-black/40 flex mx-auto  items-center text-center ">
        <p className="text-white text-4xl md:text-4xl font-bold ">
          Грузовые шины и диски <br /> под ваши задачи
        </p>
      </div>
    </section>
  );
}
