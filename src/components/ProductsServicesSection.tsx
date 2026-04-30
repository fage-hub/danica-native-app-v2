"use client"

import { spark } from '@/lib/spark-shim'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  MagicWand, 
  Robot, 
  ChartLine,
  ChatCircleDots,
  Lightbulb,
  CaretDown,
  CaretUp,
  Sparkle,
  MagnifyingGlass,
  X,
  Coins,
  ArrowsLeftRight,
  CurrencyCircleDollar,
  ShoppingCart,
  Lightning,
  TrendUp,
  CheckCircle,
  Scales,
  Lightbulb as LightbulbIcon,
  Package,
  Receipt,
  ArrowsClockwise
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'
import { PRODUCT_CATALOG } from '@/lib/product-catalog'
import { ProductDetailDialog } from '@/components/ProductDetailDialog'
import { PackageComparisonDialog } from '@/components/PackageComparisonDialog'
import { PackageRecommender } from '@/components/PackageRecommender'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getProductRating } from '@/lib/reviews-data'
import { ServiceBundleDialog, serviceBundles, type ServiceBundle } from '@/components/ServiceBundleDialog'
import { PaymentCheckoutDialog } from '@/components/PaymentCheckoutDialog'
import { PurchaseHistoryDialog } from '@/components/PurchaseHistoryDialog'
import { SubscriptionManagementDialog } from '@/components/SubscriptionManagementDialog'
import type { PaymentItem } from '@/lib/payment-gateway'

type ServiceKey = 'aiAssistant' | 'contentGen' | 'automation' | 'analytics' | 'sentiment' | 'recommender' | 'voiceAI' | 'visionAI' | 'nlpPlatform' | 'chatbotBuilder' | 'aiWorkflow' | 'knowledgeBase' | 'emailAI' | 'dataLabeling' | 'fraudDetection' | 'documentAI' | 'translationAI' | 'codeAssistant' | 'videoAnalytics' | 'speechRecognition' | 'textSummarizer' | 'imageGenerator' | 'predictiveMaintenance' | 'recruitmentAI' | 'priceOptimization' | 'inventoryAI' | 'socialMediaAI' | 'customerSegmentation' | 'anomalyDetection' | 'riskAssessment' | 'leadScoring' | 'qualityControl' | 'energyOptimization' | 'supplyChainAI' | 'medicalDiagnosis' | 'legalAI' | 'financialForecasting' | 'marketingAutomation' | 'salesForecasting' | 'contractAnalysis' | 'complianceAI' | 'cybersecurityAI' | 'routeOptimization' | 'warehouseAI' | 'retailAnalytics' | 'personalizationEngine' | 'searchOptimization' | 'contentModeration' | 'dynamicPricing'

type Service = {
  id: ServiceKey
  icon: React.ElementType
  demo?: boolean
}

type TokenPackage = {
  id: string
  name: { en: string; zh: string }
  tokens: number
  price: number
  discount?: number
  popular?: boolean
  badge?: { en: string; zh: string }
  features: { en: string[]; zh: string[] }
  category?: 'basic' | 'business' | 'industry'
}

