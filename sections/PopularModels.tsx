import TyreCard from "@/components/shared/tyreCard";

const models = [
  {
    id: 1,
    name: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
  },
  {
    id: 2,
    name: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
  },
  {
    id: 3,
    name: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
  },
  {
    id: 4,
    name: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
  },
];

export default function PopularModels() {
  return (
    <section className="py-10 px-4 max-w-screen-xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Популярные модели</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {models.map((model, index) => (
          <TyreCard model={model} key={index} />
        ))}
      </div>
    </section>
  );
}
