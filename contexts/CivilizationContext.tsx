import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getRomanLabels,
  getHellenicLabels,
  getEgyptianLabels,
  getChineseLabels,
  getBabylonianLabels,
  CivLabels,
} from '../utils/civLabels';

export type Civilization = 'rome' | 'hellas' | 'aegyptus' | 'zhongguo' | 'babylonia';

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

  let labels = getBabylonianLabels();
  if (civilization === 'rome') labels = getRomanLabels();
  else if (civilization === 'hellas') labels = getHellenicLabels();
  else if (civilization === 'aegyptus') labels = getEgyptianLabels();
  else if (civilization === 'zhongguo') labels = getChineseLabels();

  return (
    <CivilizationContext.Provider value={{ civilization, setCivilization, labels }}>
      {children}
    </CivilizationContext.Provider>
  );
};

export default CivilizationContext;
