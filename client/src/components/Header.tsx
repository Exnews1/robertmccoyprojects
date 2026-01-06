import { Search, FileOutput, Printer, Bell, Settings, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10 shadow-sm/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <button className="text-neutral-500 hover:text-neutral-700 md:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search frameworks, policies..." 
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm bg-neutral-50/50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all placeholder:text-neutral-400"
            />
            <Search className="absolute left-3 top-2.5 text-neutral-400 w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 shadow-sm transition-all hover:shadow-md">
            <FileOutput className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-white bg-neutral-900 border border-transparent rounded-md hover:bg-neutral-800 shadow-sm transition-all hover:shadow-md">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <div className="h-6 w-px bg-neutral-200 mx-2 hidden sm:block"></div>
          <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
