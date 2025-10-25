'use client';

import Image from 'next/image';
import { dark } from '@clerk/themes';
import { PricingTable } from '@clerk/nextjs';

import { useCurrentTheme } from '@/hooks/use-current-theme';

const Page = () => {
  const currentTheme = useCurrentTheme();
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Vibe"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-center">Pricing</h1>
        <p className="text-sm md:text-base text-center text-muted-foreground">
          Choose the plan that fits your needs the best.
        </p>
        <PricingTable
          appearance={{
            theme: currentTheme === 'dark' ? dark : undefined,
            elements: {
              pricingTableCard: 'border! shadow-none! rounded-lg!',
            },
          }}
        />
      </section>
    </div>
  );
};

export default Page;
