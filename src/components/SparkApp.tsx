"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useKV } from "@/lib/spark-shim"
import { BottomNav } from "@/components/BottomNav"
import { HomeSection } from "@/components/HomeSection"
import { ProductsServicesSection } from "@/components/ProductsServicesSection"
import { DemoShowcaseSection } from "@/components/DemoShowcaseSection"
import { ComparisonSection } from "@/components/ComparisonSection"
import { PortalSection } from "@/components/PortalSection"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export function SparkApp() {
  const [activeTab, setActiveTab] = useKV<string>("active-tab", "home")
  const currentTab = activeTab || "home"

  const renderSection = () => {
    switch (currentTab) {
      case "home":
        return <HomeSection key="home" />
      case "products":
        return <ProductsServicesSection key="products" />
      case "demos":
        return <DemoShowcaseSection key="demos" />
      case "compare":
        return <ComparisonSection key="compare" />
      case "portal":
        return <PortalSection key="portal" />
      default:
        return <HomeSection key="home" />
    }
  }

  const transition = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] will-change-transform">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/50 rounded-full blur-3xl"
          style={{ animation: "float-slow-1 20s ease-in-out infinite", willChange: "transform" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/50 rounded-full blur-3xl"
          style={{ animation: "float-slow-2 25s ease-in-out infinite 5s", willChange: "transform" }}
        />
      </div>

      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <LanguageSwitcher />
      </div>

      <main className="max-w-2xl lg:max-w-5xl mx-auto px-4 pt-16 sm:pt-20 lg:pt-10 pb-28 sm:px-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            variants={transition}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={currentTab} onTabChange={setActiveTab} />
    </div>
  )
}
