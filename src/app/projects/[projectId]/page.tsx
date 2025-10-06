interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;
  return <div>Project ID: {projectId}</div>;
};

export default Page;
