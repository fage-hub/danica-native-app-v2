"use client"

import { spark } from '@/lib/spark-shim'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  MagicWand, 
  Robot, 
  ChartLine,
  ChatCircleDots,
  Lightbulb,
  CaretDown,
  CaretUp,
  Sparkle
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'
import { PRODUCT_CATALOG } from '@/lib/product-catalog'

type ServiceKey = 'aiAssistant' | 'contentGen' | 'automation' | 'analytics' | 'sentiment' | 'recommender' | 'voiceAI' | 'visionAI' | 'nlpPlatform' | 'chatbotBuilder' | 'aiWorkflow' | 'knowledgeBase' | 'emailAI' | 'dataLabeling' | 'fraudDetection' | 'documentAI' | 'translationAI' | 'codeAssistant' | 'videoAnalytics' | 'speechRecognition' | 'textSummarizer' | 'imageGenerator' | 'predictiveMaintenance' | 'recruitmentAI' | 'priceOptimization' | 'inventoryAI' | 'socialMediaAI' | 'customerSegmentation' | 'anomalyDetection' | 'riskAssessment' | 'leadScoring' | 'qualityControl' | 'energyOptimization' | 'supplyChainAI' | 'medicalDiagnosis' | 'legalAI' | 'financialForecasting' | 'marketingAutomation' | 'salesForecasting' | 'contractAnalysis' | 'complianceAI' | 'cybersecurityAI' | 'routeOptimization' | 'warehouseAI' | 'retailAnalytics' | 'personalizationEngine' | 'searchOptimization' | 'contentModeration' | 'dynamicPricing'

type Service = {
  id: ServiceKey
  icon: React.ElementType
  demo?: boolean
}

export function ServicesSection() {
  const { t, language } = useLanguage()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [demoInput, setDemoInput] = useState('')
  const [demoResponse, setDemoResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

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
          {t.services.title}
        </motion.h1>
        <motion.p 
          className="text-sm sm:text-base text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t.services.subtitle}
        </motion.p>
      </motion.div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {services.map((service, index) => {
          const Icon = service.icon
          const isExpanded = expandedId === service.id
          const translationData = t.services.products[service.id]
          const catalogData = PRODUCT_CATALOG[language][service.id]
          
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
              initial={{ opacity: 0, x: -30, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ 
                delay: 0.15 + index * 0.08,
                type: 'spring',
                stiffness: 280,
                damping: 24
              }}
              whileHover={{ 
                scale: 1.01,
                x: 5,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
              }}
            >
              <Card className="overflow-hidden border-border/70 hover:border-accent/30 transition-all shadow-sm hover:shadow-md">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <motion.div 
                      className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-accent/10 to-primary/5"
                      whileHover={{ rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <Icon size={26} weight="duotone" className="text-accent" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CardTitle className="text-base sm:text-lg">{productData.title}</CardTitle>
                        {service.demo && (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-accent/40">
                            <Sparkle size={10} className="mr-1" weight="fill" />
                            {t.services.demo}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs sm:text-sm">{productData.description}</CardDescription>
                    </div>
                    <motion.div
                      whileTap={{ scale: 0.92 }}
                    >
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
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => handleRequestDemo(productData.title)}
                      >
                        {t.services.requestDemo}
                      </Button>
                    )}
                  </CardContent>
                </motion.div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
