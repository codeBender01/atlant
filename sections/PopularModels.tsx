import Image from "next/image";

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
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-white border border-gray-200 rounded-xl shadow-xl p-4 flex flex-col items-center text-center"
          >
            <div className="w-32 h-48 relative mb-4">
              <Image
                src={model.image}
                alt={model.name}
                fill
                className="object-contain"
              />
            </div>
            <p className="font-semibold mb-3">{model.name}</p>
            <button className="bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700 transition">
              подробное описание
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
