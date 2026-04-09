from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, "../NoteBook/cvd_random_forest_model.pkl"))
label_encoder = joblib.load(os.path.join(BASE_DIR, "../NoteBook/label_encoder.pkl"))

REQUIRED_FIELDS = ["control_fail", "red_fail", "green_fail", "vanishing_seen", "total_correct", "total_seen"]

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "cvd_random_forest"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    # Check all required fields present
    missing = [f for f in REQUIRED_FIELDS if f not in data]
    if missing:
        return jsonify({"error": "Missing required fields", "missing": missing}), 400

    # Validate all values are non-negative integers
    try:
        values = [int(data[f]) for f in REQUIRED_FIELDS]
    except (ValueError, TypeError):
        return jsonify({"error": "All fields must be integers"}), 400

    if any(v < 0 for v in values):
        return jsonify({"error": "All values must be >= 0"}), 400

    if values[5] == 0:  # total_seen cannot be 0
        return jsonify({"error": "total_seen must be >= 1"}), 400

    try:
        features = np.array([values], dtype=float)
        # Use DataFrame to preserve feature names and avoid sklearn warning
        import pandas as pd
        feature_df = pd.DataFrame([values], columns=REQUIRED_FIELDS)

        prediction = model.predict(feature_df)[0]
        probabilities = model.predict_proba(feature_df)[0]
        confidence = round(float(probabilities.max()) * 100, 2)
        label = label_encoder.inverse_transform([prediction])[0]

        classes = label_encoder.classes_.tolist()
        scores = {cls: round(float(prob) * 100, 2) for cls, prob in zip(classes, probabilities)}

        return jsonify({
            "prediction": label,
            "confidence": confidence,
            "scores": scores
        })

    except Exception as e:
        return jsonify({"error": "Prediction failed", "detail": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