const tokenPackages: TokenPackage[] = [
  {
    id: 'starter',
    name: { en: 'Starter Pack', zh: '入门套餐' },
    tokens: 100000,
    price: 99,
    category: 'basic',
    features: {
      en: ['100K tokens', 'Basic support', 'API access', '30-day validity'],
      zh: ['10万tokens', '基础支持', 'API访问', '30天有效期']
    }
  },
  {
    id: 'trial',
    name: { en: 'Trial Pack', zh: '体验套餐' },
    tokens: 50000,
    price: 49,
    category: 'basic',
    badge: { en: 'New Users', zh: '新用户专享' },
    features: {
      en: ['50K tokens', 'Email support', 'Basic API access', '15-day validity', 'Quick start guide'],
      zh: ['5万tokens', '邮件支持', '基础API访问', '15天有效期', '快速入门指南']
    }
  },
  {
    id: 'professional',
    name: { en: 'Professional Pack', zh: '专业套餐' },
    tokens: 500000,
    price: 449,
    discount: 10,
    popular: true,
    category: 'basic',
    badge: { en: 'Best Value', zh: '最超值' },
    features: {
      en: ['500K tokens', 'Priority support', 'API access', '90-day validity', 'Save 10%'],
      zh: ['50万tokens', '优先支持', 'API访问', '90天有效期', '节省10%']
    }
  },
  {
    id: 'enterprise',
    name: { en: 'Enterprise Pack', zh: '企业套餐' },
    tokens: 2000000,
    price: 1599,
    discount: 20,
    category: 'basic',
    features: {
      en: ['2M tokens', '24/7 support', 'Dedicated API', '180-day validity', 'Save 20%', 'Custom integration'],
      zh: ['200万tokens', '24/7支持', '专属API', '180天有效期', '节省20%', '定制集成']
    }
  },
  {
    id: 'unlimited',
    name: { en: 'Unlimited Pack', zh: '无限套餐' },
    tokens: 10000000,
    price: 6999,
    discount: 30,
    category: 'basic',
    features: {
      en: ['10M tokens', 'White-glove support', 'Dedicated infrastructure', '365-day validity', 'Save 30%', 'SLA guarantee'],
      zh: ['1000万tokens', '白金支持', '专属基础设施', '365天有效期', '节省30%', 'SLA保障']
    }
  },
  {
    id: 'content-creator',
    name: { en: 'Content Creator Pack', zh: '内容创作套餐' },
    tokens: 300000,
    price: 279,
    discount: 7,
    category: 'business',
    badge: { en: 'For Creators', zh: '创作专用' },
    features: {
      en: ['300K tokens', 'Content generation focus', 'Image AI included', '60-day validity', 'Marketing templates'],
      zh: ['30万tokens', '内容生成专用', '包含图像AI', '60天有效期', '营销模板']
    }
  },
  {
    id: 'developer',
    name: { en: 'Developer Pack', zh: '开发者套餐' },
    tokens: 750000,
    price: 649,
    discount: 13,
    category: 'business',
    badge: { en: 'For Devs', zh: '开发专用' },
    features: {
      en: ['750K tokens', 'Code assistant access', 'API rate boost', '120-day validity', 'SDK included', 'Technical support'],
      zh: ['75万tokens', '代码助手访问', 'API速率提升', '120天有效期', '包含SDK', '技术支持']
    }
  },
  {
    id: 'ecommerce',
    name: { en: 'E-commerce Pack', zh: '电商套餐' },
    tokens: 600000,
    price: 549,
    discount: 9,
    category: 'industry',
    badge: { en: 'E-commerce', zh: '电商专用' },
    features: {
      en: ['600K tokens', 'Product description AI', 'Customer service bot', '90-day validity', 'Inventory optimization'],
      zh: ['60万tokens', '商品描述AI', '客服机器人', '90天有效期', '库存优化']
    }
  },
  {
    id: 'healthcare',
    name: { en: 'Healthcare Pack', zh: '医疗套餐' },
    tokens: 1000000,
    price: 899,
    discount: 10,
    category: 'industry',
    badge: { en: 'Healthcare', zh: '医疗专用' },
    features: {
      en: ['1M tokens', 'Medical AI models', 'HIPAA compliance', '120-day validity', 'Diagnosis support', 'Priority processing'],
      zh: ['100万tokens', '医疗AI模型', 'HIPAA合规', '120天有效期', '诊断支持', '优先处理']
    }
  },
  {
    id: 'finance',
    name: { en: 'Finance Pack', zh: '金融套餐' },
    tokens: 1500000,
    price: 1299,
    discount: 15,
    category: 'industry',
    badge: { en: 'Finance', zh: '金融专用' },
    features: {
      en: ['1.5M tokens', 'Financial forecasting', 'Risk assessment AI', '180-day validity', 'Fraud detection', 'Compliance tools'],
      zh: ['150万tokens', '财务预测', '风险评估AI', '180天有效期', '欺诈检测', '合规工具']
    }
  },
  {
    id: 'education',
    name: { en: 'Education Pack', zh: '教育套餐' },
    tokens: 400000,
    price: 349,
    discount: 13,
    category: 'industry',
    badge: { en: 'Education', zh: '教育专用' },
    features: {
      en: ['400K tokens', 'Learning assistant', 'Content moderation', '90-day validity', 'Student analytics', 'Educational discount'],
      zh: ['40万tokens', '学习助手', '内容审核', '90天有效期', '学生分析', '教育折扣']
    }
  },
  {
    id: 'marketing',
    name: { en: 'Marketing Pro Pack', zh: '营销专业套餐' },
    tokens: 800000,
    price: 699,
    discount: 13,
    category: 'business',
    badge: { en: 'Marketing', zh: '营销专用' },
    features: {
      en: ['800K tokens', 'Ad copy generation', 'Social media AI', '120-day validity', 'SEO optimization', 'Campaign analytics'],
      zh: ['80万tokens', '广告文案生成', '社交媒体AI', '120天有效期', 'SEO优化', '活动分析']
    }
  },
  {
    id: 'legal',
    name: { en: 'Legal Pack', zh: '法律套餐' },
    tokens: 1200000,
    price: 1099,
    discount: 9,
    category: 'industry',
    badge: { en: 'Legal', zh: '法律专用' },
    features: {
      en: ['1.2M tokens', 'Contract analysis', 'Legal research AI', '180-day validity', 'Document review', 'Compliance checking'],
      zh: ['120万tokens', '合同分析', '法律研究AI', '180天有效期', '文档审查', '合规检查']
    }
  }
]

