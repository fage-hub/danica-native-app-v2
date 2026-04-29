"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Play, Sparkle, TrendUp, ChatCircle, FileText, Brain, Star } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface DemoVideo {
  id: string
  title: string
  description: string
  duration: string
  category: 'tutorial' | 'feature' | 'use-case'
  level: 'beginner' | 'intermediate' | 'advanced'
  thumbnail: string
  videoUrl: string
  tags: string[]
  views: string
  featured?: boolean
}

export function DemoShowcaseSection() {
  const { t } = useLanguage()
  const [selectedVideo, setSelectedVideo] = useState<DemoVideo | null>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | 'tutorial' | 'feature' | 'use-case'>('all')

  const demoVideos: DemoVideo[] = [
    {
      id: '1',
      title: t.demos.videos.gettingStarted.title,
      description: t.demos.videos.gettingStarted.description,
      duration: '4:32',
      category: 'tutorial',
      level: 'beginner',
      thumbnail: '🤖',
      videoUrl: 'https://example.com/demo1',
      tags: t.demos.videos.gettingStarted.tags,
      views: '12.5K',
      featured: true
    },
    {
      id: '2',
      title: t.demos.videos.advancedContent.title,
      description: t.demos.videos.advancedContent.description,
      duration: '8:15',
      category: 'feature',
      level: 'advanced',
      thumbnail: '✍️',
      videoUrl: 'https://example.com/demo2',
      tags: t.demos.videos.advancedContent.tags,
      views: '8.2K',
      featured: true
    },
    {
      id: '3',
      title: t.demos.videos.ecommerceSupport.title,
      description: t.demos.videos.ecommerceSupport.description,
      duration: '6:45',
      category: 'use-case',
      level: 'intermediate',
      thumbnail: '🛍️',
      videoUrl: 'https://example.com/demo3',
      tags: t.demos.videos.ecommerceSupport.tags,
      views: '15.3K',
      featured: true
    },
    {
      id: '4',
      title: t.demos.videos.sentimentDashboard.title,
      description: t.demos.videos.sentimentDashboard.description,
      duration: '5:20',
      category: 'feature',
      level: 'beginner',
      thumbnail: '📊',
      videoUrl: 'https://example.com/demo4',
      tags: t.demos.videos.sentimentDashboard.tags,
      views: '9.7K'
    },
    {
      id: '5',
      title: t.demos.videos.workflows.title,
      description: t.demos.videos.workflows.description,
      duration: '11:30',
      category: 'tutorial',
      level: 'advanced',
      thumbnail: '⚙️',
      videoUrl: 'https://example.com/demo5',
      tags: t.demos.videos.workflows.tags,
      views: '6.4K'
    },
    {
      id: '6',
      title: t.demos.videos.recommendations.title,
      description: t.demos.videos.recommendations.description,
      duration: '7:00',
      category: 'use-case',
      level: 'intermediate',
      thumbnail: '🎯',
      videoUrl: 'https://example.com/demo6',
      tags: t.demos.videos.recommendations.tags,
      views: '11.1K'
    },
    {
      id: '7',
      title: t.demos.videos.apiIntegration.title,
      description: t.demos.videos.apiIntegration.description,
      duration: '9:15',
      category: 'tutorial',
      level: 'intermediate',
      thumbnail: '🔌',
      videoUrl: 'https://example.com/demo7',
      tags: t.demos.videos.apiIntegration.tags,
      views: '7.8K'
    },
    {
      id: '8',
      title: t.demos.videos.predictiveAnalytics.title,
      description: t.demos.videos.predictiveAnalytics.description,
      duration: '10:45',
      category: 'use-case',
      level: 'advanced',
      thumbnail: '📈',
      videoUrl: 'https://example.com/demo8',
      tags: t.demos.videos.predictiveAnalytics.tags,
      views: '13.2K'
    }
  ]

  const filteredVideos = activeCategory === 'all' 
    ? demoVideos 
    : demoVideos.filter(v => v.category === activeCategory)

  const featuredVideos = demoVideos.filter(v => v.featured)

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-emerald-100 text-emerald-700'
      case 'intermediate': return 'bg-amber-100 text-amber-700'
      case 'advanced': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tutorial': return <Brain className="w-4 h-4" />
      case 'feature': return <Sparkle className="w-4 h-4" />
      case 'use-case': return <TrendUp className="w-4 h-4" />
      default: return <Play className="w-4 h-4" />
    }
  }

  return (
    <motion.div 
      className="pb-20 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotateX: 20 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 280,
          damping: 26,
          delay: 0.05
        }}
      >
        <div className="mb-6">
          <motion.h1 
            className="text-3xl font-bold mb-2 flex items-center gap-2"
            initial={{ opacity: 0, x: -40, rotateZ: -3 }}
            animate={{ opacity: 1, x: 0, rotateZ: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 24 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180, y: -20 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 320, damping: 20 }}
            >
              <Sparkle className="w-8 h-8 text-accent" weight="fill" />
            </motion.div>
            {t.demos.title}
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {t.demos.subtitle}
          </motion.p>
        </div>

        <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-accent/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" weight="fill" />
              <CardTitle className="text-lg">{t.demos.featuredDemos}</CardTitle>
            </div>
            <CardDescription>
              {t.demos.featuredDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {featuredVideos.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all border-accent/30"
                  onClick={() => setSelectedVideo(video)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-4xl">
                        {video.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm leading-tight">{video.title}</h3>
                          <Play className="w-5 h-5 text-accent flex-shrink-0" weight="fill" />
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {video.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {video.duration}
                          </Badge>
                          <Badge className={getLevelColor(video.level) + ' text-xs'}>
                            {t.demos.level[video.level]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{video.views} {t.demos.views}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as any)} className="mt-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">{t.demos.all}</TabsTrigger>
            <TabsTrigger value="tutorial">{t.demos.tutorials}</TabsTrigger>
            <TabsTrigger value="feature">{t.demos.featuresTab}</TabsTrigger>
            <TabsTrigger value="use-case">{t.demos.useCases}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-4 mt-0">
            <div className="grid gap-4">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center text-3xl">
                          {video.thumbnail}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-sm leading-tight">{video.title}</h3>
                            <div className="flex items-center gap-1 text-accent flex-shrink-0">
                              {getCategoryIcon(video.category)}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {video.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {video.duration}
                            </Badge>
                            <Badge className={getLevelColor(video.level) + ' text-xs'}>
                              {t.demos.level[video.level]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{video.views} {t.demos.views}</span>
                          </div>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {video.tags && video.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedVideo?.thumbnail}</span>
              {selectedVideo?.title}
            </DialogTitle>
            <DialogDescription>{selectedVideo?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-accent" weight="fill" />
                </div>
                <p className="text-sm text-muted-foreground">{t.demos.videoPlayer}</p>
                <p className="text-xs text-muted-foreground">{t.demos.duration} {selectedVideo?.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getLevelColor(selectedVideo?.level || 'beginner')}>
                {selectedVideo?.level ? t.demos.level[selectedVideo.level] : ''}
              </Badge>
              <Badge variant="outline">
                {selectedVideo?.category ? (t.demos.category as Record<string, string>)[selectedVideo.category] ?? selectedVideo.category : ''}
              </Badge>
              <Badge variant="secondary">
                {selectedVideo?.views} {t.demos.views}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">{t.demos.topicsCovered}</h4>
              <div className="flex gap-2 flex-wrap">
                {selectedVideo?.tags && selectedVideo.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button className="flex-1">
                <Play className="w-4 h-4 mr-2" weight="fill" />
                {t.demos.watchDemo}
              </Button>
              <Button variant="outline">
                <ChatCircle className="w-4 h-4 mr-2" />
                {t.demos.askAI}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
