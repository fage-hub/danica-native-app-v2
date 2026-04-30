"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Target, Heart, TrendUp, Users, Brain, Trophy, Rocket } from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'

const teamMembers = [
  { name: 'Dr. Sarah Chen', role: 'Chief AI Officer', initials: 'SC', expertise: 'ML/NLP', key: 'sarah' },
  { name: 'Michael Rodriguez', role: 'Head of AI Engineering', initials: 'MR', expertise: 'Deep Learning', key: 'michael' },
  { name: 'Emily Watson', role: 'AI Research Lead', initials: 'EW', expertise: 'Computer Vision', key: 'emily' },
  { name: 'James Kim', role: 'AI Ethics Director', initials: 'JK', expertise: 'Responsible AI', key: 'james' },
]

const values = [
  {
    icon: Brain,
    key: 'innovation'
  },
  {
    icon: Heart,
    key: 'ethical'
  },
  {
    icon: TrendUp,
    key: 'excellence'
  },
  {
    icon: Users,
    key: 'collaboration'
  },
]

const achievements = [
  { icon: Trophy, key: 'projects', value: '50+' },
  { icon: Users, key: 'clients', value: '200+' },
  { icon: Rocket, key: 'accuracy', value: '99%' },
]

export function AboutSection() {
  const { t } = useLanguage()
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

  const handleMemberClick = (name: string) => {
    setSelectedMember(name)
    toast.success(`${t.about.toast.learnMore} ${name}`, {
      description: t.about.toast.visitLinkedIn
    })
    setTimeout(() => setSelectedMember(null), 2000)
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-4 pt-2"
      >
        <h1 className="text-2xl font-bold" style={{ letterSpacing: '-0.02em' }}>
          {t.about.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.about.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-xl p-6 border border-primary/20"
      >
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2" style={{ letterSpacing: '-0.01em' }}>
          <Brain size={24} weight="duotone" className="text-accent" />
          {t.about.missionTitle}
        </h2>
        <p className="text-sm leading-relaxed text-foreground/80 mb-3">
          {t.about.missionText1}
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          {t.about.missionText2}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ letterSpacing: '-0.01em' }}>
          {t.about.achievementsTitle}
        </h2>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon
            const label = t.about.achievements[achievement.key as keyof typeof t.about.achievements]
            return (
              <motion.div
                key={achievement.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Icon size={28} weight="duotone" className="text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary mb-1">{achievement.value}</p>
                    <p className="text-xs text-muted-foreground leading-tight">
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ letterSpacing: '-0.01em' }}>
          {t.about.valuesTitle}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {values.map((value, index) => {
            const Icon = value.icon
            const valueData = t.about.values[value.key as keyof typeof t.about.values]
            return (
              <motion.div
                key={value.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-4">
                    <Icon size={28} weight="duotone" className="text-accent mb-2" />
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

      <Separator />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ letterSpacing: '-0.01em' }}>
          {t.about.expertsTitle}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member, index) => {
            const memberData = t.about.team[member.key as keyof typeof t.about.team]
            return (
              <motion.div
                key={member.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleMemberClick(memberData.name)}
              >
                <Card className={`cursor-pointer hover:shadow-md transition-all ${
                  selectedMember === memberData.name ? 'ring-2 ring-accent' : ''
                }`}>
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-3">
                      <Avatar className="h-16 w-16 border-2 border-accent">
                        <AvatarFallback className="bg-accent/10 text-accent font-semibold text-lg">
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-6 border border-accent/20"
      >
        <h2 className="text-lg font-semibold mb-2" style={{ letterSpacing: '-0.01em' }}>
          {t.about.joinTitle}
        </h2>
        <p className="text-sm leading-relaxed text-foreground/80">
          {t.about.joinText}
        </p>
      </motion.div>
    </div>
  )
}
