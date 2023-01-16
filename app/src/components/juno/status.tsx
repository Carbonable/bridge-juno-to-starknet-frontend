import React from "react";
export default function Status({ children }: React.PropsWithChildren) {
  return (
    <span
      className={`
                uppercase font-bold font-inter py-1 px-2 text-xs rounded-xl ml-2 text-neutral-500
                ${children === "success" ? "bg-primary" : ""} 
                ${children === "to bridge" ? "bg-neutral-300" : ""}
                ${children === "error" ? "bg-red" : ""}
                ${children === "pending" ? "bg-orange" : ""}
                ${children === "processing" ? "bg-blue" : ""}
            `}
    >
      {children}
    </span>
  );
}
