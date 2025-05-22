// app/admin/[salon_id]/boutique/blogs/page.tsx

import BlogClient from "./components/BlogClient";



export default async function Page({ params }: { params: Promise<{ salon_id: string }> }) {
  const resolvedParams = await params;
  return <BlogClient salonId={resolvedParams.salon_id} />;
}
