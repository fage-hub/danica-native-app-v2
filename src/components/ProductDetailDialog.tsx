"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Check, 
  Rocket, 
  Lightning, 
  Crown,
  Sparkle,
  Tag,
  Star
} from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { PRODUCT_CATALOG } from '@/lib/product-catalog'
import { getProductDetails } from '@/lib/product-details'
import { toast } from 'sonner'
import { useKV } from '@/lib/spark-shim'
import { getProductReviews, getProductRating, Review } from '@/lib/reviews-data'
import { ProductReviews } from './ProductReviews'

type ProductKey = keyof typeof PRODUCT_CATALOG.en

type ProductDetailDialogProps = {
  productKey: ProductKey
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PRICING_DATA = {
  starter: {
    icon: Rocket,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  professional: {
    icon: Lightning,
    color: 'text-accent',
    bgColor: 'bg-accent/10'
  },
  enterprise: {
    icon: Crown,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  }
}

const SPECIFICATIONS: Partial<Record<ProductKey, { labelEn: string, labelZh: string, valueEn: string, valueZh: string }[]>> = {
  aiAssistant: [
    { labelEn: 'Response Time', labelZh: '响应时间', valueEn: '< 500ms average', valueZh: '平均 < 500ms' },
    { labelEn: 'Languages', labelZh: '语言', valueEn: '95+ languages', valueZh: '95+ 种语言' },
    { labelEn: 'Accuracy', labelZh: '准确率', valueEn: '94.5%', valueZh: '94.5%' },
    { labelEn: 'Uptime SLA', labelZh: '正常运行时间', valueEn: '99.9%', valueZh: '99.9%' }
  ],
  contentGen: [
    { labelEn: 'Content Types', labelZh: '内容类型', valueEn: '50+ formats', valueZh: '50+ 种格式' },
    { labelEn: 'Languages', labelZh: '语言', valueEn: '30+ languages', valueZh: '30+ 种语言' },
    { labelEn: 'Generation Speed', labelZh: '生成速度', valueEn: '500 words/sec', valueZh: '500 字/秒' },
    { labelEn: 'SEO Score', labelZh: 'SEO评分', valueEn: 'Average 85/100', valueZh: '平均 85/100' }
  ],
  automation: [
    { labelEn: 'Workflow Types', labelZh: '工作流类型', valueEn: '200+ templates', valueZh: '200+ 个模板' },
    { labelEn: 'Execution Speed', labelZh: '执行速度', valueEn: '< 2 seconds', valueZh: '< 2 秒' },
    { labelEn: 'Success Rate', labelZh: '成功率', valueEn: '99.7%', valueZh: '99.7%' },
    { labelEn: 'Integrations', labelZh: '集成', valueEn: '500+ apps', valueZh: '500+ 个应用' }
  ],
  analytics: [
    { labelEn: 'Model Types', labelZh: '模型类型', valueEn: '50+ algorithms', valueZh: '50+ 种算法' },
    { labelEn: 'Accuracy', labelZh: '准确度', valueEn: '85-95%', valueZh: '85-95%' },
    { labelEn: 'Data Processing', labelZh: '数据处理', valueEn: '1TB+/day', valueZh: '1TB+/天' },
    { labelEn: 'Latency', labelZh: '延迟', valueEn: '< 100ms', valueZh: '< 100ms' }
  ],
  sentiment: [
    { labelEn: 'Languages', labelZh: '语言', valueEn: '60+ languages', valueZh: '60+ 种语言' },
    { labelEn: 'Accuracy', labelZh: '准确率', valueEn: '91%', valueZh: '91%' },
    { labelEn: 'Processing Speed', labelZh: '处理速度', valueEn: '10,000/sec', valueZh: '10,000/秒' },
    { labelEn: 'Emotions', labelZh: '情感类别', valueEn: '12 categories', valueZh: '12 种类别' }
  ],
  recommender: [
    { labelEn: 'Algorithm Types', labelZh: '算法类型', valueEn: 'Hybrid ML', valueZh: '混合ML' },
    { labelEn: 'Response Time', labelZh: '响应时间', valueEn: '< 50ms', valueZh: '< 50ms' },
    { labelEn: 'Accuracy', labelZh: '准确率', valueEn: '88%', valueZh: '88%' },
    { labelEn: 'Update Frequency', labelZh: '更新频率', valueEn: 'Real-time', valueZh: '实时' }
  ],
}

const DEFAULT_SPECS = [
  { labelEn: 'Processing Speed', labelZh: '处理速度', valueEn: 'High performance', valueZh: '高性能' },
  { labelEn: 'Accuracy', labelZh: '准确率', valueEn: '90%+', valueZh: '90%+' },
  { labelEn: 'Availability', labelZh: '可用性', valueEn: '99.9%', valueZh: '99.9%' },
  { labelEn: 'Support', labelZh: '支持', valueEn: '24/7', valueZh: '24/7' }
]

const PRICING_TIERS: Record<'starter' | 'professional' | 'enterprise', { price: number, yearlyPrice: number, features: { en: string[], zh: string[] } }> = {
  starter: {
    price: 299,
    yearlyPrice: 2990,
    features: {
      en: ['Basic features', 'Email support', 'Standard performance', 'Monthly billing'],
      zh: ['基本功能', '电子邮件支持', '标准性能', '按月计费']
    }
  },
  professional: {
    price: 799,
    yearlyPrice: 7990,
    features: {
      en: ['Advanced features', 'Priority support', 'High performance', 'API access', 'Analytics dashboard'],
      zh: ['高级功能', '优先支持', '高性能', 'API访问', '分析仪表板']
    }
  },
  enterprise: {
    price: 2499,
    yearlyPrice: 24990,
    features: {
      en: ['All features', 'Dedicated support', 'Custom integration', 'SLA guarantee', 'White-label', 'On-premise option'],
      zh: ['所有功能', '专属支持', '自定义集成', 'SLA保证', '白标签', '本地部署选项']
    }
  }
}

export function ProductDetailDialog({ productKey, open, onOpenChange }: ProductDetailDialogProps) {
  const { t, language } = useLanguage()
  const [isYearly, setIsYearly] = useState(false)
  const product = PRODUCT_CATALOG[language][productKey]
  const productDetails = getProductDetails(productKey)
  const specs = SPECIFICATIONS[productKey] || DEFAULT_SPECS
  
  const defaultReviews = getProductReviews(productKey)
  const defaultRating = getProductRating(productKey)
  const [storedReviews, setStoredReviews] = useKV<Review[]>(`reviews-${productKey}`, defaultReviews)
  const allReviews = storedReviews || defaultReviews
  
  const rating = defaultRating ? {
    ...defaultRating,
    totalReviews: allReviews.length,
    averageRating: allReviews.length > 0 
      ? Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10) / 10
      : defaultRating.averageRating
  } : {
    productId: productKey,
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  }

  const handleStartTrial = (tier: string) => {
    toast.success(
      language === 'en' 
        ? `Starting ${tier} trial for ${product.title}` 
        : `开始 ${product.title} 的${tier}试用`
    )
    onOpenChange(false)
  }

  const handleContactSales = () => {
    toast.success(
      language === 'en' 
        ? 'Sales team will contact you shortly' 
        : '销售团队将很快与您联系'
    )
    onOpenChange(false)
  }

  const handleReviewSubmit = (review: Omit<Review, 'id' | 'date' | 'helpful'>) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    }
    
    setStoredReviews((current) => [newReview, ...(current || defaultReviews)])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-2xl">
                    {product.title}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-base">
                    {product.description}
                  </DialogDescription>
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkle size={24} className="text-primary" weight="duotone" />
                </div>
              </div>
            </DialogHeader>

            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">
                  {language === 'en' ? 'Overview' : '概览'}
                </TabsTrigger>
                <TabsTrigger value="pricing">
                  {language === 'en' ? 'Pricing' : '价格'}
                </TabsTrigger>
                <TabsTrigger value="specs">
                  {language === 'en' ? 'Specifications' : '规格'}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="gap-2">
                  {language === 'en' ? 'Reviews' : '评价'}
                  <div className="flex items-center gap-1">
                    <Star size={14} weight="fill" className="text-yellow-500" />
                    <span className="text-xs">{rating.averageRating}</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {productDetails?.imageUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={productDetails.imageUrl} 
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    {language === 'en' ? 'Product Details' : '产品详情'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {productDetails?.detailedDescription || product.description}
                  </p>
                </div>

                <Separator />

                {productDetails && (
                  <>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">
                        {language === 'en' ? 'Key Benefits' : '主要优势'}
                      </h3>
                      <div className="space-y-2">
                        {productDetails.benefits?.map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check size={20} className="text-accent flex-shrink-0 mt-0.5" weight="bold" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-lg mb-3">
                        {language === 'en' ? 'Key Features' : '主要功能'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {productDetails.keyFeatures?.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Sparkle size={16} className="text-primary flex-shrink-0 mt-0.5" weight="fill" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    {language === 'en' ? 'Use Cases' : '使用案例'}
                  </h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            {language === 'en' ? `Use Case ${i}` : `使用案例 ${i}`}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            {language === 'en'
                              ? 'Streamline workflows and improve efficiency with intelligent automation.'
                              : '通过智能自动化简化工作流程并提高效率。'
                            }
                          </CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={() => handleStartTrial('Free')} className="flex-1">
                    {language === 'en' ? 'Start Free Trial' : '开始免费试用'}
                  </Button>
                  <Button onClick={handleContactSales} variant="outline" className="flex-1">
                    {language === 'en' ? 'Contact Sales' : '联系销售'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {language === 'en' ? 'Choose Your Plan' : '选择您的计划'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'en' ? 'Flexible pricing for teams of all sizes' : '适合各种规模团队的灵活定价'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${!isYearly ? 'font-semibold' : 'text-muted-foreground'}`}>
                      {language === 'en' ? 'Monthly' : '月付'}
                    </span>
                    <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                    <span className={`text-sm ${isYearly ? 'font-semibold' : 'text-muted-foreground'}`}>
                      {language === 'en' ? 'Yearly' : '年付'}
                    </span>
                    {isYearly && (
                      <Badge variant="secondary" className="ml-1">
                        {language === 'en' ? 'Save 17%' : '节省17%'}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.keys(PRICING_TIERS) as Array<keyof typeof PRICING_TIERS>).map((tier) => {
                    const tierData = PRICING_TIERS[tier]
                    const pricing = PRICING_DATA[tier]
                    const Icon = pricing.icon
                    const price = isYearly ? tierData.yearlyPrice : tierData.price
                    const features = tierData.features[language]

                    return (
                      <Card key={tier} className="relative">
                        <CardHeader>
                          <div className={`w-10 h-10 rounded-lg ${pricing.bgColor} flex items-center justify-center mb-3`}>
                            <Icon size={20} className={pricing.color} weight="duotone" />
                          </div>
                          <CardTitle className="capitalize">{tier}</CardTitle>
                          <div className="mt-4">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">${price}</span>
                              <span className="text-muted-foreground text-sm">
                                /{isYearly ? (language === 'en' ? 'year' : '年') : (language === 'en' ? 'month' : '月')}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Separator />
                          <div className="space-y-2">
                            {features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Check size={16} className="text-accent flex-shrink-0 mt-1" weight="bold" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                          <Button 
                            onClick={() => handleStartTrial(tier)} 
                            className="w-full"
                            variant={tier === 'professional' ? 'default' : 'outline'}
                          >
                            {tier === 'enterprise'
                              ? (language === 'en' ? 'Contact Sales' : '联系销售')
                              : (language === 'en' ? 'Start Trial' : '开始试用')
                            }
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="specs" className="space-y-6 mt-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    {language === 'en' ? 'Technical Specifications' : '技术规格'}
                  </h3>
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {specs.map((spec, idx) => (
                          <div key={idx} className="grid grid-cols-2 gap-4 p-4">
                            <div className="font-medium">
                              {language === 'en' ? spec.labelEn : spec.labelZh}
                            </div>
                            <div className="text-muted-foreground">
                              {language === 'en' ? spec.valueEn : spec.valueZh}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    {language === 'en' ? 'Integrations' : '集成'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Slack', 'Salesforce', 'HubSpot', 'Microsoft Teams', 'Zendesk', 'Google Workspace'].map((integration) => (
                      <Badge key={integration} variant="secondary" className="px-3 py-1">
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    {language === 'en' ? 'Deployment Options' : '部署选项'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Cloud', 'On-Premise', 'Hybrid'].map((option) => (
                      <Card key={option}>
                        <CardContent className="p-4 text-center">
                          <div className="font-medium">{option}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <ProductReviews
                  reviews={allReviews}
                  rating={rating}
                  productId={productKey}
                  onReviewSubmit={handleReviewSubmit}
                />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
