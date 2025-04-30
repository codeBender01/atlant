import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import FilterSelect from "@/components/shared/filterSelect";

export default function TruckTiresPage() {
  const tires = Array(9).fill({
    id: 1,
    model: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
    width: "315",
    height: "80",
    diameter: "R22.5",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Грузовые шины</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <FilterSelect
          label="Ширина"
          options={[
            { label: "Все", value: "all" },
            { label: "295", value: "295" },
            { label: "315", value: "315" },
            { label: "385", value: "385" },
          ]}
        />

        <FilterSelect
          label="Высота"
          options={[
            { label: "Все", value: "all" },
            { label: "70", value: "70" },
            { label: "80", value: "80" },
            { label: "90", value: "90" },
          ]}
        />

        <FilterSelect
          label="Диаметр"
          options={[
            { label: "Все", value: "all" },
            { label: "R22.5", value: "r22.5" },
            { label: "R19.5", value: "r19.5" },
            { label: "R17.5", value: "r17.5" },
          ]}
        />

        <FilterSelect
          label="Ось"
          options={[
            { label: "Все", value: "all" },
            { label: "Ведущая", value: "drive" },
            { label: "Рулевая", value: "steer" },
            { label: "Прицепная", value: "trailer" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tires.map((tire, index) => (
          <Card key={index} className="overflow-hidden border border-gray-200">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="w-full h-48 relative mb-4">
                <Image
                  width={100}
                  height={100}
                  src={tire.image}
                  alt={tire.model}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-center">{tire.model}</h3>
            </CardContent>
            <CardFooter className="flex justify-center px-24">
              <Button className="w-full rounded-lg py-2 bg-red-700 hover:bg-red-800 text-white">
                ПОДРОБНЕЕ О МОДЕЛИ
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-8 right-8">
        <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 font-medium">
          ЗАЯВКА
          <Badge className="ml-2 bg-red-600 w-4 h-4 rounded-full p-0 flex items-center justify-center">
            1
          </Badge>
        </Button>
      </div>
    </div>
  );
}
