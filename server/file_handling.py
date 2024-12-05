import mimetypes
import fitz
import base64
from docx import Document
from image_Handling import get_file_type,extract_text_from_image64base

fileT='./files/test.pdf'
def extract_text_from_pdf(file):
    # Open the pdf file using fitz
    doc = fitz.open(file)
    text_content=[]
    # Loop through each page
    for i in range(len(doc)):
        page = doc.load_page(i) 
        text_content.append(page.get_text("text"))
    # Join all page texts into a single string 
    text = "\n".join(text_content) 
    return text

def extract_text_from_txtfile(file): 
    with open(file, 'r', encoding='utf-8') as filetxt: 
        return filetxt.read()
    
def extract_text_from_docx(file):
    # Open the docx file using docx
    doc = Document(file) 
    text = []
    # Loop through each paragraph
    for paragraph in doc.paragraphs: 
        text.append(paragraph.text) 
    return "\n".join(text)

def extract_images_from_pdf(pdf_path): 
     # Open the PDF file
     document = fitz.open(pdf_path) 
     images = [] 
     # Loop through each page
     for page_num in range(len(document)): 
        page = document.load_page(page_num) 
        images_list = page.get_images(full=True) 
        for img_index, img in enumerate(images_list, start=1): 
            xref = img[0] 
            base_image = document.extract_image(xref) 
            image_bytes = base_image["image"] 
            # Convert the image bytes to base64
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            images.append(base64_image)
            
     return images

def file_handler(file):
    import mimetypes
import fitz
import base64
from docx import Document
from image_Handling import get_file_type, extract_text_from_image64base

def extract_text_from_pdf(file):
    """Extract text from a PDF file."""
    doc = fitz.open(file)
    text_content = [page.get_text("text") for page in doc]
    return "\n".join(text_content)

def extract_text_from_txtfile(file):
    """Extract text from a text file."""
    with open(file, 'r', encoding='utf-8') as filetxt:
        return filetxt.read()

def extract_text_from_docx(file):
    """Extract text from a docx file."""
    doc = Document(file)
    return "\n".join([paragraph.text for paragraph in doc.paragraphs])

def extract_images_from_pdf(pdf_path):
    """Extract images from a PDF file."""
    document = fitz.open(pdf_path)
    images = []
    for page_num in range(len(document)):
        page = document.load_page(page_num)
        images_list = page.get_images(full=True)
        for img_index, img in enumerate(images_list, start=1):
            xref = img[0]
            base_image = document.extract_image(xref)
            image_bytes = base_image["image"]
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            images.append(base64_image)
    return images

def file_handler(file_path):
    """Handle different file types and extract text."""
    file_type = get_file_type(file_path)
    print(file_type)
    if file_type == 'pdf':
        ex_text = extract_text_from_pdf(file_path)
        final_text = ex_text
        ex_images = extract_images_from_pdf(file_path)
        if ex_images:
            for img in ex_images:
                img_text = extract_text_from_image64base(img, type="png")
                final_text += "\n" + + img_text
        return final_text
    elif file_type == 'docx':
        return extract_text_from_docx(file_path)
    elif file_type == 'txt':
        return extract_text_from_txtfile(file_path)
    else:
        return 'file type not supported'

