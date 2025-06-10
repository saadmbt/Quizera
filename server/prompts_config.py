keywords_prompt="""
    You are a content strategist. Based on the following text, identify the **5 most important educational concepts or topics** that would make compelling YouTube video suggestions.

    Your task:
    - Extract exactly 5 suggestions as **YouTube video title ideas**
    - Each suggestion must be **5-10 words long**
    - Titles must be **clear, concise, and instructional**
    - Focus only on **educational or tutorial-style content**
    - Use natural phrasing that sounds like actual YouTube videos
    - Do **not** include any explanations or extra text
    - Output the result as a **valid JSON list of strings**
    - Return **only** the list, with nothing before or after

    Format:
    ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"]

"""
flashcards_prompt = """
    You are an expert flashcard generator. Create 10 high-quality flashcards from this content:
    ---
    {content}
    ---

    ### STRICT REQUIREMENTS:
    1. **Language**: Use EXACTLY the same language as the content (terminology, style, and tone).
    2. **Format**: MUST return a valid Python list of dictionaries with no syntax errors.
    3. **Coverage**: Ensure questions span key concepts (no trivial/repetitive questions).
    4. **Difficulty**: Include a mix of:
       - 3 Basic recall questions
       - 4 Conceptual understanding questions
       - 3 Applied knowledge questions

    ### FLASHCARD RULES:
    - **Front (Question)**:
      - Maximum 15 words
      - Must be answerable without context
      - Phrased as a direct question or completion ("What is...?" or "The process of ___ involves...")
    - **Back (Answer)**:
      - Maximum 30 words
      - Must fully resolve the question
      - Include key technical terms from content

    ### OUTPUT VALIDATION:
    Before responding, verify:
    - [ ] All brackets/quotes are properly closed
    - [ ] No trailing commas
    - [ ] "front" and "back" fields exist for every card
    - [ ] Total of EXACTLY 10 flashcards
    - [ ] All text is in content's language
    - [ ] if the language of the content in french the out put should e in french too.
    - [ ] The format and structure of the output is correct

    ### OUTPUT FORMAT (PYTHON LIST):
    [{{"front": "Concise question in content's language?","back": "Complete answer using content's exact terminology"}},
    {{"front": "Another question covering different concept","back": "Precise answer with key details"}}
        # ... 8 more cards
    ]

    ### FAILURE CONDITIONS (will reject output if):
    - Contains ANY text outside the Python list
    - Uses different terminology than content
    - Has fewer/more than 10 items
    - Includes explanations (save these for answer side)

    Begin your response with: [
"""

base_prompt = {
    "multiple-choice": """
        Generate {num} {difficulty} multiple-choice questions from the provided content. Follow ALL requirements strictly.

        ### CONTENT:
        {content}

        ### INSTRUCTIONS:
        1. **Language**: Use the EXACT terminology and language style of the content.
        2. **Format**: Output MUST be a **valid Python list of dictionaries** (no trailing commas, proper quotes).
        3. **Quality**: 
           - 40% factual, 40% conceptual, 20% applied questions.
           - No trick questions or ambiguous phrasing.
           - All distractors must be plausible.

        ### OUTPUT TEMPLATE (PYTHON):
        [
            {{
                "question": "Clear question phrased as a complete sentence?",
                "options": [
                    "Correct answer (exactly matches content)",
                    "Plausible distractor 1",
                    "Plausible distractor 2",
                    "Common misconception"
                ],
                "correctanswer": "Correct answer (exactly matches content)",  # CASE-SENSITIVE
                "explanation": "Brief explanation in same language as content"
            }}
        ]

        ### VALIDATION CHECKS (REQUIRED):
        - [ ] Verify `correctanswer` is an EXACT match to one option.
        - [ ] Ensure all brackets/quotes are closed.
        - [ ] Confirm explanations derive from content.
        - [ ] No trailing commas or syntax errors.
        - [ ] Confirm the output Text Language is the same as the content.
        - [ ] if the language of the content in french the out put should e in french too.
        - [ ] Return ONLY a valid Python list, no additional text.
        

        ### BEGIN OUTPUT:
        [
    """,

    "true-false": """
        Generate {num} {difficulty} true/false questions from the content. Follow ALL rules.

        ### CONTENT:
        {content}

        ### INSTRUCTIONS:
        1. **Balance**: 50% True, 50% False statements.
        2. **Clarity**: Statements must be directly verifiable from content (no opinions).
        3. **Format**: Valid Python list with EXACT options ["True", "False"].

        ### OUTPUT TEMPLATE (PYTHON):
        [
           {{
                "question": "Definitive statement that is objectively True/False.",
                "options": ["True", "False"],  # EXACTLY these values
                "correctanswer": "True",  # or "False" (case-sensitive)
                "explanation": "Brief explanation in same language as content"
            }}
        ]

        ### VALIDATION CHECKS (REQUIRED):
        - [ ] `correctanswer` is either "True" or "False" (case-sensitive).
        - [ ] Ensure all brackets/quotes are closed.
        - [ ] Confirm explanations derive from content.
        - [ ] No trailing commas or syntax errors.
        - [ ] All questions are fact-based (no generalizations).
        - [ ] Confirm the output Text Language is the same as the content.
        - [ ] if the language of the content in french the out put should e in french too.
        - [ ] Return ONLY a valid Python list, no additional text.

        ### BEGIN OUTPUT:
        [
    """,

    "fill-blank": """
        Create {num} {difficulty} fill-in-the-blank questions. Follow ALL guidelines.

        ### CONTENT:
        {content}

        ### INSTRUCTIONS:
        1. **Blanks**: Use 1 blank for easy, 2 for medium, 3 for hard.
        2. **Answers**: Provide 1 correct + 2 incorrect options per blank.
        3. **Context**: Ensure blanks are inferable from surrounding text.
        4. **Format**: Return ONLY a valid JSON array, no additional text

        ### JSON STRUCTURE:
        [
            {{
                "question": "Sentence with ___ blank(s) placed where key terms belong.",
                "blanks": ["___"],  # 1-3 blanks max
                "answers": [
                    "Correct term (exact match to content)",
                    "Plausible but incorrect term",
                    "Another incorrect term"
                ],
                "correctanswer": "Correct term (exact match to content)",
                "explanation": "Brief explanation in same language as content"
            }}
        ]

        ### VALIDATION CHECKS (REQUIRED):
        - [ ] Each blank marked with `___`.
        - [ ] `correctanswer` exists in `answers` list.
        - [ ] No missing/extra blanks or answers.
        - [ ] Confirm the output Text Language is the same as the content.
        - [ ] if the language of the content in french the out put should e in french too.
        - [ ] Return ONLY a valid JSON array, no additional text.

        ### BEGIN OUTPUT:
        [
    """
}