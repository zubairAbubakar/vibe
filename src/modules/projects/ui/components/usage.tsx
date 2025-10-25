import Link from 'next/link';
import { CrownIcon } from 'lucide-react';
import { formatDuration, intervalToDuration } from 'date-fns';

import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';

interface Props {
  usagePoints: number;
  millisecondsBeforeNext: number;
}

export const Usage = ({ usagePoints, millisecondsBeforeNext }: Props) => {
  const { has } = useAuth();
  const isProUser = has?.({ plan: 'pro' });
  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {usagePoints} {isProUser ? '' : 'free'} credits remaining
          </p>
          <p className="text-xs text-muted-foreground">
            Resets in{' '}
            {formatDuration(
              intervalToDuration({
                start: new Date(),
                end: new Date(Date.now() + millisecondsBeforeNext),
              }),
              { format: ['months', 'days', 'hours'] }
            )}
          </p>
        </div>
        {!isProUser && (
          <Button asChild size="sm" variant="default" className="ml-auto">
            <Link href="/pricing">
              <CrownIcon /> Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
