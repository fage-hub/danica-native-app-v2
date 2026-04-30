"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { EnvelopeSimple, Phone, MapPin, PaperPlaneRight, CheckCircle, ChatCircleDots, CalendarBlank } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'

export function ContactSection() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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
    <div className="flex flex-col gap-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-14 bg-background/95 backdrop-blur-sm z-10 pb-4 pt-2"
      >
        <h1 className="text-2xl font-bold" style={{ letterSpacing: '-0.02em' }}>
          {t.contact.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.contact.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => handleQuickAction(t.contact.liveChat)}
        >
          <Card className="cursor-pointer hover:shadow-md transition-all">
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="p-2 rounded-lg bg-accent/10">
                <ChatCircleDots size={24} weight="duotone" className="text-accent" />
              </div>
              <p className="text-sm font-medium">{t.contact.liveChat}</p>
              <Badge variant="secondary" className="text-[10px]">{t.contact.availableNow}</Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => handleQuickAction(t.contact.scheduleDemo)}
        >
          <Card className="cursor-pointer hover:shadow-md transition-all">
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="p-2 rounded-lg bg-primary/10">
                <CalendarBlank size={24} weight="duotone" className="text-primary" />
              </div>
              <p className="text-sm font-medium">{t.contact.scheduleDemo}</p>
              <Badge variant="secondary" className="text-[10px]">{t.contact.duration}</Badge>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid gap-3 lg:grid-cols-3 lg:gap-4"
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
              transition={{ delay: 0.4 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer hover:shadow-md transition-all">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Icon size={24} weight="duotone" className="text-accent" />
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
        transition={{ delay: 0.7 }}
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
    </div>
  )
}
