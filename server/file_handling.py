import mimetypes
import fitz
import base64
from docx import Document
from image_Handling import get_file_type,extract_text_from_image64base

fileT='./files/test2.pdf'
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
    # Get the file path from the api
    # Get the type from file 
    file_type=get_file_type(file)
    print(file_type,'lien :55')
    if file_type == 'pdf':
        #Handle pdf file
        ex_text=extract_text_from_pdf(file)
        final_text=ex_text
        ex_images=extract_images_from_pdf(file)
        print(len(ex_images))
        for img in ex_images :
            img_text=extract_text_from_image64base(img,type="png")
            final_text+="\n"+img_text

        return print(final_text)
    elif file_type == 'docx':
        # Handle docx file
        ex_text=extract_text_from_docx(file)
        return ex_text
    elif file_type=='txt':
        ex_text=extract_text_from_txtfile(file)
        return ex_text
    else:
        return print('file type not supported')


file_handler(fileT)



