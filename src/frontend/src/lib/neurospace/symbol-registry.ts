export type EvidenceClass = "established" | "model" | "doctrine";

export type SymbolRecord = {
  id: string;
  display: string;
  transliteration: string;
  language: "Latin" | "Sanskrit" | "Greek" | "Universal";
  category: "logic" | "governance" | "memory" | "knowledge" | "runtime";
  meaning: string;
  operator: string;
  typeSignature: string;
  evidenceClass: EvidenceClass;
  source: string;
  version: string;
};

export type ClaimRecord = {
  id: string;
  statement: string;
  evidenceClass: EvidenceClass;
  evidenceRoute: "pratyaksa" | "anumana" | "upamana" | "sabda";
  sources: string[];
  testId?: string;
};

export const SYMBOLS: readonly SymbolRecord[] = [
  {
    id: "ORIGO",
    display: "ORIGO",
    transliteration: "origo",
    language: "Latin",
    category: "runtime",
    meaning: "origin, build, and initialization",
    operator: "build",
    typeSignature: "(Input, Context) -> Artifact",
    evidenceClass: "doctrine",
    source: "Medina Protocol Charter",
    version: "1.0.0"
  },
  {
    id: "RATIO",
    display: "RATIO",
    transliteration: "ratio",
    language: "Latin",
    category: "logic",
    meaning: "reasoning, relation, and route selection",
    operator: "infer",
    typeSignature: "(Premises, Evidence) -> Proposition",
    evidenceClass: "model",
    source: "Medina Protocol Charter",
    version: "1.0.0"
  },
  {
    id: "MEMORIA",
    display: "MEMORIA",
    transliteration: "memoria",
    language: "Latin",
    category: "memory",
    meaning: "durable memory and consequence lineage",
    operator: "remember",
    typeSignature: "(Event, Lineage) -> Trace",
    evidenceClass: "doctrine",
    source: "Medina Protocol Charter",
    version: "1.0.0"
  },
  {
    id: "REGISTRUM",
    display: "REGISTRUM",
    transliteration: "registrum",
    language: "Latin",
    category: "governance",
    meaning: "canonical record and provenance",
    operator: "record",
    typeSignature: "(Artifact, Digest) -> Receipt",
    evidenceClass: "model",
    source: "KILN provenance design",
    version: "1.0.0"
  },
  {
    id: "SUTRA",
    display: "सूत्र",
    transliteration: "sutra",
    language: "Sanskrit",
    category: "logic",
    meaning: "compact rule or generative instruction",
    operator: "applyRule",
    typeSignature: "(State, Rule) -> State",
    evidenceClass: "model",
    source: "Paninian grammatical tradition",
    version: "1.0.0"
  },
  {
    id: "SAMJNA",
    display: "संज्ञा",
    transliteration: "samjna",
    language: "Sanskrit",
    category: "logic",
    meaning: "technical definition or naming rule",
    operator: "define",
    typeSignature: "(Name, Domain) -> Type",
    evidenceClass: "model",
    source: "Paninian grammatical tradition",
    version: "1.0.0"
  },
  {
    id: "PARIBHASHA",
    display: "परिभाषा",
    transliteration: "paribhasha",
    language: "Sanskrit",
    category: "logic",
    meaning: "interpretive meta-rule and precedence rule",
    operator: "interpret",
    typeSignature: "(RuleSet, Context) -> RuleSet",
    evidenceClass: "model",
    source: "Paninian grammatical tradition",
    version: "1.0.0"
  },
  {
    id: "PRAMANA",
    display: "प्रमाण",
    transliteration: "pramana",
    language: "Sanskrit",
    category: "knowledge",
    meaning: "means or route of justified knowledge",
    operator: "qualifyEvidence",
    typeSignature: "(Observation, Route) -> Evidence",
    evidenceClass: "model",
    source: "Nyaya epistemology",
    version: "1.0.0"
  },
  {
    id: "SMRTI",
    display: "स्मृति",
    transliteration: "smrti",
    language: "Sanskrit",
    category: "memory",
    meaning: "remembered trace",
    operator: "consolidate",
    typeSignature: "(Episode, Similarity) -> SemanticTrace",
    evidenceClass: "model",
    source: "Nyaya and NeurospaceAI memory design",
    version: "1.0.0"
  }
];

export const CLAIMS: readonly ClaimRecord[] = [
  {
    id: "claim-panini-rule-system",
    statement: "Paninian grammar provides a compact rule system with explicit definitions, scope, and rule interaction.",
    evidenceClass: "established",
    evidenceRoute: "sabda",
    sources: [
      "https://academic.oup.com/edited-volume/28195/chapter-abstract/213132317"
    ]
  },
  {
    id: "claim-active-inference-model",
    statement: "Active inference is a model of perception, learning, attention, and action under uncertainty.",
    evidenceClass: "model",
    evidenceRoute: "sabda",
    sources: [
      "https://doi.org/10.1038/nrn2787",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC3491875/"
    ]
  },
  {
    id: "claim-doctrine-phi",
    statement: "PHI-derived thresholds are NeurospaceAI design doctrine unless independently justified for a specific experiment.",
    evidenceClass: "doctrine",
    evidenceRoute: "sabda",
    sources: [
      "https://github.com/ItsNotAILABS/Neurospaceai/blob/main/src/backend/sovereign_laws.mo"
    ],
    testId: "physics-doctrine-separation"
  }
];

const BY_ID = new Map(SYMBOLS.map((symbol) => [symbol.id, symbol]));

export function getSymbol(id: string): SymbolRecord | undefined {
  return BY_ID.get(id.trim().toUpperCase());
}

export function compileSymbol(id: string, args: readonly string[] = []): {
  symbol: SymbolRecord;
  expression: string;
} {
  const symbol = getSymbol(id);
  if (!symbol) {
    throw new Error("Unknown NeurospaceAI symbol: " + id);
  }

  const expression = symbol.operator + "(" + args.join(", ") + ")";
  return { symbol, expression };
}

export function claimsForEvidenceClass(evidenceClass: EvidenceClass): readonly ClaimRecord[] {
  return CLAIMS.filter((claim) => claim.evidenceClass === evidenceClass);
}
