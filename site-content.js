export const SERVICES = [
  {
    id: "safety-files",
    icon: "files",
    title: "SHE Files / Safety Files",
    description:
      "Professionally compiled, site-specific and client-approved safety files that get you on site without delays.",
  },
  {
    id: "risk-assessments",
    icon: "clipboard-check",
    title: "Risk Assessments & Method Statements",
    description:
      "In-depth baseline and task-specific risk assessments (IBR), safe work procedures and method statements for all high-risk activities.",
  },
  {
    id: "safety-officers",
    icon: "hard-hat",
    title: "Site Safety Officer Services",
    description:
      "Qualified, experienced part-time and full-time Safety Officers for your construction sites.",
  },
  {
    id: "audits",
    icon: "shield-check",
    title: "Safety Audits & Inspections",
    description:
      "Site compliance audits, scaffold inspections, tools & equipment inspections to identify gaps before the client does.",
  },
  {
    id: "training",
    icon: "graduation-cap",
    title: "HSE Training",
    description:
      "Training support including First Aid, Working at Heights, Scaffold Erector/Inspector, Safety Induction and more. Ask us about course availability and accreditation.",
  },
  {
    id: "environmental",
    icon: "leaf",
    title: "Environmental Management",
    description:
      "Environmental management plans, waste management and compliance support for sustainable operations.",
  },
  {
    id: "contractor-compliance",
    icon: "handshake",
    title: "Contractor Compliance Support",
    description:
      "COID/Workman’s Compensation, Letters of Good Standing, and assistance with client contractor requirements.",
  },
];
export const SERVICE_OPTIONS = [...SERVICES.map(({ title }) => title), "Other"];
