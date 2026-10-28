"""
Limitless Curated Curriculum — Simple, Fun, and Visual.
Designed so anyone (even a 10-year-old) can understand instantly!
"""

TOPICS = [
    {
        "id": "bst_invariants",
        "title": "Binary Search Trees (The Number Tree Game)",
        "subject": "Data Structures",
        "description": "Learn the simple rule: Left is smaller, Right is bigger. Everywhere!",
        "difficulty": "Easy to follow",
        "prerequisites": ["tree_basics"],
        "estimated_minutes": 10
    },
    {
        "id": "recursion_basics",
        "title": "Recursion (Russian Dolls in Code)",
        "subject": "Coding Basics",
        "description": "Functions that call themselves until a simple stopping rule is reached.",
        "difficulty": "Beginner",
        "prerequisites": [],
        "estimated_minutes": 10
    },
    {
        "id": "dp_memoization",
        "title": "Memoization (Writing Down Answers so You Don't Redo Work)",
        "subject": "Smart Shortcuts",
        "description": "Like writing answers in a notebook instead of re-calculating 100 times.",
        "difficulty": "Fun & Fast",
        "prerequisites": ["recursion_basics"],
        "estimated_minutes": 15
    },
    {
        "id": "cache_invalidation",
        "title": "Caching (Keeping Sticky Notes in Sync with Your Book)",
        "subject": "System Basics",
        "description": "Quick memory vs permanent storage made super simple.",
        "difficulty": "Visual",
        "prerequisites": [],
        "estimated_minutes": 10
    }
]

QUESTIONS = [
    {
        "id": "q_bst_1",
        "topic_id": "bst_invariants",
        "prompt": "A student wrote a quick program to check if a number tree is correct:\n\n```python\ndef is_bst(node):\n    if not node: return True\n    # Only checks immediate child:\n    if node.left and node.left.val >= node.val: return False\n    if node.right and node.right.val <= node.val: return False\n    return is_bst(node.left) and is_bst(node.right)\n```\n\nWhy does this code fail on tricky trees?",
        "options": [
            {
                "id": "A",
                "text": "It only checks parent and direct child! It forgets that ALL numbers in the left family must stay smaller than the top root (Grandpa).",
                "is_correct": True,
                "misconception": None,
                "feedback": " Exactly right! In a number tree, the rule applies to the whole family branch, not just the nearest child."
            },
            {
                "id": "B",
                "text": "Because an empty tree is not allowed.",
                "is_correct": False,
                "misconception": "base_case_confusion",
                "feedback": "Empty trees are actually totally fine! The real secret is what happens deep down the branches."
            },
            {
                "id": "C",
                "text": "Because computer code cannot compare negative numbers.",
                "is_correct": False,
                "misconception": "syntactic_distraction",
                "feedback": "Computers compare negative numbers easily! Look at how numbers are placed in the family branch."
            },
            {
                "id": "D",
                "text": "The computer gets stuck in an endless loop forever.",
                "is_correct": False,
                "misconception": "recursion_termination_doubt",
                "feedback": "It doesn't loop forever because the tree ends at the leaves! It just checks the wrong rule."
            }
        ],
        "concept_tested": "The Family Rule: All Left Numbers Must Be Smaller",
        "difficulty": "Simple"
    },
    {
        "id": "q_bst_followup",
        "topic_id": "bst_invariants",
        "prompt": "Look at this simple 3-number tree:\n\n• Top Root = 20\n  └── Left Child = 10\n        └── Right Child = 25\n\nWhat happens here?",
        "options": [
            {
                "id": "A",
                "text": "It looks okay to the weak code, but it's WRONG! 25 is on the left side of 20, but 25 is bigger than 20!",
                "is_correct": True,
                "misconception": None,
                "feedback": " Bingo! You caught it! 25 is bigger than 10 (so 10 is happy), but 25 is on the left of 20 (breaking the big rule)."
            },
            {
                "id": "B",
                "text": "The tree is 100% correct because 25 is bigger than 10.",
                "is_correct": False,
                "misconception": "persistent_local_invariant_bias",
                "feedback": "Notice where 25 is! It's under 20's left branch. Can a number bigger than 20 live on the left of 20? No!"
            },
            {
                "id": "C",
                "text": "The tree has too few numbers to tell.",
                "is_correct": False,
                "misconception": "uncertainty",
                "feedback": "3 numbers are plenty! Look at 20 on top and 25 deep on its left."
            }
        ],
        "concept_tested": "Spotting the Sneaky Number",
        "difficulty": "Visual"
    }
]

MICRO_LESSONS = {
    "bst_invariants": {
        "title": "The Big Rule of Number Trees",
        "concept": "Left side = Smaller, Right side = Bigger",
        "formats": {
            "worked_example": {
                "label": " Simple Story & Example",
                "content": """
### Think of it like a School Line:

Imagine the teacher is **20**:
- Everyone on the **LEFT** must be shorter than **20**.
- Everyone on the **RIGHT** must be taller than **20**.

```
          [Teacher: 20]
         /             \\
   [Left: Max 19]   [Right: Min 21]
```

#### What went wrong before?
A student placed **10** on the left (good!).
Then placed **25** to the right of 10.
- Is 25 taller than 10? Yes!
- **BUT** 25 is still standing in the **shorter-than-20** line!
- Teacher 20 turns around and says: *"Hey, 25! You're taller than me, you cannot be on my left!"*

**That's it!** Each step down gives numbers a **Min and Max box** they must fit in.
"""
            },
            "visual_diagram": {
                "label": " Quick Visual Map",
                "content": """
### See the Allowed Boxes:

```
               [ 20 ]   <-- Rule for left: (Must be < 20)
              /
           [ 10 ]       <-- Now rule for right child: (Between 10 and 20)
             \\
             [ 25 ]     <-- OOPS! 25 is NOT between 10 and 20!
```

 10 is okay with 25.
❌ But 20 is NOT okay with 25.
**Rule:** Going Left sets a ceiling. Going Right sets a floor!
"""
            },
            "active_practice": {
                "label": " 10-Second Test",
                "content": """
### Quick Quiz:
If Grandpa is **50**, and your Dad is **30** (on the left of Grandpa):
- Can you be **55**?

**Answer:** No! Even if you are bigger than Dad (30), you are in Grandpa's left house, so you MUST be under 50!
"""
            },
            "structured_text": {
                "label": " Quick Summary",
                "content": """
### 3 Bullet Summary:
1. Every left child must be smaller than **ALL** parents above it.
2. Every right child must be bigger than **ALL** parents above it.
3. Keep track of two numbers: `(minimum_allowed, maximum_allowed)`.
"""
            }
        }
    }
}
