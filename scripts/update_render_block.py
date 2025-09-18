from pathlib import Path
path = Path('src/app/template/[id]/page.tsx')
text = path.read_text()
old = "  const renderedPrompt = useMemo(() => {\n    if (!template?.template_content) return \"\";\n    return Object.entries(watchValues ?? {}).reduce((content, [key, value]) => {\n      const safeValue = value === undefined || value === null ? \"\" : String(value);\n      const currentField = template.fields?.find((field) => field.id === key);\n      const label = currentField?.label ?? key;\n      const pattern = new RegExp(`{{\\\\s*${escapeRegExp(label)}\\\\s*}}`, \"gi\");\n      return content.replace(pattern, safeValue);\n    }, template.template_content);\n  }, [template?.template_content, template?.fields, watchValues]);\n"
new = "  const renderedPrompt = useMemo(() => renderTemplateContent(template?.template_content, template?.fields ?? [], watchValues ?? {}), [template?.template_content, template?.fields, watchValues]);\n"
if old not in text:
    raise SystemExit('old block not found')
path.write_text(text.replace(old, new))
