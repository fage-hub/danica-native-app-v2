"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkle, Brain, MagicWand, Robot, ChartLine, ChatCircleDots, Target, Heart, TrendUp, Users, Trophy, Rocket, EnvelopeSimple, Phone, MapPin, PaperPlaneRight, CheckCircle, CalendarBlank, Star, Quotes, Code, Lightbulb, ShieldCheck, Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { AIChatDialog } from '@/components/AIChatDialog'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMicroInteractions } from '@/hooks/use-micro-interactions'

type ProductKey = 'aiAssistant' | 'contentGenerator' | 'automation' | 'analytics' | 'sentiment' | 'recommendations' | 'voiceAI' | 'visionAI' | 'nlpPlatform' | 'chatbotBuilder' | 'aiWorkflow' | 'knowledgeBase'
type StatusKey = 'live' | 'new' | 'popular' | 'pro'

const aiProducts: Array<{
  icon: typeof Brain
  productKey: ProductKey
  color: string
  statusKey: StatusKey
}> = [
  { 
    icon: Brain, 
    productKey: 'aiAssistant',
    color: 'text-accent',
    statusKey: 'live'
  },
  { 
    icon: MagicWand, 
    productKey: 'contentGenerator',
    color: 'text-primary',
    statusKey: 'new'
  },
  { 
    icon: Robot, 
    productKey: 'automation',
    color: 'text-accent',
    statusKey: 'popular'
  },
  { 
    icon: ChartLine, 
    productKey: 'analytics',
    color: 'text-primary',
    statusKey: 'pro'
  },
  { 
    icon: ChatCircleDots, 
    productKey: 'sentiment',
    color: 'text-accent',
    statusKey: 'live'
  },
  { 
    icon: Sparkle, 
    productKey: 'recommendations',
    color: 'text-primary',
    statusKey: 'new'
  },
  { 
    icon: Brain, 
    productKey: 'voiceAI',
    color: 'text-accent',
    statusKey: 'new'
  },
  { 
    icon: Brain, 
    productKey: 'visionAI',
    color: 'text-primary',
    statusKey: 'pro'
  },
  { 
    icon: ChatCircleDots, 
    productKey: 'nlpPlatform',
    color: 'text-accent',
    statusKey: 'live'
  },
  { 
    icon: Robot, 
    productKey: 'chatbotBuilder',
    color: 'text-primary',
    statusKey: 'popular'
  },
  { 
    icon: Robot, 
    productKey: 'aiWorkflow',
    color: 'text-accent',
    statusKey: 'pro'
  },
  { 
    icon: Brain, 
    productKey: 'knowledgeBase',
    color: 'text-primary',
    statusKey: 'new'
  },
]

const teamMembers = [
  { name: 'Dr. Sarah Chen', role: 'Chief AI Officer', initials: 'SC', expertise: 'ML/NLP', key: 'sarah' },
  { name: 'Michael Rodriguez', role: 'Head of AI Engineering', initials: 'MR', expertise: 'Deep Learning', key: 'michael' },
  { name: 'Emily Watson', role: 'AI Research Lead', initials: 'EW', expertise: 'Computer Vision', key: 'emily' },
  { name: 'James Kim', role: 'AI Ethics Director', initials: 'JK', expertise: 'Responsible AI', key: 'james' },
]

const values = [
  { icon: Brain, key: 'innovation' },
  { icon: Heart, key: 'ethical' },
  { icon: TrendUp, key: 'excellence' },
  { icon: Users, key: 'collaboration' },
]

const achievements = [
  { icon: Trophy, key: 'projects', value: '50+' },
  { icon: Users, key: 'clients', value: '200+' },
  { icon: Rocket, key: 'accuracy', value: '99%' },
]

