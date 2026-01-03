"use client"

import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1"
import { motion } from "motion/react"

const testimonials = [
  {
    text: "This SaaS platform revolutionized our operations. The web-based interface lets us manage invoices from anywhere. The cloud-hosted solution keeps us productive, even remotely.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing PayTrack SaaS was seamless. No software installation needed - just sign up online. The intuitive web dashboard made onboarding our team effortless.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team guided us through the cloud setup perfectly. Having all our invoice data synced online with automated backups gives us peace of mind.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "PayTrack's web-based platform integrates perfectly with our workflow. Access from any browser, real-time updates, and secure cloud storage. Highly recommend this SaaS solution.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "The robust cloud features and instant web access have transformed our workflow. Real-time currency conversion and live analytics make this SaaS platform incredibly efficient.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "Switching to this web-based SaaS exceeded expectations. No desktop software needed - just log in from anywhere. Streamlined our entire invoice process.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "The modern web interface is perfect for our remote team. Cloud sync ensures everyone has access to the latest invoice data. This SaaS platform improved our business operations significantly.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "This cloud-based solution delivers exactly what we needed. Web-accessible, secure, and reliable. The automated backups and real-time updates make it a premium SaaS experience.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using PayTrack's online platform, our invoice management became seamless. The web dashboard provides instant insights, and the cloud storage ensures we never lose data. Excellent SaaS platform.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export function TestimonialsSection() {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimonials</div>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
            Trusted by SaaS Users Worldwide
          </h2>
          <p className="text-center mt-5 opacity-75">
            See how our cloud-based platform is transforming invoice management for businesses globally.
          </p>
        </motion.div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  )
}






