import os
import json
from typing import Dict, Any, Optional

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

def get_gemini_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or not GENAI_AVAILABLE:
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception:
        return None

def analyze_expression_with_gemini(
    concept: str,
    user_explanation: str,
    style: str = "interview"
) -> Dict[str, Any]:
    """
    Evaluates a student's explanation using simple, encouraging, easy-to-understand feedback.
    """
    client = get_gemini_client()
    if client:
        try:
            prompt = f"""
            You are Limitless AI, a warm and encouraging learning buddy.
            Review this student's explanation in VERY SIMPLE, FRIENDLY words (like explaining to a 10-year-old).
            No heavy academic jargon! Keep it short, visual, and helpful.

            Concept: {concept}
            Student says:
            \"\"\"{user_explanation}\"\"\"

            Return a valid JSON strictly matching:
            {{
                "conceptual_score": int between 0 and 100,
                "clarity_score": int between 0 and 100,
                "structure_score": int between 0 and 100,
                "diagnosis": "conceptual_gap" | "expression_difficulty" | "sound_understanding",
                "diagnosis_explanation": "1 simple, friendly sentence on what they did well and the 1 tiny thing to improve.",
                "strengths": ["Clear simple point 1", "Clear simple point 2"],
                "missing_key_points": ["Simple thing to add"],
                "refined_version": "A super simple, 1-sentence way to say this perfectly.",
                "recommended_exercise": "A fun 30-second mini game to practice."
            }}
            """
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )
            data = json.loads(response.text)
            data["mode"] = "live_gemini"
            return data
        except Exception:
            pass

    # Simple, friendly deterministic response
    user_lower = user_explanation.lower()
    has_range = any(w in user_lower for w in ["range", "bound", "ancestor", "all", "entire", "whole", "top", "root", "grandpa", "box", "line"])
    has_left = any(w in user_lower for w in ["left", "smaller", "less", "child"])

    if has_range and has_left:
        return {
            "conceptual_score": 95,
            "clarity_score": 90,
            "structure_score": 92,
            "diagnosis": "sound_understanding",
            "diagnosis_explanation": "Awesome work! You totally got the big rule: the whole left family must be smaller than the top root.",
            "strengths": [
                "Understood that the rule applies to the whole branch, not just one node.",
                "Clear, easy-to-follow explanation."
            ],
            "missing_key_points": [
                "You can also mention the right side must be bigger!"
            ],
            "refined_version": "In a number tree, every number on the left must be smaller than all parents above it, and every number on the right must be bigger.",
            "recommended_exercise": "Try drawing a 3-node tree on a napkin with numbers 15, 10, and 12 to test your friend!",
            "mode": "deterministic_demo"
        }
    elif has_left:
        return {
            "conceptual_score": 80,
            "clarity_score": 75,
            "structure_score": 70,
            "diagnosis": "expression_difficulty",
            "diagnosis_explanation": "Great start! You know the left side is smaller, but remember to mention that it has to be smaller than the very top number too.",
            "strengths": [
                "Understood that left means smaller.",
                "Good everyday words."
            ],
            "missing_key_points": [
                "Remember: it's not just the nearest parent, it's the whole family tree!"
            ],
            "refined_version": "Left numbers must be smaller than the parent AND smaller than the root on top.",
            "recommended_exercise": "Say out loud: 'Left is smaller than Grandpa, Right is bigger than Grandpa!'",
            "mode": "deterministic_demo"
        }
    else:
        return {
            "conceptual_score": 60,
            "clarity_score": 65,
            "structure_score": 60,
            "diagnosis": "conceptual_gap",
            "diagnosis_explanation": "Nice try! Think of it like a school line where everyone on the left must be shorter than the teacher on top.",
            "strengths": [
                "Wrote down a thoughtful attempt.",
                "Good effort explaining the logic."
            ],
            "missing_key_points": [
                "Think of the rule: Left = smaller, Right = bigger."
            ],
            "refined_version": "A BST works like a sorted shelf: smaller items on the left, bigger items on the right.",
            "recommended_exercise": "Check out the visual tree preview in the studio to see it in action!",
            "mode": "deterministic_demo"
        }

def generate_ai_plan_with_gemini(
    goal: str,
    available_hours: float,
    gaps: list
) -> list:
    """
    Creates bite-sized, friendly actions.
    """
    client = get_gemini_client()
    if client:
        try:
            prompt = f"""
            Create 3 simple, fun, 15-minute study steps for a student.
            Goal: {goal}
            Hours available: {available_hours}
            Keep words very simple, action-oriented and friendly.
            Return JSON list:
            [
                {{
                    "title": "Fun, simple action title",
                    "duration_minutes": 15,
                    "why_it_matters": "One simple sentence why this is cool",
                    "goal_id": "{goal}"
                }}
            ]
            """
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )
            tasks = json.loads(response.text)
            for t in tasks:
                t["source"] = "live_gemini"
            return tasks
        except Exception:
            pass

    return [
        {
            "title": "Play with the 3-number visual tree puzzle",
            "duration_minutes": 10,
            "why_it_matters": "See with your own eyes why 25 breaks the rule on the left of 20.",
            "goal_id": goal,
            "source": "deterministic_demo"
        },
        {
            "title": "Write the 3-line check rule in code",
            "duration_minutes": 15,
            "why_it_matters": "Turns what you just saw into simple Python code.",
            "goal_id": goal,
            "source": "deterministic_demo"
        },
        {
            "title": "Explain the rule to a friend or yourself in 30 seconds",
            "duration_minutes": 10,
            "why_it_matters": "If you can say it simply, you will never forget it!",
            "goal_id": goal,
            "source": "deterministic_demo"
        }
    ]
