import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface Persona {
  id: string;
  name: string;
  description: string;
  serviceProfile: string;
  color: string;
}

export const personas: Persona[] = [
  {
    id: "junior-enlisted",
    name: "Junior Enlisted Transition",
    description: "E-4 separating after first enlistment, exploring education and career options with limited civilian experience.",
    serviceProfile: "4 years service, E-4, first-term separation",
    color: "hsl(210, 70%, 50%)",
  },
  {
    id: "mid-career-nco",
    name: "Mid-Career NCO",
    description: "E-6 at 12 years considering whether to continue service or transition with strong technical skills.",
    serviceProfile: "12 years service, E-6, technical MOS, mid-career decision point",
    color: "hsl(260, 50%, 55%)",
  },
  {
    id: "senior-nco-retirement",
    name: "Senior NCO Retirement",
    description: "E-8 retiring after 20+ years with extensive leadership experience, transitioning to civilian leadership roles.",
    serviceProfile: "20+ years service, E-8, leadership transition to civilian sector",
    color: "hsl(150, 50%, 45%)",
  },
  {
    id: "officer-career-shift",
    name: "Officer Career Shift",
    description: "O-4 at 15 years exploring transition to defense industry, government service, or private sector leadership.",
    serviceProfile: "15 years service, O-4, strategic and operational experience",
    color: "hsl(30, 70%, 50%)",
  },
];

interface PersonaContextType {
  selectedPersona: Persona | null;
  setSelectedPersona: (persona: Persona | null) => void;
}

const PersonaContext = createContext<PersonaContextType>({
  selectedPersona: null,
  setSelectedPersona: () => {},
});

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [selectedPersona, setSelectedPersonaState] = useState<Persona | null>(() => {
    try {
      const stored = localStorage.getItem("cmgf-persona");
      if (stored) {
        const parsed = JSON.parse(stored);
        return personas.find((p) => p.id === parsed.id) || null;
      }
    } catch {}
    return null;
  });

  const setSelectedPersona = (persona: Persona | null) => {
    setSelectedPersonaState(persona);
    if (persona) {
      localStorage.setItem("cmgf-persona", JSON.stringify({ id: persona.id }));
    } else {
      localStorage.removeItem("cmgf-persona");
    }
  };

  return (
    <PersonaContext.Provider value={{ selectedPersona, setSelectedPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}
