'use client';

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Project: {project?.name}</h1>
      <p>Created At: {new Date(project?.createdAt || '').toLocaleString()}</p>
      <h2 className="text-xl font-bold mt-4">Messages:</h2>
      <ul>
        {messages?.map((message) => (
          <li key={message.id}>
            <p>{message.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
