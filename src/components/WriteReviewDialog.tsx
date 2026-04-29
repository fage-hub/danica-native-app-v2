"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Star,
  Rocket,
  Lightning,
  Crown
} from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Review } from '@/lib/reviews-data'
import { toast } from 'sonner'

type WriteReviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  onSubmit: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void
}

type TierOption = 'starter' | 'professional' | 'enterprise' | ''

export function WriteReviewDialog({ open, onOpenChange, productId, onSubmit }: WriteReviewDialogProps) {
  const { language } = useLanguage()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [userName, setUserName] = useState('')
  const [tier, setTier] = useState<TierOption>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error(language === 'en' ? 'Please select a rating' : '请选择评分')
      return
    }
    if (!title.trim()) {
      toast.error(language === 'en' ? 'Please enter a title' : '请输入标题')
      return
    }
    if (!comment.trim()) {
      toast.error(language === 'en' ? 'Please enter a review' : '请输入评价内容')
      return
    }
    if (!userName.trim()) {
      toast.error(language === 'en' ? 'Please enter your name' : '请输入您的姓名')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      onSubmit({
        productId,
        userId: `user-${Date.now()}`,
        userName: userName.trim(),
        rating,
        title: title.trim(),
        comment: comment.trim(),
        verified: false,
        tier: tier || undefined
      })

      toast.success(
        language === 'en' 
          ? 'Review submitted successfully!' 
          : '评价提交成功！'
      )

      setRating(0)
      setTitle('')
      setComment('')
      setUserName('')
      setTier('')
      setIsSubmitting(false)
      onOpenChange(false)
    }, 500)
  }

  const handleCancel = () => {
    setRating(0)
    setHoveredRating(0)
    setTitle('')
    setComment('')
    setUserName('')
    setTier('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Write a Review' : '写评价'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Share your experience with this product to help others make informed decisions.'
              : '分享您对此产品的体验，帮助其他人做出明智的决定。'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>
              {language === 'en' ? 'Your Rating' : '您的评分'}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    weight={star <= (hoveredRating || rating) ? 'fill' : 'regular'}
                    className={
                      star <= (hoveredRating || rating) 
                        ? 'text-yellow-500' 
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating === 5 && (language === 'en' ? 'Excellent' : '非常好')}
                  {rating === 4 && (language === 'en' ? 'Good' : '好')}
                  {rating === 3 && (language === 'en' ? 'Average' : '一般')}
                  {rating === 2 && (language === 'en' ? 'Poor' : '较差')}
                  {rating === 1 && (language === 'en' ? 'Terrible' : '很差')}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">
              {language === 'en' ? 'Your Name' : '您的姓名'}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={language === 'en' ? 'John Doe' : '张三'}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              {language === 'en' ? 'Review Title' : '评价标题'}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'en' ? 'Summarize your experience' : '总结您的体验'}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">
              {language === 'en' ? 'Your Review' : '您的评价'}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={language === 'en' 
                ? 'Share your experience with this product...'
                : '分享您对此产品的体验...'
              }
              rows={6}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/1000
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              {language === 'en' ? 'Your Plan (Optional)' : '您的套餐（可选）'}
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTier(tier === 'starter' ? '' : 'starter')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tier === 'starter'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-border hover:border-blue-300'
                }`}
              >
                <Rocket 
                  size={24} 
                  weight="duotone" 
                  className={`mx-auto mb-2 ${tier === 'starter' ? 'text-blue-500' : 'text-muted-foreground'}`}
                />
                <p className="text-sm font-medium">Starter</p>
              </button>

              <button
                type="button"
                onClick={() => setTier(tier === 'professional' ? '' : 'professional')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tier === 'professional'
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <Lightning 
                  size={24} 
                  weight="duotone" 
                  className={`mx-auto mb-2 ${tier === 'professional' ? 'text-accent' : 'text-muted-foreground'}`}
                />
                <p className="text-sm font-medium">Professional</p>
              </button>

              <button
                type="button"
                onClick={() => setTier(tier === 'enterprise' ? '' : 'enterprise')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tier === 'enterprise'
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-border hover:border-yellow-300'
                }`}
              >
                <Crown 
                  size={24} 
                  weight="duotone" 
                  className={`mx-auto mb-2 ${tier === 'enterprise' ? 'text-yellow-500' : 'text-muted-foreground'}`}
                />
                <p className="text-sm font-medium">Enterprise</p>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {language === 'en' ? 'Cancel' : '取消'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (language === 'en' ? 'Submitting...' : '提交中...')
              : (language === 'en' ? 'Submit Review' : '提交评价')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
