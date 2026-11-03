import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    """Đặt màu nền cho ô trong bảng"""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    """Đặt lề trong cho ô bảng (dxa)"""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}>'
                      f'<w:top w:w="{top}" w:type="dxa"/>'
                      f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
                      f'<w:left w:w="{left}" w:type="dxa"/>'
                      f'<w:right w:w="{right}" w:type="dxa"/>'
                      f'</w:tcMar>')
    tcPr.append(tcMar)

def set_cell_border(cell, color="CBD5E1", sz="4"):
    """Đặt viền thanh mảnh cho ô bảng"""
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}>'
                        f'<w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
                        f'<w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
                        f'<w:left w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
                        f'<w:right w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
                        f'</w:tcBorders>')
    tcPr.append(borders)

def add_styled_paragraph(doc, text, style='Normal', space_after=4, line_spacing=1.15):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    
    parts = re.split(r'(\*\*.*?\*\*|\*.*?\*)', text)
    for part in parts:
        if part.startswith('**') and part.endswith('**'):
            run = p.add_run(part[2:-2])
            run.bold = True
            run.font.name = 'Arial'
        elif part.startswith('*') and part.endswith('*'):
            run = p.add_run(part[1:-1])
            run.italic = True
            run.font.name = 'Arial'
        else:
            run = p.add_run(part)
            run.font.name = 'Arial'
    return p

def add_heading_with_color(doc, text, level):
    clean_text = re.sub(r'\{#.*?\}', '', text).strip()
    clean_text = re.sub(r'^\#+\s*', '', clean_text).strip()
    clean_text = clean_text.replace('**', '').strip()

    h = doc.add_heading(level=level)
    run = h.add_run(clean_text)
    run.font.name = 'Arial'
    run.bold = True
    
    if level == 1:
        run.font.size = Pt(17)
        run.font.color.rgb = RGBColor(30, 58, 138)  # Deep Navy Blue
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(6)
    elif level == 2:
        run.font.size = Pt(13.5)
        run.font.color.rgb = RGBColor(37, 99, 235)  # Royal Blue
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(4)
    elif level == 3:
        run.font.size = Pt(11.5)
        run.font.color.rgb = RGBColor(15, 118, 110)  # Teal
        h.paragraph_format.space_before = Pt(8)
        h.paragraph_format.space_after = Pt(3)
    return h

def insert_diagram_image(doc, img_path, width_in=6.2):
    if not os.path.exists(img_path):
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run()
    run.add_picture(img_path, width=Inches(width_in))

