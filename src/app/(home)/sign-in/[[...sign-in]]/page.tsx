'use client';

import { dark } from '@clerk/themes';
import { SignIn } from '@clerk/nextjs';

import { useCurrentTheme } from '@/hooks/use-current-theme';

const Page = () => {
  const currentTheme = useCurrentTheme();
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <SignIn
            appearance={{
              theme: currentTheme === 'dark' ? dark : undefined,
              elements: { cardBox: 'border! shadow-none! rounded-lg!' },
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default Page;
