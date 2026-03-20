// Comprehensive ML/AI Topics for beginners - exhaustive list
// Each topic generates a complete course with lessons, quizzes, and projects

export interface MLTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  prerequisites: string[];
  estimatedHours: number;
}

export const mlTopics: MLTopic[] = [
  // Foundations
  {
    id: 'python-basics',
    title: 'Python Fundamentals for ML',
    description: 'Learn Python programming basics specifically for machine learning',
    difficulty: 'beginner',
    category: 'Foundations',
    prerequisites: [],
    estimatedHours: 15
  },
  {
    id: 'linear-algebra',
    title: 'Linear Algebra for ML',
    description: 'Vectors, matrices, and linear transformations - the math behind ML',
    difficulty: 'beginner',
    category: 'Foundations',
    prerequisites: ['python-basics'],
    estimatedHours: 20
  },
  {
    id: 'calculus',
    title: 'Calculus for ML',
    description: 'Derivatives, gradients, and optimization fundamentals',
    difficulty: 'beginner',
    category: 'Foundations',
    prerequisites: ['linear-algebra'],
    estimatedHours: 20
  },
  {
    id: 'probability-statistics',
    title: 'Probability & Statistics',
    description: 'Random variables, distributions, and statistical inference',
    difficulty: 'beginner',
    category: 'Foundations',
    prerequisites: ['python-basics'],
    estimatedHours: 25
  },

  // Core ML
  {
    id: 'intro-ml',
    title: 'Introduction to Machine Learning',
    description: 'What is ML, types of learning, and basic concepts',
    difficulty: 'beginner',
    category: 'Core ML',
    prerequisites: ['python-basics', 'linear-algebra'],
    estimatedHours: 15
  },
  {
    id: 'supervised-learning',
    title: 'Supervised Learning',
    description: 'Classification and regression algorithms',
    difficulty: 'beginner',
    category: 'Core ML',
    prerequisites: ['intro-ml', 'probability-statistics'],
    estimatedHours: 25
  },
  {
    id: 'unsupervised-learning',
    title: 'Unsupervised Learning',
    description: 'Clustering, dimensionality reduction, and anomaly detection',
    difficulty: 'intermediate',
    category: 'Core ML',
    prerequisites: ['supervised-learning'],
    estimatedHours: 20
  },
  {
    id: 'model-evaluation',
    title: 'Model Evaluation & Validation',
    description: 'Cross-validation, metrics, and hyperparameter tuning',
    difficulty: 'beginner',
    category: 'Core ML',
    prerequisites: ['supervised-learning'],
    estimatedHours: 15
  },
  {
    id: 'feature-engineering',
    title: 'Feature Engineering',
    description: 'Data preprocessing, feature selection, and transformation',
    difficulty: 'intermediate',
    category: 'Core ML',
    prerequisites: ['supervised-learning'],
    estimatedHours: 20
  },

  // Deep Learning
  {
    id: 'neural-networks',
    title: 'Neural Networks Fundamentals',
    description: 'Architecture, backpropagation, and training',
    difficulty: 'intermediate',
    category: 'Deep Learning',
    prerequisites: ['supervised-learning', 'calculus'],
    estimatedHours: 25
  },
  {
    id: 'deep-learning-pytorch',
    title: 'Deep Learning with PyTorch',
    description: 'Building neural networks with PyTorch framework',
    difficulty: 'intermediate',
    category: 'Deep Learning',
    prerequisites: ['neural-networks'],
    estimatedHours: 30
  },
  {
    id: 'deep-learning-tensorflow',
    title: 'Deep Learning with TensorFlow',
    description: 'Building neural networks with TensorFlow/Keras',
    difficulty: 'intermediate',
    category: 'Deep Learning',
    prerequisites: ['neural-networks'],
    estimatedHours: 30
  },
  {
    id: 'convolutional-nets',
    title: 'Convolutional Neural Networks (CNNs)',
    description: 'Image classification and computer vision',
    difficulty: 'intermediate',
    category: 'Deep Learning',
    prerequisites: ['deep-learning-pytorch'],
    estimatedHours: 25
  },
  {
    id: 'recurrent-nets',
    title: 'Recurrent Neural Networks (RNNs)',
    description: 'Sequence modeling and time series',
    difficulty: 'intermediate',
    category: 'Deep Learning',
    prerequisites: ['deep-learning-pytorch'],
    estimatedHours: 20
  },
  {
    id: 'transformers',
    title: 'Transformers & Attention',
    description: 'BERT, GPT, and modern NLP architectures',
    difficulty: 'advanced',
    category: 'Deep Learning',
    prerequisites: ['recurrent-nets'],
    estimatedHours: 30
  },

  // NLP
  {
    id: 'nlp-fundamentals',
    title: 'Natural Language Processing Fundamentals',
    description: 'Text preprocessing, tokenization, and embeddings',
    difficulty: 'intermediate',
    category: 'NLP',
    prerequisites: ['supervised-learning'],
    estimatedHours: 20
  },
  {
    id: 'text-classification',
    title: 'Text Classification',
    description: 'Sentiment analysis, spam detection, and categorization',
    difficulty: 'intermediate',
    category: 'NLP',
    prerequisites: ['nlp-fundamentals'],
    estimatedHours: 15
  },
  {
    id: 'sequence-to-sequence',
    title: 'Sequence-to-Sequence Models',
    description: 'Translation, summarization, and chatbots',
    difficulty: 'advanced',
    category: 'NLP',
    prerequisites: ['transformers'],
    estimatedHours: 25
  },
  {
    id: 'llm-fine-tuning',
    title: 'LLM Fine-Tuning',
    description: 'Fine-tuning pre-trained language models',
    difficulty: 'advanced',
    category: 'NLP',
    prerequisites: ['transformers'],
    estimatedHours: 30
  },

  // Computer Vision
  {
    id: 'computer-vision',
    title: 'Computer Vision Fundamentals',
    description: 'Image processing, object detection, and segmentation',
    difficulty: 'intermediate',
    category: 'Computer Vision',
    prerequisites: ['convolutional-nets'],
    estimatedHours: 25
  },
  {
    id: 'object-detection',
    title: 'Object Detection',
    description: 'YOLO, R-CNN, and real-time detection',
    difficulty: 'advanced',
    category: 'Computer Vision',
    prerequisites: ['computer-vision'],
    estimatedHours: 25
  },
  {
    id: 'image-segmentation',
    title: 'Image Segmentation',
    description: 'Semantic and instance segmentation',
    difficulty: 'advanced',
    category: 'Computer Vision',
    prerequisites: ['object-detection'],
    estimatedHours: 20
  },
  {
    id: 'generative-models',
    title: 'Generative AI & Diffusion Models',
    description: 'GANs, VAEs, and diffusion models for image generation',
    difficulty: 'advanced',
    category: 'Computer Vision',
    prerequisites: ['convolutional-nets'],
    estimatedHours: 30
  },

  // Reinforcement Learning
  {
    id: 'rl-intro',
    title: 'Reinforcement Learning Introduction',
    description: 'Agents, environments, and reward signals',
    difficulty: 'intermediate',
    category: 'Reinforcement Learning',
    prerequisites: ['supervised-learning', 'probability-statistics'],
    estimatedHours: 20
  },
  {
    id: 'q-learning',
    title: 'Q-Learning & Deep Q-Networks',
    description: 'Value-based methods and DQN',
    difficulty: 'intermediate',
    category: 'Reinforcement Learning',
    prerequisites: ['rl-intro'],
    estimatedHours: 20
  },
  {
    id: 'policy-gradients',
    title: 'Policy Gradient Methods',
    description: 'REINFORCE, Actor-Critic, and PPO',
    difficulty: 'advanced',
    category: 'Reinforcement Learning',
    prerequisites: ['q-learning'],
    estimatedHours: 25
  },

  // MLOps & Tools
  {
    id: 'ml-lifecycle',
    title: 'ML Lifecycle & Pipelines',
    description: 'Data collection, training, deployment, and monitoring',
    difficulty: 'intermediate',
    category: 'MLOps',
    prerequisites: ['model-evaluation'],
    estimatedHours: 20
  },
  {
    id: 'model-deployment',
    title: 'ML Model Deployment',
    description: 'REST APIs, containers, and cloud deployment',
    difficulty: 'intermediate',
    category: 'MLOps',
    prerequisites: ['ml-lifecycle'],
    estimatedHours: 25
  },
  {
    id: 'ml-tools',
    title: 'ML Tools & Frameworks',
    description: 'Scikit-learn, XGBoost, LightGBM, and more',
    difficulty: 'beginner',
    category: 'MLOps',
    prerequisites: ['intro-ml'],
    estimatedHours: 15
  },

  // Applied ML
  {
    id: 'time-series',
    title: 'Time Series Forecasting',
    description: 'ARIMA, Prophet, and LSTM for forecasting',
    difficulty: 'intermediate',
    category: 'Applied ML',
    prerequisites: ['unsupervised-learning'],
    estimatedHours: 20
  },
  {
    id: 'recommendation-systems',
    title: 'Recommendation Systems',
    description: 'Collaborative filtering and content-based methods',
    difficulty: 'intermediate',
    category: 'Applied ML',
    prerequisites: ['unsupervised-learning'],
    estimatedHours: 20
  },
  {
    id: 'anomaly-detection',
    title: 'Anomaly Detection',
    description: 'Fraud detection and outlier identification',
    difficulty: 'intermediate',
    category: 'Applied ML',
    prerequisites: ['unsupervised-learning'],
    estimatedHours: 15
  }
];

export const topicCategories = [
  'Foundations',
  'Core ML',
  'Deep Learning',
  'NLP',
  'Computer Vision',
  'Reinforcement Learning',
  'MLOps',
  'Applied ML'
];

export function getTopicsByCategory(category: string): MLTopic[] {
  return mlTopics.filter(t => t.category === category);
}

export function getTopicById(id: string): MLTopic | undefined {
  return mlTopics.find(t => t.id === id);
}

export function getPrerequisiteTopics(topic: MLTopic): MLTopic[] {
  return topic.prerequisites.map(id => getTopicById(id)).filter(Boolean) as MLTopic[];
}
