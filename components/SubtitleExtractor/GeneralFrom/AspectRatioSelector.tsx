"use client";

import { Button } from "@/components/UI/button";
import { cn } from "@/libs/cn";

interface AspectRatioButtonProps {
  ratio: string;
  width: number;
  height: number;
  selected?: boolean;
  onClick?: () => void;
}

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onRatioChange: (ratio: string) => void;
  className?: string;
}

const ASPECT_RATIOS = [
  { ratio: "9:16", width: 0.84375, height: 1.5 },
  { ratio: "16:9", width: 1.5, height: 0.84375 },
  { ratio: "1:1", width: 1.5, height: 1.5 },
  { ratio: "4:3", width: 1.125, height: 0.84375 }, // 修正为正确的4:3比例
  { ratio: "3:4", width: 0.84375, height: 1.125 },
];

function AspectRatioButton({
  ratio,
  width,
  height,
  selected = false,
  onClick,
}: AspectRatioButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "p-4 h-auto border-2 transition-all duration-200",
        selected
          ? "border-purple-500 bg-purple-500/10" // 选中状态：紫色边框+淡紫色背景
          : "border-transparent hover:border-gray-600 hover:bg-gray-700/30" // 未选中状态：透明边框，悬停时灰色边框
      )}
      onClick={onClick}
    >
      <div className="mx-auto mb-1 flex h-6 items-center justify-center">
        <div
          className={cn(
            "rounded transition-colors duration-200",
            selected ? "bg-purple-400" : "bg-gray-500"
          )}
          style={{ 
            width: `${width}rem`, 
            height: `${height}rem`,
            // 添加微妙的阴影效果
            boxShadow: selected ? "0 0 4px rgba(168, 85, 247, 0.5)" : "none"
          }}
        ></div>
        <span
          className={cn(
            "mt-1 text-xs pl-2 font-medium",
            selected ? "text-purple-300" : "text-gray-400"
          )}
        >
          {ratio}
        </span>
      </div>
    </Button>
  );
}

export function AspectRatioSelector({
  selectedRatio,
  onRatioChange,
  className,
}: AspectRatioSelectorProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {ASPECT_RATIOS.map(({ ratio, width, height }) => (
        <AspectRatioButton
          key={ratio}
          ratio={ratio}
          width={width}
          height={height}
          selected={selectedRatio === ratio}
          onClick={() => onRatioChange(ratio)}
        />
      ))}
    </div>
  );
}