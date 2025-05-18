from flask import Flask, request, jsonify
import requests
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # ✅ Now it's correct

CLARIFAI_API_KEY = 'YOUR CLARIFAI API KEY'  # Replace with your actual API key

@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files['image']
    base64_image = base64.b64encode(image.read()).decode('utf-8')

    headers = {
        "Authorization": f"Key {CLARIFAI_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "inputs": [
            {
                "data": {
                    "image": {
                        "base64": base64_image
                    }
                }
            }
        ]
    }

    try:
        response = requests.post(
            "https://api.clarifai.com/v2/models/food-item-recognition/outputs",
            headers=headers,
            json=data
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
