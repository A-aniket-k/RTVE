from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64

app = Flask(__name__)

# ✅ Homepage Route
@app.route('/')
def home():
    return "Real-Time Video Enhancement API is Running!"

# ✅ Video Enhancement Route
@app.route('/enhance', methods=['POST'])
def enhance_frame():
    if 'frame' not in request.files:
        return jsonify({"error": "No frame received"}), 400

    frame = request.files['frame'].read()
    frame = np.frombuffer(frame, dtype=np.uint8)
    frame = cv2.imdecode(frame, cv2.IMREAD_COLOR)

    if frame is None:
        return jsonify({"error": "Invalid frame"}), 400

    # 🛠 Apply enhancement (Simple Resize for Now)
    enhanced_frame = cv2.resize(frame, (1280, 720))  # Upscale to 720p

    # ✅ Encode the enhanced image to Base64
    _, buffer = cv2.imencode('.jpg', enhanced_frame)
    encoded_frame = base64.b64encode(buffer).decode('utf-8')

    return jsonify({"image": f"data:image/jpeg;base64,{encoded_frame}"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
