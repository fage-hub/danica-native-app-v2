"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Brain, 
  MagicWand, 
  Robot, 
  ChartLine,
  ChatCircleDots,
  Lightbulb,
  Check,
  X,
  Sparkle,
  Lightning,
  Crown,
  Rocket,
  ShieldCheck,
  CaretDown,
  CaretUp
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIProductAdvisor } from '@/components/AIProductAdvisor'
import { useLanguage } from '@/contexts/LanguageContext'

type Product = {
  id: string
  icon: React.ElementType
  useCases: string[]
  integrations: string[]
  deployment: string[]
}

type PricingTier = {
  id: string
  icon: React.ElementType
  price: { monthly: number; yearly: number }
  highlight?: boolean
  features: {
    labelKey: string
    included: boolean
    valueKey?: string
  }[]
}

type FeatureComparison = {
  categoryKey: string
  features: {
    nameKey: string
    aiAssistant: boolean | string
    contentGen: boolean | string
    automation: boolean | string
    analytics: boolean | string
    sentiment: boolean | string
    recommender: boolean | string
  }[]
}

const getProducts = (): Product[] => [
  {
    id: 'ai-assistant',
    icon: Brain,
    useCases: ['Customer Support', 'Sales Assistance', 'Internal Help Desk', 'Lead Qualification'],
    integrations: ['Slack', 'Zendesk', 'Salesforce', 'Microsoft Teams', 'WhatsApp', 'Website Chat'],
    deployment: ['Cloud', 'On-Premise', 'Hybrid']
  },
  {
    id: 'content-gen',
    icon: MagicWand,
    useCases: ['Blog Writing', 'Social Media', 'Email Marketing', 'Product Descriptions', 'Ad Copy'],
    integrations: ['WordPress', 'HubSpot', 'Mailchimp', 'Shopify', 'LinkedIn', 'Facebook'],
    deployment: ['Cloud', 'API']
  },
  {
    id: 'automation',
    icon: Robot,
    useCases: ['Document Processing', 'Data Entry', 'Email Routing', 'Invoice Processing', 'Workflow Automation'],
    integrations: ['Zapier', 'SAP', 'Oracle', 'Google Workspace', 'Microsoft 365', 'Dropbox'],
    deployment: ['Cloud', 'On-Premise', 'Hybrid']
  },
  {
    id: 'analytics',
    icon: ChartLine,
    useCases: ['Sales Forecasting', 'Churn Prediction', 'Demand Planning', 'Risk Assessment', 'Market Analysis'],
    integrations: ['Tableau', 'Power BI', 'Snowflake', 'BigQuery', 'PostgreSQL', 'MySQL'],
    deployment: ['Cloud', 'On-Premise']
  },
  {
    id: 'sentiment',
    icon: ChatCircleDots,
    useCases: ['Brand Monitoring', 'Customer Feedback', 'Product Reviews', 'Crisis Detection', 'Competitor Analysis'],
    integrations: ['Twitter', 'Facebook', 'Instagram', 'Reddit', 'TrustPilot', 'Google Reviews'],
    deployment: ['Cloud', 'API']
  },
  {
    id: 'recommender',
    icon: Lightbulb,
    useCases: ['Product Recommendations', 'Content Discovery', 'Upselling', 'Cross-selling', 'Email Personalization'],
    integrations: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Amazon', 'eBay'],
    deployment: ['Cloud', 'API']
  }
]

