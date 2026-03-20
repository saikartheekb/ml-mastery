import type { Course, LearningPath, UserProgress, Achievement } from '../types';

// Phase 1: Math Foundations
export const mathFoundationsCourse: Course = {
  id: 'phase1-math',
  title: 'Mathematical Foundations',
  description: 'Master the essential mathematics needed for machine learning: linear algebra, calculus, probability, and statistics.',
  phase: 1,
  lessons: [
    {
      id: 'phase1-math-l1',
      courseId: 'phase1-math',
      title: 'Introduction to Linear Algebra',
      content: `# Introduction to Linear Algebra

Linear algebra is the foundation of machine learning. It provides the mathematical framework for representing and manipulating data in multiple dimensions.

## Vectors

A **vector** is a quantity that has both magnitude and direction. In machine learning, we often represent data points as vectors.

### Example: Representing a House

Imagine we want to represent a house with:
- Square footage: 2000
- Number of bedrooms: 3
- Age: 10 years

We can represent this as a vector: **[2000, 3, 10]**

## Matrices

A **matrix** is a rectangular array of numbers. It's used to represent collections of vectors.

### Matrix Addition
When adding matrices, we add corresponding elements:
$$
\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} + \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix} = \\begin{pmatrix} 6 & 8 \\\\ 10 & 12 \\end{pmatrix}
$$

### Matrix Multiplication
Matrix multiplication is more complex but fundamental to neural networks:
$$
\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\times \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix} = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}
$$`,
      codeExamples: [
        {
          id: 'ex1',
          title: 'Vector Operations in NumPy',
          code: `import numpy as np

# Creating vectors
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])

# Vector addition
print("v1 + v2 =", v1 + v2)

# Scalar multiplication
print("3 * v1 =", 3 * v1)

# Dot product
print("v1 · v2 =", np.dot(v1, v2))`,
          language: 'python',
          explanation: 'NumPy provides efficient operations for vectors. The dot product is especially important in machine learning for measuring similarity between vectors.'
        }
      ],
      practiceProblems: [
        {
          id: 'pp1',
          title: 'Vector Magnitude',
          description: 'Calculate the magnitude (length) of vector [3, 4]',
          solution: 'The magnitude is sqrt(3² + 4²) = 5',
          difficulty: 'easy'
        }
      ],
      duration: 45,
      order: 1
    },
    {
      id: 'phase1-math-l2',
      courseId: 'phase1-math',
      title: 'Calculus Fundamentals',
      content: `# Calculus Fundamentals

Calculus is essential for understanding how machine learning models learn through optimization.

## Derivatives

The derivative measures how a function changes as its input changes.

### Power Rule
$$
\\frac{d}{dx}x^n = nx^{n-1}
$$

### Chain Rule
$$
\\frac{d}{dx}f(g(x)) = f\'(g(x)) \\cdot g\'(x)
$$

## Gradient Descent

The gradient points in the direction of steepest increase. In ML, we move in the opposite direction to minimize the loss function.

### The Update Rule
$$
\\theta_{new} = \\theta_{old} - \\alpha \\cdot \\nabla J(\\theta)
$$

Where:
- $\\alpha$ is the learning rate
- $\\nabla J(\\theta)$ is the gradient of the loss function`,
      codeExamples: [
        {
          id: 'ex2',
          title: 'Visualizing Derivatives',
          code: `import numpy as np
import matplotlib.pyplot as plt

# Function: f(x) = x^2
x = np.linspace(-5, 5, 100)
y = x**2

# Derivative: f'(x) = 2x
dy = 2 * x

plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
plt.plot(x, y, 'b-', label='f(x) = x²')
plt.grid(True)
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(x, dy, 'r-', label="f'(x) = 2x")
plt.grid(True)
plt.legend()
plt.tight_layout()
plt.show()`,
          language: 'python',
          explanation: 'The derivative of x² is 2x. Notice how the derivative is negative when x < 0 (function decreasing) and positive when x > 0 (function increasing).'
        }
      ],
      practiceProblems: [
        {
          id: 'pp2',
          title: 'Find the Derivative',
          description: 'Find the derivative of f(x) = x³',
          solution: 'f\'(x) = 3x²',
          difficulty: 'easy'
        }
      ],
      duration: 50,
      order: 2
    },
    {
      id: 'phase1-math-l3',
      courseId: 'phase1-math',
      title: 'Probability Theory',
      content: `# Probability Theory

Probability provides the framework for dealing with uncertainty in machine learning.

## Basic Concepts

### Probability Rules
- **P(A)** = Probability of event A occurring
- **P(A ∪ B)** = Probability of A or B occurring
- **P(A ∩ B)** = Probability of both A and B occurring

### Conditional Probability
$$
P(A|B) = \\frac{P(A \\cap B)}{P(B)}
$$

This is fundamental to many ML algorithms, especially Naive Bayes.

## Bayes' Theorem

$$
P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}
$$

This theorem is the foundation of many ML methods, including:
- Spam classification
- Medical diagnosis
- Document classification`,
      codeExamples: [
        {
          id: 'ex3',
          title: 'Bayesian Spam Filter',
          code: `from collections import Counter
import re

# Simple word frequency approach
def tokenize(text):
    return re.findall(r'\\w+', text.lower())

# Training data
spam_emails = [
    "free money win lottery",
    "click here for free prize",
    "congratulations you won"
]
ham_emails = [
    "meeting tomorrow at 10",
    "please review the document",
    "project update attached"
]

# Build word counts
spam_words = Counter()
for email in spam_emails:
    spam_words.update(tokenize(email))
    
ham_words = Counter()
for email in ham_emails:
    ham_words.update(tokenize(email))

# Classify new email
new_email = "free money meeting"
new_words = tokenize(new_email)

spam_score = sum(spam_words.get(w, 0) for w in new_words)
ham_score = sum(ham_words.get(w, 0) for w in new_words)

print(f"Spam score: {spam_score}, Ham score: {ham_score}")
print("Classification:", "SPAM" if spam_score > ham_score else "HAM")`,
          language: 'python',
          explanation: 'This is a simple Naive Bayes classifier. It counts word frequencies in spam vs ham emails and classifies new emails based on which category has more word matches.'
        }
      ],
      practiceProblems: [
        {
          id: 'pp3',
          title: 'Conditional Probability',
          description: 'If P(A) = 0.3, P(B) = 0.4, and P(A ∩ B) = 0.1, find P(A|B)',
          solution: 'P(A|B) = P(A ∩ B) / P(B) = 0.1 / 0.4 = 0.25',
          difficulty: 'medium'
        }
      ],
      duration: 55,
      order: 3
    },
    {
      id: 'phase1-math-l4',
      courseId: 'phase1-math',
      title: 'Statistics Fundamentals',
      content: `# Statistics Fundamentals

Statistics helps us understand data and make inferences.

## Descriptive Statistics

### Mean, Median, Mode
- **Mean**: Average of all values
- **Median**: Middle value when sorted
- **Mode**: Most frequent value

### Standard Deviation
$$
\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i=1}^{N}(x_i - \\mu)^2}
$$

## Inferential Statistics

### Normal Distribution
The Gaussian (normal) distribution is ubiquitous in ML:
$$
f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}
$$

### Central Limit Theorem
The sum of many independent random variables tends toward a normal distribution, regardless of the original distribution.`,
      codeExamples: [
        {
          id: 'ex4',
          title: 'Statistical Analysis',
          code: `import numpy as np
from scipy import stats

# Sample data
data = np.array([23, 25, 28, 29, 30, 31, 33, 35, 38, 40, 42, 45])

# Descriptive statistics
print(f"Mean: {np.mean(data):.2f}")
print(f"Median: {np.median(data):.2f}")
print(f"Std Dev: {np.std(data):.2f}")
print(f"Min: {np.min(data)}, Max: {np.max(data)}")

# Generate normal distribution
x = np.linspace(-3, 3, 100)
y = stats.norm.pdf(x, 0, 1)
print(f"\\nNormal distribution peak at x=0: {stats.norm.pdf(0, 0, 1):.3f}")`,
          language: 'python',
          explanation: 'NumPy and SciPy provide powerful statistical functions. The normal distribution is critical in ML for modeling errors and as an assumption in many algorithms.'
        }
      ],
      practiceProblems: [
        {
          id: 'pp4',
          title: 'Calculate Standard Deviation',
          description: 'Find the standard deviation of [2, 4, 4, 4, 5, 5, 7, 9]',
          solution: 'Mean = 5, Variance = 4, Std Dev = 2',
          difficulty: 'medium'
        }
      ],
      duration: 50,
      order: 4
    },
    {
      id: 'phase1-math-l5',
      courseId: 'phase1-math',
      title: 'Optimization Basics',
      content: `# Optimization Basics

Optimization is at the heart of machine learning. We want to find the best parameters that minimize (or maximize) a function.

## Loss Functions

A loss (or cost) function measures how far our predictions are from the true values.

### Mean Squared Error (MSE)
$$
MSE = \\frac{1}{n} \\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2
$$

### Cross-Entropy Loss
For classification problems:
$$
L = -\\sum_{i=1}^{n} y_i \\log(\\hat{y}_i)
$$

## Optimization Algorithms

### Gradient Descent
The most basic optimization algorithm:
1. Calculate the gradient
2. Move in the opposite direction
3. Repeat until convergence

### Stochastic Gradient Descent (SGD)
Uses a single sample or small batch instead of the entire dataset.

### Adam
Adaptive Moment Estimation - combines momentum and learning rate adaptation.`,
      codeExamples: [
        {
          id: 'ex5',
          title: 'Implementing Gradient Descent',
          code: `import numpy as np

def gradient_descent(learning_rate=0.1, n_iterations=50):
    # Minimize f(x) = x^2
    x = 10  # Start at x = 10
    history = [x]
    
    for i in range(n_iterations):
        gradient = 2 * x  # derivative of x^2
        x = x - learning_rate * gradient
        history.append(x)
        
        if abs(gradient) < 0.001:  # Convergence check
            break
    
    return x, history

optimal_x, history = gradient_descent()
print(f"Optimal x: {optimal_x:.6f}")
print(f"Converged in {len(history)-1} iterations")

# Show convergence
print(f"\\nConvergence: {history[0]:.2f} → ... → {history[-1]:.6f}")`,
          language: 'python',
          explanation: 'Gradient descent iteratively moves toward the minimum. With a learning rate of 0.1, we reduce x by 20% of the gradient each step (gradient = 2x).'
        }
      ],
      practiceProblems: [
        {
          id: 'pp5',
          title: 'Learning Rate Impact',
          description: 'What happens if learning rate is too large in gradient descent?',
          solution: 'The algorithm may overshoot and diverge, never reaching the minimum',
          difficulty: 'easy'
        }
      ],
      duration: 60,
      order: 5
    }
  ],
  assessments: [
    {
      id: 'phase1-math-assess',
      courseId: 'phase1-math',
      title: 'Math Foundations Quiz',
      type: 'quiz',
      passingScore: 70,
      duration: 30,
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          question: 'What is the dot product of vectors [1, 2, 3] and [4, 5, 6]?',
          options: ['32', '44', '20', '27'],
          correctAnswer: '32',
          explanation: '1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32',
          points: 10
        },
        {
          id: 'q2',
          type: 'multiple_choice',
          question: 'What is the derivative of f(x) = x³?',
          options: ['3x²', 'x³', '3x', '2x³'],
          correctAnswer: '3x²',
          explanation: 'Using the power rule: d/dx(x³) = 3x²',
          points: 10
        },
        {
          id: 'q3',
          type: 'fill_blank',
          question: 'If P(A) = 0.3, P(B) = 0.5, and P(A ∩ B) = 0.1, then P(A|B) = _____ (round to 2 decimals)',
          correctAnswer: ['0.2', '0.20'],
          explanation: 'P(A|B) = P(A ∩ B) / P(B) = 0.1 / 0.5 = 0.2',
          points: 15
        },
        {
          id: 'q4',
          type: 'multiple_choice',
          question: 'Which optimization algorithm uses momentum?',
          options: ['Gradient Descent', 'SGD', 'Adam', 'All of the above'],
          correctAnswer: 'Adam',
          explanation: 'Adam (Adaptive Moment Estimation) uses momentum and adaptive learning rates',
          points: 10
        },
        {
          id: 'q5',
          type: 'short_answer',
          question: 'Explain why the normal distribution is important in machine learning.',
          correctAnswer: ['error', 'assumption', 'central limit', 'gaussian'],
          explanation: 'The normal distribution is used to model errors, is an assumption in many algorithms, and the Central Limit Theorem justifies its widespread use',
          points: 15
        }
      ]
    }
  ],
  projects: [
    {
      id: 'phase1-math-proj1',
      courseId: 'phase1-math',
      title: 'Build a Linear Algebra Library',
      description: 'Create a Python library for basic linear algebra operations from scratch.',
      objectives: [
        'Implement vector operations (add, subtract, dot product, magnitude)',
        'Implement matrix operations (add, multiply, transpose)',
        'Create functions to solve systems of linear equations',
        'Test your implementation against NumPy'
      ],
      starterCode: `# Your Linear Algebra Library
# Implement the functions below

def vector_add(v1, v2):
    """Add two vectors"""
    pass

def vector_dot(v1, v2):
    """Calculate dot product of two vectors"""
    pass

def matrix_multiply(A, B):
    """Multiply two matrices"""
    pass

# Add more functions as needed

# Test your implementation
if __name__ == "__main__":
    # Test vector operations
    v1 = [1, 2, 3]
    v2 = [4, 5, 6]
    print("Vector add:", vector_add(v1, v2))
    print("Dot product:", vector_dot(v1, v2))`,
      expectedOutput: 'All tests should pass and match NumPy results',
      hints: [
        'Remember to handle dimension mismatches',
        'Use nested loops for matrix multiplication',
        'Check NumPy source code for reference'
      ],
      rubric: [
        { criterion: 'Correctness', maxPoints: 40, description: 'All operations produce correct results' },
        { criterion: 'Code Quality', maxPoints: 30, description: 'Clean, readable code with proper structure' },
        { criterion: 'Testing', maxPoints: 30, description: 'Comprehensive test coverage' }
      ],
      estimatedHours: 8
    }
  ],
  prerequisites: [],
  estimatedHours: 40,
  icon: '📐'
};

