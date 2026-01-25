import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Card } from "@/components/ui/card";
import { TrendingUp, BarChart3, Globe, Cpu, AlertTriangle, GraduationCap } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdoptionData {
  marketSize: {
    unit: string;
    data: Record<string, number>;
    cagr: number;
  };
  sectorAdoption: {
    k12: { name: string; adoption2020: number; adoption2023: number; adoption2024: number; adoption2026: number };
    higherEd: { name: string; adoption2020: number; adoption2023: number; adoption2024: number; adoption2026: number };
    vocational: { name: string; adoption2020: number; adoption2023: number; adoption2024: number; adoption2026: number };
    corporate: { name: string; adoption2020: number; adoption2023: number; adoption2024: number; adoption2026: number };
  };
  technologyAdoption: Record<string, { name: string; adoption2024: number }>;
  regionalData: Record<string, { name: string; adoption2024: number; cagr: number }>;
  barriers: Record<string, { name: string; prevalence: number }>;
  digitalDivide: {
    highIncome: { adoption: number };
    lowIncome: { adoption: number };
  };
  facultyReadiness: {
    positiveAttitude: number;
    adequateTraining: number;
    activeUse: number;
  };
  investment: {
    "2024": {
      totalInvestment: number;
      startups: number;
      cagr: number;
    };
  };
}

const colors = {
  primary: "#2E86AB",
  secondary: "#06A77D",
  purple: "#7B68EE",
  orange: "#F77F00",
  red: "#E74C3C",
  blue: "#3498DB",
  yellow: "#F39C12",
  teal: "#16A085",
  pink: "#E91E63",
  green: "#27AE60",
};

export function EducationAICharts() {
  const [data, setData] = useState<AdoptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/education-ai/data/adoption-data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load adoption data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 h-80 animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-muted-foreground">Failed to load chart data</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-6">
        <MarketGrowthChart data={data} />
        <SectorAdoptionChart data={data} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <TechnologyChart data={data} />
        <RegionalChart data={data} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <BarriersChart data={data} />
        <ReadinessChart data={data} />
      </div>
    </div>
  );
}

function MarketGrowthChart({ data }: { data: AdoptionData }) {
  const years = Object.keys(data.marketSize.data);
  const values = Object.values(data.marketSize.data);

  const chartData = {
    labels: years,
    datasets: [
      {
        label: "Market Size (USD Billions)",
        data: values,
        borderColor: colors.primary,
        backgroundColor: colors.primary + "30",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: colors.primary,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Market Size: $${context.parsed.y.toFixed(1)}B`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "USD Billions" },
        ticks: { callback: (value: any) => `$${value}B` },
        grid: { color: "rgba(128, 128, 128, 0.1)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <Card className="p-6" data-testid="chart-market-growth">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Market Growth (2020-2026)</h3>
          <p className="text-xs text-muted-foreground">34.1% CAGR • $2.1B → $11.5B</p>
        </div>
      </div>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}

function SectorAdoptionChart({ data }: { data: AdoptionData }) {
  const sectors = data.sectorAdoption;

  const chartData = {
    labels: ["2020", "2023", "2024", "2026 (Proj.)"],
    datasets: [
      {
        label: "K-12",
        data: [sectors.k12.adoption2020, sectors.k12.adoption2023, sectors.k12.adoption2024, sectors.k12.adoption2026],
        borderColor: colors.purple,
        backgroundColor: colors.purple + "20",
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Higher Ed",
        data: [sectors.higherEd.adoption2020, sectors.higherEd.adoption2023, sectors.higherEd.adoption2024, sectors.higherEd.adoption2026],
        borderColor: colors.orange,
        backgroundColor: colors.orange + "20",
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Vocational",
        data: [sectors.vocational.adoption2020, sectors.vocational.adoption2023, sectors.vocational.adoption2024, sectors.vocational.adoption2026],
        borderColor: colors.teal,
        backgroundColor: colors.teal + "20",
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Corporate",
        data: [sectors.corporate.adoption2020, sectors.corporate.adoption2023, sectors.corporate.adoption2024, sectors.corporate.adoption2026],
        borderColor: colors.blue,
        backgroundColor: colors.blue + "20",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const, labels: { boxWidth: 12, padding: 15 } },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 80,
        title: { display: true, text: "Adoption %" },
        ticks: { callback: (value: any) => `${value}%` },
        grid: { color: "rgba(128, 128, 128, 0.1)" },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <Card className="p-6" data-testid="chart-sector-adoption">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Sector Adoption Rates</h3>
          <p className="text-xs text-muted-foreground">All sectors trending toward 60%+ by 2026</p>
        </div>
      </div>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}

function TechnologyChart({ data }: { data: AdoptionData }) {
  const tech = data.technologyAdoption;
  const techNames = Object.values(tech).map((t) => t.name.split(" ")[0]);
  const adoptionRates = Object.values(tech).map((t) => t.adoption2024);

  const chartData = {
    labels: techNames,
    datasets: [
      {
        data: adoptionRates,
        backgroundColor: [colors.primary, colors.secondary, colors.purple, colors.orange, colors.blue, colors.pink],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" as const, labels: { boxWidth: 12, padding: 10 } },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed}%`,
        },
      },
    },
  };

  return (
    <Card className="p-6" data-testid="chart-technology">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Technology Adoption (2024)</h3>
          <p className="text-xs text-muted-foreground">GenAI leads at 60%</p>
        </div>
      </div>
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
    </Card>
  );
}