const getPricingTiers = (): { [key: string]: PricingTier[] } => ({
  'ai-assistant': [
    {
      id: 'starter',
      icon: Rocket,
      price: { monthly: 99, yearly: 950 },
      features: [
        { labelKey: 'conversations', included: true, valueKey: '1,000' },
        { labelKey: 'languages', included: true, valueKey: '10' },
        { labelKey: 'customKnowledge', included: true },
        { labelKey: 'emailSupport', included: true },
        { labelKey: 'analytics', included: true },
        { labelKey: 'apiAccess', included: false },
        { labelKey: 'prioritySupport', included: false },
        { labelKey: 'customTraining', included: false }
      ]
    },
    {
      id: 'professional',
      icon: Lightning,
      price: { monthly: 299, yearly: 2870 },
      highlight: true,
      features: [
        { labelKey: 'conversations', included: true, valueKey: '10,000' },
        { labelKey: 'languages', included: true, valueKey: '50+' },
        { labelKey: 'customKnowledge', included: true },
        { labelKey: 'emailChatSupport', included: true },
        { labelKey: 'analytics', included: true },
        { labelKey: 'apiAccess', included: true },
        { labelKey: 'prioritySupport', included: true },
        { labelKey: 'customTraining', included: false }
      ]
    },
    {
      id: 'enterprise',
      icon: Crown,
      price: { monthly: 999, yearly: 9590 },
      features: [
        { labelKey: 'conversations', included: true, valueKey: 'unlimited' },
        { labelKey: 'languages', included: true, valueKey: '50+' },
        { labelKey: 'customKnowledge', included: true },
        { labelKey: 'dedicatedSupport', included: true },
        { labelKey: 'analytics', included: true },
        { labelKey: 'apiAccess', included: true },
        { labelKey: 'prioritySupport', included: true },
        { labelKey: 'customTraining', included: true }
      ]
    }
  ],
  'content-gen': [
    {
      id: 'starter',
      icon: Rocket,
      price: { monthly: 49, yearly: 470 },
      features: [
        { labelKey: 'words', included: true, valueKey: '50,000' },
        { labelKey: 'contentTypes', included: true, valueKey: '10' },
        { labelKey: 'seoOptimization', included: true },
        { labelKey: 'brandVoice', included: true },
        { labelKey: 'exportFormats', included: true, valueKey: 'basic' },
        { labelKey: 'apiAccess', included: false },
        { labelKey: 'teamCollaboration', included: false },
        { labelKey: 'priorityGeneration', included: false }
      ]
    },
    {
      id: 'professional',
      icon: Lightning,
      price: { monthly: 149, yearly: 1430 },
      highlight: true,
      features: [
        { labelKey: 'words', included: true, valueKey: '200,000' },
        { labelKey: 'contentTypes', included: true, valueKey: 'all' },
        { labelKey: 'seoOptimization', included: true },
        { labelKey: 'brandVoice', included: true },
        { labelKey: 'exportFormats', included: true, valueKey: 'all' },
        { labelKey: 'apiAccess', included: true },
        { labelKey: 'teamCollaboration', included: true, valueKey: '5users' },
        { labelKey: 'priorityGeneration', included: true }
      ]
    },
    {
      id: 'enterprise',
      icon: Crown,
      price: { monthly: 499, yearly: 4790 },
      features: [
        { labelKey: 'words', included: true, valueKey: 'unlimited' },
        { labelKey: 'contentTypes', included: true, valueKey: 'allCustom' },
        { labelKey: 'seoOptimization', included: true },
        { labelKey: 'brandVoice', included: true },
        { labelKey: 'exportFormats', included: true, valueKey: 'all' },
        { labelKey: 'apiAccess', included: true },
        { labelKey: 'teamCollaboration', included: true, valueKey: 'unlimited' },
        { labelKey: 'priorityGeneration', included: true }
      ]
    }
  ],
  'automation': [
    {
      id: 'starter',
      icon: Rocket,
      price: { monthly: 199, yearly: 1910 },
      features: [
        { labelKey: 'workflows', included: true, valueKey: '500' },
        { labelKey: 'integrations', included: true, valueKey: '20' },
        { labelKey: 'documentProcessing', included: true, valueKey: '100month' },
        { labelKey: 'ocrCapabilities', included: true },
        { labelKey: 'emailSupport', included: true },
        { labelKey: 'customWorkflows', included: false },
        { labelKey: 'onPremiseDeployment', included: false },
        { labelKey: 'slaGuarantee', included: false }
      ]
    },
    {
      id: 'professional',
      icon: Lightning,
      price: { monthly: 499, yearly: 4790 },
      highlight: true,
      features: [
        { labelKey: 'workflows', included: true, valueKey: '5,000' },
        { labelKey: 'integrations', included: true, valueKey: '100+' },
        { labelKey: 'documentProcessing', included: true, valueKey: '1000month' },
        { labelKey: 'ocrCapabilities', included: true },
        { labelKey: 'prioritySupport', included: true },
        { labelKey: 'customWorkflows', included: true },
        { labelKey: 'onPremiseDeployment', included: true },
        { labelKey: 'slaGuarantee', included: false }
      ]
    },
    {
      id: 'enterprise',
      icon: Crown,
      price: { monthly: 1499, yearly: 14390 },
      features: [
        { labelKey: 'workflows', included: true, valueKey: 'unlimited' },
        { labelKey: 'integrations', included: true, valueKey: '100+' },
        { labelKey: 'documentProcessing', included: true, valueKey: 'unlimited' },
        { labelKey: 'ocrCapabilities', included: true },
        { labelKey: 'dedicatedSupport', included: true },
        { labelKey: 'customWorkflows', included: true },
        { labelKey: 'onPremiseDeployment', included: true },
        { labelKey: 'slaGuarantee', included: true }
      ]
    }
  ],
  'analytics': [
    {
      id: 'starter',
      icon: Rocket,
      price: { monthly: 149, yearly: 1430 },
      features: [
        { labelKey: 'dataPoints', included: true, valueKey: '100K' },
        { labelKey: 'mlModels', included: true, valueKey: '5' },
        { labelKey: 'customDashboards', included: true, valueKey: '3' },
        { labelKey: 'dataSources', included: true, valueKey: '5' },
        { labelKey: 'historicalAnalysis', included: true, valueKey: '1year' },
        { labelKey: 'apiAccess', included: false },
        { labelKey: 'realtimePredictions', included: false },
        { labelKey: 'customModels', included: false }
      ]
    },
    {
      id: 'professional',
      icon: Lightning,
      price: { monthly: 399, yearly: 3830 },
      highlight: true,
      features: [
        { labelKey: 'dataPoints', included: true, valueKey: '1M' },
        { labelKey: 'mlModels', included: true, valueKey: '20' },
        { labelKey: 'customDashboards', included: true, valueKey: '10' },
        { labelKey: 'dataSources', included: true, valueKey: '20' },
        { labelKey: 'historicalAnalysis', included: true, valueKey: '3years' },
        { labelKey: 'apiAccess', included: true },
        { labelKey: 'realtimePredictions', included: true },
        { labelKey: 'customModels', included: false }
      ]
    },
    {
      id: 'enterprise',
      icon: Crown,
      price: { monthly: 999, yearly: 9590 },
      features: [
        { labelKey: 'dataPoints', included: true, valueKey: 'unlimited' },
        { labelKey: 'mlModels', included: true, valueKey: 'unlimited' },
        { labelKey: 'customDashboards', included: true, valueKey: 'unlimited' },
        { labelKey: 'dataSources', included: true, valueKey: 'unlimited' },
        { labelKey: 'historicalAnalysis', included: true, valueKey: 'unlimited' },
        { labelKey: 'apiAccess', included: true },
        { labelKey: 'realtimePredictions', included: true },
        { labelKey: 'customModels', included: true }
      ]
    }
  ],
  'sentiment': [
    {
      id: 'starter',
      icon: Rocket,
      price: { monthly: 79, yearly: 760 },
      features: [
        { labelKey: 'analyses', included: true, valueKey: '5,000' },
        { labelKey: 'socialSources', included: true, valueKey: '3' },
        { labelKey: 'languages', included: true, valueKey: '10' },
        { labelKey: 'realtimeMonitoring', included: true },
        { labelKey: 'sentimentAlerts', included: true },
        { labelKey: 'historicalData', included: true, valueKey: '3months' },
        { labelKey: 'customReports', included: false },
        { labelKey: 'apiAccess', included: false }
      ]
    },
    {
      id: 'professional',
      icon: Lightning,
      price: { monthly: 249, yearly: 2390 },
      highlight: true,
      features: [
        { labelKey: 'analyses', included: true, valueKey: '50,000' },
        { labelKey: 'socialSources', included: true, valueKey: '10' },
        { labelKey: 'languages', included: true, valueKey: '50+' },
        { labelKey: 'realtimeMonitoring', included: true },
        { labelKey: 'sentimentAlerts', included: true },
        { labelKey: 'historicalData', included: true, valueKey: '1year' },
        { labelKey: 'customReports', included: true },
        { labelKey: 'apiAccess', included: true }
      ]
    },
    {
      id: 'enterprise',
      icon: Crown,
      price: { monthly: 699, yearly: 6710 },
      features: [
        { labelKey: 'analyses', included: true, valueKey: 'unlimited' },
        { labelKey: 'socialSources', included: true, valueKey: 'all' },
        { labelKey: 'languages', included: true, valueKey: '50+' },
        { labelKey: 'realtimeMonitoring', included: true },
        { labelKey: 'sentimentAlerts', included: true },
        { labelKey: 'historicalData', included: true, valueKey: 'unlimited' },
        { labelKey: 'customReports', included: true },
        { labelKey: 'apiAccess', included: true }
      ]
    }
  ],
  'recommender': [
    {
      id: 'starter',
      icon: Rocket,
      price: { monthly: 129, yearly: 1240 },
      features: [
        { labelKey: 'recommendations', included: true, valueKey: '50K' },
        { labelKey: 'products', included: true, valueKey: '1,000' },
        { labelKey: 'recommendationTypes', included: true, valueKey: '3' },
        { labelKey: 'abTesting', included: true },
        { labelKey: 'analytics', included: true },
        { labelKey: 'apiAccess', included: false },
        { labelKey: 'visualSimilarity', included: false },
        { labelKey: 'customAlgorithms', included: false }
      ]
    },
    {
      id: 'professional',
      icon: Lightning,
      price: { monthly: 349, yearly: 3350 },
      highlight: true,
      features: [
        { labelKey: 'recommendations', included: true, valueKey: '500K' },
        { labelKey: 'products', included: true, valueKey: '10,000' },
        { labelKey: 'recommendationTypes', included: true, valueKey: 'all' },
        { labelKey: 'abTesting', included: true },
        { labelKey: 'analytics', included: true },
        { labelKey: 'apiAccess', included: true },
        { labelKey: 'visualSimilarity', included: true },
        { labelKey: 'customAlgorithms', included: false }
      ]
    },
    {
      id: 'enterprise',
      icon: Crown,
      price: { monthly: 899, yearly: 8630 },
      features: [
        { labelKey: 'recommendations', included: true, valueKey: 'unlimited' },
        { labelKey: 'products', included: true, valueKey: 'unlimited' },
        { labelKey: 'recommendationTypes', included: true, valueKey: 'all' },
        { labelKey: 'abTesting', included: true },
        { labelKey: 'analytics', included: true },
        { labelKey: 'apiAccess', included: true },
        { labelKey: 'visualSimilarity', included: true },
        { labelKey: 'customAlgorithms', included: true }
      ]
    }
  ]
})