// Phase 2: Machine Learning Basics
export const mlBasicsCourse: Course = {
  id: 'phase2-ml-basics',
  title: 'Machine Learning Fundamentals',
  description: 'Learn the core algorithms that form the foundation of machine learning: regression, classification, and clustering.',
  phase: 2,
  lessons: [
    {
      id: 'phase2-ml-l1',
      courseId: 'phase2-ml-basics',
      title: 'Introduction to ML',
      content: `# Introduction to Machine Learning

Machine Learning (ML) is a subset of artificial intelligence that enables systems to learn and improve from experience.

## Types of Machine Learning

### Supervised Learning
- **Regression**: Predict continuous values (house prices, temperatures)
- **Classification**: Predict categorical labels (spam/not spam, cat/dog)

### Unsupervised Learning
- **Clustering**: Group similar data points (customer segmentation)
- **Dimensionality Reduction**: Reduce features while preserving information

### Reinforcement Learning
- Learn through rewards and penalties
- Used in game AI, robotics

## The Machine Learning Workflow
1. Data Collection
2. Data Preprocessing
3. Feature Engineering
4. Model Selection
5. Training
6. Evaluation
7. Deployment`,
      codeExamples: [
        {
          id: 'ml-ex1',
          title: 'Your First ML Model',
          code: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import numpy as np

# Sample data: House sizes and prices
X = np.array([[500], [700], [900], [1100], [1300], [1500]])
y = np.array([150, 200, 250, 300, 350, 400])  # in thousands

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predicted_price = model.predict([[1200]])
print(f"Predicted price for 1200 sq ft: " + str(int(predicted_price[0]*1000)) + " dollars")
print(f"Model coefficient: {model.coef_[0]:.2f}")
print(f"Model intercept: {model.intercept_:.2f}")`,
          language: 'python',
          explanation: 'This simple linear regression model learns the relationship between house size and price. The coefficient tells us each additional square foot adds ~$100 to the price.'
        }
      ],
      practiceProblems: [
        {
          id: 'ml-pp1',
          title: 'Identify ML Type',
          description: 'You have customer purchase data and want to group customers into segments. What type of ML is this?',
          solution: 'Unsupervised Learning - Clustering',
          difficulty: 'easy'
        }
      ],
      duration: 40,
      order: 1
    },
    {
      id: 'phase2-ml-l2',
      courseId: 'phase2-ml-basics',
      title: 'Linear Regression',
      content: `# Linear Regression

Linear regression is the foundation of predictive modeling.

## Simple Linear Regression

$$y = mx + b$$

Where:
- $y$ is the target variable
- $x$ is the feature
- $m$ is the slope (coefficient)
- $b$ is the intercept

## Multiple Linear Regression

$$y = b + w_1x_1 + w_2x_2 + ... + w_nx_n$$

## Cost Function: Mean Squared Error

$$MSE = \\frac{1}{n} \\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2$$

## Normal Equation

For small datasets, we can solve directly:
$$\\theta = (X^T X)^{-1} X^T y$$`,
      codeExamples: [
        {
          id: 'ml-ex2',
          title: 'Multiple Linear Regression',
          code: `import numpy as np
from sklearn.linear_model import LinearRegression

# Data: [size, bedrooms, age] → price
X = np.array([
    [2000, 3, 10],
    [1500, 2, 5],
    [2500, 4, 15],
    [1800, 3, 8],
    [2200, 3, 12]
])
y = np.array([350, 280, 420, 310, 380])  # in thousands

model = LinearRegression()
model.fit(X, y)

# Predict for new house
new_house = np.array([[2000, 3, 10]])
predicted = model.predict(new_house)
print(f"Predicted: " + str(int(predicted[0]*1000)) + " dollars")

# Feature importance
print("\\nFeature coefficients:")
print(f"  Size: {model.coef_[0]:.2f}")
print(f"  Bedrooms: {model.coef_[1]:.2f}")
print(f"  Age: {model.coef_[2]:.2f}")`,
          language: 'python',
          explanation: 'Multiple linear regression uses multiple features. The coefficients show how each feature affects the price - positive means it increases price.'
        }
      ],
      practiceProblems: [
        {
          id: 'ml-pp2',
          title: 'Interpret Coefficients',
          description: 'In a linear regression model for predicting salary: salary = 30000 + 1000*experience + 500*education, what does the coefficient 1000 represent?',
          solution: 'Each additional year of experience adds $1000 to the predicted salary',
          difficulty: 'easy'
        }
      ],
      duration: 50,
      order: 2
    },
    {
      id: 'phase2-ml-l3',
      courseId: 'phase2-ml-basics',
      title: 'Classification Algorithms',
      content: `# Classification Algorithms

Classification predicts categorical labels. Let's explore the main algorithms.

## Logistic Regression

Despite its name, logistic regression is for classification!

$$P(y=1|x) = \\frac{1}{1 + e^{-(wx+b)}}$$

The Sigmoid function outputs a probability between 0 and 1.

## Decision Trees

- Splits data based on feature values
- Easy to interpret
- Prone to overfitting

## Support Vector Machines (SVM)

- Finds the optimal hyperplane that separates classes
- Works well with high-dimensional data
- Uses "kernels" for non-linear boundaries

## K-Nearest Neighbors (KNN)

- Classifies based on the majority class of k nearest neighbors
- Simple but computationally expensive for large datasets`,
      codeExamples: [
        {
          id: 'ml-ex3',
          title: 'Comparing Classifiers',
          code: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# Create sample data
X, y = make_classification(n_samples=200, n_features=2, 
                           n_redundant=0, random_state=42)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Compare models
models = {
    'Logistic Regression': LogisticRegression(),
    'Decision Tree': DecisionTreeClassifier(max_depth=5),
    'SVM': SVC(kernel='rbf'),
    'KNN': KNeighborsClassifier(n_neighbors=5)
}

print("Model Comparison:")
print("-" * 30)
for name, model in models.items():
    model.fit(X_train, y_train)
    accuracy = accuracy_score(y_test, model.predict(X_test))
    print(f"{name}: {accuracy:.2%}")`,
          language: 'python',
          explanation: 'This code compares multiple classification algorithms on the same dataset. Each has different strengths - SVM often performs well, while decision trees are easy to interpret.'
        }
      ],
      practiceProblems: [
        {
          id: 'ml-pp3',
          title: 'Choose the Right Model',
          description: 'You need to build a model to detect credit card fraud. The data is highly imbalanced (0.1% fraud). Which metric should you prioritize?',
          solution: 'Precision, Recall, or F1-score (not accuracy)',
          difficulty: 'medium'
        }
      ],
      duration: 60,
      order: 3
    },
    {
      id: 'phase2-ml-l4',
      courseId: 'phase2-ml-basics',
      title: 'Model Evaluation',
      content: `# Model Evaluation

How do we know if our model is good?

## Metrics for Classification

### Accuracy
$$Accuracy = \\frac{TP + TN}{TP + TN + FP + FN}$$

### Precision
$$Precision = \\frac{TP}{TP + FP}$$

### Recall (Sensitivity)
$$Recall = \\frac{TP}{TP + FN}$$

### F1-Score
$$F1 = 2 \\cdot \\frac{Precision \\cdot Recall}{Precision + Recall}$$

## Metrics for Regression

### R² Score
Measures how much variance is explained by the model.

### Mean Absolute Error (MAE)
$$MAE = \\frac{1}{n} \\sum |y_i - \\hat{y}_i|$$

### Root Mean Squared Error (RMSE)
$$RMSE = \\sqrt{\\frac{1}{n} \\sum (y_i - \\hat{y}_i)^2}$$`,
      codeExamples: [
        {
          id: 'ml-ex4',
          title: 'Comprehensive Model Evaluation',
          code: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, precision_score, 
                             recall_score, f1_score, confusion_matrix)

# Create imbalanced data (like fraud detection)
X, y = make_classification(n_samples=1000, weights=[0.99, 0.01], 
                          random_state=42)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

model = LogisticRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Model Evaluation Metrics:")
print("=" * 30)
print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
print(f"F1-Score:  {f1_score(y_test, y_pred):.4f}")

print("\\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))`,
          language: 'python',
          explanation: 'With imbalanced data, accuracy is misleading. The confusion matrix shows we predicted 295 negatives correctly but only 2 positives - recall is very low!'
        }
      ],
      practiceProblems: [
        {
          id: 'ml-pp4',
          title: 'Interpret F1-Score',
          description: 'If Precision = 0.8 and Recall = 0.5, what is the F1-Score?',
          solution: 'F1 = 2 * (0.8 * 0.5) / (0.8 + 0.5) = 0.615',
          difficulty: 'medium'
        }
      ],
      duration: 55,
      order: 4
    },
    {
      id: 'phase2-ml-l5',
      courseId: 'phase2-ml-basics',
      title: 'Overfitting & Regularization',
      content: `# Overfitting & Regularization

A critical concept in machine learning.

## The Bias-Variance Tradeoff

- **High Bias**: Model is too simple (underfitting)
- **High Variance**: Model is too complex (overfitting)

## Overfitting

The model memorizes training data instead of learning patterns.

## Regularization Techniques

### L1 Regularization (Lasso)
Adds penalty: $\\lambda \\sum |w_i|$
- Can set weights to zero (feature selection)

### L2 Regularization (Ridge)
Adds penalty: $\\lambda \\sum w_i^2$
- Shrinks weights toward zero

### Elastic Net
Combines L1 and L2 penalties.

## Cross-Validation

Use k-fold cross-validation to get reliable performance estimates.`,
      codeExamples: [
        {
          id: 'ml-ex5',
          title: 'Fighting Overfitting',
          code: `import numpy as np
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import Ridge, Lasso, LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures

# Create overfitting-prone data
np.random.seed(42)
X = np.sort(np.random.rand(50) * 10)
y = np.sin(X) + np.random.randn(50) * 0.2

X = X.reshape(-1, 1)

# Compare models
models = {
    'Linear': LinearRegression(),
    'Poly (overfit)': make_pipeline(PolynomialFeatures(10), LinearRegression()),
    'Ridge': make_pipeline(PolynomialFeatures(10), Ridge(alpha=0.1)),
    'Lasso': make_pipeline(PolynomialFeatures(10), Lasso(alpha=0.1))
}

print("Cross-Validation Scores (higher is better):")
print("-" * 40)
for name, model in models.items():
    scores = cross_val_score(model, X, y, cv=5, scoring='r2')
    print(f"{name:15}: {scores.mean():.3f} (+/- {scores.std():.3f})")`,
          language: 'python',
          explanation: 'Without regularization, polynomial features cause severe overfitting. Ridge and Lasso regularize the model, improving generalization.'
        }
      ],
      practiceProblems: [
        {
          id: 'ml-pp5',
          title: 'Regularization Effect',
          description: 'As you increase the regularization strength (alpha), what happens to the model complexity?',
          solution: 'Model complexity decreases, weights get smaller',
          difficulty: 'easy'
        }
      ],
      duration: 55,
      order: 5
    }
  ],
  assessments: [
    {
      id: 'phase2-ml-assess',
      courseId: 'phase2-ml-basics',
      title: 'ML Fundamentals Quiz',
      type: 'quiz',
      passingScore: 70,
      duration: 30,
      questions: [
        {
          id: 'ml-q1',
          type: 'multiple_choice',
          question: 'Which algorithm is best for predicting house prices (continuous value)?',
          options: ['Logistic Regression', 'Linear Regression', 'K-Means', 'Decision Tree Classifier'],
          correctAnswer: 'Linear Regression',
          explanation: 'Linear Regression is used for regression tasks (continuous targets)',
          points: 10
        },
        {
          id: 'ml-q2',
          type: 'multiple_choice',
          question: 'What does a high F1-score indicate?',
          options: ['High precision only', 'High recall only', 'Balanced precision and recall', 'High accuracy'],
          correctAnswer: 'Balanced precision and recall',
          explanation: 'F1-score is the harmonic mean of precision and recall',
          points: 10
        },
        {
          id: 'ml-q3',
          type: 'fill_blank',
          question: 'In Ridge Regression, the regularization term is the sum of _____ of the coefficients.',
          correctAnswer: ['squares', 'squared values'],
          explanation: 'Ridge uses L2 regularization: λΣw²',
          points: 15
        },
        {
          id: 'ml-q4',
          type: 'multiple_choice',
          question: 'What is the purpose of cross-validation?',
          options: ['To train faster', 'To get reliable performance estimates', 'To select features', 'To reduce data'],
          correctAnswer: 'To get reliable performance estimates',
          explanation: 'K-fold CV trains and tests on different splits to get robust performance metrics',
          points: 10
        },
        {
          id: 'ml-q5',
          type: 'short_answer',
          question: 'Explain the bias-variance tradeoff in your own words.',
          correctAnswer: ['bias', 'variance', 'tradeoff', 'overfit', 'underfit'],
          explanation: 'Bias is error from overly simple assumptions, variance is error from complexity. Finding the right balance prevents both underfitting and overfitting.',
          points: 15
        }
      ]
    }
  ],
  projects: [
    {
      id: 'phase2-ml-proj1',
      courseId: 'phase2-ml-basics',
      title: 'Build a House Price Predictor',
      description: 'Create a complete ML pipeline to predict house prices using real estate data.',
      objectives: [
        'Load and explore the dataset',
        'Handle missing values and feature engineering',
        'Train multiple regression models',
        'Evaluate and compare model performance',
        'Make predictions on new data'
      ],
      starterCode: `# House Price Prediction Project
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# Load data (use a sample dataset or create one)
# For example, use: from sklearn.datasets import fetch_openml
# housing = fetch_openml(name="house_prices", as_frame=True)

# For this exercise, let's create sample data
np.random.seed(42)
n_samples = 500

data = pd.DataFrame({
    'size': np.random.randint(1000, 4000, n_samples),
    'bedrooms': np.random.randint(1, 6, n_samples),
    'age': np.random.randint(0, 50, n_samples),
    'location_score': np.random.randint(1, 10, n_samples)
})

# Generate prices with some noise
data['price'] = (data['size'] * 150 + 
                 data['bedrooms'] * 10000 + 
                 data['location_score'] * 5000 - 
                 data['age'] * 500 +
                 np.random.randn(n_samples) * 20000)

print("Dataset shape:", data.shape)
print(data.head())

# TODO: Split data into features and target
# X = ?
# y = ?

# TODO: Split into train/test sets

# TODO: Scale features

# TODO: Train multiple models and compare

# TODO: Evaluate and report results`,
      expectedOutput: 'Report RMSE, R² scores for each model and identify the best one',
      hints: [
        'Start with simple models first',
        'Try different feature scalings',
        'Use cross-validation for more reliable estimates'
      ],
      rubric: [
        { criterion: 'Data Processing', maxPoints: 20, description: 'Proper handling of data' },
        { criterion: 'Model Training', maxPoints: 30, description: 'At least 3 different models' },
        { criterion: 'Evaluation', maxPoints: 25, description: 'Comprehensive metrics' },
        { criterion: 'Analysis', maxPoints: 25, description: 'Insightful conclusions' }
      ],
      estimatedHours: 10
    }
  ],
  prerequisites: ['phase1-math'],
  estimatedHours: 50,
  icon: '🤖'
};

