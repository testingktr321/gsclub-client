interface Image {
  id: string;
  url: string;
  position: number | null;
  productId: string | null;
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

interface ProductPuffs {
  id: string;
  productId: string;
  puffsId: string;
  puffDesc: string;
  createdAt: Date;
  updatedAt: Date;
  puffs: Puffs;
}

interface ReviewProps {
  id: string;
  userEmail: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

// New interface for the ProductFlavors relation
export interface ProductFlavors {
  id: string;
  productId: string;
  flavorId: string;
  createdAt: Date;
  flavor: Flavor; // Include the related flavor
}

export interface ProductContentSection {
  id: string;
  title: string;
  description: string;
  detailDescription: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  Review: ReviewProps[];
  currentPrice: number;
  originalPrice: number;
  // Optional fields
  eLiquidContent: string | null;
  batteryCapacity: string | null;
  coil: string | null;
  firingMechanism: string | null;
  type: string | null;
  resistance: string | null;
  powerRange: string | null;
  charging: string | null;
  extra: string | null;
  // Relations
  isArchived: boolean;
  brandId: string;
  brand: Brand;
  flavorId: string | null; // Make flavorId optional since it might use productFlavors instead
  flavor: Flavor | null; // Make flavor optional for the same reason
  nicotineId: string;
  Nicotine: Nicotine;
  // Many-to-many relation through ProductPuffs
  productPuffs: (ProductPuffs & { puffs: Puffs })[];
  // The new productFlavors relation
  productFlavors?: ProductFlavors[];
  // Alternative flattened representation (optional)
  puffs?: Array<Puffs & { description: string }>;
  // Images
  images: Image[];
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  redirectLink: string | null;
  packCount: number;
  detailDescription: string | null;
  ProductContentSection?: ProductContentSection | null
}
