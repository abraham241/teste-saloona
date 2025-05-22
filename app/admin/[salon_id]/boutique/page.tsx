// app/admin/[salon_id]/boutique/page.tsx

import BoutiqueAdminPageClient from "./components/product-client-page";

// ✅ Make sure this is NOT async
const Page = ({ params }: { params: { salon_id: string } }) => {
  return <BoutiqueAdminPageClient salonId={params.salon_id} />;
};

export default Page;
