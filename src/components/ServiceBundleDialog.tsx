"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Package, 
  CheckCircle, 
  ShoppingCart,
  Sparkle,
  TrendUp,
  Lightning,
  Star
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

type ServiceBundle = {
  id: string
  name: { en: string; zh: string }
  description: { en: string; zh: string }
  services: string[]
  price: number
  originalPrice: number
  discount: number
  popular?: boolean
  badge?: { en: string; zh: string }
  features: { en: string[]; zh: string[] }
  tokensIncluded?: number
  category: 'starter' | 'growth' | 'enterprise'
}

export const serviceBundles: ServiceBundle[] = [
  {
    id: 'content-master',
    name: { en: 'Content Master Bundle', zh: '内容大师套餐' },
    description: { 
      en: 'Complete content creation toolkit for marketers and creators',
      zh: '为营销人员和创作者提供的完整内容创作工具包'
    },
    services: ['Content Generation', 'Image Generator', 'Social Media AI', 'SEO Optimization', 'Text Summarizer'],
    price: 899,
    originalPrice: 1299,
    discount: 31,
    popular: true,
    badge: { en: 'Best for Marketing', zh: '营销首选' },
    tokensIncluded: 500000,
    category: 'growth',
    features: {
      en: [
        '5 AI services included',
        '500K tokens/month',
        'Unlimited content generation',
        'Priority support',
        'Advanced analytics',
        'API access'
      ],
      zh: [
        '包含5项AI服务',
        '每月50万tokens',
        '无限内容生成',
        '优先支持',
        '高级分析',
        'API访问'
      ]
    }
  },
  {
    id: 'business-automation',
    name: { en: 'Business Automation Suite', zh: '业务自动化套件' },
    description: {
      en: 'Streamline operations with intelligent automation tools',
      zh: '使用智能自动化工具简化运营'
    },
    services: ['AI Workflow', 'Chatbot Builder', 'Email AI', 'Customer Segmentation', 'Lead Scoring', 'Marketing Automation'],
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    badge: { en: 'Enterprise Ready', zh: '企业就绪' },
    tokensIncluded: 1000000,
    category: 'enterprise',
    features: {
      en: [
        '6 AI services included',
        '1M tokens/month',
        'Workflow automation',
        '24/7 support',
        'Custom integrations',
        'Dedicated account manager'
      ],
      zh: [
        '包含6项AI服务',
        '每月100万tokens',
        '工作流自动化',
        '24/7支持',
        '定制集成',
        '专属客户经理'
      ]
    }
  },
  {
    id: 'analytics-pro',
    name: { en: 'Analytics Pro Bundle', zh: '分析专业套餐' },
    description: {
      en: 'Advanced analytics and insights for data-driven decisions',
      zh: '为数据驱动决策提供高级分析和洞察'
    },
    services: ['Analytics', 'Sentiment Analysis', 'Predictive Analytics', 'Anomaly Detection', 'Retail Analytics'],
    price: 1199,
    originalPrice: 1699,
    discount: 29,
    tokensIncluded: 750000,
    category: 'growth',
    features: {
      en: [
        '5 AI services included',
        '750K tokens/month',
        'Real-time analytics',
        'Custom dashboards',
        'Data visualization',
        'Export capabilities'
      ],
      zh: [
        '包含5项AI服务',
        '每月75万tokens',
        '实时分析',
        '自定义仪表板',
        '数据可视化',
        '导出功能'
      ]
    }
  },
  {
    id: 'starter-pack',
    name: { en: 'Startup Essentials', zh: '创业基础套餐' },
    description: {
      en: 'Perfect starter bundle for small businesses and startups',
      zh: '适合小企业和初创公司的完美入门套餐'
    },
    services: ['AI Assistant', 'Content Generation', 'Chatbot Builder'],
    price: 399,
    originalPrice: 599,
    discount: 33,
    popular: true,
    badge: { en: 'Most Popular', zh: '最受欢迎' },
    tokensIncluded: 200000,
    category: 'starter',
    features: {
      en: [
        '3 AI services included',
        '200K tokens/month',
        'Email support',
        'Getting started guide',
        'Basic analytics',
        'Community access'
      ],
      zh: [
        '包含3项AI服务',
        '每月20万tokens',
        '邮件支持',
        '入门指南',
        '基础分析',
        '社区访问'
      ]
    }
  },
  {
    id: 'freelancer-boost',
    name: { en: 'Freelancer Boost', zh: '自由职业者加速套餐' },
    description: {
      en: 'Accelerate your freelance work with AI productivity tools',
      zh: '使用AI生产力工具加速自由职业工作'
    },
    services: ['Content Generation', 'Translation AI', 'Text Summarizer', 'Email AI'],
    price: 349,
    originalPrice: 549,
    discount: 36,
    badge: { en: 'Best for Freelancers', zh: '自由职业者首选' },
    tokensIncluded: 150000,
    category: 'starter',
    features: {
      en: [
        '4 AI services included',
        '150K tokens/month',
        'Multi-language support',
        'Fast turnaround',
        'Email assistance',
        '30-day money back'
      ],
      zh: [
        '包含4项AI服务',
        '每月15万tokens',
        '多语言支持',
        '快速响应',
        '邮件协助',
        '30天退款保证'
      ]
    }
  },
  {
    id: 'social-media-starter',
    name: { en: 'Social Media Starter', zh: '社交媒体入门套餐' },
    description: {
      en: 'Grow your social presence with AI content tools',
      zh: '使用AI内容工具扩大社交媒体影响力'
    },
    services: ['Social Media AI', 'Image Generator', 'Content Generation', 'Sentiment Analysis'],
    price: 449,
    originalPrice: 699,
    discount: 36,
    tokensIncluded: 250000,
    category: 'starter',
    features: {
      en: [
        '4 AI services included',
        '250K tokens/month',
        'Social post scheduling',
        'Hashtag optimization',
        'Performance insights',
        'Visual content creation'
      ],
      zh: [
        '包含4项AI服务',
        '每月25万tokens',
        '社交发布计划',
        '标签优化',
        '性能洞察',
        '视觉内容创作'
      ]
    }
  },
  {
    id: 'blogger-companion',
    name: { en: 'Blogger Companion', zh: '博主助手套餐' },
    description: {
      en: 'Everything you need to create engaging blog content',
      zh: '创建引人入胜的博客内容所需的一切'
    },
    services: ['Content Generation', 'Text Summarizer', 'SEO Optimization', 'Image Generator'],
    price: 329,
    originalPrice: 499,
    discount: 34,
    tokensIncluded: 180000,
    category: 'starter',
    features: {
      en: [
        '4 AI services included',
        '180K tokens/month',
        'SEO-optimized content',
        'Plagiarism check',
        'Content calendar',
        'Readability analysis'
      ],
      zh: [
        '包含4项AI服务',
        '每月18万tokens',
        'SEO优化内容',
        '原创性检查',
        '内容日历',
        '可读性分析'
      ]
    }
  },
  {
    id: 'student-research',
    name: { en: 'Student Research Pack', zh: '学生研究套餐' },
    description: {
      en: 'AI tools to enhance learning and research productivity',
      zh: 'AI工具提升学习和研究效率'
    },
    services: ['AI Assistant', 'Text Summarizer', 'Translation AI', 'Document AI'],
    price: 199,
    originalPrice: 349,
    discount: 43,
    badge: { en: 'Student Discount', zh: '学生优惠' },
    tokensIncluded: 100000,
    category: 'starter',
    features: {
      en: [
        '4 AI services included',
        '100K tokens/month',
        'Research assistance',
        'Citation help',
        'Note-taking tools',
        'Educational discount'
      ],
      zh: [
        '包含4项AI服务',
        '每月10万tokens',
        '研究辅助',
        '引用帮助',
        '笔记工具',
        '教育折扣'
      ]
    }
  },
  {
    id: 'small-biz-intro',
    name: { en: 'Small Business Intro', zh: '小企业入门套餐' },
    description: {
      en: 'Affordable AI solutions for growing small businesses',
      zh: '为成长中的小企业提供的实惠AI解决方案'
    },
    services: ['AI Assistant', 'Email AI', 'Customer Segmentation', 'Lead Scoring'],
    price: 479,
    originalPrice: 749,
    discount: 36,
    tokensIncluded: 220000,
    category: 'starter',
    features: {
      en: [
        '4 AI services included',
        '220K tokens/month',
        'CRM integration',
        'Customer insights',
        'Lead management',
        'Phone support'
      ],
      zh: [
        '包含4项AI服务',
        '每月22万tokens',
        'CRM集成',
        '客户洞察',
        '潜客管理',
        '电话支持'
      ]
    }
  },
  {
    id: 'ecommerce-complete',
    name: { en: 'E-commerce Complete', zh: '电商完整套餐' },
    description: {
      en: 'All-in-one solution for online retailers',
      zh: '在线零售商的一体化解决方案'
    },
    services: ['Product Recommendation', 'Dynamic Pricing', 'Inventory AI', 'Customer Segmentation', 'Chatbot Builder', 'Retail Analytics'],
    price: 1799,
    originalPrice: 2599,
    discount: 31,
    tokensIncluded: 1200000,
    category: 'enterprise',
    features: {
      en: [
        '6 AI services included',
        '1.2M tokens/month',
        'E-commerce optimized',
        'Inventory management',
        'Sales forecasting',
        'Priority support'
      ],
      zh: [
        '包含6项AI服务',
        '每月120万tokens',
        '电商优化',
        '库存管理',
        '销售预测',
        '优先支持'
      ]
    }
  },
  {
    id: 'developer-toolkit',
    name: { en: 'Developer Toolkit', zh: '开发者工具包' },
    description: {
      en: 'Essential AI tools for software development teams',
      zh: '软件开发团队的基本AI工具'
    },
    services: ['Code Assistant', 'Document AI', 'API Platform', 'Testing Automation'],
    price: 799,
    originalPrice: 1199,
    discount: 33,
    badge: { en: 'For Developers', zh: '开发者专用' },
    tokensIncluded: 600000,
    category: 'growth',
    features: {
      en: [
        '4 AI services included',
        '600K tokens/month',
        'Code completion',
        'Technical support',
        'SDK access',
        'Developer documentation'
      ],
      zh: [
        '包含4项AI服务',
        '每月60万tokens',
        '代码补全',
        '技术支持',
        'SDK访问',
        '开发者文档'
      ]
    }
  },
  {
    id: 'customer-experience',
    name: { en: 'Customer Experience Suite', zh: '客户体验套件' },
    description: {
      en: 'Enhance customer satisfaction with AI-powered tools',
      zh: '使用AI驱动的工具提升客户满意度'
    },
    services: ['AI Assistant', 'Chatbot Builder', 'Sentiment Analysis', 'Voice AI', 'Personalization Engine'],
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    tokensIncluded: 900000,
    category: 'growth',
    features: {
      en: [
        '5 AI services included',
        '900K tokens/month',
        'Multi-channel support',
        'Customer insights',
        'Personalization',
        '24/7 availability'
      ],
      zh: [
        '包含5项AI服务',
        '每月90万tokens',
        '多渠道支持',
        '客户洞察',
        '个性化',
        '24/7可用'
      ]
    }
  },
  {
    id: 'compliance-security',
    name: { en: 'Compliance & Security Bundle', zh: '合规与安全套餐' },
    description: {
      en: 'Maintain compliance and security with AI monitoring',
      zh: '通过AI监控保持合规性和安全性'
    },
    services: ['Compliance AI', 'Cybersecurity AI', 'Fraud Detection', 'Risk Assessment', 'Document AI'],
    price: 1999,
    originalPrice: 2899,
    discount: 31,
    tokensIncluded: 1500000,
    category: 'enterprise',
    features: {
      en: [
        '5 AI services included',
        '1.5M tokens/month',
        'Security monitoring',
        'Compliance reporting',
        'Audit trails',
        'Premium support'
      ],
      zh: [
        '包含5项AI服务',
        '每月150万tokens',
        '安全监控',
        '合规报告',
        '审计跟踪',
        '高级支持'
      ]
    }
  }
]

type ServiceBundleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchase: (bundle: ServiceBundle) => void
}

export function ServiceBundleDialog({ open, onOpenChange, onPurchase }: ServiceBundleDialogProps) {
  const { language } = useLanguage()

  const bundlesByCategory = {
    starter: serviceBundles.filter(b => b.category === 'starter'),
    growth: serviceBundles.filter(b => b.category === 'growth'),
    enterprise: serviceBundles.filter(b => b.category === 'enterprise')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package size={24} className="text-primary" weight="duotone" />
            {language === 'en' ? 'Service Bundle Packages' : '服务套餐组合'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en'
              ? 'Combine multiple AI services at discounted rates. Save up to 33% compared to individual purchases.'
              : '以折扣价格组合多项AI服务。与单独购买相比，最高可节省33%。'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {/* Starter Bundles */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Lightning size={20} className="text-accent" weight="fill" />
                {language === 'en' ? 'Starter Bundles' : '入门套餐'}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {bundlesByCategory.starter.map((bundle, index) => (
                  <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`relative ${bundle.popular ? 'border-primary shadow-lg' : ''}`}>
                      {bundle.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <Badge className="bg-primary text-primary-foreground">
                            <Star size={12} weight="fill" className="mr-1" />
                            {language === 'en' ? 'Most Popular' : '最受欢迎'}
                          </Badge>
                        </div>
                      )}
                      {bundle.badge && !bundle.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <Badge variant="secondary">{bundle.badge[language]}</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{bundle.name[language]}</CardTitle>
                            <CardDescription className="text-sm">{bundle.description[language]}</CardDescription>
                          </div>
                          <Badge variant="outline" className="text-accent border-accent shrink-0">
                            {language === 'en' ? 'Save' : '节省'} {bundle.discount}%
                          </Badge>
                        </div>
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-3xl font-bold text-foreground">₱{bundle.price}</span>
                          <span className="text-sm text-muted-foreground line-through">₱{bundle.originalPrice}</span>
                          <span className="text-sm text-muted-foreground">/ {language === 'en' ? 'month' : '月'}</span>
                        </div>
                        {bundle.tokensIncluded && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            <Sparkle size={14} weight="fill" className="text-accent" />
                            {(bundle.tokensIncluded / 1000).toLocaleString()}K tokens {language === 'en' ? 'included' : '包含'}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Package size={16} className="text-primary" />
                            {language === 'en' ? 'Services Included' : '包含的服务'}
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {bundle.services.map(service => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">{language === 'en' ? 'Key Features' : '主要特性'}</h4>
                          <ul className="space-y-1.5">
                            {bundle.features[language].map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle size={16} className="text-accent shrink-0 mt-0.5" weight="fill" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button 
                          className="w-full"
                          variant={bundle.popular ? 'default' : 'outline'}
                          onClick={() => onPurchase(bundle)}
                        >
                          <ShoppingCart size={18} className="mr-2" />
                          {language === 'en' ? 'Purchase Bundle' : '购买套餐'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Growth Bundles */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendUp size={20} className="text-primary" weight="fill" />
                {language === 'en' ? 'Growth Bundles' : '增长套餐'}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {bundlesByCategory.growth.map((bundle, index) => (
                  <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Card className={`relative ${bundle.popular ? 'border-primary shadow-lg' : ''}`}>
                      {bundle.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <Badge className="bg-primary text-primary-foreground">
                            <Star size={12} weight="fill" className="mr-1" />
                            {language === 'en' ? 'Most Popular' : '最受欢迎'}
                          </Badge>
                        </div>
                      )}
                      {bundle.badge && !bundle.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <Badge variant="secondary">{bundle.badge[language]}</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{bundle.name[language]}</CardTitle>
                            <CardDescription className="text-sm">{bundle.description[language]}</CardDescription>
                          </div>
                          <Badge variant="outline" className="text-accent border-accent shrink-0">
                            {language === 'en' ? 'Save' : '节省'} {bundle.discount}%
                          </Badge>
                        </div>
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-3xl font-bold text-foreground">₱{bundle.price}</span>
                          <span className="text-sm text-muted-foreground line-through">₱{bundle.originalPrice}</span>
                          <span className="text-sm text-muted-foreground">/ {language === 'en' ? 'month' : '月'}</span>
                        </div>
                        {bundle.tokensIncluded && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            <Sparkle size={14} weight="fill" className="text-accent" />
                            {(bundle.tokensIncluded / 1000).toLocaleString()}K tokens {language === 'en' ? 'included' : '包含'}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Package size={16} className="text-primary" />
                            {language === 'en' ? 'Services Included' : '包含的服务'}
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {bundle.services.map(service => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">{language === 'en' ? 'Key Features' : '主要特性'}</h4>
                          <ul className="space-y-1.5">
                            {bundle.features[language].map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle size={16} className="text-accent shrink-0 mt-0.5" weight="fill" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button 
                          className="w-full"
                          variant={bundle.popular ? 'default' : 'outline'}
                          onClick={() => onPurchase(bundle)}
                        >
                          <ShoppingCart size={18} className="mr-2" />
                          {language === 'en' ? 'Purchase Bundle' : '购买套餐'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enterprise Bundles */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Star size={20} className="text-accent" weight="fill" />
                {language === 'en' ? 'Enterprise Bundles' : '企业套餐'}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {bundlesByCategory.enterprise.map((bundle, index) => (
                  <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <Card className="relative">
                      {bundle.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {bundle.badge[language]}
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{bundle.name[language]}</CardTitle>
                            <CardDescription className="text-sm">{bundle.description[language]}</CardDescription>
                          </div>
                          <Badge variant="outline" className="text-accent border-accent shrink-0">
                            {language === 'en' ? 'Save' : '节省'} {bundle.discount}%
                          </Badge>
                        </div>
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-3xl font-bold text-foreground">₱{bundle.price}</span>
                          <span className="text-sm text-muted-foreground line-through">₱{bundle.originalPrice}</span>
                          <span className="text-sm text-muted-foreground">/ {language === 'en' ? 'month' : '月'}</span>
                        </div>
                        {bundle.tokensIncluded && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            <Sparkle size={14} weight="fill" className="text-accent" />
                            {(bundle.tokensIncluded / 1000).toLocaleString()}K tokens {language === 'en' ? 'included' : '包含'}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Package size={16} className="text-primary" />
                            {language === 'en' ? 'Services Included' : '包含的服务'}
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {bundle.services.map(service => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">{language === 'en' ? 'Key Features' : '主要特性'}</h4>
                          <ul className="space-y-1.5">
                            {bundle.features[language].map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle size={16} className="text-accent shrink-0 mt-0.5" weight="fill" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => onPurchase(bundle)}
                        >
                          <ShoppingCart size={18} className="mr-2" />
                          {language === 'en' ? 'Purchase Bundle' : '购买套餐'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
