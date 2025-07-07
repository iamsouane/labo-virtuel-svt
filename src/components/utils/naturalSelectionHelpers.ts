// src/utils/simulation/naturalSelectionHelpers.ts
export const determineTraitFromAlleles = (
  alleles: [string, string],
  trait: "fur" | "ear" | "tooth"
): "brown" | "white" | "straight" | "floppy" | "long" | "short" => {
  const [a1, a2] = alleles

  switch (trait) {
    case "fur":
      return a1 === "B" || a2 === "B" ? "brown" : "white"
    case "ear":
      return a1 === "S" || a2 === "S" ? "straight" : "floppy"
    case "tooth":
      return a1 === "L" || a2 === "L" ? "long" : "short"
    default:
      // fallback safe value
      return "white"
  }
}

export const generateRabbitName = (): string => {
  const names = [
    "Caramel",
    "Flocon",
    "Luna",
    "Simba",
    "Zoe",
    "Oscar",
    "Tulipe",
    "Coco",
    "Chloe",
    "Soleil",
    "Miel",
    "Ziggy",
  ]
  return names[Math.floor(Math.random() * names.length)]
}