function RegionalChart({ data }: { data: AdoptionData }) {
  const regional = data.regionalData;
  const regionNames = Object.values(regional).map((r) => r.name.split(" ")[0]);
  const adoptionRates = Object.values(regional).map((r) => r.adoption2024);
  const cagrRates = Object.values(regional).map((r) => r.cagr);

  const chartData = {
    labels: regionNames,
    datasets: [
      {
        label: "Adoption 2024 (%)",
        data: adoptionRates,
        backgroundColor: colors.primary,
        borderRadius: 4,
      },
      {
        label: "CAGR (%)",
        data: cagrRates,
        backgroundColor: colors.orange,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const, labels: { boxWidth: 12, padding: 15 } },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value: any) => `${value}%` },
        grid: { color: "rgba(128, 128, 128, 0.1)" },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <Card className="p-6" data-testid="chart-regional">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Regional Adoption & Growth</h3>
          <p className="text-xs text-muted-foreground">Asia-Pacific highest CAGR (42.8%)</p>
        </div>
      </div>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
}

function BarriersChart({ data }: { data: AdoptionData }) {
  const barriers = data.barriers;
  const barrierNames = Object.values(barriers).map((b) => b.name.replace(" & ", "/").replace(" Constraints", "").replace("Inadequate ", ""));
  const prevalence = Object.values(barriers).map((b) => b.prevalence);

  const chartData = {
    labels: barrierNames,
    datasets: [
      {
        label: "Prevalence (%)",
        data: prevalence,
        backgroundColor: [colors.red, colors.orange, colors.yellow, colors.blue, colors.purple],
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Prevalence: ${context.parsed.x}%`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 80,
        ticks: { callback: (value: any) => `${value}%` },
        grid: { color: "rgba(128, 128, 128, 0.1)" },
      },
      y: { grid: { display: false } },
    },
  };

  return (
    <Card className="p-6" data-testid="chart-barriers">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-semibold">Top Adoption Barriers</h3>
          <p className="text-xs text-muted-foreground">Training (71%) is #1 barrier</p>
        </div>
      </div>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
}

function ReadinessChart({ data }: { data: AdoptionData }) {
  const readiness = data.facultyReadiness;

  const chartData = {
    labels: ["Positive Attitude", "Adequate Training", "Active Use"],
    datasets: [
      {
        label: "Faculty (%)",
        data: [readiness.positiveAttitude, readiness.adequateTraining, readiness.activeUse],
        backgroundColor: [colors.green, colors.red, colors.blue],
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (value: any) => `${value}%` },
        grid: { color: "rgba(128, 128, 128, 0.1)" },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <Card className="p-6" data-testid="chart-readiness">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Faculty Readiness Gap</h3>
          <p className="text-xs text-muted-foreground">49-point gap: 78% positive, 29% trained</p>
        </div>
      </div>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
}
