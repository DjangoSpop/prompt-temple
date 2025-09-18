from pathlib import Path
path = Path('src/app/template/[id]/page.tsx')
text = path.read_text()
text = text.replace('const ratingOptions = [1, 2, 3, 4, 5];\n\n', '')
path.write_text(text)
