const SUBJECTS = {
  biology: { name: "Biology", description: "The study of living things — from cells to ecosystems." },
  chemistry: { name: "Chemistry", description: "The study of matter, bonding, reactions, and change." },
  physics: { name: "Physics", description: "The study of motion, forces, energy, waves, and the universe." }
};

const LESSONS = [
  {
    id: "cell-membrane-structure",
    subject: "biology",
    topic: "cell-biology",
    type: "video",
    title: "Cell membrane structure",
    summary: "An overview of the phospholipid bilayer, membrane proteins, and selective permeability.",
    // These two are the actual content slots a lesson page fills in.
    // Leave either as null and the lesson page shows an honest
    // "coming soon" placeholder in that spot instead of hiding it.
    videoId: null,        // set to a YouTube video ID (e.g. "dQw4w9WgXcQ") once recorded
    writtenContent: null, // set to a paragraph (or a few) of written explanation once drafted
    comingSoon: false,    // false because the quiz below already works — video/writing can lag behind
    concepts: ["membrane-structure", "phospholipid-bilayer", "selective-permeability", "membrane-transport"],
    quiz: [
      {
        question: "What forms the main structure of the cell membrane?",
        concepts: ["membrane-structure", "phospholipid-bilayer"],
        options: [
          {
            id: "a",
            text: "A protein monolayer",
            misconception: "This mixes up the membrane's structural framework with membrane proteins \u2014 proteins sit within the bilayer, but they don't form it."
          },
          { id: "b", text: "A phospholipid bilayer" },
          {
            id: "c",
            text: "A cellulose wall",
            misconception: "This describes a plant cell wall, not the cell membrane \u2014 the membrane itself isn't a rigid cellulose structure."
          }
        ],
        answer: "b"
      },
      {
        question: "What does selectively permeable mean?",
        concepts: ["selective-permeability", "membrane-transport"],
        options: [
          { id: "a", text: "Only certain substances can pass through" },
          {
            id: "b",
            text: "Nothing can pass through",
            misconception: "This treats the membrane like a solid, sealed barrier \u2014 but it's selectively permeable, meaning some things do get through."
          },
          {
            id: "c",
            text: "Everything passes freely",
            misconception: "This describes a fully open membrane \u2014 real cell membranes actively control and restrict what crosses them."
          }
        ],
        answer: "a"
      }
    ]
  },

  // ===== Cell Biology (remaining subtopics) =====
  { id: "organelles-functions", subject: "biology", topic: "cell-biology", type: "video", title: "Organelles and their functions", comingSoon: true },
  { id: "cell-division-cycle", subject: "biology", topic: "cell-biology", type: "video", title: "Cell division & the cell cycle", comingSoon: true },

  // ===== Genetics =====
  { id: "mendelian-inheritance", subject: "biology", topic: "genetics", type: "video", title: "Mendelian inheritance", comingSoon: true },
  { id: "meiosis-gametes", subject: "biology", topic: "genetics", type: "video", title: "Meiosis & gamete formation", comingSoon: true },
  { id: "non-mendelian-inheritance", subject: "biology", topic: "genetics", type: "video", title: "Non-Mendelian inheritance patterns", comingSoon: true },

  // ===== Molecular Biology =====
  { id: "dna-replication", subject: "biology", topic: "molecular-biology", type: "video", title: "DNA structure & replication", comingSoon: true,
    concepts: ["dna-replication", "base-pairing", "semi-conservative-replication"] },
  { id: "transcription-translation", subject: "biology", topic: "molecular-biology", type: "video", title: "Transcription & translation", comingSoon: true },
  { id: "mutations-gene-regulation", subject: "biology", topic: "molecular-biology", type: "video", title: "Mutations & gene regulation", comingSoon: true },

  // ===== Immunology =====
  { id: "innate-vs-adaptive-immunity", subject: "biology", topic: "immunology", type: "video", title: "Innate vs. adaptive immunity", comingSoon: true },
  { id: "b-t-cell-development", subject: "biology", topic: "immunology", type: "video", title: "B cell and T cell development", comingSoon: true },
  { id: "macrophages-immune-cells", subject: "biology", topic: "immunology", type: "video", title: "Macrophages and other immune cells", comingSoon: true },
  { id: "antibodies-vaccines", subject: "biology", topic: "immunology", type: "video", title: "Antibodies and vaccines", comingSoon: true },

  // ===== Microbiology =====
  { id: "bacteria-vs-viruses", subject: "biology", topic: "microbiology", type: "video", title: "Bacteria vs. viruses", comingSoon: true },
  { id: "how-antibiotics-work", subject: "biology", topic: "microbiology", type: "video", title: "How antibiotics work", comingSoon: true },
  { id: "microbiomes", subject: "biology", topic: "microbiology", type: "video", title: "Microbiomes", comingSoon: true },

  // ===== Evolution =====
  { id: "evidence-for-evolution", subject: "biology", topic: "evolution", type: "video", title: "Evidence for evolution", comingSoon: true },
  { id: "natural-selection-mechanisms", subject: "biology", topic: "evolution", type: "video", title: "Natural selection mechanisms", comingSoon: true },
  { id: "speciation", subject: "biology", topic: "evolution", type: "video", title: "Speciation", comingSoon: true },

  // ===== Ecology =====
  { id: "population-dynamics", subject: "biology", topic: "ecology", type: "video", title: "Population dynamics", comingSoon: true },
  { id: "food-webs-energy-flow", subject: "biology", topic: "ecology", type: "video", title: "Food webs & energy flow", comingSoon: true },
  { id: "ecosystems-biomes", subject: "biology", topic: "ecology", type: "video", title: "Ecosystems & biomes", comingSoon: true },

  // ===== Chemistry: General Chemistry =====
  { id: "periodic-table", subject: "chemistry", topic: "general-chemistry", type: "video", title: "Atomic structure & the periodic table", comingSoon: true,
    concepts: ["periodic-table", "elements", "atomic-structure"] },
  { id: "chemical-bonding", subject: "chemistry", topic: "general-chemistry", type: "video", title: "Chemical bonding (ionic, covalent, metallic)", comingSoon: true },
  { id: "mole-stoichiometry", subject: "chemistry", topic: "general-chemistry", type: "video", title: "The mole & stoichiometry", comingSoon: true },

  // ===== Chemistry: Chemical Reactions =====
  { id: "balancing-equations", subject: "chemistry", topic: "chemical-reactions", type: "practice", title: "Balancing chemical equations", comingSoon: true,
    concepts: ["chemical-equations", "stoichiometry", "conservation-of-mass"] },
  { id: "reaction-types", subject: "chemistry", topic: "chemical-reactions", type: "video", title: "Types of reactions", comingSoon: true },
  { id: "rates-equilibrium", subject: "chemistry", topic: "chemical-reactions", type: "video", title: "Reaction rates & equilibrium", comingSoon: true },

  // ===== Chemistry: Acids, Bases & Solutions =====
  { id: "acids-bases", subject: "chemistry", topic: "acids-bases-solutions", type: "video", title: "Acids and bases (the pH scale)", comingSoon: true },
  { id: "solutions-concentration", subject: "chemistry", topic: "acids-bases-solutions", type: "video", title: "Solutions & concentration", comingSoon: true },
  { id: "titrations", subject: "chemistry", topic: "acids-bases-solutions", type: "video", title: "Titrations", comingSoon: true },

  // ===== Chemistry: Thermochemistry =====
  { id: "energy-in-reactions", subject: "chemistry", topic: "thermochemistry", type: "video", title: "Energy in reactions", comingSoon: true },
  { id: "enthalpy-entropy", subject: "chemistry", topic: "thermochemistry", type: "video", title: "Enthalpy & entropy", comingSoon: true },

  // ===== Chemistry: Organic Chemistry =====
  { id: "intro-carbon-chemistry", subject: "chemistry", topic: "organic-chemistry", type: "video", title: "Introduction to carbon chemistry", comingSoon: true },
  { id: "functional-groups", subject: "chemistry", topic: "organic-chemistry", type: "video", title: "Functional groups", comingSoon: true },
  { id: "naming-organic-compounds", subject: "chemistry", topic: "organic-chemistry", type: "video", title: "Naming organic compounds", comingSoon: true },

  // ===== Physics: Mechanics =====
  { id: "kinematics", subject: "physics", topic: "mechanics", type: "video", title: "Kinematics (motion)", comingSoon: true,
    concepts: ["motion", "velocity", "acceleration"] },
  { id: "newtons-laws", subject: "physics", topic: "mechanics", type: "quiz", title: "Newton's laws", comingSoon: true,
    concepts: ["forces", "newtons-laws", "inertia"] },
  { id: "energy-and-work", subject: "physics", topic: "mechanics", type: "video", title: "Energy & work", comingSoon: true },
  { id: "momentum-collisions", subject: "physics", topic: "mechanics", type: "video", title: "Momentum & collisions", comingSoon: true },

  // ===== Physics: Waves & Sound =====
  { id: "wave-properties", subject: "physics", topic: "waves-sound", type: "video", title: "Wave properties", comingSoon: true },
  { id: "sound-waves", subject: "physics", topic: "waves-sound", type: "video", title: "Sound waves", comingSoon: true },

  // ===== Physics: Electricity & Magnetism =====
  { id: "electric-circuits", subject: "physics", topic: "electricity-magnetism", type: "video", title: "Electric circuits", comingSoon: true },
  { id: "magnetism-basics", subject: "physics", topic: "electricity-magnetism", type: "video", title: "Magnetism basics", comingSoon: true },
  { id: "electromagnetic-induction", subject: "physics", topic: "electricity-magnetism", type: "video", title: "Electromagnetic induction", comingSoon: true },

  // ===== Physics: Thermodynamics =====
  { id: "heat-temperature", subject: "physics", topic: "thermodynamics", type: "video", title: "Heat & temperature", comingSoon: true },
  { id: "laws-of-thermodynamics", subject: "physics", topic: "thermodynamics", type: "video", title: "Laws of thermodynamics", comingSoon: true },

  // ===== Physics: Modern Physics =====
  { id: "intro-relativity", subject: "physics", topic: "modern-physics", type: "video", title: "Introduction to relativity", comingSoon: true },
  { id: "quantum-basics", subject: "physics", topic: "modern-physics", type: "video", title: "Quantum basics", comingSoon: true },
  { id: "nuclear-physics", subject: "physics", topic: "modern-physics", type: "video", title: "Nuclear physics", comingSoon: true }
];

