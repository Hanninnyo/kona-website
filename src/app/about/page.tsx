import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Coffee, MapPin, Users, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us — Kona Island Coffee',
  description:
    'Learn about our story, meet our team, and discover our passion for bringing authentic Hawaiian coffee culture to the Bay Area.',
}

interface TeamMember {
  name: string
  role: string
  photo: string
  bio: string
}

const team: TeamMember[] = [
  {
    name: 'Jorge Mejia',
    role: 'Co-Founder',
    photo: '/images/team/jorge-mejia.jpg',
    bio: 'Jorge has loved coffee since he was 15 years old. From dialing in espresso shots at home to dreaming up island-inspired drinks, he is the heart behind our coffee menu and the aloha you feel at the window.',
  },
  {
    name: 'Hanna Mejia Hans',
    role: 'Co-Founder',
    photo: '/images/team/hanna-mejia-hans.jpg',
    bio: 'Hanna is originally from Europe and has baking and crêpe-making in her veins. She brings her love for pastries, design, and warm hospitality together to create the sweet side of Kona Island Coffee.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-kona-white">
      {/* Hero Section */}
      <section className="relative bg-kona-brown text-kona-white py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Coffee className="w-16 h-16 mx-auto mb-6 text-kona-teal" />
            <h1 className="font-league-spartan text-4xl lg:text-6xl font-bold mb-6">
              Our Story
            </h1>
            <p className="text-lg lg:text-xl text-kona-white/90">
              Bringing the spirit of aloha and the rich flavors of Hawaiian coffee to the Bay Area.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <h2 className="font-league-spartan text-3xl lg:text-4xl font-bold text-kona-espresso">
                  From the Big Island to Your Cup
                </h2>
                <p className="text-lg text-kona-espresso/80 leading-relaxed">
                  Kona Island Coffee was born from a shared love of Hawaiian coffee and the dream of
                  bringing that feeling of sunshine, ocean breeze, and aloha to the Bay Area. On a trip
                  to the Big Island, Hanna and Jorge tasted authentic 100% Kona coffee for the first time —
                  rich, smooth, and full of warmth. It was love at first sip.
                </p>
                <p className="text-lg text-kona-espresso/80 leading-relaxed">
                  Back home, the idea wouldn&apos;t let go. What if a little slice of Hawaiʻi could roll up
                  to hospitals, neighborhoods, and offices and brighten people&apos;s days? That&apos;s how our
                  mobile coffee ʻohana on wheels was born.
                </p>
                <p className="text-lg text-kona-espresso/80 leading-relaxed">
                  We partner with Hawaiian coffee farms to bring you thoughtfully sourced beans, roasted to
                  highlight their naturally smooth, chocolatey character. Every cup tells a story of volcanic
                  soil, tropical sun, and the families who have cared for these trees for generations.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 text-kona-brown">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">Farmer Partnerships</span>
                  </div>
                  <div className="flex items-center gap-2 text-kona-brown">
                    <Coffee className="w-5 h-5" />
                    <span className="font-medium">Hawaiian-Grown Coffee</span>
                  </div>
                  <div className="flex items-center gap-2 text-kona-brown">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Family Owned &amp; Operated</span>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-kona-soft bg-kona-taupe/20">
                <Image
                  src="/images/truck/truck-hero.jpg"
                  alt="Kona Island Coffee truck serving customers"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-kona-soft bg-kona-taupe/20 lg:order-1">
                <Image
                  src="/images/truck/truck-service.jpg"
                  alt="Serving coffee and pastries from our mobile truck"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-6 lg:order-2">
                <h2 className="font-league-spartan text-3xl lg:text-4xl font-bold text-kona-espresso">
                  Mobile First, Community Always
                </h2>
                <p className="text-lg text-kona-espresso/80 leading-relaxed">
                  We started with a mobile coffee truck, bringing Hawaiian coffee and fresh crêpes directly
                  to neighborhoods across the Bay Area. Our truck has become a familiar sight at Valley Medical
                  Center, apartment communities, and weekend pop-ups.
                </p>
                <p className="text-lg text-kona-espresso/80 leading-relaxed">
                  Every stop we make becomes part of our ʻohana. Whether you&apos;re grabbing a quick latte
                  between shifts or lingering over a crepe with friends, our hope is that Kona Island Coffee
                  feels like a small pause of island calm in your day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-kona-taupe/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-kona-brown" />
              <h2 className="font-league-spartan text-3xl lg:text-5xl font-bold text-kona-espresso mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-kona-espresso/70 max-w-2xl mx-auto">
                The husband-and-wife team behind every cup, every crêpe, and every smile.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-kona-white rounded-xl shadow-kona-soft overflow-hidden hover:shadow-kona-medium transition-shadow duration-300 flex flex-col items-center text-center p-6"
                >
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-kona-taupe/20">
                    <Image
                      src={member.photo}
                      alt={`${member.name} - ${member.role}`}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <h3 className="font-league-spartan text-xl font-bold text-kona-espresso mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-kona-brown mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-kona-espresso/70 leading-relaxed max-w-md">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Store Opening Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-kona-deep">
              {/* Background Image */}
              <div className="absolute inset-0 bg-kona-espresso">
                <Image
                  src="/images/store/opening-hero.jpg"
                  alt="Kona Island Coffee store opening in Mountain View"
                  fill
                  className="object-cover opacity-30"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-24 text-center">
                <MapPin className="w-16 h-16 mx-auto mb-6 text-kona-teal" />
                <h2 className="font-league-spartan text-4xl lg:text-6xl font-bold text-kona-white mb-6">
                  Our First Shop Opens Spring 2026!
                </h2>
                <p className="text-xl lg:text-2xl text-kona-white/90 mb-4 font-medium">
                  Mountain View — San Antonio Village Center
                </p>
                <p className="text-lg text-kona-white/80 max-w-2xl mx-auto mb-8">
                  We&apos;re so excited to bring our mobile aloha to a permanent home. Soon you&apos;ll be
                  able to enjoy Hawaiian coffee, fresh crêpes, and island-inspired pastries in a cozy,
                  welcoming space built for connection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="bg-kona-white/10 text-kona-white border-kona-white/30 hover:bg-kona-white/20"
                  >
                    <Link href="/locations">
                      <MapPin className="w-5 h-5 mr-2" />
                      View Our Current Locations
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-kona-teal/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-league-spartan text-3xl lg:text-4xl font-bold text-kona-espresso mb-6">
              Experience the Aloha Spirit
            </h2>
            <p className="text-lg text-kona-espresso/70 mb-8">
              Come find our truck, say aloha, and let us pour you a little taste of Hawaiʻi here in the Bay Area.
            </p>
            <Button variant="aloha" size="lg" asChild>
              <Link href="/locations">
                Find Our Truck
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
