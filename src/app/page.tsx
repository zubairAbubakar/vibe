'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const Page = () => {
  const router = useRouter();
  const [value, setValue] = useState('');

  const trpc = useTRPC();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
    })
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter some text"
        />
        <Button
          disabled={createProject.isPending}
          onClick={() =>
            createProject.mutate({ value: value, projectId: 'your-project-id' })
          }
          className="mt-4"
        >
          Invoke Background Job
        </Button>
      </div>
    </div>
  );
};

export default Page;
