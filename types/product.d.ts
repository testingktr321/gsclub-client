interface Image {
  id: string;
  url: string;
  position: number | null;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Brand {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Flavor {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Puffs {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Nicotine {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  eLiquidContent: string;
  batteryCapacity: string;
  coil: string;
  firingMechanism: string;
  type: string;
  currentPrice: number;
  originalPrice: number;
  isArchived: boolean;
  brandId: string | null;
  brand: Brand | null;
  flavorId: string | null;
  flavor: Flavor | null;
  puffsId: string | null;
  Puffs: Puffs | null;
  nicotineId: string | null;
  Nicotine: Nicotine | null;
  images: Image[];
  createdAt: Date;
  updatedAt: Date;
}
