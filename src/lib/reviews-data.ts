export type Review = {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  date: string
  helpful: number
  verified: boolean
  tier?: 'starter' | 'professional' | 'enterprise'
  images?: string[]
}

export type ProductRating = {
  productId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'aiAssistant',
    userId: 'u1',
    userName: 'Sarah Chen',
    userAvatar: '👩‍💼',
    rating: 5,
    title: 'Game changer for our customer support',
    comment: 'The AI Assistant has completely transformed how we handle customer inquiries. Response times dropped by 85% and customer satisfaction scores improved significantly. The NLP is incredibly accurate and it rarely misunderstands context.',
    date: '2024-01-15',
    helpful: 42,
    verified: true,
    tier: 'professional'
  },
  {
    id: 'r2',
    productId: 'aiAssistant',
    userId: 'u2',
    userName: 'Michael Rodriguez',
    userAvatar: '👨‍💻',
    rating: 4,
    title: 'Excellent product, minor learning curve',
    comment: 'Very powerful AI assistant. Took about a week to fine-tune for our specific use case, but once configured, it works brilliantly. The analytics dashboard is particularly useful for tracking performance.',
    date: '2024-01-10',
    helpful: 28,
    verified: true,
    tier: 'starter'
  },
  {
    id: 'r3',
    productId: 'aiAssistant',
    userId: 'u3',
    userName: 'Jennifer Lee',
    userAvatar: '👩',
    rating: 5,
    title: 'Best investment we made this year',
    comment: 'Cannot recommend this enough! The multi-language support is flawless and has allowed us to expand to new markets. Support team is also incredibly responsive.',
    date: '2024-01-05',
    helpful: 35,
    verified: true,
    tier: 'enterprise'
  },
  {
    id: 'r4',
    productId: 'contentGen',
    userId: 'u4',
    userName: 'David Park',
    userAvatar: '👨‍🎨',
    rating: 5,
    title: 'Content creation has never been easier',
    comment: 'As a marketing manager, this tool has saved me countless hours. The content quality is consistently high, and the SEO optimization features are fantastic. Worth every penny.',
    date: '2024-01-18',
    helpful: 51,
    verified: true,
    tier: 'professional'
  },
  {
    id: 'r5',
    productId: 'contentGen',
    userId: 'u5',
    userName: 'Emily Thompson',
    userAvatar: '👩‍💼',
    rating: 4,
    title: 'Great for bulk content generation',
    comment: 'We use this for generating product descriptions and blog posts. The quality is good, though sometimes requires minor editing. The variety of formats is impressive.',
    date: '2024-01-12',
    helpful: 22,
    verified: true,
    tier: 'starter'
  },
  {
    id: 'r6',
    productId: 'automation',
    userId: 'u6',
    userName: 'Robert Zhang',
    userAvatar: '👨‍💼',
    rating: 5,
    title: 'Automation heaven',
    comment: 'This is exactly what our team needed. The workflow templates are comprehensive and the custom integration options are powerful. We\'ve automated 70% of our repetitive tasks.',
    date: '2024-01-20',
    helpful: 47,
    verified: true,
    tier: 'enterprise'
  },
  {
    id: 'r7',
    productId: 'automation',
    userId: 'u7',
    userName: 'Lisa Wang',
    userAvatar: '👩‍💻',
    rating: 5,
    title: 'Incredible time saver',
    comment: 'Set up was straightforward and the results were immediate. The execution speed is lightning fast and error rate is minimal. Highly recommend for any business.',
    date: '2024-01-14',
    helpful: 33,
    verified: true,
    tier: 'professional'
  },
  {
    id: 'r8',
    productId: 'analytics',
    userId: 'u8',
    userName: 'James Wilson',
    userAvatar: '👨‍💼',
    rating: 5,
    title: 'Data insights that actually matter',
    comment: 'The predictive analytics have helped us make better business decisions. The models are accurate and the visualizations make it easy to present to stakeholders.',
    date: '2024-01-16',
    helpful: 39,
    verified: true,
    tier: 'enterprise'
  },
  {
    id: 'r9',
    productId: 'analytics',
    userId: 'u9',
    userName: 'Amanda Foster',
    userAvatar: '👩‍💼',
    rating: 4,
    title: 'Solid analytics platform',
    comment: 'Good range of algorithms and models. The data processing speed is impressive. Would love to see more customization options in the future.',
    date: '2024-01-08',
    helpful: 25,
    verified: true,
    tier: 'professional'
  },
  {
    id: 'r10',
    productId: 'sentiment',
    userId: 'u10',
    userName: 'Chris Anderson',
    userAvatar: '👨‍💻',
    rating: 5,
    title: 'Accurately captures customer sentiment',
    comment: 'We use this to analyze customer feedback across all channels. The accuracy is remarkable and it supports all the languages we need. Integration was seamless.',
    date: '2024-01-11',
    helpful: 31,
    verified: true,
    tier: 'professional'
  },
  {
    id: 'r11',
    productId: 'sentiment',
    userId: 'u11',
    userName: 'Michelle Brown',
    userAvatar: '👩',
    rating: 4,
    title: 'Great for social media monitoring',
    comment: 'Perfect tool for tracking brand sentiment. The real-time analysis helps us respond quickly to customer concerns. Very satisfied with the purchase.',
    date: '2024-01-07',
    helpful: 19,
    verified: true,
    tier: 'starter'
  },
  {
    id: 'r12',
    productId: 'recommender',
    userId: 'u12',
    userName: 'Daniel Kim',
    userAvatar: '👨‍💼',
    rating: 5,
    title: 'Boosted our conversion rate by 40%',
    comment: 'The recommendation engine is incredibly smart. Our customers are discovering products they love and our average order value has increased significantly.',
    date: '2024-01-19',
    helpful: 56,
    verified: true,
    tier: 'enterprise'
  },
  {
    id: 'r13',
    productId: 'recommender',
    userId: 'u13',
    userName: 'Rachel Martinez',
    userAvatar: '👩‍💻',
    rating: 5,
    title: 'The best recommendation system I\'ve used',
    comment: 'Lightning-fast response times and highly accurate suggestions. Easy to implement and the results speak for themselves. Customer engagement is through the roof.',
    date: '2024-01-13',
    helpful: 44,
    verified: true,
    tier: 'professional'
  },
  {
    id: 'r14',
    productId: 'aiAssistant',
    userId: 'u14',
    userName: 'Kevin Nguyen',
    userAvatar: '👨',
    rating: 5,
    title: 'Exceeded all expectations',
    comment: 'We were skeptical about AI chatbots, but this product won us over completely. The setup was straightforward, and within days we saw a dramatic reduction in support tickets. Customers love the instant responses.',
    date: '2024-01-22',
    helpful: 38,
    verified: true,
    tier: 'enterprise'
  },
  {
    id: 'r15',
    productId: 'contentGen',
    userId: 'u15',
    userName: 'Sophie Turner',
    userAvatar: '👩‍🎨',
    rating: 5,
    title: 'A must-have for content teams',
    comment: 'This tool has become indispensable for our marketing team. The quality of generated content is consistently high, and the time savings are incredible. We\'ve tripled our content output.',
    date: '2024-01-21',
    helpful: 29,
    verified: true,
    tier: 'professional'
  },
  {
    id: 'r16',
    productId: 'automation',
    userId: 'u16',
    userName: 'Marcus Johnson',
    userAvatar: '👨‍💼',
    rating: 4,
    title: 'Powerful automation platform',
    comment: 'Very comprehensive automation suite. The learning curve is moderate, but the documentation is excellent. Once you get the hang of it, you can automate almost anything.',
    date: '2024-01-17',
    helpful: 21,
    verified: true,
    tier: 'starter'
  },
  {
    id: 'r17',
    productId: 'analytics',
    userId: 'u17',
    userName: 'Olivia Chen',
    userAvatar: '👩‍💼',
    rating: 5,
    title: 'Game-changing insights',
    comment: 'The predictive models are incredibly accurate. We\'ve been able to forecast demand with precision we never had before. This has significantly reduced our inventory costs and stockouts.',
    date: '2024-01-19',
    helpful: 36,
    verified: true,
    tier: 'enterprise'
  },
  {
    id: 'r18',
    productId: 'sentiment',
    userId: 'u18',
    userName: 'Thomas Wright',
    userAvatar: '👨‍💻',
    rating: 5,
    title: 'Essential for brand monitoring',
    comment: 'We monitor thousands of mentions daily and this tool makes it effortless. The sentiment accuracy is impressive, and the alerts have helped us respond to issues before they became problems.',
    date: '2024-01-15',
    helpful: 27,
    verified: true,
    tier: 'professional'
  },
  {
    id: 'r19',
    productId: 'recommender',
    userId: 'u19',
    userName: 'Isabella Garcia',
    userAvatar: '👩‍💼',
    rating: 4,
    title: 'Solid recommendation engine',
    comment: 'Good results overall. The recommendations are relevant and our customers appreciate the personalized experience. Would like to see more customization options in future updates.',
    date: '2024-01-16',
    helpful: 18,
    verified: true,
    tier: 'starter'
  },
  {
    id: 'r20',
    productId: 'aiAssistant',
    userId: 'u20',
    userName: 'Alexander Lee',
    userAvatar: '👨‍💻',
    rating: 3,
    title: 'Good but room for improvement',
    comment: 'The AI assistant works well for basic queries, but occasionally struggles with complex technical questions. Support has been helpful in addressing these issues. Overall a good product that\'s getting better.',
    date: '2024-01-09',
    helpful: 12,
    verified: true,
    tier: 'starter'
  }
]

