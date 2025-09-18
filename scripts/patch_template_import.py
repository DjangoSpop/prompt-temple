from pathlib import Path
path = Path('src/app/template/[id]/page.tsx')
text = path.read_text()
text = text.replace('\nimport type { OperationResponse } from "@/lib/apiClient";', '')
path.write_text(text)