export function HomeSection() {
  const { t } = useLanguage()
  const { createHapticFeedback } = useMicroInteractions()
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleProductClick = (index: number, productKey: ProductKey) => {
    setSelectedProduct(index)
    const label = t.home.products[productKey].label
    toast.success(`${t.home.toast.exploring} ${label}`, {
      description: t.home.toast.checkServices
    })
    setTimeout(() => setSelectedProduct(null), 2000)
  }

  const handleGetStarted = () => {
    toast.success(t.home.toast.welcomeAboard, {
      description: t.home.toast.contactSoon
    })
  }

  const handleChatWithAI = () => {
    setChatOpen(true)
  }

  const handleMemberClick = (name: string) => {
    setSelectedMember(name)
    toast.success(`${t.about.toast.learnMore} ${name}`, {
      description: t.about.toast.visitLinkedIn
    })
    setTimeout(() => setSelectedMember(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)
    toast.success(t.contact.toast.success, {
      description: t.contact.toast.contactSoon,
    })

    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '', interest: 'general' })
      setSubmitted(false)
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleQuickAction = (action: string) => {
    toast.success(`${action} ${t.contact.toast.initiated}`, {
      description: t.contact.toast.redirecting
    })
  }

  return (
    <motion.div 
      className="flex flex-col gap-5 pb-24 sm:gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 280,
          damping: 24,
          delay: 0.05
        }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-accent p-8 sm:p-10 text-primary-foreground shadow-xl"
      >
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.15, 
              type: 'spring', 
              stiffness: 200,
              damping: 15
            }}
          >
            <Sparkle size={52} weight="duotone" className="mb-5" />
          </motion.div>
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold mb-3" 
            style={{ letterSpacing: '-0.025em' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            {t.home.title}
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg opacity-95 leading-relaxed max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {t.home.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Badge className="mt-4 bg-primary-foreground/25 text-primary-foreground border-primary-foreground/40 backdrop-blur-sm text-sm px-3 py-1">
              {t.home.productsAvailable}
            </Badge>
          </motion.div>
        </div>
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-accent/25 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.35, 0.25]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="bg-gradient-to-br from-primary/8 via-accent/5 to-primary/5 rounded-2xl p-6 sm:p-7 border border-primary/15 shadow-sm"
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 flex items-center gap-2.5" style={{ letterSpacing: '-0.015em' }}>
          <Brain size={28} weight="duotone" className="text-accent" />
          {t.about.missionTitle}
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-foreground/85 mb-3">
          {t.about.missionText1}
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-foreground/85">
          {t.about.missionText2}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ letterSpacing: '-0.015em' }}>
          {t.about.achievementsTitle}
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon
            const label = t.about.achievements[achievement.key as keyof typeof t.about.achievements]
            return (
              <motion.div
                key={achievement.key}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.75 + index * 0.08,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -4
                }}
                whileTap={{ 
                  scale: 0.98,
                  y: 0
                }}
                onTap={createHapticFeedback}
              >
                <Card className="text-center cursor-pointer hover:shadow-lg transition-all duration-300 border-border/60 bg-card/50 backdrop-blur-sm relative overflow-hidden group touch-manipulation">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <CardContent className="p-5 sm:p-6 relative z-10">
                    <motion.div 
                      whileHover={{ rotate: [0, -12, 12, -8, 8, 0] }} 
                      transition={{ duration: 0.5 }}
                      className="min-h-[48px] flex items-center justify-center"
                    >
                      <Icon size={36} weight="duotone" className="text-accent mx-auto mb-2.5" />
                    </motion.div>
                    <p className="text-2xl sm:text-3xl font-bold text-primary mb-1.5">{achievement.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                      {label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold gap-2.5 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group" 
            size="lg"
            onClick={() => {
              createHapticFeedback()
              handleChatWithAI()
            }}
            variant="outline"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <motion.div whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.4 }}>
              <ChatCircleDots size={26} weight="duotone" />
            </motion.div>
            <span className="relative z-10">{t.home.chatWithAI}</span>
          </Button>
        </motion.div>
      </motion.div>

      <div className="space-y-3.5">
        <h2 className="text-lg sm:text-xl font-semibold" style={{ letterSpacing: '-0.015em' }}>
          {t.home.ourProducts}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {aiProducts.map((item, index) => {
            const product = t.home.products[item.productKey]
            const status = t.home.status[item.statusKey]
            
            return (
              <motion.div
                key={item.productKey}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 1.1 + index * 0.08,
                  type: 'spring',
                  stiffness: 280,
                  damping: 22
                }}
                whileHover={{ 
                  scale: 1.03,
                  y: -2
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  createHapticFeedback()
                  handleProductClick(index, item.productKey)
                }}
              >
                <Card className={`cursor-pointer transition-all duration-300 border-border/70 hover:border-accent/40 relative overflow-hidden group touch-manipulation ${
                  selectedProduct === index ? 'ring-2 ring-accent shadow-lg border-accent' : 'hover:shadow-lg'
                }`}>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-accent/8 to-primary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <CardContent className="p-5 sm:p-6 relative z-10">
                    <div className="flex items-start gap-3 sm:gap-3.5">
                      <motion.div 
                        className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 relative min-w-[48px] min-h-[48px] flex items-center justify-center"
                        whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon size={28} weight="duotone" className={item.color} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="font-semibold text-sm sm:text-base leading-tight">{product.label}</p>
                          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-secondary/80">
                            {status}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ letterSpacing: '-0.01em' }}>
          {t.about.valuesTitle}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {values.map((value, index) => {
            const Icon = value.icon
            const valueData = t.about.values[value.key as keyof typeof t.about.values]
            return (
              <motion.div
                key={value.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7 + index * 0.1 }}
              >
                <Card className="h-full touch-manipulation">
                  <CardContent className="p-5">
                    <div className="min-h-[48px] flex items-center justify-center mb-2">
                      <Icon size={32} weight="duotone" className="text-accent" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{valueData.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {valueData.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <Separator className="my-4" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1 }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ letterSpacing: '-0.01em' }}>
          {t.about.expertsTitle}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {teamMembers.map((member, index) => {
            const memberData = t.about.team[member.key as keyof typeof t.about.team]
            return (
              <motion.div
                key={member.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + index * 0.1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  createHapticFeedback()
                  handleMemberClick(memberData.name)
                }}
              >
                <Card className={`cursor-pointer hover:shadow-md transition-all touch-manipulation ${
                  selectedMember === memberData.name ? 'ring-2 ring-accent' : ''
                }`}>
                  <CardHeader className="text-center pb-4 p-5">
                    <div className="flex justify-center mb-3">
                      <Avatar className="h-20 w-20 border-2 border-accent">
                        <AvatarFallback className="bg-accent/10 text-accent font-semibold text-xl">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-base">{memberData.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{memberData.role}</p>
                    <Badge variant="secondary" className="mt-2 text-[10px]">
                      {memberData.expertise}
                    </Badge>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <Separator className="my-4" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
        className="grid grid-cols-2 gap-3"
      >
        <motion.div
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            createHapticFeedback()
            handleQuickAction(t.contact.liveChat)
          }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden group touch-manipulation">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <CardContent className="flex flex-col items-center gap-2 p-5 text-center relative z-10">
              <motion.div 
                className="p-3 rounded-lg bg-accent/10"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                <ChatCircleDots size={28} weight="duotone" className="text-accent" />
              </motion.div>
              <p className="text-sm font-medium">{t.contact.liveChat}</p>
              <Badge variant="secondary" className="text-[10px]">{t.contact.availableNow}</Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            createHapticFeedback()
            handleQuickAction(t.contact.scheduleDemo)
          }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden group touch-manipulation">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <CardContent className="flex flex-col items-center gap-2 p-5 text-center relative z-10">
              <motion.div 
                className="p-3 rounded-lg bg-primary/10"
                whileHover={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.4 }}
              >
                <CalendarBlank size={28} weight="duotone" className="text-primary" />
              </motion.div>
              <p className="text-sm font-medium">{t.contact.scheduleDemo}</p>
              <Badge variant="secondary" className="text-[10px]">{t.contact.duration}</Badge>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7 }}
        className="grid gap-3"
      >
        {[
          { icon: EnvelopeSimple, label: t.contact.email, value: t.contact.contactInfo.emailValue },
          { icon: Phone, label: t.contact.phone, value: t.contact.contactInfo.phoneValue },
          { icon: MapPin, label: t.contact.location, value: t.contact.contactInfo.locationValue },
        ].map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.8 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={createHapticFeedback}
            >
              <Card className="cursor-pointer hover:shadow-md transition-all touch-manipulation">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="p-3 rounded-lg bg-accent/10 min-w-[48px] min-h-[48px] flex items-center justify-center">
                    <Icon size={26} weight="duotone" className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.contact.sendMessage}</CardTitle>
            <CardDescription>
              {t.contact.tellUs}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.contact.name}</Label>
                <Input
                  id="name"
                  placeholder={t.contact.yourName}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting || submitted}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.contact.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.contact.yourEmail}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting || submitted}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t.contact.phoneOptional}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t.contact.phoneNumber}
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting || submitted}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest">{t.contact.interestedIn}</Label>
                <select
                  id="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  disabled={isSubmitting || submitted}
                >
                  {Object.entries(t.contact.services).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t.contact.message}</Label>
                <Textarea
                  id="message"
                  placeholder={t.contact.tellUsNeeds}
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting || submitted}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || submitted}
              >
                {submitted ? (
                  <>
                    <CheckCircle size={20} weight="fill" className="mr-2" />
                    {t.contact.sent}
                  </>
                ) : isSubmitting ? (
                  t.contact.sending
                ) : (
                  <>
                    <PaperPlaneRight size={20} className="mr-2" />
                    {t.contact.sendMessageBtn}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <AIChatDialog open={chatOpen} onOpenChange={setChatOpen} />
    </motion.div>
  )
}
