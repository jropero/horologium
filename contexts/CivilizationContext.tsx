import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getRomanLabels, getHellenicLabels, getEgyptianLabels, CivLabels } from '../utils/civLabels';

export type Civilization = 'rome' | 'hellas' | 'aegyptus';

interface CivilizationContextType {
  civilization: Civilization;
  setCivilization: (c: Civilization) => void;
  labels: CivLabels;
}

const CivilizationContext = createContext<CivilizationContextType>({
  civilization: 'rome',
  setCivilization: () => {},
  labels: getRomanLabels(),
});

export const useCivilization = () => useContext(CivilizationContext);

interface CivilizationProviderProps {
  children: ReactNode;
}

export const CivilizationProvider: React.FC<CivilizationProviderProps> = ({ children }) => {
  const [civilization, setCivilization] = useState<Civilization>(() => {
    const saved = localStorage.getItem('civilizationMode');
    return (saved as Civilization) || 'rome';
  });

  useEffect(() => {
    localStorage.setItem('civilizationMode', civilization);
  }, [civilization]);

  const labels = civilization === 'rome'
    ? getRomanLabels()
    : civilization === 'hellas'
      ? getHellenicLabels()
      : getEgyptianLabels();

  return (
    <CivilizationContext.Provider value={{ civilization, setCivilization, labels }}>
      {children}
    </CivilizationContext.Provider>
  );
};

export default CivilizationContext;
