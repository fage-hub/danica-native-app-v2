type ProductData = {
  title: string
  description: string
  detailedDescription: string
  imageUrl: string
  benefits: string[]
  features: string[]
}

export const PRODUCT_CATALOG: {
  en: Record<string, ProductData>
  zh: Record<string, ProductData>
} = {
  en: {
    aiAssistant: { 
      title: 'AI Assistant', 
      description: '24/7 intelligent customer support chatbot',
      detailedDescription: 'Transform your customer service with our advanced AI Assistant. Powered by state-of-the-art natural language processing, it understands context, maintains conversation history, and delivers human-like responses. Seamlessly integrates with your existing tools and scales effortlessly to handle unlimited concurrent conversations. Reduce support costs by up to 85% while improving customer satisfaction scores.',
      imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
      benefits: [
        'Reduce response time from hours to seconds',
        'Handle unlimited concurrent conversations',
        'Maintain 24/7 availability without additional staffing',
        'Learn from interactions to continuously improve',
        'Support 95+ languages with native-level fluency'
      ],
      features: [
        'Natural Language Understanding',
        'Context-Aware Responses',
        'Multi-Channel Support',
        'Custom Knowledge Base Integration',
        'Real-Time Analytics Dashboard',
        'Sentiment Detection'
      ]
    },
    contentGen: { 
      title: 'AI Content Generator', 
      description: 'Create high-quality marketing content instantly',
      detailedDescription: 'Accelerate your content creation workflow with AI-powered generation. From blog posts to social media content, email campaigns to product descriptions, create engaging, SEO-optimized content in seconds. Our advanced language models understand your brand voice and maintain consistency across all outputs. Perfect for marketing teams, content creators, and businesses of all sizes.',
      imageUrl: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800&h=600&fit=crop',
      benefits: [
        'Generate months of content in hours',
        'Maintain consistent brand voice across channels',
        'Built-in SEO optimization for better rankings',
        'Reduce content creation costs by 70%',
        'A/B test multiple variations instantly'
      ],
      features: [
        '50+ Content Templates',
        'SEO Keyword Integration',
        'Brand Voice Training',
        'Multi-Format Export',
        'Plagiarism Detection',
        'Content Calendar Integration'
      ]
    },
    automation: { 
      title: 'AI Automation Suite', 
      description: 'Automate repetitive business workflows',
      detailedDescription: 'Eliminate manual tasks and streamline operations with intelligent workflow automation. Our AI-powered platform identifies optimization opportunities, executes complex multi-step processes, and adapts to changing conditions. From document processing to data entry, email routing to invoice management, automate your entire business workflow with unprecedented accuracy and speed.',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
      benefits: [
        'Automate up to 80% of repetitive tasks',
        'Reduce human error to near zero',
        'Scale operations without adding headcount',
        'Free up staff for high-value work',
        'Achieve 10x faster processing speeds'
      ],
      features: [
        '200+ Pre-Built Workflow Templates',
        'Drag-and-Drop Workflow Designer',
        'OCR Document Processing',
        '500+ Integration Connectors',
        'Smart Error Handling',
        'Real-Time Process Monitoring'
      ]
    },
    analytics: { 
      title: 'Predictive Analytics', 
      description: 'ML-powered forecasting & insights',
      detailedDescription: 'Make data-driven decisions with confidence using advanced machine learning analytics. Our platform processes vast amounts of data to identify patterns, predict trends, and provide actionable insights. From sales forecasting to customer churn prediction, demand planning to risk assessment, turn your data into a competitive advantage with accuracy rates of 85-95%.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      benefits: [
        'Forecast future trends with 90%+ accuracy',
        'Identify opportunities before competitors',
        'Reduce forecasting errors by 60%',
        'Make decisions backed by data, not gut feel',
        'Visualize complex data in seconds'
      ],
      features: [
        '50+ ML Algorithms',
        'Custom Model Training',
        'Real-Time Predictions',
        'Interactive Dashboards',
        'Automated Anomaly Detection',
        'What-If Scenario Analysis'
      ]
    },
    sentiment: { 
      title: 'Sentiment Analysis', 
      description: 'Understand customer emotions at scale',
      detailedDescription: 'Decode customer emotions and opinions with precision. Our sentiment analysis engine processes millions of messages across social media, reviews, support tickets, and surveys to provide real-time emotional intelligence. Identify PR crises before they escalate, measure campaign effectiveness, and understand what customers truly think about your brand with 91% accuracy across 60+ languages.',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
      benefits: [
        'Detect brand sentiment in real-time',
        'Prevent PR crises with early warnings',
        'Understand customer pain points deeply',
        'Track competitor sentiment trends',
        'Measure campaign impact instantly'
      ],
      features: [
        'Multi-Language Sentiment Detection',
        'Emotion Category Classification',
        'Social Media Monitoring',
        'Review Aggregation',
        'Trend Analysis & Alerts',
        'Competitive Benchmarking'
      ]
    },
    recommender: { 
      title: 'AI Recommendations', 
      description: 'Personalized product recommendations',
      detailedDescription: 'Boost revenue and customer satisfaction with hyper-personalized product recommendations. Our AI analyzes user behavior, purchase history, browsing patterns, and preferences to suggest the perfect products at the perfect time. Proven to increase conversion rates by 40%, average order value by 35%, and customer lifetime value by 50%. Real-time learning ensures recommendations get smarter with every interaction.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      benefits: [
        'Increase conversion rates by 40%',
        'Boost average order value by 35%',
        'Improve customer retention by 25%',
        'Reduce cart abandonment significantly',
        'Personalize every customer journey'
      ],
      features: [
        'Hybrid ML Algorithms',
        'Real-Time Personalization',
        'Visual Similarity Matching',
        'Collaborative Filtering',
        'A/B Testing Built-In',
        'Cross-Sell & Upsell Optimization'
      ]
    },
    voiceAI: { title: 'Voice AI', description: 'Natural speech recognition and synthesis' },
    visionAI: { title: 'Computer Vision AI', description: 'Image and video analysis at scale' },
    nlpPlatform: { title: 'NLP Platform', description: 'Advanced natural language processing' },
    chatbotBuilder: { title: 'Chatbot Builder', description: 'No-code chatbot creation platform' },
    aiWorkflow: { title: 'AI Workflow Engine', description: 'Intelligent business process automation' },
    knowledgeBase: { title: 'AI Knowledge Base', description: 'Intelligent knowledge management' },
    emailAI: { title: 'Email AI', description: 'Smart email composition and routing' },
    dataLabeling: { title: 'Data Labeling AI', description: 'Automated training data annotation' },
    fraudDetection: { title: 'Fraud Detection AI', description: 'Real-time fraud prevention system' },
    documentAI: { title: 'Document AI', description: 'Intelligent document processing' },
    translationAI: { title: 'Translation AI', description: 'Neural machine translation engine' },
    codeAssistant: { title: 'Code Assistant', description: 'AI-powered coding companion' },
    videoAnalytics: { title: 'Video Analytics', description: 'Deep video content analysis' },
    speechRecognition: { title: 'Speech Recognition', description: 'Advanced voice-to-text conversion' },
    textSummarizer: { title: 'Text Summarizer', description: 'Automatic content summarization' },
    imageGenerator: { title: 'Image Generator', description: 'AI-powered image creation' },
    predictiveMaintenance: { title: 'Predictive Maintenance', description: 'Equipment failure prediction' },
    recruitmentAI: { title: 'Recruitment AI', description: 'Intelligent hiring and talent matching' },
    priceOptimization: { title: 'Price Optimization', description: 'Dynamic pricing engine' },
    inventoryAI: { title: 'Inventory AI', description: 'Smart inventory management' },
    socialMediaAI: { title: 'Social Media AI', description: 'Social content optimization' },
    customerSegmentation: { title: 'Customer Segmentation', description: 'AI-driven customer profiling' },
    anomalyDetection: { title: 'Anomaly Detection', description: 'Automated pattern recognition' },
    riskAssessment: { title: 'Risk Assessment AI', description: 'Intelligent risk analysis' },
    leadScoring: { title: 'Lead Scoring', description: 'Predictive lead qualification' },
    qualityControl: { title: 'Quality Control AI', description: 'Automated quality inspection' },
    energyOptimization: { title: 'Energy Optimization', description: 'Smart energy management' },
    supplyChainAI: { title: 'Supply Chain AI', description: 'Intelligent logistics optimization' },
    medicalDiagnosis: { title: 'Medical Diagnosis AI', description: 'Clinical decision support system' },
    legalAI: { title: 'Legal AI', description: 'Contract analysis and legal research' },
    financialForecasting: { title: 'Financial Forecasting', description: 'Advanced financial predictions' },
    marketingAutomation: { title: 'Marketing Automation', description: 'AI-driven campaign management' },
    salesForecasting: { title: 'Sales Forecasting', description: 'Predictive sales analytics' },
    contractAnalysis: { title: 'Contract Analysis', description: 'Automated contract review' },
    complianceAI: { title: 'Compliance AI', description: 'Regulatory compliance monitoring' },
    cybersecurityAI: { title: 'Cybersecurity AI', description: 'Threat detection and prevention' },
    routeOptimization: { title: 'Route Optimization', description: 'Intelligent routing algorithms' },
    warehouseAI: { title: 'Warehouse AI', description: 'Smart warehouse operations' },
    retailAnalytics: { title: 'Retail Analytics', description: 'Customer behavior insights' },
    personalizationEngine: { title: 'Personalization Engine', description: 'Real-time content personalization' },
    searchOptimization: { title: 'Search Optimization', description: 'Intelligent search ranking' },
    contentModeration: { title: 'Content Moderation', description: 'Automated content filtering' },
    dynamicPricing: { title: 'Dynamic Pricing', description: 'Real-time price adjustment' },
  },
  zh: {
    aiAssistant: { title: 'AI助手', description: '全天候智能客服聊天机器人' },
    contentGen: { title: 'AI内容生成器', description: '即时创建高质量营销内容' },
    automation: { title: 'AI自动化套件', description: '自动化重复性业务流程' },
    analytics: { title: '预测分析', description: 'ML驱动的预测和洞察' },
    sentiment: { title: '情感分析', description: '大规模理解客户情绪' },
    recommender: { title: 'AI推荐', description: '个性化产品推荐' },
    voiceAI: { title: '语音AI', description: '自然语音识别和合成' },
    visionAI: { title: '计算机视觉AI', description: '大规模图像和视频分析' },
    nlpPlatform: { title: 'NLP平台', description: '高级自然语言处理' },
    chatbotBuilder: { title: '聊天机器人构建器', description: '无代码聊天机器人创建平台' },
    aiWorkflow: { title: 'AI工作流引擎', description: '智能业务流程自动化' },
    knowledgeBase: { title: 'AI知识库', description: '智能知识管理' },
    emailAI: { title: '电子邮件AI', description: '智能邮件撰写和路由' },
    dataLabeling: { title: '数据标注AI', description: '自动化训练数据标注' },
    fraudDetection: { title: '欺诈检测AI', description: '实时欺诈预防系统' },
    documentAI: { title: '文档AI', description: '智能文档处理' },
    translationAI: { title: '翻译AI', description: '神经机器翻译引擎' },
    codeAssistant: { title: '代码助手', description: 'AI驱动的编程伴侣' },
    videoAnalytics: { title: '视频分析', description: '深度视频内容分析' },
    speechRecognition: { title: '语音识别', description: '高级语音转文字' },
    textSummarizer: { title: '文本摘要器', description: '自动内容摘要' },
    imageGenerator: { title: '图像生成器', description: 'AI驱动的图像创建' },
    predictiveMaintenance: { title: '预测性维护', description: '设备故障预测' },
    recruitmentAI: { title: '招聘AI', description: '智能招聘和人才匹配' },
    priceOptimization: { title: '价格优化', description: '动态定价引擎' },
    inventoryAI: { title: '库存AI', description: '智能库存管理' },
    socialMediaAI: { title: '社交媒体AI', description: '社交内容优化' },
    customerSegmentation: { title: '客户细分', description: 'AI驱动的客户画像' },
    anomalyDetection: { title: '异常检测', description: '自动模式识别' },
    riskAssessment: { title: '风险评估AI', description: '智能风险分析' },
    leadScoring: { title: '线索评分', description: '预测性线索资格评估' },
    qualityControl: { title: '质量控制AI', description: '自动化质量检测' },
    energyOptimization: { title: '能源优化', description: '智能能源管理' },
    supplyChainAI: { title: '供应链AI', description: '智能物流优化' },
    medicalDiagnosis: { title: '医学诊断AI', description: '临床决策支持系统' },
    legalAI: { title: '法律AI', description: '合同分析和法律研究' },
    financialForecasting: { title: '财务预测', description: '高级财务预测' },
    marketingAutomation: { title: '营销自动化', description: 'AI驱动的活动管理' },
    salesForecasting: { title: '销售预测', description: '预测性销售分析' },
    contractAnalysis: { title: '合同分析', description: '自动化合同审查' },
    complianceAI: { title: '合规AI', description: '监管合规监控' },
    cybersecurityAI: { title: '网络安全AI', description: '威胁检测和预防' },
    routeOptimization: { title: '路径优化', description: '智能路由算法' },
    warehouseAI: { title: '仓库AI', description: '智能仓库运营' },
    retailAnalytics: { title: '零售分析', description: '客户行为洞察' },
    personalizationEngine: { title: '个性化引擎', description: '实时内容个性化' },
    searchOptimization: { title: '搜索优化', description: '智能搜索排名' },
    contentModeration: { title: '内容审核', description: '自动化内容过滤' },
    dynamicPricing: { title: '动态定价', description: '实时价格调整' },
  },
}

export type ProductKey = keyof typeof PRODUCT_CATALOG.en
