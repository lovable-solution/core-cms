import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { WhatYouCanGet } from '@/components/sections/WhatYouCanGet';
import { HowCoreWorks } from '@/components/sections/HowCoreWorks';
import { CoreSystems } from '@/components/sections/CoreSystems';
import { HPEInteractive } from '@/components/sections/HPEInteractive';
import { PilotPartners } from '@/components/sections/PilotPartners';
import { WhyCore } from '@/components/sections/WhyCore';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { getMediaSlot } from '@/lib/media';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [howCoreWorksImage, coreSystemsImage, pilotPartnersImage] = await Promise.all([
    getMediaSlot('howCoreWorks.image', '/images/section3/1.webp'),
    getMediaSlot('coreSystems.image', '/images/section4/1.webp'),
    getMediaSlot('pilotPartners.image', '/images/section5/1.webp'),
  ]);

  return (
    <>
      <Hero />
      <WhatYouCanGet />
      <HowCoreWorks image={howCoreWorksImage} />
      <CoreSystems image={coreSystemsImage} />
      <HPEInteractive />
      <PilotPartners image={pilotPartnersImage} />
      <WhyCore />
      <FinalCTA />
    </>
  );
}
