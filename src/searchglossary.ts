import glossary from "../glossary.json";

export const searchGlossary = (query: string): string | null => {
  const normalizedQuery = query.toLowerCase().trim();

  // Step 1: Try exact term match
  const exactMatch = glossary.find(entry =>
    normalizedQuery === entry.term.toLowerCase()
  );
  if (exactMatch) return exactMatch.definition;

  // Step 2: Try partial keyword match
  const keywordMatch = glossary.find(entry =>
    normalizedQuery.includes(entry.term.toLowerCase()) ||
    entry.term.toLowerCase().includes(normalizedQuery)
  );
  if (keywordMatch) return keywordMatch.definition;

  // Step 3 (Optional): Implement fuzzy matching (Levenshtein, etc.)

  return null; // Not found — fallback to GPT
};
