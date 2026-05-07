import { MetaBeast } from '../beasts/MetaBeast';
import { InstagramBeast } from '../beasts/InstagramBeast';
// Import other beasts here

export type BeastType = 'MetaBeast' | 'InstagramBeast' | /* more */;

export const BeastRegistry = {
  MetaBeast,
  InstagramBeast,
  // ... more
} as const;

export type RegisteredBeast = typeof BeastRegistry[keyof typeof BeastRegistry];

export function getBeast(beastType: BeastType) {
  return BeastRegistry[beastType];
}

// High-leverage: Dynamic beast loading
export async function getBeastInstance(beastType: BeastType, connectionId?: number) {
  const BeastClass = getBeast(beastType);
  return new BeastClass(connectionId);
}