const getFeatureComparison = (): FeatureComparison[] => [
  {
    categoryKey: 'core',
    features: [
      { nameKey: 'nlp', aiAssistant: true, contentGen: true, automation: true, analytics: false, sentiment: true, recommender: false },
      { nameKey: 'ml', aiAssistant: true, contentGen: true, automation: true, analytics: true, sentiment: true, recommender: true },
      { nameKey: 'realtime', aiAssistant: true, contentGen: false, automation: true, analytics: true, sentiment: true, recommender: true },
      { nameKey: 'multiLanguage', aiAssistant: '50+', contentGen: '30+', automation: '20+', analytics: 'N/A', sentiment: '50+', recommender: 'N/A' },
      { nameKey: 'customTraining', aiAssistant: true, contentGen: true, automation: true, analytics: true, sentiment: false, recommender: true }
    ]
  },
  {
    categoryKey: 'integration',
    features: [
      { nameKey: 'restApi', aiAssistant: true, contentGen: true, automation: true, analytics: true, sentiment: true, recommender: true },
      { nameKey: 'webhooks', aiAssistant: true, contentGen: true, automation: true, analytics: true, sentiment: true, recommender: true },
      { nameKey: 'nativeIntegrations', aiAssistant: '20+', contentGen: '15+', automation: '100+', analytics: '25+', sentiment: '15+', recommender: '20+' },
      { nameKey: 'zapierSupport', aiAssistant: true, contentGen: true, automation: true, analytics: true, sentiment: true, recommender: true },
      { nameKey: 'sdkAvailability', aiAssistant: 'JS, Python', contentGen: 'JS, Python', automation: 'JS, Python, Java', analytics: 'Python, R', sentiment: 'JS, Python', recommender: 'JS, Python' }
    ]
  },
  {
    categoryKey: 'security',
    features: [
      { nameKey: 'soc2', aiAssistant: true, contentGen: true, automation: true, analytics: true, sentiment: true, recommender: true },
      { nameKey: 'gdpr', aiAssistant: true, contentGen: true, automation: true, analytics: true, sentiment: true, recommender: true },
      { nameKey: 'dataEncryption', aiAssistant: 'AES-256', contentGen: 'AES-256', automation: 'AES-256', analytics: 'AES-256', sentiment: 'AES-256', recommender: 'AES-256' },
      { nameKey: 'onPremise', aiAssistant: true, contentGen: false, automation: true, analytics: true, sentiment: false, recommender: false },
      { nameKey: 'ssoSupport', aiAssistant: true, contentGen: true, automation: true, analytics: true, sentiment: true, recommender: true }
    ]
  },
  {
    categoryKey: 'support',
    features: [
      { nameKey: 'support24', aiAssistant: 'Enterprise', contentGen: 'Enterprise', automation: 'Pro+', analytics: 'Enterprise', sentiment: 'Pro+', recommender: 'Pro+' },
      { nameKey: 'onboarding', aiAssistant: true, contentGen: true, automation: true, analytics: true, sentiment: true, recommender: true },
      { nameKey: 'customTrainingSupport', aiAssistant: 'Enterprise', contentGen: 'Enterprise', automation: 'Pro+', analytics: 'Enterprise', sentiment: 'Enterprise', recommender: 'Enterprise' },
      { nameKey: 'accountManager', aiAssistant: 'Enterprise', contentGen: 'Enterprise', automation: 'Enterprise', recommender: 'Enterprise', sentiment: 'Enterprise', analytics: 'Enterprise' },
      { nameKey: 'slaGuarantee', aiAssistant: '99.9%', contentGen: '99.5%', automation: '99.9%', analytics: '99.9%', sentiment: '99.5%', recommender: '99.5%' }
    ]
  }
]

