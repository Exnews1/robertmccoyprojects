import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Type, RotateCcw } from "lucide-react";

export function AccessibilityControls() {
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    const stored = localStorage.getItem("accessibility-font-size");
    if (stored) {
      const size = parseInt(stored, 10);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }
  }, []);

  const handleFontSizeChange = (value: number[]) => {
    const size = value[0];
    setFontSize(size);
    localStorage.setItem("accessibility-font-size", size.toString());
    document.documentElement.style.fontSize = `${size}%`;
  };

  const handleReset = () => {
    setFontSize(100);
    localStorage.removeItem("accessibility-font-size");
    document.documentElement.style.fontSize = "100%";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          title="Accessibility Options"
          data-testid="button-accessibility"
        >
          <Type className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Text Size</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="h-7 text-xs"
              data-testid="button-reset-font-size"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
          <div className="space-y-3">
            <Slider
              value={[fontSize]}
              onValueChange={handleFontSizeChange}
              min={80}
              max={150}
              step={10}
              data-testid="slider-font-size"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller</span>
              <span className="font-mono">{fontSize}%</span>
              <span>Larger</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Adjust text size for improved readability. Changes are saved automatically.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
