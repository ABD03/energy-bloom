import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageDetails } from "../service";
import pageMetaData from "@/utils/pageMetaData";
import PageContainer from "./pageContainer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ permalink: string }>;
}): Promise<Metadata> {
  const { permalink } = await params;
  const page: any = await getPageDetails(permalink);
  const data = page?.data;
  return pageMetaData({
    permalink: `page/${permalink}`,
    title: data?.name,
    description: data?.meta_description,
    image: data?.meta_image,
    publishedAt: data?.createdAt,
    updatedAt: data?.updatedAt,
  });
}

export default async function StaticPage({
  params,
}: {
  params: Promise<{ permalink: string }>;
}) {
  const { permalink } = await params;
  const res: any = await getPageDetails(permalink);
  if (!res?.status || !res?.data?._id) notFound();

  return (
    <div className="min-h-screen">
      <PageContainer data={res?.data} />
    </div>
  );
}
