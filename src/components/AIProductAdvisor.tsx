"use client"

import { spark } from '@/lib/spark-shim'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'

type Recommendation = {
  products: string[]
  tier: string
  reasoning: string
  estimatedCost: string
}

export function AIProductAdvisor() {
  const { t } = useLanguage()
  const [businessNeeds, setBusinessNeeds] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)

  const handleAnalyze = async () => {
    if (!businessNeeds.trim()) {
      toast.error(t.advisor.toast.describeNeeds)
      return
    }

    setIsAnalyzing(true)
    setRecommendation(null)

    try {
      const prompt = spark.llmPrompt`You are an AI product advisor for Danica IT. Based on the following business needs, recommend the most suitable AI products from our catalog:

Available Products:
1. AI Assistant - 24/7 conversational AI for customer support (Tiers: Starter $99/mo, Professional $299/mo, Enterprise $999/mo)
2. Content Generator - Marketing content creation (Tiers: Starter $49/mo, Professional $149/mo, Enterprise $499/mo)
3. Automation Suite - Business workflow automation (Tiers: Starter $199/mo, Professional $499/mo, Enterprise $1499/mo)
4. Predictive Analytics - ML-powered forecasting (Tiers: Starter $149/mo, Professional $399/mo, Enterprise $999/mo)
5. Sentiment Analysis - Customer feedback monitoring (Tiers: Starter $79/mo, Professional $249/mo, Enterprise $699/mo)
6. AI Recommendations - E-commerce personalization (Tiers: Starter $129/mo, Professional $349/mo, Enterprise $899/mo)

Business Needs: ${businessNeeds}

Return ONLY a valid JSON object in this exact format (no additional text):
{
  "products": ["Product Name 1", "Product Name 2"],
  "tier": "Starter|Professional|Enterprise",
  "reasoning": "Brief 2-3 sentence explanation of why these products and tier",
  "estimatedCost": "$XXX/month"
}`

      const response = await spark.llm(prompt, 'gpt-4o-mini', true)
      const parsed = JSON.parse(response)
      setRecommendation(parsed)
      toast.success(t.advisor.toast.generated)
    } catch (error) {
      toast.error(t.advisor.toast.failed)
      setRecommendation(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb size={24} weight="duotone" className="text-accent" />
          <div className="flex-1">
            <CardTitle className="text-lg">{t.advisor.title}</CardTitle>
            <CardDescription>{t.advisor.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Sparkle size={12} className="mr-1" weight="fill" />
            {t.advisor.aiPowered}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="business-needs" className="text-sm font-medium">
            {t.advisor.describeNeeds}
          </label>
          <Textarea
            id="business-needs"
            placeholder={t.advisor.placeholder}
            value={businessNeeds}
            onChange={(e) => setBusinessNeeds(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isAnalyzing}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !businessNeeds.trim()}
        >
          {isAnalyzing ? t.advisor.analyzing : t.advisor.getRecommendation}
        </Button>

        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 p-4 bg-card rounded-lg border"
          >
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Sparkle size={16} weight="fill" className="text-accent" />
                {t.advisor.recommendedProducts}
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendation.products.map((product) => (
                  <Badge key={product} className="bg-accent text-accent-foreground">
                    {product}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-1">{t.advisor.recommendedTier}</h4>
              <Badge variant="outline" className="text-sm">
                {recommendation.tier}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-1">{t.advisor.estimatedCost}</h4>
              <p className="text-lg font-bold text-accent">{recommendation.estimatedCost}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-1">{t.advisor.whyThese}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              {t.advisor.viewPricing}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