/* -----------------------------------------------------------
   BIOLOGY_TOPICS
   The navigational structure for the Biology hub page
   (biology.html): a set of topic tabs \u2014 closer to how a
   university lists separate courses (Immunology, Genetics,
   Microbiology) than one intro textbook's table of contents.
   No "AP" or "college" labeling on purpose \u2014 these are just
   topics, usable at whatever depth a student needs.

   Each subtopic's "lessonId" points at an entry in LESSONS above.
   Depth is intentionally uneven \u2014 more specialized topics (like
   Immunology) are expected to grow more subtopics over time than
   a broad intro topic, rather than forcing a uniform count.
----------------------------------------------------------- */
const BIOLOGY_TOPICS = [
  {
    id: "cell-biology",
    name: "Cell Biology",
    subtopics: [
      { lessonId: "cell-membrane-structure" },
      { lessonId: "organelles-functions" },
      { lessonId: "cell-division-cycle" }
    ]
  },
  {
    id: "genetics",
    name: "Genetics",
    subtopics: [
      { lessonId: "mendelian-inheritance" },
      { lessonId: "meiosis-gametes" },
      { lessonId: "non-mendelian-inheritance" }
    ]
  },
  {
    id: "molecular-biology",
    name: "Molecular Biology",
    subtopics: [
      { lessonId: "dna-replication" },
      { lessonId: "transcription-translation" },
      { lessonId: "mutations-gene-regulation" }
    ]
  },
  {
    id: "immunology",
    name: "Immunology",
    subtopics: [
      { lessonId: "innate-vs-adaptive-immunity" },
      { lessonId: "b-t-cell-development" },
      { lessonId: "macrophages-immune-cells" },
      { lessonId: "antibodies-vaccines" }
    ]
  },
  {
    id: "microbiology",
    name: "Microbiology",
    subtopics: [
      { lessonId: "bacteria-vs-viruses" },
      { lessonId: "how-antibiotics-work" },
      { lessonId: "microbiomes" }
    ]
  },
  {
    id: "evolution",
    name: "Evolution",
    subtopics: [
      { lessonId: "evidence-for-evolution" },
      { lessonId: "natural-selection-mechanisms" },
      { lessonId: "speciation" }
    ]
  },
  {
    id: "ecology",
    name: "Ecology",
    subtopics: [
      { lessonId: "population-dynamics" },
      { lessonId: "food-webs-energy-flow" },
      { lessonId: "ecosystems-biomes" }
    ]
  }
];

