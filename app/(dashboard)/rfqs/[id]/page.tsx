import { notFound } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { getRFQById } from '@/entities/rfq/repo'
import { listRFQFiles } from '@/entities/file/repo'
import { listOffersForRFQ, getMyOfferForRFQ } from '@/entities/offer/repo'
import { getUserPrimaryCompany, isUserCompanyMember } from '@/entities/company/repo'
import { RFQDetailContent } from '@/features/rfq/ui/RFQDetailContent'

interface RFQDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: RFQDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const rfq = await getRFQById(supabase, id)

  if (!rfq) {
    return { title: 'RFQ Not Found' }
  }

  return {
    title: `${rfq.title} - Zakupka`,
    description: rfq.description || `RFQ from ${rfq.company?.name}`,
  }
}

export default async function RFQDetailPage({ params }: RFQDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const rfq = await getRFQById(supabase, id)

  if (!rfq) {
    notFound()
  }

  // Check if user is the buyer (owns this RFQ)
  const isBuyer = await isUserCompanyMember(supabase, user.id, rfq.companyId)

  // Get user's company
  const userCompany = await getUserPrimaryCompany(supabase, user.id)

  // Get files
  const files = await listRFQFiles(supabase, id)

  // Get offers based on role
  let offers = null
  let myOffer = null

  // Always load all offers to find the winning offer (needed for WinnerSection)
  const allOffers = await listOffersForRFQ(supabase, id)
  
  if (isBuyer) {
    // Buyer sees all offers
    offers = allOffers
  } else if (userCompany?.supplierEnabled) {
    // Supplier sees only their offer in the UI, but we need all offers to find winner
    offers = allOffers // Keep all offers for winner detection
    myOffer = await getMyOfferForRFQ(supabase, id, userCompany.id)
  }

  const canSubmitOffer = Boolean(
    !isBuyer &&
    userCompany?.supplierEnabled &&
    rfq.status === 'open' &&
    new Date(rfq.deadline) > new Date()
  )

  return (
    <RFQDetailContent
      rfq={rfq}
      files={files}
      offers={offers}
      myOffer={myOffer}
      isBuyer={isBuyer}
      canSubmitOffer={canSubmitOffer}
      userCompanyId={userCompany?.id}
    />
  )
}
