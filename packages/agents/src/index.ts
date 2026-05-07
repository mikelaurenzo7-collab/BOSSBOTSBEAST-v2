// Central export for all beasts
import beastRegistry from './registry/BeastRegistry';
import { MetaBeast } from './beasts/MetaBeast';
import { InstagramBeast } from './beasts/InstagramBeast';

// Register all beasts
const metaBeast = new MetaBeast();
const instagramBeast = new InstagramBeast();

beastRegistry.register(metaBeast);
beastRegistry.register(instagramBeast);

export { beastRegistry };
export { MetaBeast, InstagramBeast };
// Export more beasts as they are added
export type { OAuthIntegrationBeast } from './beasts/base/OAuthIntegrationBeast';

export default beastRegistry;