/* -----------------------------------------------------------
   CHEMISTRY_TOPICS / PHYSICS_TOPICS
   Same pattern as BIOLOGY_TOPICS above \u2014 topic tabs for the
   Chemistry and Physics hub pages.
----------------------------------------------------------- */
const CHEMISTRY_TOPICS = [
  {
    id: "general-chemistry",
    name: "General Chemistry",
    subtopics: [
      { lessonId: "periodic-table" },
      { lessonId: "chemical-bonding" },
      { lessonId: "mole-stoichiometry" }
    ]
  },
  {
    id: "chemical-reactions",
    name: "Chemical Reactions",
    subtopics: [
      { lessonId: "balancing-equations" },
      { lessonId: "reaction-types" },
      { lessonId: "rates-equilibrium" }
    ]
  },
  {
    id: "acids-bases-solutions",
    name: "Acids, Bases & Solutions",
    subtopics: [
      { lessonId: "acids-bases" },
      { lessonId: "solutions-concentration" },
      { lessonId: "titrations" }
    ]
  },
  {
    id: "thermochemistry",
    name: "Thermochemistry",
    subtopics: [
      { lessonId: "energy-in-reactions" },
      { lessonId: "enthalpy-entropy" }
    ]
  },
  {
    id: "organic-chemistry",
    name: "Organic Chemistry",
    subtopics: [
      { lessonId: "intro-carbon-chemistry" },
      { lessonId: "functional-groups" },
      { lessonId: "naming-organic-compounds" }
    ]
  }
];

