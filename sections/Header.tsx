import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { name: "Главная", href: "/" },
  { name: "Каталог", href: "/catalog" },
  { name: "Дилерство", href: "/dealership" },
  { name: "Контакты", href: "/contacts" },
];

export default function Header() {
  return (
    <header className="w-full bg-white">
      <div className="max-w-screen-xl  mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              src="/images/atlant-trade-logo.png"
              alt="ATLANTTRADE Logo"
              width={120}
              height={120}
            />
          </div>
        </Link>

        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-red-600 font-bold transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div
          className="w-6 h-6 bg-gray-300 rounded-full"
          title="Language switch placeholder"
        ></div>
      </div>
    </header>
  );
}