export function ComparisonSection() {
  const { t, language } = useLanguage()
  const [selectedProducts, setSelectedProducts] = useState<string[]>(['ai-assistant', 'content-gen'])
  const [selectedProduct, setSelectedProduct] = useState('ai-assistant')
  const [isYearly, setIsYearly] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([t.compare.featureCategories.core])

  const products = getProducts()
  const pricingTiers = getPricingTiers()
  const featureComparison = getFeatureComparison()

  const getProductInfo = (productId: string) => {
    const keyMap: { [key: string]: 'aiAssistant' | 'contentGen' | 'automation' | 'analytics' | 'sentiment' | 'recommender' } = {
      'ai-assistant': 'aiAssistant',
      'content-gen': 'contentGen',
      'automation': 'automation',
      'analytics': 'analytics',
      'sentiment': 'sentiment',
      'recommender': 'recommender'
    }
    const key = keyMap[productId]
    return t.compare.products[key]
  }

  const getFeatureValue = (valueKey: string | undefined) => {
    if (!valueKey) return ''
    
    const valueMap: { [key: string]: string } = {
      'unlimited': t.compare.pricingValues.unlimited,
      'basic': t.compare.pricingValues.basic,
      'all': t.compare.pricingValues.all,
      'allCustom': t.compare.pricingValues.allCustom,
      '5users': `5 ${t.compare.pricingValues.users}`,
      '100month': `100/${t.compare.pricingValues.month}`,
      '1000month': `1,000/${t.compare.pricingValues.month}`,
      '1year': `1 ${t.compare.pricingValues.year}`,
      '3years': `3 ${t.compare.pricingValues.years}`,
      '3months': `3 ${t.compare.pricingValues.months}`
    }
    
    return valueMap[valueKey] || valueKey
  }

  const toggleProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter(id => id !== productId))
      } else {
        toast.error(t.compare.toast.selectAtLeast)
      }
    } else {
      if (selectedProducts.length >= 3) {
        toast.error(t.compare.toast.maxProducts)
      } else {
        setSelectedProducts([...selectedProducts, productId])
      }
    }
  }

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category))
    } else {
      setExpandedCategories([...expandedCategories, category])
    }
  }

  const handleStartTrial = (productName: string, tierName: string) => {
    toast.success(`${t.compare.toast.startingTrial} ${tierName} ${t.compare.toast.trialFor} ${productName}`, {
      description: t.compare.toast.setupEmail
    })
  }

  const handleContactSales = (productName: string) => {
    toast.success(`${t.compare.toast.salesInquiry} ${productName}`, {
      description: t.compare.toast.contactSoon
    })
  }

  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check size={20} weight="bold" className="text-accent" />
      ) : (
        <X size={20} weight="bold" className="text-muted-foreground" />
      )
    }
    return <span className="text-xs font-medium">{value}</span>
  }

  return (
    <motion.div 
      className="flex flex-col gap-6 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, x: 40, rotateY: 12 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 260,
          damping: 26,
          delay: 0.05
        }}
        className="sticky top-14 sm:top-16 lg:top-4 bg-background/95 backdrop-blur-sm z-10 pb-4 pt-2"
      >
        <motion.h1 
          className="text-2xl font-bold" 
          style={{ letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {t.compare.title}
        </motion.h1>
        <motion.p 
          className="text-sm text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t.compare.subtitle}
        </motion.p>
      </motion.div>

      <AIProductAdvisor />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t.compare.overview}</TabsTrigger>
          <TabsTrigger value="pricing">{t.compare.pricing}</TabsTrigger>
          <TabsTrigger value="features">{t.compare.features}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.compare.selectProducts}</CardTitle>
              <CardDescription>{t.compare.selectDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {products.map((product) => {
                const Icon = product.icon
                const isSelected = selectedProducts.includes(product.id)
                const productInfo = getProductInfo(product.id)
                
                return (
                  <motion.div
                    key={product.id}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-accent shadow-md' : 'hover:shadow-sm'
                      }`}
                      onClick={() => toggleProduct(product.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            isSelected ? 'bg-accent/20' : 'bg-accent/10'
                          }`}>
                            <Icon size={24} weight="duotone" className="text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm">{productInfo.name}</h3>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {productInfo.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {productInfo.tagline}
                            </p>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 pt-2 border-t"
                              >
                                <div>
                                  <p className="text-[10px] font-medium text-muted-foreground mb-1">
                                    {t.compare.keyUseCases}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {product.useCases.slice(0, 3).map((useCase) => (
                                      <Badge key={useCase} variant="secondary" className="text-[10px] px-1.5 py-0">
                                        {useCase}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'bg-accent border-accent' : 'border-border'
                          }`}>
                            {isSelected && <Check size={14} weight="bold" className="text-accent-foreground" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>

          <AnimatePresence>
            {selectedProducts.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkle size={20} weight="fill" className="text-accent" />
                      {t.compare.quickComparison}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedProducts.map((productId) => {
                      const product = products.find(p => p.id === productId)!
                      const productInfo = getProductInfo(productId)
                      const Icon = product.icon
                      
                      return (
                        <div key={productId} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Icon size={20} weight="duotone" className="text-accent" />
                            <h3 className="font-semibold text-sm">{productInfo.name}</h3>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="space-y-1">
                              <p className="text-muted-foreground font-medium">{t.compare.deployment}</p>
                              <div className="flex flex-wrap gap-1">
                                {product.deployment.map((d) => (
                                  <Badge key={d} variant="outline" className="text-[10px] px-1.5 py-0">
                                    {d}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-muted-foreground font-medium">{t.compare.integrations}</p>
                              <p className="font-medium">{product.integrations.length}+ {t.compare.apps}</p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-muted-foreground font-medium text-xs">{t.compare.topIntegrations}</p>
                            <div className="flex flex-wrap gap-1">
                              {product.integrations.slice(0, 4).map((integration) => (
                                <Badge key={integration} variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {integration}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {productId !== selectedProducts[selectedProducts.length - 1] && (
                            <Separator className="mt-4" />
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.compare.selectProduct}</CardTitle>
              <CardDescription>{t.compare.viewPricing}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {products.map((product) => {
                  const Icon = product.icon
                  const isSelected = selectedProduct === product.id
                  const productInfo = getProductInfo(product.id)
                  
                  return (
                    <motion.div
                      key={product.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedProduct(product.id)}
                    >
                      <Card className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-accent' : 'hover:shadow-sm'
                      }`}>
                        <CardContent className="p-3">
                          <div className="flex flex-col items-center text-center gap-2">
                            <Icon size={24} weight="duotone" className="text-accent" />
                            <p className="text-xs font-medium leading-tight">{productInfo.name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t.compare.billingPeriod}</CardTitle>
                <div className="flex items-center gap-3">
                  <Label htmlFor="billing-toggle" className={`text-sm ${!isYearly ? 'font-semibold' : ''}`}>
                    {t.compare.monthly}
                  </Label>
                  <Switch
                    id="billing-toggle"
                    checked={isYearly}
                    onCheckedChange={setIsYearly}
                  />
                  <Label htmlFor="billing-toggle" className={`text-sm ${isYearly ? 'font-semibold' : ''}`}>
                    {t.compare.yearly}
                  </Label>
                </div>
              </div>
              {isYearly && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Badge className="bg-accent text-accent-foreground">
                    {t.compare.saveUpTo}
                  </Badge>
                </motion.div>
              )}
            </CardHeader>
          </Card>

          <div className="space-y-3">
            {pricingTiers[selectedProduct]?.map((tier, index) => {
              const Icon = tier.icon
              const price = isYearly ? tier.price.yearly : tier.price.monthly
              const period = isYearly ? t.compare.perYear : t.compare.perMonth
              const productInfo = getProductInfo(selectedProduct)
              
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={tier.highlight ? 'ring-2 ring-accent shadow-lg' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-accent/10">
                            <Icon size={20} weight="duotone" className="text-accent" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{t.compare.tiers[tier.id as 'starter' | 'professional' | 'enterprise']}</CardTitle>
                            {tier.highlight && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mt-1">
                                {t.compare.mostPopular}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">₱{price}</span>
                            <span className="text-xs text-muted-foreground">{period}</span>
                          </div>
                          {isYearly && (
                            <p className="text-[10px] text-muted-foreground">
                              ₱{Math.round(price / 12)}{t.compare.perMonth}
                            </p>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-xs mt-2">
                        {t.compare.tiers[`${tier.id}Desc` as 'starterDesc' | 'professionalDesc' | 'enterpriseDesc']}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        {tier.features.map((feature) => {
                          const featureLabel = t.compare.pricingFeatures[feature.labelKey as keyof typeof t.compare.pricingFeatures]
                          const featureValue = getFeatureValue(feature.valueKey)
                          
                          return (
                            <div key={feature.labelKey} className="flex items-start gap-2 text-xs">
                              {feature.included ? (
                                <Check size={16} weight="bold" className="text-accent shrink-0 mt-0.5" />
                              ) : (
                                <X size={16} weight="bold" className="text-muted-foreground shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <span className={feature.included ? '' : 'text-muted-foreground'}>
                                  {featureLabel}
                                </span>
                                {featureValue && (
                                  <span className="font-semibold ml-1">({featureValue})</span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      
                      <Separator />
                      
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          variant={tier.highlight ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStartTrial(
                            productInfo.name, 
                            t.compare.tiers[tier.id as 'starter' | 'professional' | 'enterprise']
                          )}
                        >
                          {tier.id === 'enterprise' ? t.compare.contactSales : t.compare.startFreeTrial}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck size={24} weight="duotone" className="text-accent shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm">{t.compare.allPlansInclude}</h3>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {Array.isArray(t.compare.planFeatures) && t.compare.planFeatures.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.compare.detailedComparison}</CardTitle>
              <CardDescription>{t.compare.compareFeatures}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {featureComparison.map((section) => {
                const categoryName = t.compare.featureCategories[section.categoryKey as keyof typeof t.compare.featureCategories]
                const isExpanded = expandedCategories.includes(categoryName)
                
                return (
                  <Card key={section.categoryKey}>
                    <CardHeader 
                      className="cursor-pointer"
                      onClick={() => toggleCategory(categoryName)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{categoryName}</CardTitle>
                        <Button variant="ghost" size="sm" className="min-w-[44px] min-h-[44px]">
                          {isExpanded ? <CaretUp size={20} /> : <CaretDown size={20} />}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              {/* Column headers: which products are being compared */}
                              <div
                                className="grid gap-2 pb-2 border-b"
                                style={{ gridTemplateColumns: `1fr repeat(${selectedProducts.length}, minmax(0, 1fr))` }}
                              >
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground self-end">
                                  {t.compare.featureLabel ?? (language === 'zh' ? '功能' : 'Feature')}
                                </span>
                                {selectedProducts.map(productId => {
                                  const product = products.find(p => p.id === productId)
                                  if (!product) return null
                                  const Icon = product.icon
                                  return (
                                    <div key={productId} className="flex flex-col items-center gap-1">
                                      <Icon size={18} weight="duotone" className="text-accent" />
                                      <span className="text-[10px] font-medium text-center leading-tight line-clamp-2">{getProductName(productId)}</span>
                                    </div>
                                  )
                                })}
                              </div>
                              {section.features.map((feature) => {
                                const featureName = t.compare.featureNames[feature.nameKey as keyof typeof t.compare.featureNames]
                                return (
                                  <div
                                    key={feature.nameKey}
                                    className="grid gap-2 items-center py-1"
                                    style={{ gridTemplateColumns: `1fr repeat(${selectedProducts.length}, minmax(0, 1fr))` }}
                                  >
                                    <span className="text-xs font-medium">{featureName}</span>
                                    {selectedProducts.map(productId => {
                                      const value = feature[productId as keyof typeof feature]
                                      return (
                                        <div key={productId} className="flex items-center justify-center min-h-[24px] bg-muted/30 rounded">
                                          {renderValue(value)}
                                        </div>
                                      )
                                    })}
                                  </div>
                                )
                              })}
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                )
              })}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkle size={24} weight="fill" className="text-primary shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">{t.compare.needHelp}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t.compare.needHelpText}
                  </p>
                  <Button size="sm" onClick={() => handleContactSales('Custom Solution')}>
                    {t.compare.scheduleConsultation}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
