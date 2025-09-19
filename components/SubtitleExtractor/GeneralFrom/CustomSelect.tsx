"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

interface CustomSelectProps {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function CustomSelect({
  options,
  placeholder = "Select an option",
  value,
  onChange,
  className = "",
}: CustomSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`bg-black/90 text-gray-300 border border-purple-500/40 ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-black/90 border border-purple-500/30 text-gray-300">
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="hover:bg-purple-500/10 focus:bg-purple-500/20 focus:text-white cursor-pointer"
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}