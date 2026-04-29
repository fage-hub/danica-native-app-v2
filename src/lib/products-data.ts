export type ProductCategory = 
  | 'customer-service'
  | 'content-creation'
  | 'automation'
  | 'analytics'
  | 'security'
  | 'communication'
  | 'document-processing'
  | 'e-commerce'
  | 'healthcare'
  | 'legal'
  | 'finance'
  | 'operations'
  | 'marketing'
  | 'hr'

export type PricingTier = {
  name: string
  price: number
  yearlyPrice: number
  features: string[]
}

export type ProductDetail = {
  id: string
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  longDescriptionEn: string
  longDescriptionZh: string
  categories: ProductCategory[]
  tags: string[]
  icon: string
  pricing: {
    starter: PricingTier
    professional: PricingTier
    enterprise: PricingTier
  }
  specifications: {
    labelEn: string
    labelZh: string
    valueEn: string
    valueZh: string
  }[]
  useCases: {
    titleEn: string
    titleZh: string
    descriptionEn: string
    descriptionZh: string
  }[]
  integrations: string[]
  deploymentOptions: string[]
}

export const PRODUCTS: ProductDetail[] = [
  {
    id: 'aiAssistant',
    titleEn: 'AI Assistant',
    titleZh: 'AI助手',
    descriptionEn: '24/7 intelligent customer support chatbot',
    descriptionZh: '全天候智能客服聊天机器人',
    longDescriptionEn: 'Transform your customer service with our intelligent AI Assistant. Powered by advanced natural language processing, it handles customer inquiries 24/7, provides instant responses, and seamlessly escalates complex issues to human agents. Reduce response times by 90% while maintaining high customer satisfaction.',
    longDescriptionZh: '通过我们的智能AI助手改变您的客户服务。由先进的自然语言处理驱动，全天候处理客户查询，提供即时响应，并无缝地将复杂问题升级给人工客服。响应时间减少90%，同时保持高客户满意度。',
    categories: ['customer-service', 'communication'],
    tags: ['chatbot', 'support', 'automation', 'nlp'],
    icon: 'Brain',
    pricing: {
      starter: {
        name: 'Starter',
        price: 299,
        yearlyPrice: 2990,
        features: [
          '1,000 conversations/month',
          'Basic NLP engine',
          'Email support',
          '10 custom intents',
          'Standard response time'
        ]
      },
      professional: {
        name: 'Professional',
        price: 799,
        yearlyPrice: 7990,
        features: [
          '10,000 conversations/month',
          'Advanced NLP with context',
          'Priority support',
          'Unlimited custom intents',
          'Multi-language support',
          'Analytics dashboard',
          'API access'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        price: 2499,
        yearlyPrice: 24990,
        features: [
          'Unlimited conversations',
          'Custom AI model training',
          'Dedicated support team',
          'White-label solution',
          'Advanced security features',
          'SLA guarantee',
          'Custom integrations',
          'On-premise deployment'
        ]
      }
    },
    specifications: [
      { labelEn: 'Response Time', labelZh: '响应时间', valueEn: '< 500ms average', valueZh: '平均 < 500ms' },
      { labelEn: 'Languages Supported', labelZh: '支持语言', valueEn: '95+ languages', valueZh: '95+ 种语言' },
      { labelEn: 'Accuracy Rate', labelZh: '准确率', valueEn: '94.5%', valueZh: '94.5%' },
      { labelEn: 'Uptime SLA', labelZh: '正常运行时间SLA', valueEn: '99.9%', valueZh: '99.9%' },
      { labelEn: 'Integration APIs', labelZh: '集成API', valueEn: 'REST, GraphQL, WebSocket', valueZh: 'REST, GraphQL, WebSocket' },
      { labelEn: 'Data Security', labelZh: '数据安全', valueEn: 'SOC 2, GDPR, HIPAA compliant', valueZh: 'SOC 2, GDPR, HIPAA 合规' }
    ],
    useCases: [
      {
        titleEn: 'E-commerce Support',
        titleZh: '电子商务支持',
        descriptionEn: 'Handle order inquiries, returns, and product questions automatically',
        descriptionZh: '自动处理订单查询、退货和产品问题'
      },
      {
        titleEn: 'SaaS Onboarding',
        titleZh: 'SaaS 入职',
        descriptionEn: 'Guide new users through setup and answer common questions',
        descriptionZh: '引导新用户完成设置并回答常见问题'
      },
      {
        titleEn: 'Technical Support',
        titleZh: '技术支持',
        descriptionEn: 'Troubleshoot common issues and escalate complex problems',
        descriptionZh: '排除常见问题并升级复杂问题'
      }
    ],
    integrations: ['Slack', 'Zendesk', 'Salesforce', 'Intercom', 'HubSpot', 'Microsoft Teams'],
    deploymentOptions: ['Cloud', 'On-Premise', 'Hybrid']
  },
  {
    id: 'contentGen',
    titleEn: 'AI Content Generator',
    titleZh: 'AI内容生成器',
    descriptionEn: 'Create high-quality marketing content instantly',
    descriptionZh: '即时创建高质量营销内容',
    longDescriptionEn: 'Generate engaging marketing content at scale. From blog posts to social media captions, product descriptions to email campaigns, our AI Content Generator creates high-converting copy that matches your brand voice. Reduce content creation time by 80% while maintaining quality.',
    longDescriptionZh: '大规模生成引人入胜的营销内容。从博客文章到社交媒体标题，产品描述到电子邮件活动，我们的AI内容生成器创建符合您品牌声音的高转化率文案。内容创作时间减少80%，同时保持质量。',
    categories: ['content-creation', 'marketing'],
    tags: ['copywriting', 'content', 'marketing', 'seo'],
    icon: 'MagicWand',
    pricing: {
      starter: {
        name: 'Starter',
        price: 199,
        yearlyPrice: 1990,
        features: [
          '50,000 words/month',
          '20+ templates',
          'Basic SEO optimization',
          'Plagiarism checker',
          'Email support'
        ]
      },
      professional: {
        name: 'Professional',
        price: 499,
        yearlyPrice: 4990,
        features: [
          '200,000 words/month',
          '100+ templates',
          'Advanced SEO tools',
          'Brand voice training',
          'Multi-language generation',
          'Content calendar',
          'Priority support'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        price: 1499,
        yearlyPrice: 14990,
        features: [
          'Unlimited words',
          'Custom templates',
          'AI model fine-tuning',
          'Team collaboration',
          'API access',
          'White-label solution',
          'Dedicated account manager'
        ]
      }
    },
    specifications: [
      { labelEn: 'Content Types', labelZh: '内容类型', valueEn: '50+ formats', valueZh: '50+ 种格式' },
      { labelEn: 'Languages', labelZh: '语言', valueEn: '30+ languages', valueZh: '30+ 种语言' },
      { labelEn: 'Generation Speed', labelZh: '生成速度', valueEn: '500 words/second', valueZh: '500 字/秒' },
      { labelEn: 'SEO Score', labelZh: 'SEO评分', valueEn: 'Average 85/100', valueZh: '平均 85/100' },
      { labelEn: 'Originality', labelZh: '原创性', valueEn: '99%+ unique content', valueZh: '99%+ 独特内容' },
      { labelEn: 'Brand Voice Accuracy', labelZh: '品牌声音准确度', valueEn: '92%', valueZh: '92%' }
    ],
    useCases: [
      {
        titleEn: 'Blog Content',
        titleZh: '博客内容',
        descriptionEn: 'Generate SEO-optimized blog posts and articles at scale',
        descriptionZh: '大规模生成SEO优化的博客文章和文章'
      },
      {
        titleEn: 'Product Descriptions',
        titleZh: '产品描述',
        descriptionEn: 'Create compelling product copy for e-commerce catalogs',
        descriptionZh: '为电子商务目录创建引人注目的产品文案'
      },
      {
        titleEn: 'Social Media',
        titleZh: '社交媒体',
        descriptionEn: 'Craft engaging posts for all major social platforms',
        descriptionZh: '为所有主要社交平台制作引人入胜的帖子'
      }
    ],
    integrations: ['WordPress', 'Shopify', 'HubSpot', 'Mailchimp', 'Google Docs', 'Contentful'],
    deploymentOptions: ['Cloud', 'API']
  },
  {
    id: 'automation',
    titleEn: 'AI Automation Suite',
    titleZh: 'AI自动化套件',
    descriptionEn: 'Automate repetitive business workflows',
    descriptionZh: '自动化重复性业务流程',
    longDescriptionEn: 'Eliminate manual work with intelligent automation. Our AI Automation Suite learns your workflows and automates repetitive tasks across your entire organization. From data entry to report generation, save 40+ hours per week per employee while reducing errors by 95%.',
    longDescriptionZh: '通过智能自动化消除手动工作。我们的AI自动化套件学习您的工作流程并自动化整个组织的重复性任务。从数据输入到报告生成，每位员工每周节省40多个小时，同时将错误减少95%。',
    categories: ['automation', 'operations'],
    tags: ['workflow', 'rpa', 'efficiency', 'integration'],
    icon: 'Robot',
    pricing: {
      starter: {
        name: 'Starter',
        price: 399,
        yearlyPrice: 3990,
        features: [
          '10 automation workflows',
          '1,000 executions/month',
          'Basic integrations',
          'Visual workflow builder',
          'Email support'
        ]
      },
      professional: {
        name: 'Professional',
        price: 999,
        yearlyPrice: 9990,
        features: [
          '100 automation workflows',
          '10,000 executions/month',
          'Advanced integrations',
          'AI-powered optimization',
          'Error recovery',
          'Analytics dashboard',
          'Priority support'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        price: 2999,
        yearlyPrice: 29990,
        features: [
          'Unlimited workflows',
          'Unlimited executions',
          'Custom integrations',
          'Multi-tenant support',
          'Advanced security',
          'SLA guarantee',
          'Dedicated support team'
        ]
      }
    },
    specifications: [
      { labelEn: 'Workflow Types', labelZh: '工作流类型', valueEn: '200+ templates', valueZh: '200+ 个模板' },
      { labelEn: 'Execution Speed', labelZh: '执行速度', valueEn: '< 2 seconds', valueZh: '< 2 秒' },
      { labelEn: 'Success Rate', labelZh: '成功率', valueEn: '99.7%', valueZh: '99.7%' },
      { labelEn: 'Integrations', labelZh: '集成', valueEn: '500+ apps', valueZh: '500+ 个应用' },
      { labelEn: 'Concurrent Workflows', labelZh: '并发工作流', valueEn: 'Unlimited', valueZh: '无限' },
      { labelEn: 'Data Processing', labelZh: '数据处理', valueEn: '10GB/workflow', valueZh: '10GB/工作流' }
    ],
    useCases: [
      {
        titleEn: 'Data Entry Automation',
        titleZh: '数据输入自动化',
        descriptionEn: 'Automatically extract and input data from documents and emails',
        descriptionZh: '自动从文档和电子邮件中提取和输入数据'
      },
      {
        titleEn: 'Report Generation',
        titleZh: '报告生成',
        descriptionEn: 'Create and distribute automated reports on schedule',
        descriptionZh: '按计划创建和分发自动化报告'
      },
      {
        titleEn: 'Customer Onboarding',
        titleZh: '客户入职',
        descriptionEn: 'Streamline new customer setup with automated workflows',
        descriptionZh: '通过自动化工作流简化新客户设置'
      }
    ],
    integrations: ['Zapier', 'Microsoft Power Automate', 'Salesforce', 'SAP', 'Oracle', 'ServiceNow'],
    deploymentOptions: ['Cloud', 'On-Premise', 'Hybrid']
  },
  {
    id: 'analytics',
    titleEn: 'Predictive Analytics',
    titleZh: '预测分析',
    descriptionEn: 'ML-powered forecasting & insights',
    descriptionZh: 'ML驱动的预测和洞察',
    longDescriptionEn: 'Make data-driven decisions with confidence. Our Predictive Analytics platform uses advanced machine learning to forecast trends, identify opportunities, and predict outcomes. Increase forecast accuracy by 65% and make proactive business decisions backed by AI-powered insights.',
    longDescriptionZh: '充满信心地做出数据驱动的决策。我们的预测分析平台使用先进的机器学习来预测趋势、识别机会和预测结果。预测准确性提高65%，并做出由AI驱动的洞察支持的主动业务决策。',
    categories: ['analytics', 'finance'],
    tags: ['forecasting', 'machine-learning', 'insights', 'data'],
    icon: 'ChartLine',
    pricing: {
      starter: {
        name: 'Starter',
        price: 599,
        yearlyPrice: 5990,
        features: [
          'Basic forecasting models',
          '5 data sources',
          '10,000 predictions/month',
          'Standard dashboards',
          'Email support'
        ]
      },
      professional: {
        name: 'Professional',
        price: 1499,
        yearlyPrice: 14990,
        features: [
          'Advanced ML models',
          'Unlimited data sources',
          '100,000 predictions/month',
          'Custom dashboards',
          'Real-time predictions',
          'Anomaly detection',
          'Priority support'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        price: 3999,
        yearlyPrice: 39990,
        features: [
          'Custom AI models',
          'Unlimited predictions',
          'Multi-tenant support',
          'White-label solution',
          'Advanced security',
          'SLA guarantee',
          'Dedicated data scientist'
        ]
      }
    },
    specifications: [
      { labelEn: 'Model Types', labelZh: '模型类型', valueEn: '50+ algorithms', valueZh: '50+ 种算法' },
      { labelEn: 'Prediction Accuracy', labelZh: '预测准确度', valueEn: '85-95%', valueZh: '85-95%' },
      { labelEn: 'Data Processing', labelZh: '数据处理', valueEn: '1TB+/day', valueZh: '1TB+/天' },
      { labelEn: 'Real-time Analysis', labelZh: '实时分析', valueEn: '< 100ms latency', valueZh: '< 100ms 延迟' },
      { labelEn: 'Historical Data', labelZh: '历史数据', valueEn: 'Unlimited retention', valueZh: '无限保留' },
      { labelEn: 'Visualization Options', labelZh: '可视化选项', valueEn: '30+ chart types', valueZh: '30+ 种图表类型' }
    ],
    useCases: [
      {
        titleEn: 'Sales Forecasting',
        titleZh: '销售预测',
        descriptionEn: 'Predict future sales trends with high accuracy',
        descriptionZh: '高精度预测未来销售趋势'
      },
      {
        titleEn: 'Demand Planning',
        titleZh: '需求规划',
        descriptionEn: 'Optimize inventory based on predicted demand',
        descriptionZh: '根据预测需求优化库存'
      },
      {
        titleEn: 'Risk Assessment',
        titleZh: '风险评估',
        descriptionEn: 'Identify potential risks before they occur',
        descriptionZh: '在风险发生之前识别潜在风险'
      }
    ],
    integrations: ['Tableau', 'Power BI', 'Google Analytics', 'Salesforce', 'SAP', 'Snowflake'],
    deploymentOptions: ['Cloud', 'On-Premise', 'Hybrid']
  },
  {
    id: 'sentiment',
    titleEn: 'Sentiment Analysis',
    titleZh: '情感分析',
    descriptionEn: 'Understand customer emotions at scale',
    descriptionZh: '大规模理解客户情绪',
    longDescriptionEn: 'Understand how customers truly feel about your brand. Our Sentiment Analysis engine processes millions of customer interactions to identify emotions, detect satisfaction levels, and flag urgent issues. Improve customer satisfaction by 35% through proactive emotional intelligence.',
    longDescriptionZh: '了解客户对您品牌的真实感受。我们的情感分析引擎处理数百万客户互动，以识别情绪、检测满意度水平并标记紧急问题。通过主动情商将客户满意度提高35%。',
    categories: ['customer-service', 'analytics'],
    tags: ['nlp', 'emotions', 'feedback', 'insights'],
    icon: 'ChatCircleDots',
    pricing: {
      starter: {
        name: 'Starter',
        price: 249,
        yearlyPrice: 2490,
        features: [
          '10,000 analyses/month',
          'Basic sentiment detection',
          '3 data sources',
          'Standard reports',
          'Email support'
        ]
      },
      professional: {
        name: 'Professional',
        price: 699,
        yearlyPrice: 6990,
        features: [
          '100,000 analyses/month',
          'Advanced emotion detection',
          'Unlimited data sources',
          'Real-time monitoring',
          'Custom alerts',
          'API access',
          'Priority support'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        price: 1999,
        yearlyPrice: 19990,
        features: [
          'Unlimited analyses',
          'Custom ML models',
          'Multi-language support',
          'Trend analysis',
          'White-label solution',
          'SLA guarantee',
          'Dedicated support team'
        ]
      }
    },
    specifications: [
      { labelEn: 'Languages Supported', labelZh: '支持语言', valueEn: '60+ languages', valueZh: '60+ 种语言' },
      { labelEn: 'Accuracy Rate', labelZh: '准确率', valueEn: '91%', valueZh: '91%' },
      { labelEn: 'Processing Speed', labelZh: '处理速度', valueEn: '10,000/second', valueZh: '10,000/秒' },
      { labelEn: 'Emotion Categories', labelZh: '情感类别', valueEn: '12 distinct emotions', valueZh: '12 种不同情绪' },
      { labelEn: 'Context Understanding', labelZh: '上下文理解', valueEn: 'Advanced NLP', valueZh: '高级NLP' },
      { labelEn: 'Data Sources', labelZh: '数据源', valueEn: 'Social, Email, Chat, Reviews', valueZh: '社交、邮件、聊天、评论' }
    ],
    useCases: [
      {
        titleEn: 'Social Media Monitoring',
        titleZh: '社交媒体监控',
        descriptionEn: 'Track brand sentiment across social platforms',
        descriptionZh: '跨社交平台跟踪品牌情绪'
      },
      {
        titleEn: 'Customer Feedback',
        titleZh: '客户反馈',
        descriptionEn: 'Analyze survey responses and reviews automatically',
        descriptionZh: '自动分析调查回复和评论'
      },
      {
        titleEn: 'Support Quality',
        titleZh: '支持质量',
        descriptionEn: 'Monitor customer satisfaction in real-time',
        descriptionZh: '实时监控客户满意度'
      }
    ],
    integrations: ['Twitter', 'Facebook', 'Instagram', 'Zendesk', 'Trustpilot', 'Google Reviews'],
    deploymentOptions: ['Cloud', 'API']
  },
  {
    id: 'recommender',
    titleEn: 'AI Recommendations',
    titleZh: 'AI推荐',
    descriptionEn: 'Personalized product recommendations',
    descriptionZh: '个性化产品推荐',
    longDescriptionEn: 'Boost sales with intelligent product recommendations. Our AI Recommendation Engine analyzes user behavior, purchase history, and preferences to suggest products customers actually want. Increase average order value by 45% and conversion rates by 30% with personalized suggestions.',
    longDescriptionZh: '通过智能产品推荐提高销售额。我们的AI推荐引擎分析用户行为、购买历史和偏好，推荐客户真正想要的产品。通过个性化建议将平均订单价值提高45%，转化率提高30%。',
    categories: ['e-commerce', 'marketing'],
    tags: ['personalization', 'recommendations', 'conversion', 'ml'],
    icon: 'Lightbulb',
    pricing: {
      starter: {
        name: 'Starter',
        price: 349,
        yearlyPrice: 3490,
        features: [
          '50,000 recommendations/month',
          'Collaborative filtering',
          'Basic personalization',
          'Standard widgets',
          'Email support'
        ]
      },
      professional: {
        name: 'Professional',
        price: 899,
        yearlyPrice: 8990,
        features: [
          '500,000 recommendations/month',
          'Advanced ML algorithms',
          'Real-time personalization',
          'A/B testing',
          'Custom widgets',
          'Analytics dashboard',
          'Priority support'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        price: 2499,
        yearlyPrice: 24990,
        features: [
          'Unlimited recommendations',
          'Custom AI models',
          'Multi-channel support',
          'Advanced segmentation',
          'White-label solution',
          'SLA guarantee',
          'Dedicated data scientist'
        ]
      }
    },
    specifications: [
      { labelEn: 'Algorithm Types', labelZh: '算法类型', valueEn: 'Collaborative, Content-based, Hybrid', valueZh: '协同、基于内容、混合' },
      { labelEn: 'Response Time', labelZh: '响应时间', valueEn: '< 50ms', valueZh: '< 50ms' },
      { labelEn: 'Accuracy Rate', labelZh: '准确率', valueEn: '88%', valueZh: '88%' },
      { labelEn: 'Product Catalog', labelZh: '产品目录', valueEn: 'Unlimited items', valueZh: '无限商品' },
      { labelEn: 'User Profiles', labelZh: '用户配置文件', valueEn: 'Unlimited users', valueZh: '无限用户' },
      { labelEn: 'Update Frequency', labelZh: '更新频率', valueEn: 'Real-time', valueZh: '实时' }
    ],
    useCases: [
      {
        titleEn: 'E-commerce Upselling',
        titleZh: '电子商务追加销售',
        descriptionEn: 'Suggest complementary products at checkout',
        descriptionZh: '在结账时建议互补产品'
      },
      {
        titleEn: 'Content Discovery',
        titleZh: '内容发现',
        descriptionEn: 'Help users find relevant articles and videos',
        descriptionZh: '帮助用户找到相关文章和视频'
      },
      {
        titleEn: 'Cross-sell Campaigns',
        titleZh: '交叉销售活动',
        descriptionEn: 'Drive email campaigns with personalized suggestions',
        descriptionZh: '通过个性化建议推动电子邮件活动'
      }
    ],
    integrations: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Salesforce Commerce', 'Custom APIs'],
    deploymentOptions: ['Cloud', 'API', 'JavaScript Widget']
  },
  {
    id: 'voiceAI',
    titleEn: 'Voice AI',
    titleZh: '语音AI',
    descriptionEn: 'Natural speech recognition and synthesis',
    descriptionZh: '自然语音识别和合成',
    longDescriptionEn: 'Enable voice interactions across your applications. Our Voice AI platform combines state-of-the-art speech recognition with natural-sounding synthesis. Support voice commands, transcribe meetings, and create audio content with 98% accuracy in 80+ languages.',
    longDescriptionZh: '在您的应用程序中启用语音交互。我们的语音AI平台结合了最先进的语音识别和自然合成。支持语音命令、转录会议并创建音频内容，80多种语言准确率达98%。',
    categories: ['communication', 'automation'],
    tags: ['voice', 'speech', 'transcription', 'tts'],
    icon: 'Microphone',
    pricing: {
      starter: {
        name: 'Starter',
        price: 199,
        yearlyPrice: 1990,
        features: [
          '100 hours transcription/month',
          'Basic speech-to-text',
          '10 voices',
          'Standard quality',
          'Email support'
        ]
      },
      professional: {
        name: 'Professional',
        price: 599,
        yearlyPrice: 5990,
        features: [
          '500 hours transcription/month',
          'Advanced speech recognition',
          '50+ voices',
          'HD audio quality',
          'Custom vocabulary',
          'Speaker identification',
          'Priority support'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        price: 1799,
        yearlyPrice: 17990,
        features: [
          'Unlimited transcription',
          'Custom voice cloning',
          'Multi-language real-time',
          'Voice biometrics',
          'On-premise deployment',
          'SLA guarantee',
          'Dedicated support team'
        ]
      }
    },
    specifications: [
      { labelEn: 'Languages', labelZh: '语言', valueEn: '80+ languages', valueZh: '80+ 种语言' },
      { labelEn: 'Accuracy', labelZh: '准确度', valueEn: '98.5%', valueZh: '98.5%' },
      { labelEn: 'Latency', labelZh: '延迟', valueEn: '< 300ms', valueZh: '< 300ms' },
      { labelEn: 'Audio Formats', labelZh: '音频格式', valueEn: 'MP3, WAV, FLAC, OGG', valueZh: 'MP3, WAV, FLAC, OGG' },
      { labelEn: 'Voice Options', labelZh: '语音选项', valueEn: '200+ voices', valueZh: '200+ 种语音' },
      { labelEn: 'Noise Reduction', labelZh: '降噪', valueEn: 'Advanced AI filtering', valueZh: '高级AI过滤' }
    ],
    useCases: [
      {
        titleEn: 'Meeting Transcription',
        titleZh: '会议转录',
        descriptionEn: 'Automatically transcribe and summarize meetings',
        descriptionZh: '自动转录和总结会议'
      },
      {
        titleEn: 'Voice Assistants',
        titleZh: '语音助手',
        descriptionEn: 'Build conversational AI voice interfaces',
        descriptionZh: '构建对话式AI语音界面'
      },
      {
        titleEn: 'Audio Content',
        titleZh: '音频内容',
        descriptionEn: 'Convert text to natural-sounding speech',
        descriptionZh: '将文本转换为自然语音'
      }
    ],
    integrations: ['Zoom', 'Microsoft Teams', 'Google Meet', 'Twilio', 'Amazon Connect', 'Custom APIs'],
    deploymentOptions: ['Cloud', 'On-Premise', 'API', 'SDK']
  },
  {
    id: 'visionAI',
    titleEn: 'Computer Vision AI',
    titleZh: '计算机视觉AI',
    descriptionEn: 'Image and video analysis at scale',
    descriptionZh: '大规模图像和视频分析',
    longDescriptionEn: 'Extract insights from visual content with advanced computer vision. Detect objects, recognize faces, read text, and analyze scenes in images and videos. Process millions of images daily with 96% accuracy for quality control, security, and content moderation.',
    longDescriptionZh: '通过先进的计算机视觉从视觉内容中提取洞察。检测物体、识别面部、读取文本并分析图像和视频中的场景。每天处理数百万张图像，准确率达96%，用于质量控制、安全和内容审核。',
    categories: ['analytics', 'security', 'operations'],
    tags: ['vision', 'image-recognition', 'ocr', 'detection'],
    icon: 'Eye',
    pricing: {
      starter: {
        name: 'Starter',
        price: 299,
        yearlyPrice: 2990,
        features: [
          '10,000 images/month',
          'Basic object detection',
          'Text recognition (OCR)',
          'Standard models',
          'Email support'
        ]
      },
      professional: {
        name: 'Professional',
        price: 899,
        yearlyPrice: 8990,
        features: [
          '100,000 images/month',
          'Advanced scene analysis',
          'Face recognition',
          'Custom model training',
          'Video analysis',
          'API access',
          'Priority support'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        price: 2699,
        yearlyPrice: 26990,
        features: [
          'Unlimited processing',
          'Custom AI models',
          'Real-time video streams',
          'Edge deployment',
          'Advanced security',
          'SLA guarantee',
          'Dedicated ML engineer'
        ]
      }
    },
    specifications: [
      { labelEn: 'Object Classes', labelZh: '对象类别', valueEn: '10,000+ objects', valueZh: '10,000+ 个对象' },
      { labelEn: 'Accuracy', labelZh: '准确度', valueEn: '96.2%', valueZh: '96.2%' },
      { labelEn: 'Processing Speed', labelZh: '处理速度', valueEn: '100 images/second', valueZh: '100 张图像/秒' },
      { labelEn: 'Image Formats', labelZh: '图像格式', valueEn: 'JPEG, PNG, TIFF, BMP', valueZh: 'JPEG, PNG, TIFF, BMP' },
      { labelEn: 'Max Resolution', labelZh: '最大分辨率', valueEn: '8K (7680×4320)', valueZh: '8K (7680×4320)' },
      { labelEn: 'Video Formats', labelZh: '视频格式', valueEn: 'MP4, AVI, MOV, WebM', valueZh: 'MP4, AVI, MOV, WebM' }
    ],
    useCases: [
      {
        titleEn: 'Quality Control',
        titleZh: '质量控制',
        descriptionEn: 'Automated visual inspection in manufacturing',
        descriptionZh: '制造业自动化视觉检测'
      },
      {
        titleEn: 'Security Monitoring',
        titleZh: '安全监控',
        descriptionEn: 'Real-time threat detection in video feeds',
        descriptionZh: '视频源中的实时威胁检测'
      },
      {
        titleEn: 'Content Moderation',
        titleZh: '内容审核',
        descriptionEn: 'Filter inappropriate visual content automatically',
        descriptionZh: '自动过滤不当视觉内容'
      }
    ],
    integrations: ['AWS Rekognition', 'Google Cloud Vision', 'Azure Computer Vision', 'OpenCV', 'TensorFlow'],
    deploymentOptions: ['Cloud', 'Edge', 'On-Premise', 'API']
  }
]

export const CATEGORY_INFO = {
  'customer-service': {
    labelEn: 'Customer Service',
    labelZh: '客户服务',
    descriptionEn: 'Enhance customer support and engagement',
    descriptionZh: '增强客户支持和参与度',
    icon: 'Headset'
  },
  'content-creation': {
    labelEn: 'Content Creation',
    labelZh: '内容创作',
    descriptionEn: 'Generate and manage content at scale',
    descriptionZh: '大规模生成和管理内容',
    icon: 'Article'
  },
  'automation': {
    labelEn: 'Automation',
    labelZh: '自动化',
    descriptionEn: 'Streamline workflows and processes',
    descriptionZh: '简化工作流程和流程',
    icon: 'Lightning'
  },
  'analytics': {
    labelEn: 'Analytics',
    labelZh: '分析',
    descriptionEn: 'Data-driven insights and predictions',
    descriptionZh: '数据驱动的洞察和预测',
    icon: 'ChartBar'
  },
  'security': {
    labelEn: 'Security',
    labelZh: '安全',
    descriptionEn: 'Protect and monitor your systems',
    descriptionZh: '保护和监控您的系统',
    icon: 'Shield'
  },
  'communication': {
    labelEn: 'Communication',
    labelZh: '通讯',
    descriptionEn: 'Enable seamless interactions',
    descriptionZh: '实现无缝互动',
    icon: 'ChatCircle'
  },
  'document-processing': {
    labelEn: 'Document Processing',
    labelZh: '文档处理',
    descriptionEn: 'Intelligent document management',
    descriptionZh: '智能文档管理',
    icon: 'FilePdf'
  },
  'e-commerce': {
    labelEn: 'E-Commerce',
    labelZh: '电子商务',
    descriptionEn: 'Boost online sales and conversions',
    descriptionZh: '提升在线销售和转化率',
    icon: 'ShoppingCart'
  },
  'healthcare': {
    labelEn: 'Healthcare',
    labelZh: '医疗保健',
    descriptionEn: 'Medical and clinical solutions',
    descriptionZh: '医疗和临床解决方案',
    icon: 'HeartPulse'
  },
  'legal': {
    labelEn: 'Legal',
    labelZh: '法律',
    descriptionEn: 'Legal document analysis and compliance',
    descriptionZh: '法律文件分析和合规性',
    icon: 'Gavel'
  },
  'finance': {
    labelEn: 'Finance',
    labelZh: '金融',
    descriptionEn: 'Financial analysis and forecasting',
    descriptionZh: '财务分析和预测',
    icon: 'CurrencyDollar'
  },
  'operations': {
    labelEn: 'Operations',
    labelZh: '运营',
    descriptionEn: 'Optimize business operations',
    descriptionZh: '优化业务运营',
    icon: 'Gear'
  },
  'marketing': {
    labelEn: 'Marketing',
    labelZh: '营销',
    descriptionEn: 'Marketing automation and optimization',
    descriptionZh: '营销自动化和优化',
    icon: 'Megaphone'
  },
  'hr': {
    labelEn: 'Human Resources',
    labelZh: '人力资源',
    descriptionEn: 'Recruitment and talent management',
    descriptionZh: '招聘和人才管理',
    icon: 'Users'
  }
} as const
