import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cpu, Brain, Sparkles, Cog, Users, Eye, Lightbulb, Target, Network, Layers, GitBranch, Boxes, Zap, BookOpen, ChevronRight, CheckCircle, AlertTriangle, TrendingUp, Star, FlaskConical } from "lucide-react";

type TabId = "capability" | "functionality" | "learning" | "models";

const tabs: { id: TabId; label: string }[] = [
  { id: "capability", label: "By Capability" },
  { id: "functionality", label: "By Functionality" },
  { id: "learning", label: "By Learning" },
  { id: "models", label: "AI Models" },
];

export default function AITypes() {
  const [activeTab, setActiveTab] = useState<TabId>("capability");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8" data-testid="link-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Portfolio
        </Link>

        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Types of Artificial Intelligence</h1>
          <p className="text-xl text-muted-foreground">Understanding the spectrum of AI capabilities and applications</p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="px-6"
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "capability" && <CapabilityTab />}
        {activeTab === "functionality" && <FunctionalityTab />}
        {activeTab === "learning" && <LearningTab />}
        {activeTab === "models" && <ModelsTab />}

        <footer className="text-center text-sm text-muted-foreground pt-12 border-t mt-12">
          <p>Educational resource on AI types and classifications | Last updated: January 2026</p>
        </footer>
      </div>
    </div>
  );
}

