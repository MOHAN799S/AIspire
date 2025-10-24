// data/pathsData.ts
import { Layout, Server, CodeIcon, Box, Terminal, PieChart, BarChart, TrendingUp, Brain, ChartAreaIcon, Camera, Gamepad, Cpu, ClipboardList, Database } from 'lucide-react';

export const Learningpaths = [
  {
    id: 1,
    title: 'Frontend Developer',
    icon: <Layout className="w-6 h-6" />,
    description: 'Design and build engaging, interactive user interfaces for web applications.',
    syllabus: [
      { module: 'Web Fundamentals', topics: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Responsive Design'] },
      { module: 'Frontend Frameworks', topics: ['React', 'Next.js', 'Vue.js'] },
      { module: 'Styling & UI Libraries', topics: ['Tailwind CSS', 'Bootstrap', 'Material UI', 'Styled Components'] },
      { module: 'Tools & Build Systems', topics: ['Vite', 'Webpack', 'Babel', 'NPM/Yarn'] },
      { module: 'Advanced Topics', topics: ['Performance Optimization', 'Accessibility (a11y)', 'PWAs', 'Testing with Jest'] }
    ],
    resources: [
      { name: 'freeCodeCamp', url: '#', type: 'Platform' },
      { name: 'Frontend Mentor', url: '#', type: 'Practice' },
      { name: 'MDN Web Docs', url: '#', type: 'Documentation' },
      { name: 'React Official Docs', url: '#', type: 'Reference' }
    ],
    duration: '8-12 months',
    difficulty: 'Intermediate'
  },
  {
    id: 2,
    title: 'Backend Developer',
    icon: <Server className="w-6 h-6" />,
    description: 'Develop and maintain server-side applications and APIs that power web platforms.',
    syllabus: [
      { module: 'Programming Languages', topics: ['Node.js', 'Python', 'Java', 'Go'] },
      { module: 'Databases', topics: ['SQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
      { module: 'APIs & Architecture', topics: ['RESTful APIs', 'GraphQL', 'Microservices', 'Authentication'] },
      { module: 'DevOps & Tools', topics: ['Docker', 'CI/CD', 'Nginx', 'Cloud Deployment'] },
      { module: 'Advanced Topics', topics: ['Security', 'Caching', 'Scalability', 'Monitoring'] }
    ],
    resources: [
      { name: 'The Odin Project', url: '#', type: 'Course' },
      { name: 'Backend Developer Roadmap', url: '#', type: 'Guide' },
      { name: 'Node.js Docs', url: '#', type: 'Reference' },
      { name: 'PostgreSQL Docs', url: '#', type: 'Reference' }
    ],
    duration: '10-15 months',
    difficulty: 'Intermediate-Advanced'
  },
  {
    id: 3,
    title: 'MERN Stack Developer',
    icon: <CodeIcon className="w-6 h-6" />,
    description: 'Develop full-stack web applications using MongoDB, Express, React, and Node.js.',
    syllabus: [
      { module: 'Frontend (React)', topics: ['JSX', 'Hooks', 'State Management', 'React Router'] },
      { module: 'Backend (Node & Express)', topics: ['REST APIs', 'Middleware', 'Authentication', 'Error Handling'] },
      { module: 'Database (MongoDB)', topics: ['CRUD Operations', 'Mongoose ORM', 'Aggregation', 'Indexing'] },
      { module: 'Full Stack Integration', topics: ['Connecting Frontend & Backend', 'JWT Auth', 'CORS'] },
      { module: 'Deployment', topics: ['Render', 'Vercel', 'AWS', 'Docker'] }
    ],
    resources: [
      { name: 'MERN Stack Guide', url: '#', type: 'Guide' },
      { name: 'MongoDB University', url: '#', type: 'Course' },
      { name: 'React Docs', url: '#', type: 'Documentation' },
      { name: 'Node.js Crash Course', url: '#', type: 'Tutorial' }
    ],
    duration: '10-16 months',
    difficulty: 'Intermediate-Advanced'
  },
  {
    id: 4,
    title: 'MEAN Stack Developer',
    icon: <Box className="w-6 h-6" />,
    description: 'Develop scalable web apps using MongoDB, Express, Angular, and Node.js.',
    syllabus: [
      { module: 'Frontend (Angular)', topics: ['Components', 'Directives', 'Routing', 'RxJS', 'Services'] },
      { module: 'Backend (Node & Express)', topics: ['Routing', 'Middleware', 'API Development', 'Authentication'] },
      { module: 'Database (MongoDB)', topics: ['CRUD Operations', 'Schema Design', 'Indexes', 'Aggregation'] },
      { module: 'Integration', topics: ['REST APIs with Angular', 'JWT Auth', 'State Management'] },
      { module: 'Deployment & Tools', topics: ['Git', 'CI/CD', 'Cloud Hosting', 'Docker'] }
    ],
    resources: [
      { name: 'Angular.io', url: '#', type: 'Documentation' },
      { name: 'MongoDB University', url: '#', type: 'Course' },
      { name: 'Node.js Docs', url: '#', type: 'Reference' },
      { name: 'MEAN Stack Crash Course', url: '#', type: 'Tutorial' }
    ],
    duration: '10-16 months',
    difficulty: 'Intermediate-Advanced'
  },
  {
    id: 5,
    title: 'Java Full Stack Developer',
    icon: <Terminal className="w-6 h-6" />,
    description: 'Develop enterprise-grade full-stack applications using Java and modern frameworks.',
    syllabus: [
      { module: 'Frontend', topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Angular'] },
      { module: 'Backend (Java)', topics: ['Core Java', 'Spring Boot', 'RESTful APIs', 'Microservices'] },
      { module: 'Databases', topics: ['MySQL', 'PostgreSQL', 'Hibernate ORM'] },
      { module: 'DevOps & Tools', topics: ['Maven', 'Docker', 'CI/CD', 'AWS'] },
      { module: 'Advanced Topics', topics: ['Security', 'Testing (JUnit)', 'System Design'] }
    ],
    resources: [
      { name: 'Java Brains', url: '#', type: 'Course' },
      { name: 'Spring Boot Docs', url: '#', type: 'Reference' },
      { name: 'Full Stack Java Developer Roadmap', url: '#', type: 'Guide' },
      { name: 'MySQL Docs', url: '#', type: 'Documentation' }
    ],
    duration: '12-20 months',
    difficulty: 'Advanced'
  },
  {
    id: 6,
    title: 'Data Analyst',
    icon: <PieChart className="w-6 h-6" />,
    description: 'Interpret data, find patterns, and generate actionable insights.',
    syllabus: [
      { module: 'Statistics & Mathematics', topics: ['Descriptive Statistics', 'Probability', 'Hypothesis Testing', 'Linear Algebra'] },
      { module: 'Data Handling', topics: ['Data Cleaning', 'Data Wrangling', 'Feature Engineering', 'SQL Queries'] },
      { module: 'Visualization', topics: ['Matplotlib', 'Seaborn', 'Power BI', 'Tableau'] },
      { module: 'Programming', topics: ['Python', 'R', 'Excel Automation'] },
      { module: 'Advanced Topics', topics: ['Time Series', 'Predictive Analysis', 'Dashboards'] }
    ],
    resources: [
      { name: 'Kaggle', url: '#', type: 'Platform' },
      { name: 'Google Data Analytics', url: '#', type: 'Course' },
      { name: 'Tableau Public', url: '#', type: 'Tool' },
      { name: 'Mode SQL Tutorial', url: '#', type: 'Guide' }
    ],
    duration: '8-12 months',
    difficulty: 'Beginner-Intermediate'
  },
  {
    id: 7,
    title: 'Data Scientist',
    icon: <BarChart className="w-6 h-6" />,
    description: 'Analyze and interpret complex data to drive decision-making.',
    syllabus: [
      { module: 'Mathematics & Statistics', topics: ['Probability', 'Statistics', 'Linear Algebra', 'Calculus'] },
      { module: 'Data Analysis', topics: ['EDA', 'Data Cleaning', 'Feature Engineering', 'Visualization'] },
      { module: 'Machine Learning', topics: ['Regression', 'Classification', 'Clustering', 'Ensemble Methods'] },
      { module: 'Programming & Tools', topics: ['Python', 'R', 'SQL', 'Pandas', 'NumPy'] },
      { module: 'Advanced Topics', topics: ['Time Series', 'NLP', 'Big Data', 'Recommendation Systems'] }
    ],
    resources: [
      { name: 'Kaggle', url: '#', type: 'Platform' },
      { name: 'DataCamp', url: '#', type: 'Course' },
      { name: 'Towards Data Science', url: '#', type: 'Blog' },
      { name: 'Scikit-learn Docs', url: '#', type: 'Reference' }
    ],
    duration: '12-18 months',
    difficulty: 'Intermediate-Advanced'
  },
  {
    id: 8,
    title: 'Data Engineer',
    icon: <Database className="w-6 h-6" />,
    description: 'Design, build, and maintain data infrastructure for analytics and ML.',
    syllabus: [
      { module: 'Programming', topics: ['Python', 'SQL', 'Scala', 'Java'] },
      { module: 'Data Systems', topics: ['Relational Databases', 'NoSQL', 'Data Lakes', 'ETL'] },
      { module: 'Big Data Tools', topics: ['Hadoop', 'Spark', 'Kafka', 'Airflow'] },
      { module: 'Cloud Platforms', topics: ['AWS', 'GCP', 'Azure'] },
      { module: 'Advanced Topics', topics: ['Streaming Data', 'Data Pipelines', 'Data Governance'] }
    ],
    resources: [
      { name: 'Data Engineering Zoomcamp', url: '#', type: 'Course' },
      { name: 'AWS Data Engineering', url: '#', type: 'Docs' },
      { name: 'Apache Spark Docs', url: '#', type: 'Reference' },
      { name: 'Airflow Tutorials', url: '#', type: 'Guide' }
    ],
    duration: '10-18 months',
    difficulty: 'Intermediate-Advanced'
  },
  {
    id: 9,
    title: 'Machine Learning Engineer',
    icon: <TrendingUp className="w-6 h-6" />,
    description: 'Build and deploy intelligent AI systems.',
    syllabus: [
      { module: 'Mathematics', topics: ['Linear Algebra', 'Calculus', 'Statistics', 'Optimization'] },
      { module: 'ML Fundamentals', topics: ['Supervised Learning', 'Unsupervised Learning', 'Deep Learning', 'NLP'] },
      { module: 'Frameworks', topics: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras'] },
      { module: 'MLOps', topics: ['Model Deployment', 'ML Pipelines', 'Monitoring', 'Version Control'] },
      { module: 'Advanced Topics', topics: ['Computer Vision', 'Transformers', 'Reinforcement Learning', 'GANs'] }
    ],
    resources: [
      { name: 'Fast.ai', url: '#', type: 'Course' },
      { name: 'Papers with Code', url: '#', type: 'Research' },
      { name: 'Coursera ML', url: '#', type: 'Course' },
      { name: 'Hugging Face', url: '#', type: 'Platform' }
    ],
    duration: '15-24 months',
    difficulty: 'Advanced'
  },
  {
    id: 10,
    title: 'Deep Learning Specialist',
    icon: <Brain className="w-6 h-6" />,
    description: 'Master neural networks and cutting-edge deep learning models.',
    syllabus: [
      { module: 'Mathematics', topics: ['Linear Algebra', 'Calculus', 'Probability'] },
      { module: 'Neural Networks', topics: ['Feedforward', 'CNNs', 'RNNs', 'Transformers'] },
      { module: 'Frameworks', topics: ['TensorFlow', 'PyTorch', 'Keras'] },
      { module: 'Advanced Topics', topics: ['GANs', 'RL', 'Attention Mechanisms'] },
      { module: 'Optimization & Deployment', topics: ['Tuning', 'Model Serving', 'MLOps'] }
    ],
    resources: [
      { name: 'DeepLearning.ai', url: '#', type: 'Course' },
      { name: 'Papers with Code', url: '#', type: 'Research' },
      { name: 'Fast.ai', url: '#', type: 'Course' },
      { name: 'TensorFlow Hub', url: '#', type: 'Platform' }
    ],
    duration: '12-18 months',
    difficulty: 'Advanced'
  },
  {
    id: 11,
    title: 'Natural Language Processing (NLP) Engineer',
    icon: <ChartAreaIcon className="w-6 h-6" />,
    description: 'Build systems that understand, interpret, and generate human language.',
    syllabus: [
      { module: 'Math & Linguistics', topics: ['Linear Algebra', 'Probability', 'Syntax', 'Semantics'] },
      { module: 'NLP Fundamentals', topics: ['Tokenization', 'Embeddings', 'Text Classification', 'Sequence Modeling'] },
      { module: 'Deep Learning for NLP', topics: ['RNNs', 'Transformers', 'BERT', 'GPT'] },
      { module: 'Tools & Libraries', topics: ['Hugging Face', 'NLTK', 'SpaCy', 'TensorFlow', 'PyTorch'] },
      { module: 'Applications', topics: ['Chatbots', 'Translation', 'Summarization', 'Retrieval'] }
    ],
    resources: [
      { name: 'Hugging Face Course', url: '#', type: 'Course' },
      { name: 'Stanford NLP', url: '#', type: 'Course' },
      { name: 'Kaggle NLP', url: '#', type: 'Platform' },
      { name: 'ArXiv NLP Papers', url: '#', type: 'Research' }
    ],
    duration: '12-18 months',
    difficulty: 'Advanced'
  },
  {
    id: 12,
    title: 'Computer Vision Engineer',
    icon: <Camera className="w-6 h-6" />,
    description: 'Develop systems that understand and interpret visual data.',
    syllabus: [
      { module: 'Mathematics', topics: ['Linear Algebra', 'Probability', 'Calculus', 'Optimization'] },
      { module: 'CV Fundamentals', topics: ['Image Processing', 'Object Detection', 'Segmentation'] },
      { module: 'Deep Learning', topics: ['CNNs', 'ResNet', 'YOLO', 'GANs'] },
      { module: 'Tools & Frameworks', topics: ['OpenCV', 'TensorFlow', 'PyTorch'] },
      { module: 'Advanced Topics', topics: ['3D Vision', 'Video Analysis', 'AR/VR'] }
    ],
    resources: [
      { name: 'OpenCV Docs', url: '#', type: 'Platform' },
      { name: 'Fast.ai CV', url: '#', type: 'Course' },
      { name: 'Papers with Code CV', url: '#', type: 'Research' },
      { name: 'DeepLearning.ai CV', url: '#', type: 'Course' }
    ],
    duration: '12-20 months',
    difficulty: 'Advanced'
  },
  {
    id: 13,
    title: 'MLOps Engineer',
    icon: <Server className="w-6 h-6" />,
    description: 'Manage, deploy, and monitor machine learning systems at scale.',
    syllabus: [
      { module: 'ML Fundamentals', topics: ['Supervised', 'Unsupervised', 'Model Evaluation'] },
      { module: 'DevOps Basics', topics: ['CI/CD', 'Containers', 'Version Control', 'Cloud'] },
      { module: 'MLOps Tools', topics: ['Kubeflow', 'MLflow', 'Docker', 'Kubernetes'] },
      { module: 'Monitoring', topics: ['Model Drift', 'Performance Monitoring', 'Logging', 'Alerting'] },
      { module: 'Advanced Topics', topics: ['Automation', 'A/B Testing', 'Scaling Models'] }
    ],
    resources: [
      { name: 'MLOps Community', url: '#', type: 'Platform' },
      { name: 'Google MLOps Guide', url: '#', type: 'Docs' },
      { name: 'MLflow Docs', url: '#', type: 'Reference' },
      { name: 'Coursera MLOps', url: '#', type: 'Course' }
    ],
    duration: '12-18 months',
    difficulty: 'Advanced'
  },
  {
    id: 14,
    title: 'Reinforcement Learning Engineer',
    icon: <Gamepad className="w-6 h-6" />,
    description: 'Build intelligent agents that learn through interactions with environments.',
    syllabus: [
      { module: 'Mathematics', topics: ['Probability', 'Calculus', 'Optimization'] },
      { module: 'RL Fundamentals', topics: ['MDPs', 'Value Functions', 'Policy Gradients'] },
      { module: 'Deep RL', topics: ['DQN', 'A3C', 'PPO', 'Actor-Critic'] },
      { module: 'Tools & Frameworks', topics: ['OpenAI Gym', 'RLlib', 'TensorFlow', 'PyTorch'] },
      { module: 'Applications', topics: ['Robotics', 'Games', 'Simulation', 'Autonomous Systems'] }
    ],
    resources: [
      { name: 'OpenAI Gym', url: '#', type: 'Platform' },
      { name: 'Deep RL Bootcamp', url: '#', type: 'Course' },
      { name: 'Papers with Code RL', url: '#', type: 'Research' },
      { name: 'Spinning Up in Deep RL', url: '#', type: 'Tutorial' }
    ],
    duration: '12-24 months',
    difficulty: 'Advanced'
  },
  {
    id: 15,
    title: 'AI Engineer',
    icon: <Cpu className="w-6 h-6" />,
    description: 'Design and implement AI-powered applications and systems.',
    syllabus: [
      { module: 'Mathematics', topics: ['Linear Algebra', 'Probability', 'Optimization'] },
      { module: 'AI Fundamentals', topics: ['Machine Learning', 'Deep Learning', 'Reinforcement Learning'] },
      { module: 'Programming & Frameworks', topics: ['Python', 'TensorFlow', 'PyTorch'] },
      { module: 'Deployment', topics: ['Cloud Services', 'APIs', 'MLOps'] },
      { module: 'Advanced Topics', topics: ['Computer Vision', 'NLP', 'Generative AI'] }
    ],
    resources: [
      { name: 'OpenAI', url: '#', type: 'Platform' },
      { name: 'DeepLearning.ai', url: '#', type: 'Course' },
      { name: 'Hugging Face', url: '#', type: 'Platform' },
      { name: 'ArXiv', url: '#', type: 'Research' }
    ],
    duration: '12-20 months',
    difficulty: 'Advanced'
  },
  {
    id: 16,
    title: 'AI Product Manager',
    icon: <ClipboardList className="w-6 h-6" />,
    description: 'Lead AI product development and strategy bridging business and technology.',
    syllabus: [
      { module: 'AI Fundamentals', topics: ['ML Basics', 'Deep Learning Overview', 'NLP & CV'] },
      { module: 'Product Management', topics: ['Roadmaps', 'Market Research', 'Stakeholder Management'] },
      { module: 'Data & Analytics', topics: ['Metrics', 'A/B Testing', 'Data-Driven Decision Making'] },
      { module: 'AI Strategy', topics: ['AI Ethics', 'Regulations', 'Responsible AI'] },
      { module: 'Tools', topics: ['JIRA', 'Notion', 'Analytics Platforms'] }
    ],
    resources: [
      { name: 'Coursera AI for PMs', url: '#', type: 'Course' },
      { name: 'Product School', url: '#', type: 'Course' },
      { name: 'Mind the Product', url: '#', type: 'Platform' },
      { name: 'Harvard AI Strategy', url: '#', type: 'Course' }
    ],
    duration: '9-15 months',
    difficulty: 'Intermediate-Advanced'
  }
];