export function ProductsServicesSection() {
  const { t, language } = useLanguage()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [demoInput, setDemoInput] = useState('')
  const [demoResponse, setDemoResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ServiceKey | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [compareCategory, setCompareCategory] = useState<'basic' | 'business' | 'industry'>('basic')
  const [showRecommender, setShowRecommender] = useState(false)
  const [showBundles, setShowBundles] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutItems, setCheckoutItems] = useState<PaymentItem[]>([])
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false)
  const [showSubscriptions, setShowSubscriptions] = useState(false)

  const services: Service[] = [
    { id: 'aiAssistant', icon: Brain, demo: true },
    { id: 'contentGen', icon: MagicWand, demo: true },
    { id: 'automation', icon: Robot, demo: false },
    { id: 'analytics', icon: ChartLine, demo: false },
    { id: 'sentiment', icon: ChatCircleDots, demo: true },
    { id: 'recommender', icon: Lightbulb, demo: false },
    { id: 'voiceAI', icon: Brain, demo: false },
    { id: 'visionAI', icon: Brain, demo: false },
    { id: 'nlpPlatform', icon: ChatCircleDots, demo: false },
    { id: 'chatbotBuilder', icon: Robot, demo: false },
    { id: 'aiWorkflow', icon: Robot, demo: false },
    { id: 'knowledgeBase', icon: Brain, demo: false },
    { id: 'emailAI', icon: ChatCircleDots, demo: true },
    { id: 'dataLabeling', icon: Brain, demo: false },
    { id: 'fraudDetection', icon: Brain, demo: false },
    { id: 'documentAI', icon: Brain, demo: false },
    { id: 'translationAI', icon: ChatCircleDots, demo: true },
    { id: 'codeAssistant', icon: Robot, demo: true },
    { id: 'videoAnalytics', icon: Brain, demo: false },
    { id: 'speechRecognition', icon: ChatCircleDots, demo: false },
    { id: 'textSummarizer', icon: MagicWand, demo: true },
    { id: 'imageGenerator', icon: Sparkle, demo: false },
    { id: 'predictiveMaintenance', icon: ChartLine, demo: false },
    { id: 'recruitmentAI', icon: Brain, demo: false },
    { id: 'priceOptimization', icon: ChartLine, demo: false },
    { id: 'inventoryAI', icon: Robot, demo: false },
    { id: 'socialMediaAI', icon: ChatCircleDots, demo: false },
    { id: 'customerSegmentation', icon: ChartLine, demo: false },
    { id: 'anomalyDetection', icon: Brain, demo: false },
    { id: 'riskAssessment', icon: ChartLine, demo: false },
    { id: 'leadScoring', icon: Lightbulb, demo: false },
    { id: 'qualityControl', icon: Brain, demo: false },
    { id: 'energyOptimization', icon: ChartLine, demo: false },
    { id: 'supplyChainAI', icon: Robot, demo: false },
    { id: 'medicalDiagnosis', icon: Brain, demo: false },
    { id: 'legalAI', icon: Brain, demo: false },
    { id: 'financialForecasting', icon: ChartLine, demo: false },
    { id: 'marketingAutomation', icon: Robot, demo: false },
    { id: 'salesForecasting', icon: ChartLine, demo: false },
    { id: 'contractAnalysis', icon: Brain, demo: false },
    { id: 'complianceAI', icon: Brain, demo: false },
    { id: 'cybersecurityAI', icon: Brain, demo: false },
    { id: 'routeOptimization', icon: Robot, demo: false },
    { id: 'warehouseAI', icon: Robot, demo: false },
    { id: 'retailAnalytics', icon: ChartLine, demo: false },
    { id: 'personalizationEngine', icon: Lightbulb, demo: false },
    { id: 'searchOptimization', icon: Brain, demo: false },
    { id: 'contentModeration', icon: Brain, demo: false },
    { id: 'dynamicPricing', icon: ChartLine, demo: false },
  ]

  const filteredServices = services.filter(service => {
    const translationData = t.services.products[service.id]
    const catalogData = PRODUCT_CATALOG[language][service.id]
    const title = translationData?.title || catalogData?.title || service.id
    const description = translationData?.description || catalogData?.description || ''
    
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           description.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleDemo = async (serviceId: string) => {
    if (!demoInput.trim()) {
      toast.error(t.services.toast.enterText)
      return
    }

    setIsGenerating(true)
    setDemoResponse('')

    try {
      let prompt = ''
      
      switch (serviceId) {
        case 'aiAssistant':
          prompt = spark.llmPrompt`You are a professional customer service AI assistant for Danica IT, an AI solutions company. Respond to this customer inquiry in a helpful, friendly, and professional manner: "${demoInput}". 

Keep your response concise (2-3 sentences), provide actionable information, and mention that you're demonstrating Danica IT's AI Assistant capabilities. If the inquiry is about products or services, briefly mention that Danica IT offers AI solutions including chatbots, content generation, automation, analytics, sentiment analysis, and recommendations.`
          break
        case 'contentGen':
          prompt = spark.llmPrompt`You are an AI content generation tool. Generate compelling marketing content based on this input: "${demoInput}". 

Create:
- A catchy headline
- A 2-3 sentence engaging description
- A strong call-to-action

Format your response with clear sections using emojis (✨ for headline, 📝 for description, 🎯 for CTA). Make it persuasive and professionally written.`
          break
        case 'sentiment':
          prompt = spark.llmPrompt`Analyze the sentiment of this text: "${demoInput}"

Provide:
- Overall sentiment (Positive/Negative/Neutral) with percentage
- 2-3 key emotions detected
- Confidence level (High/Medium/Low)
- A brief actionable recommendation

Format with emojis and keep it concise. Act as a professional sentiment analysis tool.`
          break
        default:
          setDemoResponse(t.services.toast.demoRequested)
          setIsGenerating(false)
          return
      }

      const response = await spark.llm(prompt, 'gpt-4o-mini')
      setDemoResponse(response)
      toast.success(t.services.toast.generated)
    } catch (error) {
      toast.error(t.services.toast.failed)
      setDemoResponse('An error occurred. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRequestDemo = (title: string) => {
    toast.success(`${t.services.toast.demoRequested} ${title} ${t.services.toast.sent}`, {
      description: t.services.toast.contactSoon
    })
  }

  const handlePurchaseTokens = (pkg: TokenPackage) => {
    const item: PaymentItem = {
      id: pkg.id,
      name: pkg.name[language],
      price: pkg.price,
      quantity: pkg.tokens,
      type: 'token'
    }
    setCheckoutItems([item])
    setShowCheckout(true)
  }

  const handlePurchaseBundle = (bundle: ServiceBundle) => {
    const item: PaymentItem = {
      id: bundle.id,
      name: bundle.name[language],
      price: bundle.price,
      quantity: 1,
      type: 'bundle'
    }
    setCheckoutItems([item])
    setShowCheckout(true)
  }

  const handleCheckoutSuccess = () => {
    toast.success(
      language === 'en' 
        ? 'Purchase completed successfully!' 
        : '购买成功！',
      {
        description: language === 'en'
          ? 'Your tokens and services have been activated'
          : '您的tokens和服务已激活'
      }
    )
  }

  return (
    <motion.div 
      className="flex flex-col gap-4 sm:gap-5 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 300,
          damping: 28,
          delay: 0.05
        }}
        className="sticky top-14 bg-background/98 backdrop-blur-md z-10 pb-4 pt-2 border-b border-transparent"
      >
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold mb-2" 
          style={{ letterSpacing: '-0.025em' }}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {language === 'en' ? 'AI Products, Bundles & Tokens' : 'AI产品、套餐与Token'}
        </motion.h1>
        <motion.p 
          className="text-sm sm:text-base text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {language === 'en' 
            ? 'Browse 50+ AI products, service bundles, and token packages' 
            : '浏览50+款AI产品、服务套餐和Token包'}
        </motion.p>
      </motion.div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products" className="gap-2">
            <Brain size={18} />
            {language === 'en' ? 'AI Products' : 'AI产品'}
          </TabsTrigger>
          <TabsTrigger value="bundles" className="gap-2">
            <Package size={18} />
            {language === 'en' ? 'Bundles' : '套餐组合'}
          </TabsTrigger>
          <TabsTrigger value="tokens" className="gap-2">
            <Coins size={18} />
            {language === 'en' ? 'Tokens' : 'Token'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-4 space-y-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder={language === 'en' ? 'Search AI products...' : '搜索AI产品...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <MagnifyingGlass size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'en' ? 'No products found' : '未找到产品'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? 'Try adjusting your search'
                  : '尝试调整您的搜索'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
              {filteredServices.map((service, index) => {
                const Icon = service.icon
                const isExpanded = expandedId === service.id
                const translationData = t.services.products[service.id]
                const catalogData = PRODUCT_CATALOG[language][service.id]
                const rating = getProductRating(service.id)
                
                const productData = {
                  title: translationData?.title || catalogData?.title || service.id,
                  description: translationData?.description || catalogData?.description || '',
                  details: translationData?.details || catalogData?.detailedDescription || '',
                  tags: translationData?.tags || [],
                  features: translationData?.features || catalogData?.features || []
                }

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.15 + index * 0.05,
                      type: 'spring',
                      stiffness: 280,
                      damping: 24
                    }}
                  >
                    <Card className="overflow-hidden border-border/70 hover:border-accent/30 transition-all shadow-sm hover:shadow-md">
                      <CardHeader className="pb-3 sm:pb-4">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <motion.div 
                            className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 cursor-pointer"
                            whileHover={{ rotate: [0, -8, 8, 0] }}
                            transition={{ duration: 0.4 }}
                            onClick={() => setSelectedProduct(service.id)}
                          >
                            <Icon size={26} weight="duotone" className="text-accent" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <CardTitle 
                                className="text-base sm:text-lg cursor-pointer hover:text-accent transition-colors"
                                onClick={() => setSelectedProduct(service.id)}
                              >
                                {productData.title}
                              </CardTitle>
                              {service.demo && (
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-accent/40">
                                  <Sparkle size={10} className="mr-1" weight="fill" />
                                  {t.services.demo}
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-xs sm:text-sm">{productData.description}</CardDescription>
                            {rating && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Sparkle
                                      key={star}
                                      size={12}
                                      weight={star <= Math.round(rating.averageRating) ? 'fill' : 'regular'}
                                      className={
                                        star <= Math.round(rating.averageRating)
                                          ? 'text-yellow-500'
                                          : 'text-gray-300'
                                      }
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-medium">
                                  {rating.averageRating}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ({rating.totalReviews})
                                </span>
                              </div>
                            )}
                          </div>
                          <motion.div whileTap={{ scale: 0.92 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedId(isExpanded ? null : service.id)}
                              className="min-w-[48px] min-h-[48px] shrink-0 rounded-xl hover:bg-accent/10"
                            >
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {isExpanded ? <CaretUp size={22} /> : <CaretDown size={22} />}
                              </motion.div>
                            </Button>
                          </motion.div>
                        </div>
                      </CardHeader>
                      
                      <motion.div
                        initial={false}
                        animate={{ height: isExpanded ? 'auto' : 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-0 space-y-4">
                          <p className="text-sm leading-relaxed text-foreground/80">
                            {productData.details}
                          </p>

                          {productData.features && productData.features.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">{t.services.keyFeatures}</h4>
                              <ul className="space-y-1.5">
                                {productData.features.map((feature: string) => (
                                  <li key={feature} className="text-xs text-foreground/70 flex gap-2">
                                    <span className="text-accent">✓</span>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {productData.tags && productData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {productData.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {service.demo ? (
                            <div className="space-y-3 pt-2 border-t">
                              <h4 className="text-sm font-medium flex items-center gap-2">
                                <Sparkle size={16} weight="fill" className="text-accent" />
                                {t.services.tryItNow}
                              </h4>
                              <div className="space-y-2">
                                <Input
                                  id={`demo-${service.id}`}
                                  placeholder={t.services.enterText}
                                  value={demoInput}
                                  onChange={(e) => setDemoInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isGenerating) {
                                      handleDemo(service.id)
                                    }
                                  }}
                                />
                                <Button 
                                  className="w-full" 
                                  size="sm"
                                  onClick={() => handleDemo(service.id)}
                                  disabled={isGenerating}
                                >
                                  {isGenerating ? t.services.generating : t.services.tryDemo}
                                </Button>
                                {demoResponse && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-muted rounded-lg text-xs leading-relaxed whitespace-pre-wrap"
                                  >
                                    {demoResponse}
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button 
                                className="flex-1" 
                                size="sm"
                                onClick={() => setSelectedProduct(service.id)}
                              >
                                {language === 'en' ? 'View Details' : '查看详情'}
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1" 
                                size="sm"
                                onClick={() => handleRequestDemo(productData.title)}
                              >
                                {t.services.requestDemo}
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </motion.div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bundles" className="mt-4 space-y-4">
          <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={24} className="text-accent" weight="duotone" />
                {language === 'en' ? 'Service Bundle Packages' : '服务套餐组合'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Combine multiple AI services at discounted rates. Save up to 33% compared to individual purchases.'
                  : '以折扣价格组合多项AI服务。与单独购买相比，最高可节省33%。'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-accent" weight="fill" />
                  <span>{language === 'en' ? 'Multiple services' : '多项服务'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendUp size={20} className="text-accent" weight="fill" />
                  <span>{language === 'en' ? 'Up to 33% off' : '最高33%折扣'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightning size={20} className="text-accent" weight="fill" />
                  <span>{language === 'en' ? 'Instant activation' : '即时激活'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Lightning size={20} className="text-accent" weight="fill" />
                {language === 'en' ? 'Starter Bundles' : '入门套餐'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {serviceBundles.filter(b => b.category === 'starter').map((bundle, index) => (
                  <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`relative h-full ${bundle.popular ? 'border-primary shadow-lg' : ''}`}>
                      {bundle.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">
                            {language === 'en' ? 'Most Popular' : '最受欢迎'}
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base">{bundle.name[language]}</CardTitle>
                          <Badge variant="outline" className="text-accent border-accent shrink-0">
                            -{bundle.discount}%
                          </Badge>
                        </div>
                        <CardDescription className="text-sm mt-1">
                          {bundle.description[language]}
                        </CardDescription>
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-2xl font-bold text-foreground">₱{bundle.price}</span>
                          <span className="text-xs text-muted-foreground line-through">₱{bundle.originalPrice}</span>
                          <span className="text-xs text-muted-foreground">/ {language === 'en' ? 'mo' : '月'}</span>
                        </div>
                        {bundle.tokensIncluded && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            <Sparkle size={12} weight="fill" className="text-accent" />
                            {(bundle.tokensIncluded / 1000).toLocaleString()}K tokens
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {bundle.services.slice(0, 3).map(service => (
                            <Badge key={service} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                              {service}
                            </Badge>
                          ))}
                          {bundle.services.length > 3 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                              +{bundle.services.length - 3}
                            </Badge>
                          )}
                        </div>
                        <Button 
                          className="w-full"
                          size="sm"
                          variant={bundle.popular ? 'default' : 'outline'}
                          onClick={() => handlePurchaseBundle(bundle)}
                        >
                          <ShoppingCart size={16} className="mr-2" />
                          {language === 'en' ? 'Get Bundle' : '获取套餐'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendUp size={20} className="text-primary" weight="fill" />
                {language === 'en' ? 'Growth Bundles' : '增长套餐'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {serviceBundles.filter(b => b.category === 'growth').map((bundle, index) => (
                  <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Card className="relative h-full">
                      {bundle.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge variant="secondary">
                            {bundle.badge[language]}
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base">{bundle.name[language]}</CardTitle>
                          <Badge variant="outline" className="text-accent border-accent shrink-0">
                            -{bundle.discount}%
                          </Badge>
                        </div>
                        <CardDescription className="text-sm mt-1">
                          {bundle.description[language]}
                        </CardDescription>
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-2xl font-bold text-foreground">₱{bundle.price}</span>
                          <span className="text-xs text-muted-foreground line-through">₱{bundle.originalPrice}</span>
                          <span className="text-xs text-muted-foreground">/ {language === 'en' ? 'mo' : '月'}</span>
                        </div>
                        {bundle.tokensIncluded && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            <Sparkle size={12} weight="fill" className="text-accent" />
                            {(bundle.tokensIncluded / 1000).toLocaleString()}K tokens
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {bundle.services.slice(0, 4).map(service => (
                            <Badge key={service} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                              {service}
                            </Badge>
                          ))}
                          {bundle.services.length > 4 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                              +{bundle.services.length - 4}
                            </Badge>
                          )}
                        </div>
                        <Button 
                          className="w-full"
                          size="sm"
                          variant="outline"
                          onClick={() => handlePurchaseBundle(bundle)}
                        >
                          <ShoppingCart size={16} className="mr-2" />
                          {language === 'en' ? 'Get Bundle' : '获取套餐'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkle size={20} className="text-primary" weight="fill" />
                {language === 'en' ? 'Enterprise Bundles' : '企业套餐'}
              </h3>
              <ScrollArea className="h-[600px] pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {serviceBundles.filter(b => b.category === 'enterprise').map((bundle, index) => (
                    <motion.div
                      key={bundle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <Card className="relative h-full">
                        {bundle.badge && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {bundle.badge[language]}
                            </Badge>
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base">{bundle.name[language]}</CardTitle>
                            <Badge variant="outline" className="text-accent border-accent shrink-0">
                              -{bundle.discount}%
                            </Badge>
                          </div>
                          <CardDescription className="text-sm mt-1">
                            {bundle.description[language]}
                          </CardDescription>
                          <div className="flex items-baseline gap-2 mt-3">
                            <span className="text-2xl font-bold text-foreground">₱{bundle.price}</span>
                            <span className="text-xs text-muted-foreground line-through">₱{bundle.originalPrice}</span>
                            <span className="text-xs text-muted-foreground">/ {language === 'en' ? 'mo' : '月'}</span>
                          </div>
                          {bundle.tokensIncluded && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                              <Sparkle size={12} weight="fill" className="text-accent" />
                              {(bundle.tokensIncluded / 1000).toLocaleString()}K tokens
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {bundle.services.slice(0, 4).map(service => (
                              <Badge key={service} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                {service}
                              </Badge>
                            ))}
                            {bundle.services.length > 4 && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                +{bundle.services.length - 4}
                              </Badge>
                            )}
                          </div>
                          <Button 
                            className="w-full"
                            size="sm"
                            onClick={() => handlePurchaseBundle(bundle)}
                          >
                            <ShoppingCart size={16} className="mr-2" />
                            {language === 'en' ? 'Get Bundle' : '获取套餐'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="outline"
                onClick={() => setShowBundles(true)}
                className="gap-2"
              >
                <Package size={18} />
                {language === 'en' ? 'View All Bundle Details' : '查看所有套餐详情'}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tokens" className="mt-4 space-y-4">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <CurrencyCircleDollar size={24} className="text-primary" weight="duotone" />
                    {language === 'en' ? 'Token Resale Service' : 'Token转售服务'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Purchase AI tokens in bulk at discounted rates. Perfect for businesses and developers.'
                      : '批量购买AI tokens，享受折扣优惠。适合企业和开发者使用。'}
                  </CardDescription>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSubscriptions(true)}
                    className="gap-2"
                  >
                    <ArrowsClockwise size={16} />
                    {language === 'en' ? 'Subscriptions' : '订阅'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPurchaseHistory(true)}
                    className="gap-2"
                  >
                    <Receipt size={16} />
                    {language === 'en' ? 'History' : '历史'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRecommender(true)}
                  >
                    <LightbulbIcon size={16} className="mr-2" weight="fill" />
                    {language === 'en' ? 'Recommend' : '推荐'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Lightning size={20} className="text-accent" weight="fill" />
                  <span>{language === 'en' ? 'Instant delivery' : '即时交付'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendUp size={20} className="text-accent" weight="fill" />
                  <span>{language === 'en' ? 'Scalable packages' : '可扩展套餐'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-accent" weight="fill" />
                  <span>{language === 'en' ? 'Secure transactions' : '安全交易'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkle size={20} className="text-primary" weight="fill" />
                  {language === 'en' ? 'Basic Packages' : '基础套餐'}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCompareCategory('basic')
                    setShowComparison(true)
                  }}
                >
                  <Scales size={16} className="mr-2" />
                  {language === 'en' ? 'Compare' : '对比'}
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tokenPackages.filter(pkg => pkg.category === 'basic').map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`relative h-full ${pkg.popular ? 'border-primary shadow-lg' : ''}`}>
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">
                            {language === 'en' ? 'Most Popular' : '最受欢迎'}
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{pkg.name[language]}</span>
                          {pkg.discount && (
                            <Badge variant="outline" className="text-accent border-accent">
                              -{pkg.discount}%
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-3xl font-bold text-foreground">₱{pkg.price}</span>
                            <span className="text-muted-foreground">
                              PHP
                            </span>
                          </div>
                          <div className="text-xs mt-1 text-muted-foreground">
                            {(pkg.tokens / 1000).toLocaleString()}K tokens
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {pkg.features[language].map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle size={16} className="text-accent shrink-0" weight="fill" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className="w-full"
                          variant={pkg.popular ? 'default' : 'outline'}
                          onClick={() => handlePurchaseTokens(pkg)}
                        >
                          <ShoppingCart size={18} className="mr-2" />
                          {language === 'en' ? 'Purchase Now' : '立即购买'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Brain size={20} className="text-accent" weight="duotone" />
                  {language === 'en' ? 'Business Packages' : '业务套餐'}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCompareCategory('business')
                    setShowComparison(true)
                  }}
                >
                  <Scales size={16} className="mr-2" />
                  {language === 'en' ? 'Compare' : '对比'}
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tokenPackages.filter(pkg => pkg.category === 'business').map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Card className="relative h-full">
                      {pkg.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge variant="secondary">
                            {pkg.badge[language]}
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{pkg.name[language]}</span>
                          {pkg.discount && (
                            <Badge variant="outline" className="text-accent border-accent">
                              -{pkg.discount}%
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-3xl font-bold text-foreground">₱{pkg.price}</span>
                            <span className="text-muted-foreground">
                              PHP
                            </span>
                          </div>
                          <div className="text-xs mt-1 text-muted-foreground">
                            {(pkg.tokens / 1000).toLocaleString()}K tokens
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {pkg.features[language].map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle size={16} className="text-accent shrink-0" weight="fill" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className="w-full"
                          variant="outline"
                          onClick={() => handlePurchaseTokens(pkg)}
                        >
                          <ShoppingCart size={18} className="mr-2" />
                          {language === 'en' ? 'Purchase Now' : '立即购买'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ChartLine size={20} className="text-primary" weight="duotone" />
                  {language === 'en' ? 'Industry Packages' : '行业套餐'}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCompareCategory('industry')
                    setShowComparison(true)
                  }}
                >
                  <Scales size={16} className="mr-2" />
                  {language === 'en' ? 'Compare' : '对比'}
                </Button>
              </div>
              <ScrollArea className="h-[600px] pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tokenPackages.filter(pkg => pkg.category === 'industry').map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <Card className="relative h-full">
                        {pkg.badge && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {pkg.badge[language]}
                            </Badge>
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-base">{pkg.name[language]}</span>
                            {pkg.discount && (
                              <Badge variant="outline" className="text-accent border-accent">
                                -{pkg.discount}%
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            <div className="flex items-baseline gap-1 mt-2">
                              <span className="text-2xl font-bold text-foreground">₱{pkg.price}</span>
                              <span className="text-muted-foreground text-xs">
                                PHP
                              </span>
                            </div>
                            <div className="text-xs mt-1 text-muted-foreground">
                              {(pkg.tokens / 1000).toLocaleString()}K tokens
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ul className="space-y-1.5">
                            {pkg.features[language].map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs">
                                <CheckCircle size={14} className="text-accent shrink-0" weight="fill" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button 
                            className="w-full"
                            size="sm"
                            variant="outline"
                            onClick={() => handlePurchaseTokens(pkg)}
                          >
                            <ShoppingCart size={16} className="mr-2" />
                            {language === 'en' ? 'Purchase Now' : '立即购买'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowsLeftRight size={20} className="text-primary" />
                {language === 'en' ? 'Custom Enterprise Solutions' : '定制企业解决方案'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {language === 'en'
                  ? 'Need more tokens or custom pricing? Contact our sales team for enterprise packages tailored to your needs.'
                  : '需要更多tokens或定制价格？联系我们的销售团队获取适合您需求的企业套餐。'}
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast.success(
                    language === 'en' ? 'Sales team will contact you soon' : '销售团队将尽快与您联系',
                    {
                      description: language === 'en' 
                        ? 'We will reach out within 24 hours'
                        : '我们将在24小时内与您联系'
                    }
                  )
                }}
              >
                {language === 'en' ? 'Contact Sales' : '联系销售'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedProduct && (
        <ProductDetailDialog
          productKey={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}

      <PackageComparisonDialog
        open={showComparison}
        onOpenChange={setShowComparison}
        packages={tokenPackages.filter(pkg => pkg.category === compareCategory)}
        onPurchase={handlePurchaseTokens}
      />

      <PackageRecommender
        open={showRecommender}
        onOpenChange={setShowRecommender}
        packages={tokenPackages}
        onPurchase={handlePurchaseTokens}
      />

      <ServiceBundleDialog
        open={showBundles}
        onOpenChange={setShowBundles}
        onPurchase={handlePurchaseBundle}
      />

      <PaymentCheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        items={checkoutItems}
        onSuccess={handleCheckoutSuccess}
        enableSubscription={true}
      />

      <PurchaseHistoryDialog
        open={showPurchaseHistory}
        onOpenChange={setShowPurchaseHistory}
      />

      <SubscriptionManagementDialog
        open={showSubscriptions}
        onOpenChange={setShowSubscriptions}
      />
    </motion.div>
  )
}
