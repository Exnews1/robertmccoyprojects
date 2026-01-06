import { Link, useLocation } from "wouter";
import { 
  ShieldCheck, 
  Home, 
  Table, 
  FileText, 
  MoveRight, 
  PenTool, 
  BookOpen, 
  Landmark, 
  ShieldAlert, 
  FileCheck, 
  Download, 
  SpellCheck, 
  HelpCircle, 
  MoreVertical 
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const navItemClass = (path: string) => `
    flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200
    ${location === path || (path !== "/" && location.startsWith(path)) 
      ? "bg-neutral-900 text-white font-medium shadow-sm" 
      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"}
  `;

  return (
    <div className="w-64 bg-white border-r border-neutral-200 flex flex-col h-full sticky top-0">
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center shadow-sm">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-neutral-900 leading-tight">CMGF Compliance</h1>
            <p className="text-xs text-neutral-500">Framework Analysis</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        <div className="mb-6">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-2">Navigation</div>
          <nav className="space-y-1">
            <Link href="/" className={navItemClass("/")}>
              <Home className="w-4 h-4 mr-3 opacity-70" />
              Overview
            </Link>
            <Link href="/table" className={navItemClass("/table")}>
              <Table className="w-4 h-4 mr-3 opacity-70" />
              Compliance Table
            </Link>
            <button className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors">
              <FileText className="w-4 h-4 mr-3 text-neutral-500" />
              Framework Details
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors">
              <MoveRight className="w-4 h-4 mr-3 text-neutral-500" />
              Strategic Advantages
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors">
              <PenTool className="w-4 h-4 mr-3 text-neutral-500" />
              Design Principles
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors">
              <BookOpen className="w-4 h-4 mr-3 text-neutral-500" />
              References
            </button>
          </nav>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-2">Frameworks</div>
          <nav className="space-y-1">
            <button className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors">
              <Landmark className="w-4 h-4 mr-3 text-neutral-500" />
              EO 14110 (2023)
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors">
              <ShieldAlert className="w-4 h-4 mr-3 text-neutral-500" />
              NIST AI RMF 1.0
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors">
              <FileCheck className="w-4 h-4 mr-3 text-neutral-500" />
              GAO Reports
            </button>
          </nav>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-2">Resources</div>
          <nav className="space-y-1">
            <button className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors">
              <Download className="w-4 h-4 mr-3 text-neutral-500" />
              Downloads
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors">
              <SpellCheck className="w-4 h-4 mr-3 text-neutral-500" />
              Glossary
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors">
              <HelpCircle className="w-4 h-4 mr-3 text-neutral-500" />
              Help Center
            </button>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-200 bg-neutral-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center border border-neutral-300 overflow-hidden">
             {/* Avatar placeholder */}
             <span className="text-xs font-bold text-neutral-600">PA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">Policy Analyst</p>
            <p className="text-xs text-neutral-500 truncate">admin@cmgf.mil</p>
          </div>
          <button className="text-neutral-500 hover:text-neutral-700 p-1 rounded-md hover:bg-neutral-100">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
