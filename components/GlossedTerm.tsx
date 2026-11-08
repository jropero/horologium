import React from 'react';
import type { GlossedTerm as Term } from '../utils/civLabels';
import './GlossedTerm.css';

interface GlossedTermProps {
  term: Term;
  /** Classes for the Akkadian original (the prominent part). */
  className?: string;
  /** Classes for the Spanish gloss (always text-xs, the smaller part). */
  glossClassName?: string;
  align?: 'center' | 'start';
}

// Akkadian term on top, its Spanish gloss below in a smaller, lighter italic.
const GlossedTerm: React.FC<GlossedTermProps> = ({
  term,
  className = '',
  glossClassName = '',
  align = 'center',
}) => (
  <span className={`glossed-term ${align === 'center' ? 'align-center' : 'align-start'}`}>
    <span className={className}>{term.akk}</span>
    <span className={`glossed-term-gloss ${glossClassName}`}>{term.es}</span>
  </span>
);

export default GlossedTerm;
