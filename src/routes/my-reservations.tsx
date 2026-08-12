import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { lookupReservations, cancelReservation, setWhatsappOptIn } from '../server/booking.functions'
import { SiteHeader } from '../components/SiteHeader'

export const Route = createFileRoute('/my-reservations')({
  component: MyReservations,
})

function MyReservations() {
  const [phone, setPhone] = useState('')
  const [data, setData] = useState<Awaited<ReturnType<typeof lookupReservations>> | null>(null)
  const [loading, setLoading] = useState(false)

  async function search(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await lookupReservations({ data: { phone } })
      setData(result)
    } finally {
      setLoading(false)
    }
  }

  async function cancel(id: number) {
    await cancelReservation({ data: { id, phone } })
    const result = await lookupReservations({ data: { phone } })
    setData(result)
  }

  async function toggleOptIn(optIn: boolean) {
    await setWhatsappOptIn({ data: { phone, optIn } })
    if (data?.customer) setData({ ...data, customer: { ...data.customer, whatsappOptIn: optIn } })
  }

  const now = new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-stone-900">My reservations</h1>
        <p className="text-stone-500 mt-1">Look up bookings using the phone number you booked with.</p>
        <form onSubmit={search} className="mt-6 flex gap-2">
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 123 4567"
            className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-sm"
          />
          <button className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {data && (
          <div className="mt-8 space-y-4">
            {data.customer && (
              <div className="flex items-center justify-between text-sm bg-white border border-stone-200 rounded-lg p-4">
                <span className="text-stone-600">WhatsApp updates</span>
                <button
                  onClick={() => toggleOptIn(!data.customer!.whatsappOptIn)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    data.customer.whatsappOptIn ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {data.customer.whatsappOptIn ? 'Opted in' : 'Opted out'}
                </button>
              </div>
            )}

            {data.reservations.length === 0 && (
              <p className="text-stone-500 text-sm text-center py-8">No reservations found for that number.</p>
            )}

            {data.reservations.map(({ reservation, restaurant }) => (
              <div key={reservation.id} className="bg-white border border-stone-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-stone-900">{restaurant.name}</p>
                    <p className="text-sm text-stone-500">
                      {reservation.date} at {reservation.time.slice(0, 5)} &middot; {reservation.partySize} guests
                    </p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 capitalize">
                      {reservation.status.replace('_', ' ')}
                    </span>
                  </div>
                  {reservation.date >= now && reservation.status !== 'cancelled' && (
                    <button
                      onClick={() => cancel(reservation.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
