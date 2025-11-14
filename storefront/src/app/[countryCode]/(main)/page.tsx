import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import FeaturedCategories from "@modules/home/components/featured-categories"
import MorpheusLanding from "@modules/home/components/morpheus-landing"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  // Attempt to load data; render page gracefully even if data is unavailable
  const collections = await getCollectionsWithProducts(countryCode).catch(() => null)
  const region = await getRegion(countryCode).catch(() => null)

  return (
    <>
      {/* Sentinel for transparent overlay header: remains intersecting at top; nav turns solid only after scroll */}
      <div id="page-top-sentinel" className="h-px w-full" aria-hidden="true" />
      {/* Primary landing banner */}
      <MorpheusLanding />
      {/* Products first */}
      {collections && region ? (
        <div className="py-12">
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      ) : null}
      {/* Sliding container (existing hero) */}
      <Hero />
      <FeaturedCategories />
    </>
  )
}
