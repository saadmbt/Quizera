base_prompt = {
    "multiple-choice": """
        You are an expert question generator. Based on the following content, generate {num} {difficulty} **multiple-choice questions**.Content:{content}
        Guidelines:
        - Each question must directly test comprehension or application of the content, not simple recall.
        - Use the same language as the content.
        - Each question must have exactly 4 plausible options.
        - Only one option should be 100% correct; others should be plausible distractors (avoid obviously incorrect choices).
        - Keep the question and options clear, concise, and free from ambiguity.
        - Avoid using trick questions or overly complex wording.
        - Ensure a balance of factual, conceptual, and applied questions.

        Output Format:
        Return a valid Python list of dictionaries as shown below:
        [
            {{
                "question": "Your question here?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctanswer": "Exact matching correct option",
                "explanation": "Brief explanation of why the answer is correct."
            }}
        ]
    """,

    "true-false": """
        You are an expert question generator. Based on the following content, generate {num} {difficulty} **true/false questions**.Content:{content}
        Guidelines:
        - Create unambiguous, fact-based statements derived from the content.
        - Avoid double negatives, complex phrasing, or trick statements.
        - Mix both true and false statements (aim for a near 50/50 split).
        - Focus on meaningful, core ideas or key takeaways.
        - Use the same language as the content.
        Output Format:
        Return a valid Python list of dictionaries in the format below:
        [{{"question": "Statement goes here.","options": ["True", "False"],"correctanswer": "True" or "False",
            "explanation": "Justification based on the content."
            }}]
    """,

    "fill-blank": """
        Based on the following content, generate {num} {difficulty} **fill-in-the-blank questions**.Content:{content}
        Guidelines:
        - Focus on important keywords, phrases, or concepts from the content.
        - Each question should contain contextual information before and/or after the blank.
        - The blank(s) should test understanding, not trivia.
        - Provide 1-3 blanks depending on the difficulty level.
        - Each blank must have a single correct answer (2-4 words maximum).
        - Provide 2-3 plausible incorrect answers for each blank.
        - incorrect answers must be contextually related to the topic but clearly incorrect in the given sentence.
        - Use the same language as the content.
        Output Format:
        Return a valid Python list of dictionaries in the format below:
        [{{"question": "This is a sentence with ___ to be filled.","blanks": ["___"],"answers": ["Correct term or phrase","fasle answers",...],"correctanswer": "Correct term or phrase","explanation": "Explain why this is the correct answer."}}]
    """
}
