from pathlib import Path
path = Path('src/app/(app)/library/page.tsx')
text = path.read_text()
needle = "  const debouncedSearch = useDebounce(search, 300);\n\n"
if needle not in text:
    raise SystemExit('debounce not found')
insert = "  useEffect(() => {\n    const params = new URLSearchParams();\n    if (debouncedSearch) params.set('q', debouncedSearch);\n    if (category !== 'all') params.set('category', category);\n    if (ordering !== ORDERING_OPTIONS[0]?.value) params.set('ordering', ordering);\n    if (page > 1) params.set('page', String(page));\n\n    const queryString = params.toString();\n    const href = queryString ? `__TEMPLATE__` : pathname;\n    router.replace(href, { scroll: false });\n  }, [debouncedSearch, category, ordering, page, pathname, router]);\n\n"
insert = insert.replace('__TEMPLATE__', '${pathname}?${queryString}')
text = text.replace(needle, needle + insert)
path.write_text(text)
