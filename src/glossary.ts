import glossary from '../glossary.json';

export type GlossaryEntry = {
  term: string;
  definition: string;
};

export function getGlossary(): GlossaryEntry[] {
  return glossary;
}

export function searchGlossary(query: string): GlossaryEntry[] {
  if (!query) return glossary;
  return glossary.filter(entry =>
    entry.term.toLowerCase().includes(query.toLowerCase()) ||
    entry.definition.toLowerCase().includes(query.toLowerCase())
  );
}

export function getDefinition(term: string): string | undefined {
  const entry = glossary.find(entry => entry.term.toLowerCase() === term.toLowerCase());
  return entry?.definition;
}
