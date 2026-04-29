"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Star, 
  ThumbsUp, 
  CheckCircle,
  Rocket,
  Lightning,
  Crown,
  CaretDown
} from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Review, ProductRating } from '@/lib/reviews-data'
import { WriteReviewDialog } from './WriteReviewDialog'

type ProductReviewsProps = {
  reviews: Review[]
  rating: ProductRating
  productId: string
  onReviewSubmit: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void
}

type FilterOption = 'all' | 'verified' | '5' | '4' | '3' | '2' | '1'
type SortOption = 'recent' | 'helpful' | 'rating-high' | 'rating-low'

const TIER_ICONS = {
  starter: Rocket,
  professional: Lightning,
  enterprise: Crown
}

const TIER_COLORS = {
  starter: 'text-blue-500',
  professional: 'text-accent',
  enterprise: 'text-yellow-500'
}

export function ProductReviews({ reviews, rating, productId, onReviewSubmit }: ProductReviewsProps) {
  const { language } = useLanguage()
  const [filter, setFilter] = useState<FilterOption>('all')
  const [sort, setSort] = useState<SortOption>('recent')
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set())

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true
    if (filter === 'verified') return review.verified
    return review.rating === parseInt(filter)
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sort) {
      case 'recent':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'helpful':
        return b.helpful - a.helpful
      case 'rating-high':
        return b.rating - a.rating
      case 'rating-low':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const handleHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return language === 'en' 
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {language === 'en' ? 'Customer Reviews' : '客户评价'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold">{rating.averageRating}</span>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={20}
                      weight={star <= Math.round(rating.averageRating) ? 'fill' : 'regular'}
                      className={star <= Math.round(rating.averageRating) ? 'text-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? `Based on ${rating.totalReviews} reviews` 
                  : `基于 ${rating.totalReviews} 条评价`
                }
              </p>
              <Button 
                onClick={() => setShowWriteReview(true)}
                className="w-full"
              >
                {language === 'en' ? 'Write a Review' : '写评价'}
              </Button>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = rating.ratingDistribution[stars as keyof typeof rating.ratingDistribution]
                const percentage = (count / rating.totalReviews) * 100
                return (
                  <button
                    key={stars}
                    onClick={() => setFilter(stars.toString() as FilterOption)}
                    className="flex items-center gap-3 w-full hover:bg-muted/50 rounded-lg p-2 transition-colors"
                  >
                    <div className="flex items-center gap-1 min-w-[80px]">
                      <span className="text-sm font-medium">{stars}</span>
                      <Star size={16} weight="fill" className="text-yellow-500" />
                    </div>
                    <Progress value={percentage} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground min-w-[40px] text-right">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                {language === 'en' ? 'All' : '全部'} ({reviews.length})
              </Button>
              <Button
                variant={filter === 'verified' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('verified')}
              >
                <CheckCircle size={16} className="mr-1" weight="fill" />
                {language === 'en' ? 'Verified' : '已验证'}
              </Button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">
                {language === 'en' ? 'Sort:' : '排序:'}
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-sm border rounded-md px-3 py-1.5 bg-background"
              >
                <option value="recent">
                  {language === 'en' ? 'Most Recent' : '最新'}
                </option>
                <option value="helpful">
                  {language === 'en' ? 'Most Helpful' : '最有用'}
                </option>
                <option value="rating-high">
                  {language === 'en' ? 'Highest Rating' : '最高评分'}
                </option>
                <option value="rating-low">
                  {language === 'en' ? 'Lowest Rating' : '最低评分'}
                </option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? 'No reviews match your filter' 
                  : '没有符合筛选条件的评价'
                }
              </p>
              <Button 
                variant="link" 
                onClick={() => setFilter('all')}
                className="mt-2"
              >
                {language === 'en' ? 'Clear filters' : '清除筛选'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedReviews.map((review) => {
            const TierIcon = review.tier ? TIER_ICONS[review.tier] : null
            const tierColor = review.tier ? TIER_COLORS[review.tier] : ''
            const isHelpful = helpfulReviews.has(review.id)
            
            return (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                          {review.userAvatar || review.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">{review.userName}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="gap-1">
                                <CheckCircle size={12} weight="fill" />
                                {language === 'en' ? 'Verified' : '已验证'}
                              </Badge>
                            )}
                            {review.tier && TierIcon && (
                              <Badge variant="outline" className="gap-1 capitalize">
                                <TierIcon size={12} weight="duotone" className={tierColor} />
                                {review.tier}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{formatDate(review.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            weight={star <= review.rating ? 'fill' : 'regular'}
                            className={star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">{review.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(review.id)}
                        className={`gap-2 ${isHelpful ? 'text-accent' : ''}`}
                      >
                        <ThumbsUp 
                          size={16} 
                          weight={isHelpful ? 'fill' : 'regular'}
                        />
                        <span className="text-sm">
                          {language === 'en' ? 'Helpful' : '有用'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({review.helpful + (isHelpful ? 1 : 0)})
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <WriteReviewDialog
        open={showWriteReview}
        onOpenChange={setShowWriteReview}
        productId={productId}
        onSubmit={onReviewSubmit}
      />
    </div>
  )
}
