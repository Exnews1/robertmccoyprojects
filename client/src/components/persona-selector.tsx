import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, X, Check } from "lucide-react";
import { personas, usePersona } from "@/components/persona-context";

export function PersonaSelector() {
  const { selectedPersona, setSelectedPersona } = usePersona();

  return (
    <div data-testid="persona-selector">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <User className="w-4 h-4" />
          Scenario Persona
        </h3>
        {selectedPersona && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPersona(null)}
            data-testid="button-clear-persona"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {personas.map((persona) => {
          const isSelected = selectedPersona?.id === persona.id;
          return (
            <Card
              key={persona.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-primary"
                  : "hover-elevate"
              }`}
              onClick={() => setSelectedPersona(isSelected ? null : persona)}
              data-testid={`persona-card-${persona.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: persona.color }}
                    />
                    <span className="text-sm font-semibold text-foreground truncate">{persona.name}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{persona.description}</p>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {persona.serviceProfile}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function PersonaBanner() {
  const { selectedPersona } = usePersona();
  if (!selectedPersona) return null;

  return (
    <div
      className="mb-6 px-4 py-3 rounded-md border flex items-center gap-3"
      style={{
        backgroundColor: `${selectedPersona.color}10`,
        borderColor: `${selectedPersona.color}30`,
      }}
      data-testid="persona-banner"
    >
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: selectedPersona.color }}
      />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground">
          Viewing Scenario: {selectedPersona.name}
        </span>
        <span className="text-sm text-muted-foreground mx-2">—</span>
        <span className="text-sm text-muted-foreground">{selectedPersona.serviceProfile}</span>
      </div>
    </div>
  );
}
