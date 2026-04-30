"use client"
import { formatTokens } from '@/lib/utils'

import { spark } from '@/lib/spark-shim'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ShoppingCart, Sparkle, MagicWand, ArrowLeft } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'

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

type PackageRecommenderProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  packages: TokenPackage[]
  onPurchase: (pkg: TokenPackage) => void
}

type UseCase = 'content' | 'development' | 'business' | 'enterprise' | 'industry'
type Budget = 'low' | 'medium' | 'high' | 'unlimited'

export function PackageRecommender({ 
  open, 
  onOpenChange, 
  packages,
  onPurchase 
}: PackageRecommenderProps) {
  const { language } = useLanguage()
  const [mode, setMode] = useState<'guided' | 'ai'>('guided')
  const [useCase, setUseCase] = useState<UseCase | null>(null)
  const [budget, setBudget] = useState<Budget | null>(null)
  const [aiInput, setAiInput] = useState('')
  const [aiRecommendations, setAiRecommendations] = useState<TokenPackage[]>([])
  const [aiReason, setAiReason] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const useCases = {
    content: {
      en: 'Content Creation & Marketing',
      zh: '内容创作与营销'
    },
    development: {
      en: 'Software Development',
      zh: '软件开发'
    },
    business: {
      en: 'General Business Operations',
      zh: '通用业务运营'
    },
    enterprise: {
      en: 'Large Enterprise',
      zh: '大型企业'
    },
    industry: {
      en: 'Specialized Industry (Healthcare, Finance, Legal)',
      zh: '专业行业（医疗、金融、法律）'
    }
  }

  const budgets = {
    low: {
      en: 'Under $500',
      zh: '低于$500'
    },
    medium: {
      en: '$500 - $1,500',
      zh: '$500 - $1,500'
    },
    high: {
      en: '$1,500 - $5,000',
      zh: '$1,500 - $5,000'
    },
    unlimited: {
      en: 'Above $5,000',
      zh: '$5,000以上'
    }
  }

  const getRecommendation = (): TokenPackage | null => {
    if (!useCase || !budget) return null

    if (useCase === 'content') {
      if (budget === 'low') return packages.find(p => p.id === 'trial') || packages.find(p => p.id === 'content-creator') || null
      if (budget === 'medium') return packages.find(p => p.id === 'content-creator') || packages.find(p => p.id === 'marketing') || null
      if (budget === 'high') return packages.find(p => p.id === 'marketing') || null
      return packages.find(p => p.id === 'professional') || null
    }

    if (useCase === 'development') {
      if (budget === 'low') return packages.find(p => p.id === 'starter') || packages.find(p => p.id === 'trial') || null
      if (budget === 'medium') return packages.find(p => p.id === 'developer') || packages.find(p => p.id === 'professional') || null
      if (budget === 'high') return packages.find(p => p.id === 'developer') || packages.find(p => p.id === 'enterprise') || null
      return packages.find(p => p.id === 'unlimited') || null
    }

    if (useCase === 'business') {
      if (budget === 'low') return packages.find(p => p.id === 'starter') || packages.find(p => p.id === 'trial') || null
      if (budget === 'medium') return packages.find(p => p.id === 'professional') || packages.find(p => p.id === 'ecommerce') || null
      if (budget === 'high') return packages.find(p => p.id === 'enterprise') || packages.find(p => p.id === 'ecommerce') || null
      return packages.find(p => p.id === 'unlimited') || null
    }

    if (useCase === 'enterprise') {
      if (budget === 'medium') return packages.find(p => p.id === 'enterprise') || null
      if (budget === 'high') return packages.find(p => p.id === 'unlimited') || packages.find(p => p.id === 'enterprise') || null
      return packages.find(p => p.id === 'unlimited') || null
    }

    if (useCase === 'industry') {
      if (budget === 'low') return packages.find(p => p.id === 'education') || packages.find(p => p.id === 'trial') || null
      if (budget === 'medium') return packages.find(p => p.id === 'healthcare') || packages.find(p => p.id === 'legal') || packages.find(p => p.id === 'ecommerce') || null
      if (budget === 'high') return packages.find(p => p.id === 'finance') || packages.find(p => p.id === 'legal') || null
      return packages.find(p => p.id === 'unlimited') || packages.find(p => p.id === 'finance') || null
    }

    return null
  }

  const handleAiRecommendation = async () => {
    if (!aiInput.trim()) {
      toast.error(language === 'en' ? 'Please describe your needs' : '请描述您的需求')
      return
    }

    setIsAnalyzing(true)
    try {
      const packagesInfo = packages.map(p => ({
        id: p.id,
        name: p.name[language],
        tokens: p.tokens,
        price: p.price,
        features: p.features[language].slice(0, 5),
        category: p.category
      }))

      const prompt = spark.llmPrompt`You are an AI package recommendation expert. Based on the user's needs, recommend the top 1-3 most suitable packages.

User needs: ${aiInput}

Available packages:
${JSON.stringify(packagesInfo, null, 2)}

Please analyze the user's requirements and recommend the most suitable packages. Return your response as a JSON object with the following structure:
{
  "recommendedPackageIds": ["package-id-1", "package-id-2"],
  "reason": "A brief explanation of why these packages are recommended (in ${language === 'en' ? 'English' : 'Chinese'})"
}

Only recommend packages that exist in the list above. Focus on matching the user's budget, use case, and specific requirements.`

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const result = JSON.parse(response)

      const recommended = packages.filter(p => 
        result.recommendedPackageIds.includes(p.id)
      )

      if (recommended.length > 0) {
        setAiRecommendations(recommended)
        setAiReason(result.reason)
        toast.success(
          language === 'en' 
            ? `Found ${recommended.length} suitable package${recommended.length > 1 ? 's' : ''}` 
            : `找到 ${recommended.length} 个合适的套餐`
        )
      } else {
        toast.error(language === 'en' ? 'No suitable packages found' : '未找到合适的套餐')
      }
    } catch (error) {
      console.error('AI recommendation error:', error)
      toast.error(language === 'en' ? 'Failed to analyze. Please try again.' : '分析失败，请重试')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const recommendation = getRecommendation()

  const handleReset = () => {
    setUseCase(null)
    setBudget(null)
    setAiInput('')
    setAiRecommendations([])
    setAiReason('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Sparkle size={24} className="text-primary" weight="fill" />
            {language === 'en' ? 'Smart Package Recommender' : '智能套餐推荐'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Find the perfect package using guided questions or AI-powered analysis'
              : '通过引导式问题或AI智能分析找到最适合的套餐'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as 'guided' | 'ai')} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guided" className="flex items-center gap-2">
              <Sparkle size={16} />
              {language === 'en' ? 'Guided' : '引导式'}
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <MagicWand size={16} />
              {language === 'en' ? 'AI Analysis' : 'AI分析'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guided" className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                {language === 'en' ? '1. What is your primary use case?' : '1. 您的主要使用场景是什么？'}
              </Label>
              <RadioGroup value={useCase || ''} onValueChange={(value) => setUseCase(value as UseCase)}>
                {Object.entries(useCases).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border transition-colors">
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key} className="flex-1 cursor-pointer">
                      {value[language]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {useCase && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {language === 'en' ? '2. What is your budget?' : '2. 您的预算是多少？'}
                </Label>
                <RadioGroup value={budget || ''} onValueChange={(value) => setBudget(value as Budget)}>
                  {Object.entries(budgets).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border transition-colors">
                      <RadioGroupItem value={key} id={`budget-${key}`} />
                      <Label htmlFor={`budget-${key}`} className="flex-1 cursor-pointer">
                        {value[language]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {recommendation && (
              <Card className="border-primary/30 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {language === 'en' ? 'Recommended Package' : '推荐套餐'}
                    </CardTitle>
                    <Badge className="bg-primary text-primary-foreground">
                      {language === 'en' ? 'Best Match' : '最佳匹配'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold">{recommendation.name[language]}</span>
                      {recommendation.discount && (
                        <Badge variant="outline" className="text-accent border-accent">
                          -{recommendation.discount}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-primary">₱{recommendation.price}</span>
                      <span className="text-muted-foreground text-sm">
                        PHP
                      </span>
                    </div>
                    <CardDescription className="mt-1">
                      {formatTokens(recommendation.tokens, language)} tokens
                    </CardDescription>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {language === 'en' ? 'Included Features:' : '包含功能：'}
                    </p>
                    <ul className="space-y-1">
                      {recommendation.features[language].slice(0, 4).map((feature, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-accent mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        onPurchase(recommendation)
                        onOpenChange(false)
                      }}
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      {language === 'en' ? 'Purchase Now' : '立即购买'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleReset}
                    >
                      {language === 'en' ? 'Reset' : '重置'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ai" className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                {language === 'en' ? 'Describe your needs' : '描述您的需求'}
              </Label>
              <Textarea
                placeholder={
                  language === 'en'
                    ? 'Tell us about your use case, budget, expected usage, and any specific requirements...\n\nExample: "I need a package for a small e-commerce website with about 5,000 monthly visitors. Budget is around $1,000. Need customer service chatbot and basic analytics."'
                    : '告诉我们您的使用场景、预算、预期使用量以及任何特殊需求...\n\n例如："我需要一个适合小型电商网站的套餐，月访问量约5000人。预算在1000美元左右。需要客服聊天机器人和基础分析功能。"'
                }
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="min-h-[150px] resize-none"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleAiRecommendation}
                  disabled={isAnalyzing || !aiInput.trim()}
                  className="flex-1"
                >
                  <MagicWand size={18} className="mr-2" />
                  {isAnalyzing 
                    ? (language === 'en' ? 'Analyzing...' : '分析中...')
                    : (language === 'en' ? 'Get AI Recommendation' : '获取AI推荐')
                  }
                </Button>
                {aiRecommendations.length > 0 && (
                  <Button variant="outline" onClick={handleReset}>
                    {language === 'en' ? 'Reset' : '重置'}
                  </Button>
                )}
              </div>
            </div>

            {aiRecommendations.length > 0 && (
              <div className="space-y-4">
                {aiReason && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {language === 'en' ? 'AI Analysis:' : 'AI分析：'}
                        </span>{' '}
                        {aiReason}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {aiRecommendations.map((pkg, index) => (
                  <Card 
                    key={pkg.id} 
                    className={`border-primary/30 shadow-lg ${
                      index === 0 ? 'bg-gradient-to-br from-primary/5 to-accent/5' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {language === 'en' ? `Recommendation #${index + 1}` : `推荐 #${index + 1}`}
                        </CardTitle>
                        {index === 0 && (
                          <Badge className="bg-primary text-primary-foreground">
                            {language === 'en' ? 'Top Choice' : '首选'}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-2xl font-bold">{pkg.name[language]}</span>
                          {pkg.discount && (
                            <Badge variant="outline" className="text-accent border-accent">
                              -{pkg.discount}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-primary">₱{pkg.price}</span>
                          <span className="text-muted-foreground text-sm">
                            PHP
                          </span>
                        </div>
                        <CardDescription className="mt-1">
                          {formatTokens(pkg.tokens, language)} tokens
                        </CardDescription>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          {language === 'en' ? 'Included Features:' : '包含功能：'}
                        </p>
                        <ul className="space-y-1">
                          {pkg.features[language].slice(0, 5).map((feature, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-accent mt-0.5">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        className="w-full"
                        variant={index === 0 ? 'default' : 'outline'}
                        onClick={() => {
                          onPurchase(pkg)
                          onOpenChange(false)
                        }}
                      >
                        <ShoppingCart size={18} className="mr-2" />
                        {language === 'en' ? 'Purchase Now' : '立即购买'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
