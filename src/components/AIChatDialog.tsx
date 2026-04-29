"use client"

import { spark } from '@/lib/spark-shim'
import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Brain, PaperPlaneTilt, User } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type AIChatDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AIChatDialog({ open, onOpenChange }: AIChatDialogProps) {
  const { t, language } = useLanguage()
  
  const WELCOME_MESSAGE: Message = {
    id: 'welcome',
    role: 'assistant',
    content: t.aiChat.welcomeMessage,
    timestamp: new Date()
  }
  
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsGenerating(true)

    try {
      const conversationContext = messages
        .slice(-4)
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n')

      const isZh = language === 'zh'

      const systemContext = isZh
        ? `你是Danica的AI助手，是Danica IT（一家AI解决方案公司）的专业代表。

Danica IT提供6款AI产品：
1. AI助手 - 全天候对话式AI客户支持（支持50+种语言，GPT-4驱动，集成Slack、Zendesk、Teams）
2. 内容生成器 - 创建营销内容、博客、社交媒体帖子、电子邮件（SEO优化，保持品牌声音）
3. 自动化套件 - 自动化工作流、文档处理、数据录入（100+集成，支持Zapier、SAP、Oracle）
4. 预测分析 - ML驱动的预测、客户流失预测、需求规划（集成Tableau、Power BI）
5. 情感分析 - 实时监控客户反馈和社交媒体（支持50+种语言）
6. AI推荐 - 电商个性化产品推荐（集成Shopify、WooCommerce）

定价层级：入门版（经济实惠）、专业版（最受欢迎）、企业版（完整功能）
所有计划包括：14天免费试用、SOC 2和GDPR合规、99.9%正常运行时间SLA

之前的对话：
${conversationContext}

用户的新消息：${userMessage.content}

请提供有帮助、简洁的回复（2-4句话）。保持友好和专业。如果他们询问具体产品，请提及关键功能。如果他们询问定价，请提及层级结构。如果他们想试用，请鼓励他们查看"服务"或"对比"标签。请用中文回复。`
        : `You are Danica's AI Assistant, a helpful and knowledgeable representative of Danica IT, an AI solutions company. 

Danica IT offers 6 AI products:
1. AI Assistant - 24/7 conversational AI for customer support (50+ languages, GPT-4 powered, integrates with Slack, Zendesk, Teams)
2. Content Generator - Creates marketing content, blogs, social media posts, emails (SEO-optimized, maintains brand voice)
3. Automation Suite - Automates workflows, document processing, data entry (100+ integrations with Zapier, SAP, Oracle)
4. Predictive Analytics - ML-powered forecasting, churn prediction, demand planning (integrates with Tableau, Power BI)
5. Sentiment Analysis - Real-time monitoring of customer feedback and social media (supports 50+ languages)
6. AI Recommendations - Personalized product recommendations for e-commerce (integrates with Shopify, WooCommerce)

Pricing tiers: Starter (budget-friendly), Professional (most popular), Enterprise (full features)
All plans include: 14-day free trial, SOC 2 & GDPR compliance, 99.9% uptime SLA

Previous conversation:
${conversationContext}

User's new message: ${userMessage.content}

Provide a helpful, concise response (2-4 sentences). Be friendly and professional. If they ask about specific products, mention key features. If they ask about pricing, mention the tier structure. If they want to try something, encourage them to check the Services or Compare tabs.`

      const prompt = spark.llmPrompt`${systemContext}`

      const response = await spark.llm(prompt, 'gpt-4o-mini')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t.aiChat.errorMessage,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClearChat = () => {
    const WELCOME_MESSAGE: Message = {
      id: 'welcome',
      role: 'assistant',
      content: t.aiChat.welcomeMessage,
      timestamp: new Date()
    }
    setMessages([WELCOME_MESSAGE])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Brain size={24} weight="duotone" className="text-accent" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{t.aiChat.title}</DialogTitle>
              <DialogDescription>{t.aiChat.poweredBy}</DialogDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t.aiChat.liveDemo}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <Brain size={16} weight="duotone" className="text-accent" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={16} weight="duotone" className="text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Brain size={16} weight="duotone" className="text-accent" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder={t.aiChat.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isGenerating}
              className="flex-1"
              id="ai-chat-input"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              size="icon"
              className="shrink-0 min-w-[44px] min-h-[44px]"
            >
              <PaperPlaneTilt size={20} weight="bold" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              disabled={isGenerating || messages.length <= 1}
              className="text-xs"
            >
              {t.aiChat.clearChat}
            </Button>
            <p className="text-[10px] text-muted-foreground flex-1 flex items-center">
              {t.aiChat.disclaimer}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
