import React from 'react';
import type { GlossedTerm as Term } from '../utils/civLabels';

interface GlossedTermProps {
  term: Term;
  /** Classes for the Akkadian original (the prominent part). */
  className?: string;
  /** Classes for the Spanish gloss (always text-xs, the smaller part). */
  glossClassName?: string;
  align?: 'center' | 'start';
}

// Akkadian term on top, its Spanish gloss below in a smaller, lighter italic.
const GlossedTerm: React.FC<GlossedTermProps> = ({ term, className = '', glossClassName = '', align = 'center' }) => (
  <span className={`inline-flex flex-col leading-tight ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
    <span className={className}>{term.akk}</span>
    <span className={`text-xs font-serif italic normal-case tracking-normal font-normal opacity-70 ${glossClassName}`}>{term.es}</span>
  </span>
);

export default GlossedTerm;
