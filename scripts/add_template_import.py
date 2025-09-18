from pathlib import Path
path = Path('src/app/template/[id]/page.tsx')
text = path.read_text()
insert = "import { createDefaultValues, createTemplateSchema, formatPercent, renderTemplateContent, ratingScale } from \"@/lib/templates/form-utils\";\n"
needle = "import { useI18nStore } from \"@/store/i18nStore\";\n"
if insert not in text:
    text = text.replace(needle, needle + insert)
    path.write_text(text)
