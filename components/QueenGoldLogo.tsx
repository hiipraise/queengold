import React from "react";
import Image from "next/image";
import logoSrc from "./queengold.jpg";

interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: { width: 100, height: 55 },
  md: { width: 160, height: 88 },
  lg: { width: 220, height: 121 },
  xl: { width: 300, height: 165 },
};



export default function QueenGoldLogo({ size = "md", className = "" }: Props) {
  const { width, height } = sizes[size];

  return (
    <Image
      src={logoSrc}
      alt="Queen Gold"
      width={width}
      height={height}
      className={className}
      draggable={false}
    />
  );
}