// Phase 3: Deep Learning
export const deepLearningCourse: Course = {
  id: 'phase3-deep-learning',
  title: 'Deep Learning',
  description: 'Master neural networks, from perceptrons to transformers, with hands-on implementation.',
  phase: 3,
  lessons: [
    {
      id: 'phase3-dl-l1',
      courseId: 'phase3-deep-learning',
      title: 'Neural Network Basics',
      content: `# Neural Network Basics

Deep learning has revolutionized AI. Let's understand the foundations.

## The Perceptron

The simplest neural network unit:
- Takes multiple inputs
- Applies weights and bias
- Applies activation function
- Produces output

## Multi-Layer Perceptron (MLP)

- Input layer
- Hidden layers
- Output layer

## Forward Propagation

$$a^{[l]} = \\sigma(z^{[l]})$$

Where $z^{[l]} = W^{[l]}a^{[l-1]} + b^{[l]}$

## Activation Functions

- **ReLU**: max(0, x) - most common
- **Sigmoid**: 1/(1+e^(-x)) - for probabilities
- **Tanh**: (e^x - e^(-x))/(e^x + e^(-x)) - zero-centered`,
      codeExamples: [
        {
          id: 'dl-ex1',
          title: 'Build a Neural Network from Scratch',
          code: `import numpy as np

class NeuralNetwork:
    def __init__(self, layer_sizes):
        self.weights = []
        self.biases = []
        
        # Initialize weights and biases
        for i in range(len(layer_sizes) - 1):
            w = np.random.randn(layer_sizes[i], layer_sizes[i+1]) * 0.1
            b = np.zeros((1, layer_sizes[i+1]))
            self.weights.append(w)
            self.biases.append(b)
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))
    
    def forward(self, X):
        self.activations = [X]
        for i in range(len(self.weights)):
            z = np.dot(self.activations[-1], self.weights[i]) + self.biases[i]
            a = self.sigmoid(z)
            self.activations.append(a)
        return self.activations[-1]

# Test the network
nn = NeuralNetwork([4, 8, 8, 1])
X = np.random.randn(3, 4)  # 3 samples, 4 features
output = nn.forward(X)
print(f"Input shape: {X.shape}")
print(f"Output shape: {output.shape}")
print(f"Predictions: {output.flatten()}")`,
          language: 'python',
          explanation: 'This is a simple 2-hidden-layer neural network. It initializes random weights and performs forward propagation through sigmoid activations.'
        }
      ],
      practiceProblems: [
        {
          id: 'dl-pp1',
          title: 'Activation Function Choice',
          description: 'Why is ReLU preferred over sigmoid for hidden layers in deep networks?',
          solution: 'ReLU avoids vanishing gradient problem and is computationally faster',
          difficulty: 'medium'
        }
      ],
      duration: 50,
      order: 1
    },
    {
      id: 'phase3-dl-l2',
      courseId: 'phase3-deep-learning',
      title: 'Training Neural Networks',
      content: `# Training Neural Networks

How do neural networks learn?

## Backpropagation

The algorithm for computing gradients:
1. Forward pass: compute predictions
2. Compute loss
3. Backward pass: compute gradients
4. Update weights

## Loss Functions

- **Mean Squared Error**: For regression
- **Cross-Entropy**: For classification

## Optimization

### Gradient Descent Update
$$W = W - \\alpha \\cdot \\frac{\\partial L}{\\partial W}$$

### Learning Rate
- Too small: slow convergence
- Too large: oscillations/divergence

## Mini-Batch Gradient Descent

Train on batches of data for efficiency.`,
      codeExamples: [
        {
          id: 'dl-ex2',
          title: 'Training a Neural Network',
          code: `import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# Load MNIST dataset
(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

# Preprocess
x_train = x_train.reshape(-1, 784).astype("float32") / 255.0
x_test = x_test.reshape(-1, 784).astype("float32") / 255.0

# Build model
model = keras.Sequential([
    layers.Dense(512, activation="relu", input_shape=(784,)),
    layers.Dropout(0.2),
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.2),
    layers.Dense(10, activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

# Train
history = model.fit(x_train, y_train, epochs=5, batch_size=128, 
                    validation_split=0.1, verbose=1)

# Evaluate
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f"\\nTest accuracy: {test_acc:.4f}")`,
          language: 'python',
          explanation: 'This trains a simple MLP on MNIST. Using TensorFlow/Keras makes it easy to build and train neural networks with just a few lines of code.'
        }
      ],
      practiceProblems: [
        {
          id: 'dl-pp2',
          title: 'Backpropagation',
          description: 'In backpropagation, in what order are the layers updated?',
          solution: 'From output layer to input layer (reverse order of forward pass)',
          difficulty: 'medium'
        }
      ],
      duration: 60,
      order: 2
    },
    {
      id: 'phase3-dl-l3',
      courseId: 'phase3-deep-learning',
      title: 'Convolutional Neural Networks',
      content: `# Convolutional Neural Networks (CNNs)

CNNs excel at image processing.

## Key Concepts

### Convolution
- Apply filters to detect features
- Edge detection, texture, patterns

### Pooling
- Reduce spatial dimensions
- Max pooling, average pooling

### Feature Hierarchies
- Early layers: edges, colors
- Middle layers: shapes, textures
- Deep layers: objects, faces

## Architecture Patterns

- Conv → ReLU → Pool
- Multiple conv layers
- Fully connected at end
- Dropout for regularization`,
      codeExamples: [
        {
          id: 'dl-ex3',
          title: 'CNN for Image Classification',
          code: `import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Build CNN
model = keras.Sequential([
    # First conv block
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    layers.MaxPooling2D((2, 2)),
    
    # Second conv block
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Third conv block
    layers.Conv2D(64, (3, 3), activation='relu'),
    
    # Fully connected
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()`,
          language: 'python',
          explanation: 'This CNN has three conv blocks that progressively extract features, followed by dense layers for classification. The pooling layers reduce dimensions.'
        }
      ],
      practiceProblems: [
        {
          id: 'dl-pp3',
          title: 'CNN Components',
          description: 'What does the filter size (3,3) or (5,5) in Conv2D represent?',
          solution: 'The spatial size of the convolutional kernel/filter',
          difficulty: 'easy'
        }
      ],
      duration: 55,
      order: 3
    },
    {
      id: 'phase3-dl-l4',
      courseId: 'phase3-deep-learning',
      title: 'Recurrent Neural Networks',
      content: `# Recurrent Neural Networks (RNNs)

RNNs process sequential data.

## Sequential Memory

- Information cycles through the network
- Previous outputs influence current prediction

## Types of RNN

### Vanilla RNN
Simple but suffers from vanishing gradients

### LSTM (Long Short-Term Memory)
- Gates: input, forget, output
- Long-term memory capability

### GRU (Gated Recurrent Unit)
- Simpler than LSTM
- Fewer parameters

## Applications

- Language modeling
- Machine translation
- Time series prediction
- Audio processing`,
      codeExamples: [
        {
          id: 'dl-ex4',
          title: 'LSTM for Sequence Prediction',
          code: `import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# Simple sequence: predict next number
# Input: sequences of 10 numbers, output: next number

def generate_sequences(n=1000):
    X, y = [], []
    for i in range(n):
        start = np.random.randint(0, 90)
        seq = list(range(start, start+10))
        X.append(seq)
        y.append(start+10)
    return np.array(X), np.array(y)

X, y = generate_sequences()
X = X / 100.0  # Normalize

# Build LSTM model
model = keras.Sequential([
    layers.LSTM(32, input_shape=(10, 1)),
    layers.Dense(1)
])

model.compile(optimizer='adam', loss='mse')

# Train
model.fit(X, y, epochs=20, verbose=0)

# Test
test_seq = np.array([[50, 51, 52, 53, 54, 55, 56, 57, 58, 59]]) / 100.0
prediction = model.predict(test_seq, verbose=0)
print(f"Input: [50-59]")
print(f"Predicted next: {prediction[0][0]*100:.1f}")
print(f"Expected: 60")`,
          language: 'python',
          explanation: 'LSTM can learn long-term dependencies in sequences. This simple model learns to predict the next number in a sequence.'
        }
      ],
      practiceProblems: [
        {
          id: 'dl-pp4',
          title: 'LSTM Gates',
          description: 'What is the purpose of the "forget gate" in an LSTM?',
          solution: 'To decide what information from previous states to discard',
          difficulty: 'medium'
        }
      ],
      duration: 60,
      order: 4
    },
    {
      id: 'phase3-dl-l5',
      courseId: 'phase3-deep-learning',
      title: 'Transformers & Attention',
      content: `# Transformers & Attention

The architecture behind modern NLP.

## The Attention Mechanism

Instead of compressing sequence into fixed vector:
- Attend to all parts of input
- Weighted sum based on relevance

## Transformer Architecture

### Encoder
- Multi-head self-attention
- Feed-forward networks
- Residual connections

### Decoder
- Masked self-attention
- Encoder-decoder attention

## Key Innovations

- Positional encoding
- Self-attention (no recurrence)
- Multi-head attention
- Parallel computation

## BERT & GPT

- BERT: Encoder-only, bidirectional
- GPT: Decoder-only, autoregressive`,
      codeExamples: [
        {
          id: 'dl-ex5',
          title: 'Transformer Architecture Overview',
          code: `import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Simplified Transformer building blocks

class MultiHeadAttention(layers.Layer):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.num_heads = num_heads
        self.d_model = d_model
        assert d_model % num_heads == 0
        
        self.depth = d_model // num_heads
        self.wq = layers.Dense(d_model)
        self.wk = layers.Dense(d_model)
        self.wv = layers.Dense(d_model)
        self.dense = layers.Dense(d_model)
    
    def split_heads(self, x, batch_size):
        x = tf.reshape(x, (batch_size, -1, self.num_heads, self.depth))
        return tf.transpose(x, perm=[0, 2, 1, 3])
    
    def call(self, q, k, v, mask):
        batch_size = tf.shape(q)[0]
        
        q = self.split_heads(self.wq(q), batch_size)
        k = self.split_heads(self.wk(k), batch_size)
        v = self.split_heads(self.wv(v), batch_size)
        
        # Simplified attention (actual uses scaled dot-product)
        matmul_qk = tf.matmul(q, k, transpose_b=True)
        dk = tf.cast(tf.shape(k)[-1], tf.float32)
        scaled_attention = matmul_qk / tf.math.sqrt(dk)
        
        output = tf.matmul(scaled_attention, v)
        output = tf.transpose(output, perm=[0, 2, 1, 3])
        output = tf.reshape(output, (batch_size, -1, self.d_model))
        
        return self.dense(output)

# Test
attention = MultiHeadAttention(64, 4)
x = tf.random.uniform((2, 10, 64))  # batch, seq, features
output = attention(x, x, x, None)
print(f"Input shape: {x.shape}")
print(f"Output shape: {output.shape}")`,
          language: 'python',
          explanation: 'This implements multi-head attention from scratch. The key is splitting the embedding dimension into multiple heads for parallel attention computation.'
        }
      ],
      practiceProblems: [
        {
          id: 'dl-pp5',
          title: 'Transformer vs RNN',
          description: 'What advantage does the Transformer architecture have over RNNs for training?',
          solution: 'Transformers can parallelize computation across sequences, making training much faster',
          difficulty: 'medium'
        }
      ],
      duration: 65,
      order: 5
    }
  ],
  assessments: [
    {
      id: 'phase3-dl-assess',
      courseId: 'phase3-deep-learning',
      title: 'Deep Learning Quiz',
      type: 'quiz',
      passingScore: 70,
      duration: 35,
      questions: [
        {
          id: 'dl-q1',
          type: 'multiple_choice',
          question: 'Which activation function is most commonly used in hidden layers of deep networks?',
          options: ['Sigmoid', 'Tanh', 'ReLU', 'Softmax'],
          correctAnswer: 'ReLU',
          explanation: 'ReLU is preferred because it helps avoid vanishing gradients and is computationally efficient',
          points: 10
        },
        {
          id: 'dl-q2',
          type: 'multiple_choice',
          question: 'What type of neural network is best suited for image classification?',
          options: ['RNN', 'CNN', 'MLP', 'Transformer'],
          correctAnswer: 'CNN',
          explanation: 'Convolutional Neural Networks excel at image processing due to their ability to capture spatial patterns',
          points: 10
        },
        {
          id: 'dl-q3',
          type: 'fill_blank',
          question: 'The _____ gate in an LSTM decides what information to discard from the cell state.',
          correctAnswer: ['forget', 'forget gate'],
          explanation: 'The forget gate controls what information to throw away from the cell state',
          points: 15
        },
        {
          id: 'dl-q4',
          type: 'multiple_choice',
          question: 'What is the key innovation of Transformers over RNNs?',
          options: ['Recurrence', 'Self-attention', 'Dropout', 'Pooling'],
          correctAnswer: 'Self-attention',
          explanation: 'Self-attention allows the model to attend to all positions simultaneously, enabling parallelization',
          points: 10
        },
        {
          id: 'dl-q5',
          type: 'short_answer',
          question: 'Why might a very deep neural network fail to train properly even with ReLU?',
          correctAnswer: ['residual', 'skip connection', 'gradient', 'initialization'],
          explanation: 'Issues can include vanishing gradients, initialization problems, and optimization difficulties. Solutions include residual connections, proper initialization, and batch normalization.',
          points: 15
        }
      ]
    }
  ],
  projects: [
    {
      id: 'phase3-dl-proj1',
      courseId: 'phase3-deep-learning',
      title: 'Build an Image Classifier',
      description: 'Create a CNN to classify images from the CIFAR-10 dataset.',
      objectives: [
        'Load and preprocess CIFAR-10 data',
        'Build a CNN architecture',
        'Train the model with proper techniques',
        'Evaluate and visualize results',
        'Experiment with different architectures'
      ],
      starterCode: `# CIFAR-10 Image Classification Project
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# Load CIFAR-10
(x_train, y_train), (x_test, y_test) = keras.datasets.cifar10.load_data()

# Normalize
x_train = x_train.astype("float32") / 255.0
x_test = x_test.astype("float32") / 255.0

# Class names
class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck']

print(f"Training set: {x_train.shape}")
print(f"Test set: {x_test.shape}")

# TODO: Build a CNN model
# Start with: Conv2D → MaxPooling → Conv2D → MaxPooling → Flatten → Dense → Output

# Hints:
# - Use 32 filters in first Conv2D
# - Try ReLU activation
# - Use Dropout for regularization

# TODO: Compile and train

# TODO: Evaluate on test set`,
      expectedOutput: 'Achieve >70% accuracy on test set with proper training',
      hints: [
        'Data augmentation helps significantly',
        'Use learning rate scheduling',
        'Try batch normalization'
      ],
      rubric: [
        { criterion: 'Model Architecture', maxPoints: 25, description: 'Well-structured CNN' },
        { criterion: 'Training', maxPoints: 25, description: 'Proper training setup' },
        { criterion: 'Performance', maxPoints: 25, description: 'Achieves good accuracy' },
        { criterion: 'Analysis', maxPoints: 25, description: 'Visualization and insights' }
      ],
      estimatedHours: 12
    }
  ],
  prerequisites: ['phase2-ml-basics'],
  estimatedHours: 60,
  icon: '🧠'
};

