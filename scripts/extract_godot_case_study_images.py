from __future__ import annotations

from pathlib import Path

import fitz


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def render_all_pages(pdf_path: Path, out_dir: Path, zoom: float = 2.5) -> list[Path]:
    ensure_dir(out_dir)
    doc = fitz.open(pdf_path)
    matrix = fitz.Matrix(zoom, zoom)
    out_files: list[Path] = []

    for i, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        out_path = out_dir / f"{pdf_path.stem}-p{i:02d}.png"
        pix.save(out_path)
        out_files.append(out_path)

    return out_files


def expanded(rect: fitz.Rect, page_rect: fitz.Rect, x_pad: float, y_pad_top: float, y_pad_bottom: float) -> fitz.Rect:
    r = fitz.Rect(rect)
    r.x0 = max(page_rect.x0 + 10, r.x0 - x_pad)
    r.x1 = min(page_rect.x1 - 10, r.x1 + x_pad)
    r.y0 = max(page_rect.y0 + 10, r.y0 - y_pad_top)
    r.y1 = min(page_rect.y1 - 10, r.y1 + y_pad_bottom)
    return r


def crop_by_keywords(pdf_path: Path, out_dir: Path, jobs: list[tuple[str, str, float, float, float]]) -> list[Path]:
    """
    jobs: [(keyword, output_name, x_pad, y_pad_top, y_pad_bottom)]
    """
    ensure_dir(out_dir)
    doc = fitz.open(pdf_path)
    matrix = fitz.Matrix(2.7, 2.7)
    written: list[Path] = []

    for keyword, out_name, x_pad, y_top, y_bottom in jobs:
        done = False
        for page_idx, page in enumerate(doc, start=1):
            matches = page.search_for(keyword)
            if not matches:
                continue

            clip = expanded(matches[0], page.rect, x_pad=x_pad, y_pad_top=y_top, y_pad_bottom=y_bottom)
            pix = page.get_pixmap(matrix=matrix, clip=clip, alpha=False)
            out_path = out_dir / out_name
            pix.save(out_path)
            written.append(out_path)
            print(f"[crop] {keyword!r} -> {pdf_path.name} page {page_idx} -> {out_path.name}")
            done = True
            break

        if not done:
            print(f"[warn] keyword not found in {pdf_path.name}: {keyword!r}")

    return written


def crop_manual(pdf_path: Path, out_dir: Path, page_no: int, rel_rect: tuple[float, float, float, float], out_name: str) -> Path:
    """Crop by normalized coordinates: (x0,y0,x1,y1) in [0,1]."""
    ensure_dir(out_dir)
    doc = fitz.open(pdf_path)
    page = doc[page_no - 1]
    pr = page.rect
    x0, y0, x1, y1 = rel_rect
    clip = fitz.Rect(pr.x0 + pr.width * x0, pr.y0 + pr.height * y0, pr.x0 + pr.width * x1, pr.y0 + pr.height * y1)
    pix = page.get_pixmap(matrix=fitz.Matrix(2.7, 2.7), clip=clip, alpha=False)
    out_path = out_dir / out_name
    pix.save(out_path)
    print(f"[crop-manual] {pdf_path.name} p{page_no} -> {out_path.name}")
    return out_path


def main() -> None:
    mswe_root = Path(r"C:\Users\37496\Desktop\Dev Workspace\MSWE\Q3\SWE 265P Reverse Engineering")
    portfolio_root = Path(r"C:\Users\37496\Desktop\Dev Workspace\Portfolio")

    out_root = portfolio_root / "public" / "images" / "projects" / "godot-case-study"
    out_full = out_root / "full-pages"
    out_pr = out_root / "pr-related"
    ensure_dir(out_full)
    ensure_dir(out_pr)

    uml_pdf = mswe_root / "265P_Godot_UML_Team_9_Part_3.pdf"
    project_pdf = mswe_root / "265P_Project_Part03.pdf"
    sys_pdf_1 = mswe_root / "265P_Godot_System_Diagram_Team9.pdf"
    sys_pdf_2 = mswe_root / "265P_Godot_System_Diagram_Team_9_Part_2.pdf"

    for pdf in [uml_pdf, project_pdf, sys_pdf_1, sys_pdf_2]:
        if pdf.exists():
            files = render_all_pages(pdf, out_full)
            print(f"[render] {pdf.name}: {len(files)} page(s)")
        else:
            print(f"[warn] missing PDF: {pdf}")

    # PR-relevant crops:
    # - UML feature packet around editor/rendering update section
    # - Rendering architecture views from project report
    if uml_pdf.exists():
        crop_by_keywords(
            uml_pdf,
            out_pr,
            jobs=[
                ("Feature 2: Rendering Update Notification", "uml-feature2-rendering-update.png", 30, 40, 420),
                ("Related Classes", "uml-feature2-related-classes.png", 20, 20, 220),
            ],
        )

    if project_pdf.exists():
        crop_by_keywords(
            project_pdf,
            out_pr,
            jobs=[
                ("Godot Rendering Feature Source File Architecture", "project-rendering-source-architecture.png", 20, 30, 380),
                ("Godot Rendering Feature Pipeline Architecture", "project-rendering-pipeline-architecture.png", 20, 30, 380),
            ],
        )

    # Image-only system diagram PDFs do not support keyword search.
    # These manual crops target central diagram regions on page 1.
    if sys_pdf_1.exists():
        crop_manual(sys_pdf_1, out_pr, page_no=1, rel_rect=(0.06, 0.12, 0.94, 0.90), out_name="system-diagram-part1-core.png")
    if sys_pdf_2.exists():
        crop_manual(sys_pdf_2, out_pr, page_no=1, rel_rect=(0.06, 0.12, 0.94, 0.90), out_name="system-diagram-part2-core.png")

    print("[done] Output root:", out_root)


if __name__ == "__main__":
    main()