def add_caption_paragraph(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(8)
    clean_text = text.strip('*_ ')
    run = p.add_run(clean_text)
    run.font.name = 'Arial'
    run.font.size = Pt(9)
    run.italic = True
    run.font.color.rgb = RGBColor(71, 85, 105)

def format_cell_content(cell, text, is_header=False):
    cell.text = ""
    lines = text.split('<br>')
    for l_idx, line_text in enumerate(lines):
        line_text = line_text.strip()
        if not line_text and len(lines) > 1:
            continue
        p = cell.paragraphs[0] if l_idx == 0 else cell.add_paragraph()
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.05

        if is_header:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            parts = re.split(r'(\*\*.*?\*\*)', line_text)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    run = p.add_run(part[2:-2])
                else:
                    run = p.add_run(part)
                run.bold = True
                run.font.name = 'Arial'
                run.font.size = Pt(9.5)
                run.font.color.rgb = RGBColor(255, 255, 255)
        else:
            parts = re.split(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)', line_text)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    run = p.add_run(part[2:-2])
                    run.bold = True
                elif part.startswith('*') and part.endswith('*'):
                    run = p.add_run(part[1:-1])
                    run.italic = True
                elif part.startswith('`') and part.endswith('`'):
                    run = p.add_run(part[1:-1])
                    run.font.name = 'Consolas'
                else:
                    run = p.add_run(part)
                run.font.name = 'Arial'
                run.font.size = Pt(9)
                run.font.color.rgb = RGBColor(30, 41, 59)

def process_table(doc, table_lines):
    rows_data = []
    for line in table_lines:
        line_clean = line.strip('|')
        cells = [c.strip() for c in line_clean.split('|')]
        if all(set(c).issubset({'-', ':', ' '}) for c in cells):
            continue
        rows_data.append(cells)

    if not rows_data:
        return

    num_rows = len(rows_data)
    num_cols = max(len(r) for r in rows_data)

    table = doc.add_table(rows=num_rows, cols=num_cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True

    # Kiểm tra xem có phải bảng 2 cột dạng Đặc tả Use Case không
    is_usecase_spec = (num_cols == 2 and any('Hạng mục' in c for c in rows_data[0]))

    for r_idx, row in enumerate(rows_data):
        is_header = (r_idx == 0)
        for c_idx, text in enumerate(row):
            if c_idx >= num_cols:
                continue
            cell = table.cell(r_idx, c_idx)
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            set_cell_border(cell, color="CBD5E1", sz="4")

            if is_header:
                set_cell_background(cell, "1E3A8A")  # Deep Navy Header
            else:
                if is_usecase_spec and c_idx == 0:
                    set_cell_background(cell, "F1F5F9")  # Cột nhãn nhẹ nhàng
                elif r_idx % 2 == 1:
                    set_cell_background(cell, "F8FAFC")
                else:
                    set_cell_background(cell, "FFFFFF")

            format_cell_content(cell, text, is_header=is_header)

    # Đặt độ rộng cho bảng đặc tả Use Case (Cột 1: 1.6 inch, Cột 2: 4.8 inch)
    if is_usecase_spec:
        for row in table.rows:
            if len(row.cells) >= 2:
                row.cells[0].width = Inches(1.6)
                row.cells[1].width = Inches(4.8)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def main():
    print("Đọc tệp EduPulse_SRS.docx.md...")
    with open('EduPulse_SRS.docx.md', 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Bỏ qua phần base64 images ở cuối tệp
    md_body = re.split(r'\[image1\]:\s*<data:image', md_content)[0]

    doc = Document()

    # Thiết lập lề chuẩn văn bản kỹ thuật (2cm ~ 0.8 inch)
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.85)
        section.right_margin = Inches(0.85)

    lines = md_body.split('\n')
    i = 0
    total_lines = len(lines)

    in_table = False
    table_lines = []
    in_mermaid = False

    while i < total_lines:
        line = lines[i].strip()

        # Bỏ qua khối Mermaid vì đã có ảnh sơ đồ phân giải cao tương ứng
        if line.startswith('```mermaid'):
            in_mermaid = True
            i += 1
            continue
        if in_mermaid:
            if line.startswith('```'):
                in_mermaid = False
            i += 1
            continue

        # Kiểm tra bảng markdown
        if line.startswith('|') and line.endswith('|'):
            table_lines.append(line)
            i += 1
            continue
        elif table_lines:
            process_table(doc, table_lines)
            table_lines = []

        if not line:
            i += 1
            continue

        # Bỏ qua dòng phân cách ngang ---
        if line == '---':
            i += 1
            continue

        # Ảnh bìa Logo hệ thống
        if '![][image1]' in line:
            insert_diagram_image(doc, 'generated_diagrams/cover_image.png', width_in=3.2)
            i += 1
            continue

        # Ảnh biểu đồ thông thường cú pháp ![alt](path)
        img_match = re.match(r'!\[(.*?)\]\((.*?)\)', line)
        if img_match:
            img_path = img_match.group(2).strip()
            insert_diagram_image(doc, img_path, width_in=6.2)
            i += 1
            continue

        # Dòng chú thích ảnh dạng *Hình 3.x: ...*
        if line.startswith('*Hình') or line.startswith('* Hình'):
            add_caption_paragraph(doc, line)
            i += 1
            continue

        # Headings
        if line.startswith('# '):
            add_heading_with_color(doc, line, 1)
        elif line.startswith('## '):
            add_heading_with_color(doc, line, 2)
        elif line.startswith('### '):
            add_heading_with_color(doc, line, 3)
        elif line.startswith('#### '):
            add_heading_with_color(doc, line, 3)
        # Danh sách gạch đầu dòng
        elif line.startswith('•') or line.startswith('- ') or line.startswith('* '):
            item_text = re.sub(r'^[•\-\*]\s*', '', line).strip()
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.15
            parts = re.split(r'(\*\*.*?\*\*)', item_text)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    run = p.add_run(part[2:-2])
                    run.bold = True
                else:
                    run = p.add_run(part)
                run.font.name = 'Arial'
        else:
            add_styled_paragraph(doc, line)

        i += 1

    if table_lines:
        process_table(doc, table_lines)

    output_path = "EduPulse_SRS.docx"
    print(f"Đang lưu tài liệu Word vào {output_path}...")
    try:
        doc.save(output_path)
        print(f"Xuất tệp Word thành công hoàn tất tại {output_path}!")
    except PermissionError:
        fallback_path = "EduPulse_SRS_Updated.docx"
        print(f"Cảnh báo: Tệp {output_path} đang được mở trong ứng dụng khác (Microsoft Word).")
        print(f"Đang tự động lưu tài liệu vào: {fallback_path}...")
        doc.save(fallback_path)
        print(f"Xuất tệp Word thành công hoàn tất tại {fallback_path}!")

if __name__ == '__main__':
    main()
