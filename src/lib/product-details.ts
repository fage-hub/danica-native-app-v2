export type ProductDetails = {
  imageUrl: string
  detailedDescription: string
  benefits: string[]
  keyFeatures: string[]
}

export const PRODUCT_DETAILS: Record<string, ProductDetails> = {
  aiAssistant: {
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
    detailedDescription: 'Transform your customer service with our advanced AI Assistant. Powered by state-of-the-art natural language processing, it understands context, maintains conversation history, and delivers human-like responses. Seamlessly integrates with your existing tools and scales effortlessly to handle unlimited concurrent conversations.',
    benefits: [
      'Reduce response time from hours to seconds',
      'Handle unlimited concurrent conversations',
      'Maintain 24/7 availability without additional staffing',
      'Learn from interactions to continuously improve',
      'Support 95+ languages with native-level fluency'
    ],
    keyFeatures: [
      'Natural Language Understanding',
      'Context-Aware Responses',
      'Multi-Channel Support',
      'Custom Knowledge Base Integration',
      'Real-Time Analytics Dashboard',
      'Sentiment Detection'
    ]
  },
  contentGen: {
    imageUrl: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800&h=600&fit=crop',
    detailedDescription: 'Accelerate your content creation workflow with AI-powered generation. From blog posts to social media content, email campaigns to product descriptions, create engaging, SEO-optimized content in seconds. Our advanced language models understand your brand voice and maintain consistency across all outputs.',
    benefits: [
      'Generate months of content in hours',
      'Maintain consistent brand voice across channels',
      'Built-in SEO optimization for better rankings',
      'Reduce content creation costs by 70%',
      'A/B test multiple variations instantly'
    ],
    keyFeatures: [
      '50+ Content Templates',
      'SEO Keyword Integration',
      'Brand Voice Training',
      'Multi-Format Export',
      'Plagiarism Detection',
      'Content Calendar Integration'
    ]
  },
  automation: {
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    detailedDescription: 'Eliminate manual tasks and streamline operations with intelligent workflow automation. Our AI-powered platform identifies optimization opportunities, executes complex multi-step processes, and adapts to changing conditions. From document processing to data entry, email routing to invoice management.',
    benefits: [
      'Automate up to 80% of repetitive tasks',
      'Reduce human error to near zero',
      'Scale operations without adding headcount',
      'Free up staff for high-value work',
      'Achieve 10x faster processing speeds'
    ],
    keyFeatures: [
      '200+ Pre-Built Workflow Templates',
      'Drag-and-Drop Workflow Designer',
      'OCR Document Processing',
      '500+ Integration Connectors',
      'Smart Error Handling',
      'Real-Time Process Monitoring'
    ]
  },
  analytics: {
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    detailedDescription: 'Make data-driven decisions with confidence using advanced machine learning analytics. Our platform processes vast amounts of data to identify patterns, predict trends, and provide actionable insights. From sales forecasting to customer churn prediction, demand planning to risk assessment.',
    benefits: [
      'Forecast future trends with 90%+ accuracy',
      'Identify opportunities before competitors',
      'Reduce forecasting errors by 60%',
      'Make decisions backed by data',
      'Visualize complex data in seconds'
    ],
    keyFeatures: [
      '50+ ML Algorithms',
      'Custom Model Training',
      'Real-Time Predictions',
      'Interactive Dashboards',
      'Automated Anomaly Detection',
      'What-If Scenario Analysis'
    ]
  },
  sentiment: {
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    detailedDescription: 'Decode customer emotions and opinions with precision. Our sentiment analysis engine processes millions of messages across social media, reviews, support tickets, and surveys to provide real-time emotional intelligence. Identify PR crises before they escalate and measure campaign effectiveness.',
    benefits: [
      'Detect brand sentiment in real-time',
      'Prevent PR crises with early warnings',
      'Understand customer pain points deeply',
      'Track competitor sentiment trends',
      'Measure campaign impact instantly'
    ],
    keyFeatures: [
      'Multi-Language Sentiment Detection',
      'Emotion Category Classification',
      'Social Media Monitoring',
      'Review Aggregation',
      'Trend Analysis & Alerts',
      'Competitive Benchmarking'
    ]
  },
  recommender: {
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    detailedDescription: 'Boost revenue and customer satisfaction with hyper-personalized product recommendations. Our AI analyzes user behavior, purchase history, browsing patterns, and preferences to suggest the perfect products at the perfect time. Proven to increase conversion rates by 40%.',
    benefits: [
      'Increase conversion rates by 40%',
      'Boost average order value by 35%',
      'Improve customer retention by 25%',
      'Reduce cart abandonment',
      'Personalize every customer journey'
    ],
    keyFeatures: [
      'Hybrid ML Algorithms',
      'Real-Time Personalization',
      'Visual Similarity Matching',
      'Collaborative Filtering',
      'A/B Testing Built-In',
      'Cross-Sell & Upsell Optimization'
    ]
  }
}

export function getProductDetails(productKey: string): ProductDetails | undefined {
  return PRODUCT_DETAILS[productKey]
}
