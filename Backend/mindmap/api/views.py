from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import re
import google.generativeai as genai

# Configure the Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

# Function to clean and normalize the Gemini JSON response
def clean_mindmap(data):
    data["topic"] = data["topic"].strip().title()

    # Rearranging data for horizontal visualization
    horizontal_branches = []

    for branch in data.get("branches", []):
        branch["title"] = branch["title"].strip().title()
        branch["subtopics"] = [sub.strip().title() for sub in branch.get("subtopics", [])]

        horizontal_branches.append({
            "branch_title": branch["title"],
            "subtopics": branch["subtopics"]
        })

    # The topic and branches are aligned horizontally in a list of dictionaries
    return {
        "topic": data["topic"],
        "branches": horizontal_branches
    }

# Utility function to call Gemini API
def generate_mindmap(topic):
    prompt = f"""
    Generate a mind map for the topic: "{topic}".
    Include 3-5 main branches, each with 3-5 subtopics.
    Only return the output in the following JSON format:
    {{
        "topic": "your_topic_here",
        "branches": [
            {{
                "title": "branch_title",
                "subtopics": ["subtopic_1", "subtopic_2"]
            }}
        ]
    }}
    """

    model = genai.GenerativeModel("gemini-2.0-flash")
    
    try:
        response = model.generate_content(prompt)
        raw_response = response.text.strip()

        # Log raw Gemini output for debugging
        print("Raw Gemini response:\n", raw_response)

        # Extract JSON block from response
        match = re.search(r'\{.*\}', raw_response, re.DOTALL)
        if match:
            json_text = match.group()
            parsed_json = json.loads(json_text)
            return parsed_json
        else:
            print("No valid JSON found in Gemini response.")
            return None

    except Exception as e:
        print("Error generating mindmap:", e)
        return None

# API endpoint to handle POST requests
@csrf_exempt
def generate_mindmap_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)

    try:
        data = json.loads(request.body)
        topic = data.get("topic", "").strip()

        if not topic:
            return JsonResponse({"error": "Topic field is required."}, status=400)

        mindmap = generate_mindmap(topic)
        if mindmap:
            return JsonResponse(mindmap)
        else:
            return JsonResponse({"error": "Failed to generate mind map from Gemini API."}, status=500)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON in request body."}, status=400)
    except Exception as e:
        print("Unexpected error:", e)
        return JsonResponse({"error": "An unexpected error occurred."}, status=500)
