import Array "mo:core/Array";
import Text "mo:core/Text";

module {
  public type EvidenceClass = {
    #Established;
    #Model;
    #Doctrine;
  };

  public type Symbol = {
    id : Text;
    display : Text;
    transliteration : Text;
    language : Text;
    category : Text;
    meaning : Text;
    operator : Text;
    evidenceClass : EvidenceClass;
    source : Text;
    version : Text;
  };

  public type CompiledSymbol = {
    symbol : Symbol;
    expression : Text;
  };

  let symbols : [Symbol] = [
    {
      id = "ORIGO";
      display = "origo";
      transliteration = "origo";
      language = "Latin";
      category = "foundation";
      meaning = "origin, reference point, or coordinate frame";
      operator = "anchor";
      evidenceClass = #Established;
      source = "Latin logical vocabulary";
      version = "v1";
    },
    {
      id = "RATIO";
      display = "ratio";
      transliteration = "ratio";
      language = "Latin";
      category = "logic";
      meaning = "reason, relation, or ordered account";
      operator = "relate";
      evidenceClass = #Established;
      source = "Aristotelian and Latin logical tradition";
      version = "v1";
    },
    {
      id = "MEMORIA";
      display = "memoria";
      transliteration = "memoria";
      language = "Latin";
      category = "memory";
      meaning = "persistent trace carried across a workspace";
      operator = "retain";
      evidenceClass = #Model;
      source = "Neurospace memory architecture";
      version = "v1";
    },
    {
      id = "REGISTRUM";
      display = "registrum";
      transliteration = "registrum";
      language = "Latin";
      category = "memory";
      meaning = "addressable record with provenance";
      operator = "register";
      evidenceClass = #Model;
      source = "KILN receipt and repository lineage model";
      version = "v1";
    },
    {
      id = "SUTRA";
      display = "सूत्र";
      transliteration = "sūtra";
      language = "Sanskrit";
      category = "rule";
      meaning = "compact rule or connective thread";
      operator = "compose";
      evidenceClass = #Established;
      source = "Pāṇinian rule tradition";
      version = "v1";
    },
    {
      id = "SAMJNA";
      display = "संज्ञा";
      transliteration = "saṃjñā";
      language = "Sanskrit";
      category = "symbol";
      meaning = "technical designation that makes a class addressable";
      operator = "name";
      evidenceClass = #Established;
      source = "Pāṇinian technical terminology";
      version = "v1";
    },
    {
      id = "PARIBHASHA";
      display = "परिभाषा";
      transliteration = "paribhāṣā";
      language = "Sanskrit";
      category = "meta-rule";
      meaning = "rule governing how rules are interpreted";
      operator = "scope";
      evidenceClass = #Established;
      source = "Pāṇinian meta-rule tradition";
      version = "v1";
    },
    {
      id = "PRAMANA";
      display = "प्रमाण";
      transliteration = "pramāṇa";
      language = "Sanskrit";
      category = "evidence";
      meaning = "valid means of knowledge or warrant";
      operator = "warrant";
      evidenceClass = #Established;
      source = "Nyāya epistemology";
      version = "v1";
    },
    {
      id = "SMRTI";
      display = "स्मृति";
      transliteration = "smṛti";
      language = "Sanskrit";
      category = "memory";
      meaning = "recollection or retained trace";
      operator = "recall";
      evidenceClass = #Model;
      source = "Neurospace memory architecture";
      version = "v1";
    }
  ];

  public func evidenceLabel(evidenceClass : EvidenceClass) : Text {
    switch (evidenceClass) {
      case (#Established) { "established" };
      case (#Model) { "model" };
      case (#Doctrine) { "doctrine" };
    };
  };

  public func list() : [Symbol] {
    symbols;
  };

  public func get(id : Text) : ?Symbol {
    Array.find<Symbol>(symbols, func(symbol) { symbol.id == id });
  };

  public func compile(id : Text, args : [Text]) : ?CompiledSymbol {
    switch (get(id)) {
      case (null) { null };
      case (?symbol) {
        let suffix = if (args.size() == 0) { "" } else { "(" # Text.join(", ", args.values()) # ")" };
        ?{
          symbol;
          expression = symbol.operator # ":" # symbol.id # suffix;
        };
      };
    };
  };
};
