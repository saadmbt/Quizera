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
    ✓ All brackets/quotes are properly closed
    ✓ No trailing commas
    ✓ "front" and "back" fields exist for every card
    ✓ Total of EXACTLY 10 flashcards

    ### OUTPUT FORMAT (PYTHON LIST):
    [
        {
            "front": "Concise question in content's language?",
            "back": "Complete answer using content's exact terminology"
        },
        {
            "front": "Another question covering different concept",
            "back": "Precise answer with key details"
        }
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
        You are an expert question generator. Generate {num} {difficulty} multiple-choice questions based on this content:
        ---
        {content}
        ---

        STRICT REQUIREMENTS:
        1. Language: Use EXACTLY the same language as the content
        2. Format: MUST return valid Python list of dictionaries
        3. Quality: Questions must test comprehension, not just recall

        QUESTION GUIDELINES:
        - Each question must have exactly 4 options
        - Only one 100% correct option (others plausible but not clearly wrong)
        - Avoid trick questions or ambiguous wording
        - Mix factual (40%), conceptual (40%), and applied (20%) questions

        OUTPUT VALIDATION:
        Before responding, validate that:
        ✓ All brackets and quotes are properly closed
        ✓ "correctanswer" EXACTLY matches one option
        ✓ No trailing commas in lists
        ✓ All text is in content's language

        OUTPUT FORMAT (PYTHON LIST):
        [
            {{
                "question": "Clear question in content's language?",
                "options": [
                    "Option 1 (correct)",
                    "Plausible distractor",
                    "Related but wrong",
                    "Common misconception"
                ],
                "correctanswer": "Option 1 (correct)",  # EXACT match
                "explanation": "1-sentence justification in content's language"
            }},
            # ... more questions
        ]

        FAILURE TO FOLLOW FORMAT WILL RESULT IN REJECTION.
        Begin now with: [
    """,

    "true-false": """
        Generate {num} {difficulty} true/false questions from:
        ---
        {content}
        ---

        STRICT REQUIREMENTS:
        1. Language: Mirror the content's language exactly
        2. Balance: 50% True, 50% False statements
        3. Format: Valid Python list with proper syntax

        QUESTION RULES:
        - Statements must be absolutely verifiable from content
        - No double negatives or ambiguous phrasing
        - Focus on key concepts, not trivial details

        OUTPUT VALIDATION:
        Before responding, confirm:
        ✓ All options are EXACTLY ["True", "False"]
        ✓ correctanswer is either "True" or "False" (case-sensitive)
        ✓ No nested quotes in questions
        ✓ All text is in content's language

        OUTPUT FORMAT (PYTHON LIST):
        [
            {{
                "question": "Definitive statement from content.",
                "options": ["True", "False"],  # Exactly these
                "correctanswer": "True",  # or "False"
                "explanation": "Evidence from content proving correctness"
            }},
            # ... more questions
        ]

        WARNING: Malformed JSON will be rejected.
        Start with: [
    """,

    "fill-blank": """
        Create {num} {difficulty} fill-in-blank questions from:
        ---
        {content}
        ---

        STRICT REQUIREMENTS:
        1. Language: Match content's terminology exactly
        2. Blanks: 1-3 per question (based on difficulty)
        3. Answers: Single correct answer per blank (2-4 words max)

        QUESTION RULES:
        - Context must make answer inferable
        - Provide 1 correct + 2 incorrect answers per blank
        - Incorrect answers must be plausible but wrong

        OUTPUT VALIDATION:
        Verify:
        ✓ Each blank marked with ___ 
        ✓ "correctanswer" exists in "answers" list
        ✓ Blank count matches answer count
        ✓ All text is in content's language

        OUTPUT FORMAT (PYTHON LIST):
        [
            {{
                "question": "Complete sentence with ___ blank(s).",
                "blanks": ["___"],  # 1-3 blanks
                "answers": [
                    "Correct answer",
                    "Plausible wrong",
                    "Another wrong"
                ],
                "correctanswer": "Correct answer",  # Exact match
                "explanation": "Why this fills the blank correctly"
            }},
            # ... more questions
        ]

        NOTE: Your response must be valid Python starting with [
    """
}