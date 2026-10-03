import { db, pool } from "../index";
import { products, productBatches } from "../schema";

const initialProducts = [
  {
    slug: "bpc-157-arginate",
    nameHr: "BPC-157 Arginatna sol",
    nameEn: "BPC-157 Arginate Salt",
    category: "Peptidi",
    categoryEn: "Peptides",
    descriptionHr:
      "Stabilni pentadekapeptid visoke čistoće za laboratorijska biokemijska istraživanja stabilnosti tkiva i citoprotektivnih mehanizama.",
    descriptionEn:
      "High-stability pentadecapeptide arginate salt designed for in-vitro tissue cytoprotective research and integrity profiling.",
    amount: "10 mg",
    price: "49.90",
    featured: true,
    purity: "≥99.4% (HPLC)",
    casNumber: "137525-51-0",
    molecularWeight: "1419.53 g/mol",
    imageUrl: "/images/products/bpc-157-arginate.jpg",
  },
  {
    slug: "tb-500-thymosin-beta4",
    nameHr: "TB-500 (Timozin Beta-4)",
    nameEn: "TB-500 (Thymosin Beta-4)",
    category: "Peptidi",
    categoryEn: "Peptides",
    descriptionHr:
      "Sintetska peptidna sekvenca timozina beta-4 namijenjena in-vitro istraživanjima stanične migracije i dinamike aktina.",
    descriptionEn:
      "Synthetic thymosin beta-4 active fragment engineered for in-vitro cellular migration assays and actin regulation analysis.",
    amount: "5 mg",
    price: "42.50",
    featured: true,
    purity: "≥99.1% (HPLC)",
    casNumber: "77591-33-4",
    molecularWeight: "4963.50 g/mol",
    imageUrl: "/images/products/tb-500-thymosin-beta4.jpg",
  },
  {
    slug: "ghk-cu-copper-peptide",
    nameHr: "GHK-Cu Bakreni Tripeptid",
    nameEn: "GHK-Cu Copper Tripeptide",
    category: "Peptidi",
    categoryEn: "Peptides",
    descriptionHr:
      "Bakreni tripeptidni kompleks visoke analitičke čistoće za proučavanje sinteze kolagena i remodeliranja izvanstaničnog matriksa.",
    descriptionEn:
      "High-affinity copper tripeptide complex synthesized for extracellular matrix modeling and gene transcription assays.",
    amount: "50 mg",
    price: "34.90",
    featured: false,
    purity: "≥98.8% (HPLC)",
    casNumber: "49557-75-7",
    molecularWeight: "403.93 g/mol",
    imageUrl: "/images/products/ghk-cu-copper-peptide.jpg",
  },
  {
    slug: "ipamorelin-acetate",
    nameHr: "Ipamorelin Acetat",
    nameEn: "Ipamorelin Acetate",
    category: "Peptidi",
    categoryEn: "Peptides",
    descriptionHr:
      "Selektivni pentapeptidni analitički standard za stanična istraživanja receptora sekretagoga hormona rasta bez stimulacije kortizola.",
    descriptionEn:
      "Highly selective pentapeptide ghrelin receptor agonist standard for targeted receptor binding kinetics research.",
    amount: "5 mg",
    price: "38.00",
    featured: false,
    purity: "≥99.0% (HPLC)",
    casNumber: "170851-70-4",
    molecularWeight: "711.85 g/mol",
    imageUrl: "/images/products/ipamorelin-acetate.jpg",
  },
  {
    slug: "nad-lyophilized-coenzyme",
    nameHr: "NAD+ Liofilizirani Koenzim",
    nameEn: "NAD+ Lyophilized Coenzyme",
    category: "Istraživački spojevi",
    categoryEn: "Research Compounds",
    descriptionHr:
      "Visokopročišćeni liofilizirani koenzim nikotinamid adenin dinukleotid za mitohondrijska ispitivanja i aktivaciju sirtuinskih puteva.",
    descriptionEn:
      "Ultra-pure lyophilized nicotinamide adenine dinucleotide coenzyme for mitochondrial respiratory and sirtuin pathway research.",
    amount: "500 mg",
    price: "59.00",
    featured: true,
    purity: "≥98.5% (HPLC)",
    casNumber: "53-84-9",
    molecularWeight: "663.43 g/mol",
    imageUrl: "/images/products/nad-lyophilized-coenzyme.jpg",
  },
  {
    slug: "semaglutide-reference-standard",
    nameHr: "Semaglutid Referentni Standard",
    nameEn: "Semaglutide Reference Standard",
    category: "Referentni uzorci",
    categoryEn: "Reference Standards",
    descriptionHr:
      "Certificirani referentni standard za kromatografsku kalibraciju, HPLC validaciju i masenu spektrometriju.",
    descriptionEn:
      "Certified analytical calibration reference standard engineered for HPLC assay validation and mass spectrometry profiling.",
    amount: "5 mg",
    price: "89.00",
    featured: true,
    purity: "≥99.5% (HPLC)",
    casNumber: "910463-68-2",
    molecularWeight: "4113.58 g/mol",
    imageUrl: "/images/products/semaglutide-reference-standard.jpg",
  },
  {
    slug: "glutathione-reduced-gsh",
    nameHr: "Glutation Reducirani (GSH)",
    nameEn: "Glutathione Reduced (GSH)",
    category: "Istraživački spojevi",
    categoryEn: "Research Compounds",
    descriptionHr:
      "Reducirani tripeptidni antioksidans ultra visoke čistoće za laboratorijsku analizu redoks potencijala i staničnog stresa.",
    descriptionEn:
      "Ultra-pure reduced tripeptide antioxidant standard for cellular redox potential measurement and oxidative kinetics studies.",
    amount: "1200 mg",
    price: "29.50",
    featured: false,
    purity: "≥99.0% (HPLC)",
    casNumber: "70-18-8",
    molecularWeight: "307.32 g/mol",
    imageUrl: "/images/products/glutathione-reduced-gsh.jpg",
  },
  {
    slug: "cjc-1295-no-dac",
    nameHr: "CJC-1295 bez DAC-a",
    nameEn: "CJC-1295 without DAC",
    category: "Peptidi",
    categoryEn: "Peptides",
    descriptionHr:
      "Modificirani 29-aminokiselinski peptidni analog (Tetrasupstituirani GRF 1-29) za analitička istraživanja specifičnosti vezanja.",
    descriptionEn:
      "Modified 29-amino acid growth hormone releasing factor analog formulated for structural sequence affinity assays.",
    amount: "2 mg",
    price: "36.00",
    featured: false,
    purity: "≥98.9% (HPLC)",
    casNumber: "863288-34-0",
    molecularWeight: "3367.97 g/mol",
    imageUrl: "/images/products/cjc-1295-no-dac.jpg",
  },
  {
    slug: "epithalon-tetrapeptide",
    nameHr: "Epithalon Tetrapeptid",
    nameEn: "Epithalon Tetrapeptide",
    category: "Peptidi",
    categoryEn: "Peptides",
    descriptionHr:
      "Sintetski tetrapeptid (Ala-Glu-Asp-Gly) visoke čistoće razvijen za istraživanja telomerazne aktivnosti i stanične dugovječnosti.",
    descriptionEn:
      "High-purity synthetic tetrapeptide (Ala-Glu-Asp-Gly) synthesized for telomerase enzymatic kinetics and cellular aging studies.",
    amount: "10 mg",
    price: "46.00",
    featured: true,
    purity: "≥99.2% (HPLC)",
    casNumber: "307297-39-8",
    molecularWeight: "390.35 g/mol",
    imageUrl: "/images/products/epithalon-tetrapeptide.jpg",
  },
];

async function seed() {
  console.log("🌱 Početak popunjavanja baze početnim podacima (Seed)...");

  try {
    for (const p of initialProducts) {
      const [inserted] = await db
        .insert(products)
        .values(p)
        .onConflictDoUpdate({
          target: products.slug,
          set: {
            price: p.price,
            nameHr: p.nameHr,
            nameEn: p.nameEn,
            purity: p.purity,
            amount: p.amount,
          },
        })
        .returning();

      // Dodaj i inicijalnu seriju za svaki proizvod
      await db.insert(productBatches).values({
        productId: inserted.id,
        batchNumber: `LOT-2026-${inserted.slug.substring(0, 6).toUpperCase()}-01`,
        purityPercentage: "99.20",
        synthesisDate: "2026-01-15",
        expiryDate: "2028-01-15",
        coaPdfUrl: `/coa/${inserted.slug}-coa.pdf`,
        stockQuantity: 150,
        isReleased: true,
      });

      console.log(`✅ Umetnut proizvod: ${inserted.nameHr} (ID: ${inserted.id})`);
    }

    console.log("🎉 Seed uspješno dovršen!");
  } catch (error) {
    console.error("❌ Greška tijekom se複d skripte:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