export const PRODUCT_RATINGS: ProductRating[] = [
  {
    productId: 'aiAssistant',
    averageRating: 4.7,
    totalReviews: 127,
    ratingDistribution: { 5: 89, 4: 28, 3: 7, 2: 2, 1: 1 }
  },
  {
    productId: 'contentGen',
    averageRating: 4.5,
    totalReviews: 94,
    ratingDistribution: { 5: 62, 4: 24, 3: 6, 2: 2, 1: 0 }
  },
  {
    productId: 'automation',
    averageRating: 4.8,
    totalReviews: 156,
    ratingDistribution: { 5: 118, 4: 29, 3: 7, 2: 2, 1: 0 }
  },
  {
    productId: 'analytics',
    averageRating: 4.6,
    totalReviews: 83,
    ratingDistribution: { 5: 58, 4: 19, 3: 5, 2: 1, 1: 0 }
  },
  {
    productId: 'sentiment',
    averageRating: 4.5,
    totalReviews: 71,
    ratingDistribution: { 5: 48, 4: 17, 3: 5, 2: 1, 1: 0 }
  },
  {
    productId: 'recommender',
    averageRating: 4.9,
    totalReviews: 112,
    ratingDistribution: { 5: 96, 4: 13, 3: 2, 2: 1, 1: 0 }
  }
]

export function getProductReviews(productId: string): Review[] {
  return MOCK_REVIEWS.filter(review => review.productId === productId)
}

export function getProductRating(productId: string): ProductRating | undefined {
  return PRODUCT_RATINGS.find(rating => rating.productId === productId)
}

export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export function getRatingDistribution(reviews: Review[]): Record<number, number> {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++
  })
  return distribution
}
