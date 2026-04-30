"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MagnifyingGlass, 
  Funnel, 
  X,
  ShoppingCart,
  Headset,
  Article,
  Lightning,
  ChartBar,
  Shield,
  ChatCircle,
  FilePdf,
  Heart,
  Gavel,
  CurrencyDollar,
  Gear,
  Megaphone,
  Users,
  Star
} from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { PRODUCT_CATALOG } from '@/lib/product-catalog'
import { ProductDetailDialog } from '@/components/ProductDetailDialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getProductRating } from '@/lib/reviews-data'

type ProductCategory = 
  | 'all'
  | 'customer-service'
  | 'content-creation'
  | 'automation'
  | 'analytics'
  | 'security'
  | 'communication'
  | 'document-processing'
  | 'e-commerce'
  | 'healthcare'
  | 'legal'
  | 'finance'
  | 'operations'
  | 'marketing'
  | 'hr'

type ProductKey = keyof typeof PRODUCT_CATALOG.en

const productCategories: Record<ProductKey, ProductCategory[]> = {
  aiAssistant: ['customer-service', 'communication'],
  contentGen: ['content-creation', 'marketing'],
  automation: ['automation', 'operations'],
  analytics: ['analytics', 'finance'],
  sentiment: ['customer-service', 'analytics'],
  recommender: ['e-commerce', 'marketing'],
  voiceAI: ['communication', 'automation'],
  visionAI: ['analytics', 'security', 'operations'],
  nlpPlatform: ['communication', 'analytics'],
  chatbotBuilder: ['customer-service', 'communication'],
  aiWorkflow: ['automation', 'operations'],
  knowledgeBase: ['customer-service', 'document-processing'],
  emailAI: ['communication', 'marketing'],
  dataLabeling: ['analytics', 'operations'],
  fraudDetection: ['security', 'finance'],
  documentAI: ['document-processing', 'operations'],
  translationAI: ['communication', 'content-creation'],
  codeAssistant: ['automation', 'operations'],
  videoAnalytics: ['analytics', 'marketing'],
  speechRecognition: ['communication', 'automation'],
  textSummarizer: ['content-creation', 'document-processing'],
  imageGenerator: ['content-creation', 'marketing'],
  predictiveMaintenance: ['operations', 'analytics'],
  recruitmentAI: ['hr', 'automation'],
  priceOptimization: ['e-commerce', 'finance'],
  inventoryAI: ['operations', 'e-commerce'],
  socialMediaAI: ['marketing', 'content-creation'],
  customerSegmentation: ['marketing', 'analytics'],
  anomalyDetection: ['security', 'analytics'],
  riskAssessment: ['finance', 'security'],
  leadScoring: ['marketing', 'analytics'],
  qualityControl: ['operations', 'analytics'],
  energyOptimization: ['operations', 'analytics'],
  supplyChainAI: ['operations', 'analytics'],
  medicalDiagnosis: ['healthcare', 'analytics'],
  legalAI: ['legal', 'document-processing'],
  financialForecasting: ['finance', 'analytics'],
  marketingAutomation: ['marketing', 'automation'],
  salesForecasting: ['analytics', 'finance'],
  contractAnalysis: ['legal', 'document-processing'],
  complianceAI: ['legal', 'finance', 'security'],
  cybersecurityAI: ['security', 'operations'],
  routeOptimization: ['operations', 'analytics'],
  warehouseAI: ['operations', 'automation'],
  retailAnalytics: ['e-commerce', 'analytics'],
  personalizationEngine: ['marketing', 'e-commerce'],
  searchOptimization: ['e-commerce', 'marketing'],
  contentModeration: ['security', 'communication'],
  dynamicPricing: ['e-commerce', 'finance'],
}

const categoryIcons: Record<ProductCategory, React.ElementType> = {
  all: Funnel,
  'customer-service': Headset,
  'content-creation': Article,
  automation: Lightning,
  analytics: ChartBar,
  security: Shield,
  communication: ChatCircle,
  'document-processing': FilePdf,
  'e-commerce': ShoppingCart,
  healthcare: Heart,
  legal: Gavel,
  finance: CurrencyDollar,
  operations: Gear,
  marketing: Megaphone,
  hr: Users
}

