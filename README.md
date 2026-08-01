# CV Generator - Harvard Format

Free, modern and ATS-compatible Curriculum Vitae generator. Harvard format, PDF download and bilingual support (EN/ES).

## Features

- **Harvard Format**: Professional CV with serif typography, clear sections and standard layout
- **9 sections**: Personal info, summary, experience, education, skills, languages, projects, certifications and references
- **ATS Compatible**: Built-in checker that analyzes your CV against Applicant Tracking System filters (Workday, Greenhouse, Jobscan)
- **PDF Download**: Generates PDF with real selectable text (not image), Letter size (8.5 x 11 inches)
- **Bilingual**: Instant switch between English and Spanish
- **Profile photo**: Upload with circular preview
- **Save/Load JSON**: Export and import your data as backup
- **Responsive**: Side panel on desktop, form/preview toggle on mobile
- **SEO optimized**: Metadata, OpenGraph, Twitter Card and keywords

## Technologies

- [Next.js 16](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Static typing
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [jsPDF](https://parall.ax/products/jspdf) - Real text PDF generation
- [Lucide React](https://lucide.dev/) - Icons

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cv.git

# Enter the directory
cd cv

# Install dependencies
npm install

# Run in development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Check code
```

## Project Structure

```
src/
├── app/
│   ├── globals.css        # Global styles + Tailwind
│   ├── layout.tsx         # Root layout with SEO metadata
│   └── page.tsx           # Main page
├── components/
│   ├── ATSChecker.tsx     # ATS checker modal
│   ├── CVForm.tsx         # Form with 9 sections
│   ├── CVPreview.tsx      # Harvard format preview
│   └── Header.tsx         # Top bar with language toggle
├── context/
│   └── LanguageContext.tsx # Internationalization context
└── lib/
    ├── atsChecker.ts      # ATS analysis logic
    ├── generatePDF.ts     # PDF generator with jsPDF
    ├── translations.ts    # EN/ES translations
    └── types.ts           # TypeScript types
```

## ATS Checker

The ATS checker analyzes 12 criteria based on real systems:

| Check | Category | Severity |
|-------|----------|----------|
| Full name | Contact | Critical |
| Valid email | Contact | Critical |
| Phone number | Contact | Critical |
| Location | Contact | Warning |
| Professional title | Content | Warning |
| Summary (min. 50 chars) | Content | Warning |
| At least 1 experience | Content | Critical |
| Quantifiable achievements | Keywords | Info |
| Education | Content | Critical |
| Min. 3 skills | Keywords | Warning |
| LinkedIn | Format | Info |
| Consistent dates | Format | Warning |

**Scoring:**
- 80-100: Green - Your CV will pass ATS filters
- 50-79: Yellow - Needs improvements
- 0-49: Red - Requires significant changes

## License

MIT