const PHYSICS_TOPICS = [
  {
    id: "mechanics",
    name: "Mechanics",
    subtopics: [
      { lessonId: "kinematics" },
      { lessonId: "newtons-laws" },
      { lessonId: "energy-and-work" },
      { lessonId: "momentum-collisions" }
    ]
  },
  {
    id: "waves-sound",
    name: "Waves & Sound",
    subtopics: [
      { lessonId: "wave-properties" },
      { lessonId: "sound-waves" }
    ]
  },
  {
    id: "electricity-magnetism",
    name: "Electricity & Magnetism",
    subtopics: [
      { lessonId: "electric-circuits" },
      { lessonId: "magnetism-basics" },
      { lessonId: "electromagnetic-induction" }
    ]
  },
  {
    id: "thermodynamics",
    name: "Thermodynamics",
    subtopics: [
      { lessonId: "heat-temperature" },
      { lessonId: "laws-of-thermodynamics" }
    ]
  },
  {
    id: "modern-physics",
    name: "Modern Physics",
    subtopics: [
      { lessonId: "intro-relativity" },
      { lessonId: "quantum-basics" },
      { lessonId: "nuclear-physics" }
    ]
  }
];

/* -----------------------------------------------------------
   TOPIC_HUBS
   Explicit lookup from a subject key to its topic-tab array.
   topic-hub.js reads from this instead of guessing at a global
   variable name \u2014 top-level "const" declarations don't attach
   to window the way "var" does, so a window["BIOLOGY_TOPICS"]-style
   lookup silently returns nothing. This sidesteps that entirely.
----------------------------------------------------------- */
const TOPIC_HUBS = {
  biology: BIOLOGY_TOPICS,
  chemistry: CHEMISTRY_TOPICS,
  physics: PHYSICS_TOPICS
};