export function ProductBrowseSection() {
  const { t, language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all')
  const [selectedProduct, setSelectedProduct] = useState<ProductKey | null>(null)

  const allProducts = Object.keys(PRODUCT_CATALOG[language]) as ProductKey[]

  const filteredProducts = allProducts.filter(productKey => {
    const product = PRODUCT_CATALOG[language][productKey]
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           productCategories[productKey]?.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const categoryLabels = {
    all: { en: 'All Products', zh: '全部产品' },
    'customer-service': { en: 'Customer Service', zh: '客户服务' },
    'content-creation': { en: 'Content Creation', zh: '内容创作' },
    automation: { en: 'Automation', zh: '自动化' },
    analytics: { en: 'Analytics', zh: '分析' },
    security: { en: 'Security', zh: '安全' },
    communication: { en: 'Communication', zh: '通讯' },
    'document-processing': { en: 'Document Processing', zh: '文档处理' },
    'e-commerce': { en: 'E-Commerce', zh: '电子商务' },
    healthcare: { en: 'Healthcare', zh: '医疗保健' },
    legal: { en: 'Legal', zh: '法律' },
    finance: { en: 'Finance', zh: '金融' },
    operations: { en: 'Operations', zh: '运营' },
    marketing: { en: 'Marketing', zh: '营销' },
    hr: { en: 'HR', zh: '人力资源' }
  }

  const productCount = (category: ProductCategory) => {
    if (category === 'all') return allProducts.length
    return allProducts.filter(key => productCategories[key]?.includes(category)).length
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="sticky top-14 z-10 bg-background/95 backdrop-blur-lg pb-4 border-b border-border/50">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {language === 'en' ? 'Product Catalog' : '产品目录'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'en' 
                ? 'Browse our complete collection of 50 AI-powered solutions'
                : '浏览我们完整的50个AI驱动解决方案集合'}
            </p>
          </div>

          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder={language === 'en' ? 'Search products...' : '搜索产品...'}
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
        </div>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2 overflow-x-auto">
          {(Object.keys(categoryLabels) as ProductCategory[]).map((category) => {
            const Icon = categoryIcons[category]
            const isActive = selectedCategory === category
            const count = productCount(category)
            
            return (
              <Button
                key={category}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0 gap-2"
              >
                <Icon size={16} weight={isActive ? 'fill' : 'regular'} />
                <span>{categoryLabels[category][language]}</span>
                <Badge 
                  variant={isActive ? 'secondary' : 'outline'} 
                  className="ml-1 rounded-full px-2"
                >
                  {count}
                </Badge>
              </Button>
            )
          })}
        </div>
      </ScrollArea>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <MagnifyingGlass size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {language === 'en' ? 'No products found' : '未找到产品'}
          </h3>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Try adjusting your search or filters'
              : '尝试调整您的搜索或过滤器'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {language === 'en' 
                ? `Showing ${filteredProducts.length} of ${allProducts.length} products`
                : `显示 ${allProducts.length} 个产品中的 ${filteredProducts.length} 个`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((productKey, index) => {
              const product = PRODUCT_CATALOG[language][productKey]
              const categories = productCategories[productKey] || []
              const rating = getProductRating(productKey)
              
              return (
                <motion.div
                  key={productKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 h-full"
                    onClick={() => setSelectedProduct(productKey)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg leading-tight">
                            {product.title}
                          </CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">
                            {product.description}
                          </CardDescription>
                        </div>
                      </div>
                      {rating && (
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                weight={star <= Math.round(rating.averageRating) ? 'fill' : 'regular'}
                                className={
                                  star <= Math.round(rating.averageRating)
                                    ? 'text-yellow-500'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">
                            {rating.averageRating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({rating.totalReviews} {language === 'en' ? 'reviews' : '评价'})
                          </span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {categories.slice(0, 3).map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {categoryLabels[cat][language]}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </>
      )}

      {selectedProduct && (
        <ProductDetailDialog
          productKey={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
