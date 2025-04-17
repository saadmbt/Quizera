base_prompt = {
    "multiple-choice": """
        Generate {num} {difficulty} multiple-choice questions based on this content: {content}
        
        Requirements:
        - Questions should be clear, concise and directly related to the content
        - Each question must have exactly 4 options
        - All options must be plausible but only one correct
        - Avoid obvious wrong answers
        - Use the same language as the content
        - Questions should test understanding, not just memorization
        
        Return as valid Python list of dictionaries in format:
        [
            {{
                "question": "question text",
                "options": ["option1", "option2", "option3", "option4"],
                "correctanswer": "exact matching option",
                "explanation": "explanation of the answer"
            }}
        ]
    """,
    
    "true-false": """
        Generate {num} {difficulty} true/false questions based on this content: {content}
        
        Requirements:
        - Statements should be clear and unambiguous
        - Avoid double negatives
        - Focus on key concepts from the content
        - Mix both true and false statements
        - Use the same language as the content
        
        Return as valid Python list of dictionaries in format:
        [
            {{
                "question": "question text",
                "options": ["True", "False"],
                "correctanswer": "True or False",
                "explanation": "explanation of the answer"
            }}
        ]
    """,
    
    "fill-blank": """
        Generate {num} {difficulty} fill-in-the-blank questions based on this content: {content}
        
        Requirements:
        - Blanks should test key terms or concepts
        - Provide context for the answer
        - Each blank should have only one correct answer
        - Base on the difficulty level, provide number of blanks
        - Use the same language as the content
        - Answer should be 2-4 words maximum
        
        Return as valid Python list of dictionaries in format:
        [
            {{
                "question": "question with ___ blank",
                "blanks": ["word1","word2","word3"],
                "answers": ["correct1"],
                "correctanswer": "correct1",
                "explanation": "explanation of the answer"
            }}
        ]
    """
}
