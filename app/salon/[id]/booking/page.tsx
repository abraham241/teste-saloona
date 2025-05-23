import BookingPageClient from "./components/booking"

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <>
      <BookingPageClient id={id} />
    </>
  )
}
