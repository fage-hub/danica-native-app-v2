import "dotenv/config"
import { db } from "../src/lib/db"
import { products } from "../src/lib/db/schema"

const CATALOG = [
  {
    slug: "ai-assistant",
    name: "AI Assistant",
    description: "24/7 conversational AI for customer support. 50+ languages, integrates with Slack/Zendesk/Teams.",
    type: "service" as const,
    basePrice: 99900, // 999 PHP / mo
    tokenAmount: null,
    features: ["50+ languages", "Slack / Zendesk / Teams", "GPT-4 powered", "99.9% uptime SLA"],
  },
  {
    slug: "content-generator",
    name: "Content Generator",
    description: "Marketing copy, blogs, social posts, emails. SEO-optimized with brand-voice training.",
    type: "service" as const,
    basePrice: 79900,
    tokenAmount: null,
    features: ["SEO optimization", "Brand voice training", "Long-form content", "Bulk generation"],
  },
  {
    slug: "automation-suite",
    name: "Automation Suite",
    description: "Workflow automation, document processing, data entry. 100+ integrations.",
    type: "service" as const,
    basePrice: 149900,
    tokenAmount: null,
    features: ["Zapier / SAP / Oracle", "OCR + extraction", "RPA workflows", "Audit logs"],
  },
  {
    slug: "predictive-analytics",
    name: "Predictive Analytics",
    description: "ML-powered forecasting, churn prediction, demand planning.",
    type: "service" as const,
    basePrice: 199900,
    tokenAmount: null,
    features: ["Tableau / Power BI", "Custom models", "Churn prediction", "Demand planning"],
  },
  {
    slug: "sentiment-analysis",
    name: "Sentiment Analysis",
    description: "Real-time monitoring of customer feedback and social media. 50+ languages.",
    type: "service" as const,
    basePrice: 89900,
    tokenAmount: null,
    features: ["Real-time alerts", "50+ languages", "Multi-channel", "Topic clustering"],
  },
  {
    slug: "ai-recommendations",
    name: "AI Recommendations",
    description: "Personalized product recommendations for e-commerce.",
    type: "service" as const,
    basePrice: 119900,
    tokenAmount: null,
    features: ["Shopify / WooCommerce", "Real-time personalization", "A/B testing", "Cold start"],
  },
  {
    slug: "tokens-1k",
    name: "1,000 Tokens",
    description: "Pay-as-you-go token pack for any product.",
    type: "token" as const,
    basePrice: 9900,
    tokenAmount: 1000,
    features: ["Use across all products", "No expiry within 12 months"],
  },
  {
    slug: "tokens-10k",
    name: "10,000 Tokens",
    description: "Bulk pack with 10% bonus tokens.",
    type: "token" as const,
    basePrice: 89900,
    tokenAmount: 11000,
    features: ["10% bonus tokens", "Use across all products", "12-month validity"],
  },
  {
    slug: "tokens-50k",
    name: "50,000 Tokens",
    description: "Enterprise pack with 20% bonus.",
    type: "token" as const,
    basePrice: 399900,
    tokenAmount: 60000,
    features: ["20% bonus tokens", "Priority support", "12-month validity"],
  },
]

async function main() {
  for (const p of CATALOG) {
    await db.insert(products).values({
      slug: p.slug,
      name: p.name,
      description: p.description,
      type: p.type,
      basePrice: p.basePrice,
      currency: "PHP",
      tokenAmount: p.tokenAmount,
      features: p.features,
      active: true,
    }).onConflictDoNothing({ target: products.slug })
  }
  console.log(`seeded ${CATALOG.length} products`)
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
