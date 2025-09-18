from pathlib import Path
path = Path('src/app/template/[id]/page.tsx')
text = path.read_text()
start = text.find('const createTemplateSchema')
end = text.find('function TemplateSkeleton')
if start != -1 and end != -1:
    text = text[:start] + text[end:]
    path.write_text(text)
