export type BuildingType =
  | "Miner"
  | "OilExtractor"
  | "WaterExtractor"
  | "ResourceWellExtractor"

  | "Smelter"
  | "Foundry"
  | "Constructor"
  | "Assembler"
  | "Manufacturer"
  | "Refinery"
  | "Blender"
  | "Packager"
  | "ParticleAccelerator"
  | "QuantumEncoder"
  | "Converter"

  | "BiomassBurner"
  | "CoalGenerator"
  | "FuelGenerator"
  | "NuclearPowerPlant"
  | "GeothermalGenerator"

  | "Storage"
  | "IndustrialStorage"
  | "FluidBuffer"

  | "Splitter"
  | "SmartSplitter"
  | "ProgrammableSplitter"
  | "Merger"
  | "PriorityMerger"

  | "TruckStation"
  | "DronePort"
  | "TrainStation"
  | "FreightPlatform"
  | "FluidFreightPlatform"

  | "AwesomeSink"

  | "Hub"
  | "MAM"
  | "SpaceElevator";

export interface BuildingDef {
  type: string;
  label: string;
  inPorts: number;
  outPorts: number;
  icon?: string;
}

export interface BuildingCategory {
  name: string;
  buildings: BuildingDef[];
}

export const BUILDING_CATEGORIES: BuildingCategory[] = [
  {
    name: "Extraction",
    buildings: [
      { type: "Miner", label: "Mineur (Mk1 / Mk2 / Mk3)", inPorts: 0, outPorts: 1 },
      { type: "OilExtractor", label: "Extracteur de pétrole", inPorts: 0, outPorts: 0 },
      { type: "WaterExtractor", label: "Extracteur d'eau", inPorts: 0, outPorts: 0 },
      { type: "ResourceWellExtractor", label: "Extracteur de puits de ressources", inPorts: 0, outPorts: 1 },
    ],
  },
  {
    name: "Production",
    buildings: [
      { type: "Smelter", label: "Fondeuse", inPorts: 1, outPorts: 1 },
      { type: "Foundry", label: "Fonderie", inPorts: 2, outPorts: 1 },
      { type: "Constructor", label: "Constructeur", inPorts: 1, outPorts: 1 },
      { type: "Assembler", label: "Assembleur", inPorts: 2, outPorts: 1 },
      { type: "Manufacturer", label: "Fabricant", inPorts: 4, outPorts: 1 },
      { type: "Refinery", label: "Raffinerie", inPorts: 1, outPorts: 1 },
      { type: "Blender", label: "Mélangeur", inPorts: 1, outPorts: 1 },
      { type: "Packager", label: "Conditionneur", inPorts: 1, outPorts: 1 },
      { type: "ParticleAccelerator", label: "Accélérateur de particules", inPorts: 2, outPorts: 1 },
      { type: "QuantumEncoder", label: "Encodeur quantique", inPorts: 4, outPorts: 1 },
      { type: "Converter", label: "Convertisseur", inPorts: 2, outPorts: 1 },
    ],
  },
  {
    name: "Énergie",
    buildings: [
      { type: "BiomassBurner", label: "Générateur à biomasse", inPorts: 1, outPorts: 0 },
      { type: "CoalGenerator", label: "Générateur à charbon", inPorts: 1, outPorts: 0 },
      { type: "FuelGenerator", label: "Générateur à carburant", inPorts: 0, outPorts: 0 },
      { type: "NuclearPowerPlant", label: "Centrale nucléaire", inPorts: 1, outPorts: 0 },
      { type: "GeothermalGenerator", label: "Générateur géothermique", inPorts: 0, outPorts: 0 },
    ],
  },
  {
    name: "Stockage",
    buildings: [
      { type: "Storage", label: "Conteneur de stockage", inPorts: 1, outPorts: 1 },
      { type: "IndustrialStorage", label: "Conteneur industriel", inPorts: 2, outPorts: 2 },
      { type: "FluidBuffer", label: "Réservoir de fluide", inPorts: 0, outPorts: 0 },
    ],
  },
  {
    name: "Logistique convoyeur",
    buildings: [
      { type: "Splitter", label: "Répartiteur", inPorts: 1, outPorts: 3 },
      { type: "SmartSplitter", label: "Répartiteur intelligent", inPorts: 1, outPorts: 3 },
      { type: "ProgrammableSplitter", label: "Répartiteur programmable", inPorts: 1, outPorts: 3 },
      { type: "Merger", label: "Fusionneur", inPorts: 3, outPorts: 1 },
      { type: "PriorityMerger", label: "Fusionneur prioritaire", inPorts: 3, outPorts: 1 },
    ],
  },
  {
    name: "Transport",
    buildings: [
      { type: "TruckStation", label: "Station de camion", inPorts: 1, outPorts: 1 },
      { type: "DronePort", label: "Port de drone", inPorts: 1, outPorts: 1 },
      { type: "TrainStation", label: "Gare ferroviaire", inPorts: 1, outPorts: 1 },
      { type: "FreightPlatform", label: "Plateforme de fret", inPorts: 1, outPorts: 1 },
      { type: "FluidFreightPlatform", label: "Plateforme de fret fluide", inPorts: 0, outPorts: 0 },
    ],
  },
  {
    name: "Spécial",
    buildings: [
      { type: "AwesomeSink", label: "Broyeur AWESOME Sink", inPorts: 1, outPorts: 0 },
    ],
  },
  {
    name: "Progression",
    buildings: [
      { type: "Hub", label: "Hub", inPorts: 0, outPorts: 0 },
      { type: "MAM", label: "MAM (Analyse moléculaire)", inPorts: 0, outPorts: 0 },
      { type: "SpaceElevator", label: "Ascenseur spatial", inPorts: 0, outPorts: 0 },
    ],
  },
];