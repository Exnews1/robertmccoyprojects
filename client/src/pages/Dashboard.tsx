import { useComplianceItems } from "@/hooks/use-compliance-items";
import { useFrameworks } from "@/hooks/use-frameworks";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import { Tag } from "@/components/Tag";
import { 
  Star, 
  ArrowDown, 
  Share2, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  Filter, 
  ArrowUpDown, 
  Maximize2, 
  Download, 
  Landmark,
  ShieldAlert,
  FileCheck,
  X,
  ArrowRight,
  TriangleAlert
} from "lucide-react";

export default function Dashboard() {
  const { data: items, isLoading: itemsLoading } = useComplianceItems();
  const { data: frameworks, isLoading: frameworksLoading } = useFrameworks();

  const getFrameworkIcon = (iconName: string) => {
    switch (iconName) {
      case "landmark": return Landmark;
      case "shield-alt": return ShieldAlert;
      case "file-contract": return FileCheck;
      default: return FileText;
    }
  };

  // Helper to find framework details for an item
  const getFrameworkForItem = (frameworkId: number) => {
    return frameworks?.find(f => f.id === frameworkId);
  };

  if (itemsLoading || frameworksLoading) {
    return (
      <div className="flex h-screen bg-neutral-50 items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-neutral-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-neutral-900 to-neutral-800 px-4 md:px-8 py-8 md:py-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium mb-6 backdrop-blur-sm border border-white/10">
                    <Star className="w-3 h-3 mr-2 text-yellow-400 fill-yellow-400" />
                    Compliance Framework Analysis
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Table 2: Compliant by Design</h1>
                  <h2 className="text-xl font-medium text-neutral-400 mb-6">Strategic Advantages of Non-Predictive AI in CMGF</h2>
                  <p className="text-lg text-neutral-300 mb-8 max-w-3xl leading-relaxed">
                    This comprehensive analysis demonstrates how key federal frameworks (EO 14179, NIST AI RMF, and GAO reports) position CMGF's deliberate restraint on predictive and automated AI as a core strength—"compliant by design, non-predictive by default"—in high-impact military advising.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <button className="px-6 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-100 font-medium transition-all shadow-lg shadow-black/20 flex items-center">
                      <ArrowDown className="w-4 h-4 mr-2" />
                      View Full Table
                    </button>
                    <button className="px-6 py-3 bg-transparent border border-white/30 text-white rounded-lg hover:bg-white/10 font-medium transition-all backdrop-blur-sm flex items-center">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Analysis
                    </button>
                  </div>
                </div>
                
                <div className="hidden lg:flex w-64 h-64 bg-white/5 rounded-2xl border border-white/10 items-center justify-center backdrop-blur-md shadow-2xl">
                  <div className="text-center">
                    <ShieldCheck className="w-20 h-20 text-white/90 mx-auto mb-4 drop-shadow-lg" />
                    <p className="text-white/90 font-medium">Compliance Framework</p>
                    <div className="mt-2 w-16 h-1 bg-green-500 rounded-full mx-auto shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Metadata Section */}
          <section className="bg-white px-4 md:px-8 py-6 md:py-8 border-b border-neutral-200 shadow-sm z-10 relative">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Document Type</span>
                    <FileText className="w-4 h-4 text-neutral-400" />
                  </div>
                  <p className="text-lg font-semibold text-neutral-900">Compliance Table</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Frameworks</span>
                    <Layers className="w-4 h-4 text-neutral-400" />
                  </div>
                  <p className="text-lg font-semibold text-neutral-900">3 Primary</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Last Updated</span>
                    <Calendar className="w-4 h-4 text-neutral-400" />
                  </div>
                  <p className="text-lg font-semibold text-neutral-900">Jan 2025</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</span>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-green-600">Active</p>
                </div>
              </div>
            </div>
          </section>

          {/* Table Section */}
          <section className="px-4 md:px-8 py-8 md:py-12 bg-neutral-50 min-h-[600px]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">Detailed Framework Analysis</h2>
                  <p className="text-neutral-500">Comparing governing requirements against design choices</p>
                </div>
                
                <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0">
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
                    <Filter className="w-4 h-4 mr-2 text-neutral-400" />
                    Filter
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
                    <ArrowUpDown className="w-4 h-4 mr-2 text-neutral-400" />
                    Sort
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
                    <Maximize2 className="w-4 h-4 mr-2 text-neutral-400" />
                    Full Screen
                  </button>
                  <div className="w-px h-6 bg-neutral-300 mx-2 hidden md:block"></div>
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-neutral-900 border border-transparent rounded-lg hover:bg-neutral-800 transition-colors shadow-md">
                    <Download className="w-4 h-4 mr-2" />
                    Export Table
                  </button>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider w-1/5">
                          Governing Framework
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider w-1/4">
                          Key Requirement / Risk
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider w-1/4">
                          Non-Predictive Design Choice
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider w-1/4">
                          Strategic Advantage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {items?.map((item) => {
                        const framework = getFrameworkForItem(item.frameworkId);
                        const Icon = framework ? getFrameworkIcon(framework.icon) : FileText;

                        return (
                          <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors group">
                            {/* Column 1: Framework */}
                            <td className="px-6 py-6 align-top">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mr-4 border border-neutral-200 group-hover:border-neutral-300 transition-colors">
                                  <Icon className="w-6 h-6 text-neutral-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-neutral-900">{framework?.name}</div>
                                  <div className="text-xs text-neutral-500 mt-0.5 font-mono">({framework?.year})</div>
                                  <div className="inline-flex items-center px-2 py-1 rounded-md bg-neutral-50 text-neutral-600 border border-neutral-200 text-[10px] font-medium mt-2 uppercase tracking-wide">
                                    {framework?.description}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Column 2: Requirement */}
                            <td className="px-6 py-6 align-top">
                              <div className="text-sm text-neutral-800 leading-relaxed font-medium">
                                {item.requirement}
                              </div>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {item.tags?.map((tag, idx) => {
                                  let icon = undefined;
                                  let variant: "default" | "high-impact" | "security" = "default";
                                  
                                  if (tag.includes("High-Impact") || tag.includes("Risk")) {
                                    icon = TriangleAlert;
                                    variant = "high-impact";
                                  } else if (tag.includes("Rights") || tag.includes("Secure")) {
                                    icon = ShieldCheck;
                                    variant = "security";
                                  }
                                  
                                  return <Tag key={idx} label={tag} icon={icon} variant={variant} />;
                                })}
                              </div>
                            </td>

                            {/* Column 3: Design Choice */}
                            <td className="px-6 py-6 align-top">
                              <div className="text-sm text-neutral-700 space-y-3">
                                {item.designChoice.split("\n").map((line, idx) => (
                                  <div key={idx} className="flex items-start">
                                    {line.startsWith("-") || line.toLowerCase().includes("prohibit") ? (
                                      <X className="w-4 h-4 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <ArrowRight className="w-4 h-4 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" />
                                    )}
                                    <span>{line.replace(/^- /, "")}</span>
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Column 4: Strategic Advantage */}
                            <td className="px-6 py-6 align-top">
                              <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-4 mb-3 group-hover:bg-white group-hover:border-neutral-200 group-hover:shadow-sm transition-all">
                                <p className="text-sm text-neutral-900 font-medium leading-relaxed">
                                  {item.strategicAdvantage}
                                </p>
                              </div>
                              <div className="mt-2">
                                <StatusBadge status={item.status} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {(!items || items.length === 0) && (
                  <div className="p-12 text-center text-neutral-500">
                    <p>No compliance items found.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