function CapabilityTab() {
  return (
    <div className="grid md:grid-cols-3 gap-6" data-testid="tab-content-capability">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Narrow AI (ANI)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">Also known as Weak AI, designed for specific tasks with defined parameters.</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <p><strong>Examples:</strong> Virtual assistants (Siri, Alexa), recommendation systems, facial recognition</p>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p><strong>Usage:</strong> Most current AI applications (95%+)</p>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <p><strong>Strengths:</strong> Highly efficient, reliable, cost-effective for specific tasks</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p><strong>Weaknesses:</strong> Cannot generalize beyond training, lacks adaptability</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>General AI (AGI)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">Theoretical AI with human-like cognitive abilities across diverse tasks.</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <FlaskConical className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p><strong>Status:</strong> Research phase, not yet achieved</p>
            </div>
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p><strong>Goal:</strong> Match human reasoning, learning, and problem-solving</p>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <p><strong>Potential:</strong> Adaptable across any cognitive task</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p><strong>Challenges:</strong> Consciousness understanding, ethical considerations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Super AI (ASI)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">Hypothetical AI surpassing human intelligence in all domains.</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <p><strong>Concept:</strong> Exceeds human cognitive abilities entirely</p>
            </div>
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p><strong>Capabilities:</strong> Self-improvement, complex problem-solving beyond human comprehension</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p><strong>Concerns:</strong> Existential risk discussions, control problem</p>
            </div>
            <div className="flex items-start gap-2">
              <FlaskConical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p><strong>Timeline:</strong> Distant future, theoretical only</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FunctionalityTab() {
  return (
    <div className="space-y-6" data-testid="tab-content-functionality">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Cog className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardTitle>Reactive Machines</CardTitle>
                <Badge variant="secondary" className="mt-1">Current Technology</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">Basic AI that responds to specific inputs with predetermined outputs. No memory or learning from past experiences.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Cog className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <p><strong>Characteristics:</strong> No memory, instant responses only</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <p><strong>Example:</strong> IBM's Deep Blue, spam filters, basic chatbots</p>
              </div>
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <p><strong>Use Case:</strong> Chess, rule-based decision systems</p>
              </div>
              <div className="flex items-start gap-2">
                <Star className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <p><strong>Strength:</strong> Predictable, fast, reliable</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Layers className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <CardTitle>Limited Memory AI</CardTitle>
                <Badge variant="secondary" className="mt-1">Current Technology</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">Uses historical data to make informed decisions, but memory is temporary and task-specific.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Cog className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <p><strong>Characteristics:</strong> Short-term memory for decision-making</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <p><strong>Example:</strong> Self-driving cars, chatbots, virtual assistants</p>
              </div>
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <p><strong>Use Case:</strong> Autonomous vehicles, recommendation systems</p>
              </div>
              <div className="flex items-start gap-2">
                <Star className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <p><strong>Strength:</strong> Most common type in current AI applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <CardTitle>Theory of Mind AI</CardTitle>
                <Badge variant="outline" className="mt-1">Research Phase</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">Advanced AI that understands emotions, beliefs, and social interactions of humans and other entities.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Cog className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <p><strong>Characteristics:</strong> Emotional intelligence, social awareness</p>
              </div>
              <div className="flex items-start gap-2">
                <FlaskConical className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <p><strong>Status:</strong> Active research and development phase</p>
              </div>
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <p><strong>Potential Use:</strong> Advanced healthcare, education, customer service</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p><strong>Challenge:</strong> Understanding complex human emotions and intentions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <CardTitle>Self-Aware AI</CardTitle>
                <Badge variant="outline" className="mt-1">Theoretical</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">Theoretical AI with consciousness, self-awareness, and subjective experience.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Cog className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p><strong>Characteristics:</strong> Consciousness, desires, understanding of self</p>
              </div>
              <div className="flex items-start gap-2">
                <FlaskConical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p><strong>Status:</strong> Purely theoretical concept</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p><strong>Implications:</strong> Ethical considerations, rights and responsibilities</p>
              </div>
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <p><strong>Philosophy:</strong> Related to consciousness debates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-bold mb-4">Functionality Comparison</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-medium">Type</th>
                  <th className="text-left py-2 pr-4 font-medium">Memory</th>
                  <th className="text-left py-2 pr-4 font-medium">Learning</th>
                  <th className="text-left py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-foreground">Reactive</td>
                  <td className="py-2 pr-4">None</td>
                  <td className="py-2 pr-4">None</td>
                  <td className="py-2"><Badge variant="secondary">Exists</Badge></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-foreground">Limited Memory</td>
                  <td className="py-2 pr-4">Short-term</td>
                  <td className="py-2 pr-4">From recent data</td>
                  <td className="py-2"><Badge variant="secondary">Exists</Badge></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-foreground">Theory of Mind</td>
                  <td className="py-2 pr-4">Contextual</td>
                  <td className="py-2 pr-4">Social learning</td>
                  <td className="py-2"><Badge variant="outline">Research</Badge></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-foreground">Self-Aware</td>
                  <td className="py-2 pr-4">Full consciousness</td>
                  <td className="py-2 pr-4">Self-directed</td>
                  <td className="py-2"><Badge variant="outline">Theoretical</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LearningTab() {
  return (
    <div className="space-y-6" data-testid="tab-content-learning">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle className="text-lg">Supervised Learning</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">Learning from labeled datasets with known inputs and outputs.</p>
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Key Algorithms:</h5>
              <div className="flex flex-wrap gap-1">
                {["Linear Regression", "Decision Trees", "Random Forest", "SVM", "Neural Networks", "KNN"].map((algo) => (
                  <Badge key={algo} variant="secondary" className="text-xs">{algo}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground"><strong>Use Cases:</strong></p>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                <li>Image classification</li>
                <li>Spam detection</li>
                <li>Credit scoring</li>
                <li>Medical diagnosis</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Network className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle className="text-lg">Unsupervised Learning</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">Finding patterns in unlabeled data without predefined outcomes.</p>
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Key Algorithms:</h5>
              <div className="flex flex-wrap gap-1">
                {["K-Means", "Hierarchical", "DBSCAN", "PCA", "Autoencoders", "GMM"].map((algo) => (
                  <Badge key={algo} variant="secondary" className="text-xs">{algo}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground"><strong>Use Cases:</strong></p>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                <li>Customer segmentation</li>
                <li>Anomaly detection</li>
                <li>Recommendation systems</li>
                <li>Data compression</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle className="text-lg">Reinforcement Learning</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">Learning through trial and error with rewards and penalties.</p>
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Key Algorithms:</h5>
              <div className="flex flex-wrap gap-1">
                {["Q-Learning", "DQN", "Policy Gradient", "A3C", "PPO", "SAC"].map((algo) => (
                  <Badge key={algo} variant="secondary" className="text-xs">{algo}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground"><strong>Use Cases:</strong></p>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                <li>Game AI (AlphaGo)</li>
                <li>Robotics</li>
                <li>Autonomous vehicles</li>
                <li>Trading systems</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <GitBranch className="h-6 w-6 text-orange-500" />
              </div>
              <CardTitle className="text-lg">Semi-Supervised Learning</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">Combines labeled and unlabeled data for better learning efficiency.</p>
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Key Techniques:</h5>
              <div className="flex flex-wrap gap-1">
                {["Self-Training", "Co-Training", "Label Propagation", "Graph-Based"].map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground"><strong>Use Cases:</strong></p>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                <li>Text classification</li>
                <li>Speech recognition</li>
                <li>Content moderation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-teal-500" />
              </div>
              <CardTitle className="text-lg">Transfer Learning</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">Applying knowledge from one task to improve learning on another.</p>
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Key Approaches:</h5>
              <div className="flex flex-wrap gap-1">
                {["Fine-tuning", "Feature Extraction", "Domain Adaptation"].map((approach) => (
                  <Badge key={approach} variant="secondary" className="text-xs">{approach}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground"><strong>Popular Models:</strong></p>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                <li>BERT, GPT (NLP)</li>
                <li>ResNet, VGG (Vision)</li>
                <li>CLIP (Multi-modal)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ModelsTab() {
  const modelCategories = [
    {
      title: "Neural Networks",
      color: "blue",
      models: [
        { name: "CNN", desc: "Convolutional Neural Networks", use: "Image processing, computer vision" },
        { name: "RNN", desc: "Recurrent Neural Networks", use: "Sequential data, time series" },
        { name: "LSTM", desc: "Long Short-Term Memory", use: "Text generation, speech recognition" },
        { name: "GRU", desc: "Gated Recurrent Unit", use: "Sequence modeling, NLP" },
      ]
    },
    {
      title: "Transformers",
      color: "purple",
      models: [
        { name: "BERT", desc: "Bidirectional Encoder", use: "Text understanding, Q&A" },
        { name: "GPT", desc: "Generative Pre-trained", use: "Text generation, chatbots" },
        { name: "T5", desc: "Text-to-Text Transfer", use: "Translation, summarization" },
        { name: "ViT", desc: "Vision Transformer", use: "Image classification" },
      ]
    },
    {
      title: "Generative Models",
      color: "green",
      models: [
        { name: "GAN", desc: "Generative Adversarial Networks", use: "Image generation, style transfer" },
        { name: "VAE", desc: "Variational Autoencoders", use: "Data generation, anomaly detection" },
        { name: "Diffusion", desc: "Diffusion Models", use: "High-quality image generation" },
      ]
    },
    {
      title: "Specialized Models",
      color: "amber",
      models: [
        { name: "GNN", desc: "Graph Neural Networks", use: "Social networks, molecules" },
        { name: "Autoencoder", desc: "Encoder-Decoder Networks", use: "Compression, denoising" },
        { name: "Ensemble", desc: "Multiple Model Combination", use: "Improving accuracy" },
      ]
    },
  ];

  return (
    <div className="space-y-6" data-testid="tab-content-models">
      <div className="grid md:grid-cols-2 gap-6">
        {modelCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes className="h-5 w-5 text-primary" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.models.map((model) => (
                  <div key={model.name} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm">{model.name}</span>
                      <span className="text-xs text-muted-foreground">- {model.desc}</span>
                    </div>
                    <p className="text-xs text-muted-foreground"><strong>Use:</strong> {model.use}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Quick Model Selection Guide
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h5 className="font-bold text-sm mb-2">For Image Tasks:</h5>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Classification: CNN (ResNet, EfficientNet)</li>
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Generation: GAN, Diffusion Models</li>
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Segmentation: U-Net, Mask R-CNN</li>
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Object Detection: YOLO, Faster R-CNN</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-2">For Text Tasks:</h5>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Understanding: BERT, RoBERTa</li>
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Generation: GPT, T5</li>
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Translation: Transformer, MarianMT</li>
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Sentiment: LSTM, BERT</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-2">For Structured Data:</h5>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Tabular: XGBoost, Random Forest</li>
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Time Series: LSTM, Prophet</li>
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Anomaly: Isolation Forest, Autoencoder</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-2">For Special Cases:</h5>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Graphs: GNN, GraphSAGE</li>
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Reinforcement: DQN, PPO</li>
                <li className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> Few-Shot: MAML, Prototypical Networks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
