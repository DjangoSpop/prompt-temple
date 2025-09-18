from pathlib import Path
path = Path('src/app/(app)/library/page.tsx')
text = path.read_text()
needle = "  const { t, direction } = useI18nStore();\n"
if needle not in text:
    raise SystemExit('needle not found')
text = text.replace(needle, needle + "  const pathname = usePathname();\n\n", 1)
path.write_text(text)