// Learning Paths
export const learningPath: LearningPath = {
  id: 'ml-mastery-path',
  title: 'ML Mastery Path',
  description: 'Complete journey from math foundations to advanced ML',
  phases: [
    {
      number: 1,
      title: 'Mathematical Foundations',
      description: 'Linear algebra, calculus, probability, and statistics',
      courses: [mathFoundationsCourse],
      isLocked: false,
      estimatedHours: 40
    },
    {
      number: 2,
      title: 'Machine Learning Fundamentals',
      description: 'Core algorithms: regression, classification, evaluation',
      courses: [mlBasicsCourse],
      isLocked: false,
      estimatedHours: 50
    },
    {
      number: 3,
      title: 'Deep Learning',
      description: 'Neural networks, CNNs, RNNs, and Transformers',
      courses: [deepLearningCourse],
      isLocked: false,
      estimatedHours: 60
    },
    {
      number: 4,
      title: 'Advanced Topics',
      description: 'Reinforcement learning, GANs, AutoML',
      courses: [],
      isLocked: true,
      estimatedHours: 50
    },
    {
      number: 5,
      title: 'Specialized Domains',
      description: 'NLP, Computer Vision, Time Series',
      courses: [],
      isLocked: true,
      estimatedHours: 60
    },
    {
      number: 6,
      title: 'Research & Deployment',
      description: 'MLOps, model serving, ethics',
      courses: [],
      isLocked: true,
      estimatedHours: 40
    }
  ]
};

// Default user progress
export const defaultUserProgress: UserProgress = {
  overallCompletion: 0,
  totalTimeSpent: 0,
  currentPhase: 1,
  currentCourse: null,
  currentLesson: null,
  completedLessons: [],
  completedAssessments: [],
  completedProjects: [],
  assessmentScores: [],
  streak: 0,
  lastActivityDate: new Date().toISOString().split('T')[0]
};

// Default achievements
export const defaultAchievements: Achievement[] = [
  {
    id: 'first-lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    earnedAt: ''
  },
  {
    id: 'first-course',
    name: 'Course Complete',
    description: 'Complete your first course',
    icon: '📚',
    earnedAt: ''
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    earnedAt: ''
  },
  {
    id: 'math-master',
    name: 'Math Master',
    description: 'Complete all math foundations lessons',
    icon: '📐',
    earnedAt: ''
  },
  {
    id: 'deep-thinker',
    name: 'Deep Thinker',
    description: 'Complete the Deep Learning course',
    icon: '🧠',
    earnedAt: ''
  }
];
