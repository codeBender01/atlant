"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  label: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export default function FilterSelect({
  label,
  options,
  onChange,
}: FilterSelectProps) {
  const [selectedValue, setSelectedValue] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("Все");

  const handleSelect = (option: FilterOption) => {
    setSelectedValue(option.value);
    setSelectedLabel(option.label);
    // Call onChange without any page reload
    onChange(option.value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal"
        >
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-sm">{selectedLabel}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[200px]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSelect(option)}
            className={selectedValue === option.value ? "bg-gray-100" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
