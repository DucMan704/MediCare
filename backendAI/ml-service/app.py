from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import joblib
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

import os
import warnings
import logging

warnings.filterwarnings(
    "ignore",
    message="Trying to unpickle estimator.*"
)

logging.getLogger("werkzeug").setLevel(logging.ERROR)

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"


MODELS_DIR = os.path.join("../", "ml-models")


diabetes_model = None
stroke_model = None
malaria_model = None
pneumonia_model = None


def load_pkl(path):
    with open(path, "rb") as f:
        return pickle.load(f)


def load_models():
    global diabetes_model, stroke_model, malaria_model, pneumonia_model

    try:
        diabetes_model = load_pkl(os.path.join(MODELS_DIR, "diabetes.pkl"))
        print("Diabetes model loaded.")
    except Exception as e:
        print(f"Warning: could not load diabetes model: {e}")

    try:
        stroke_model = joblib.load(os.path.join(MODELS_DIR, "stroke_model.joblib"))
        print("Stroke model loaded.")
    except Exception as e:
        print(f"Warning: could not load stroke model: {e}")

    try:
        malaria_model = load_model(
            os.path.join(MODELS_DIR, "malaria.h5"),
            compile=False,
        )
        print("Malaria model loaded.")
    except Exception as e:
        print(f"Warning: could not load malaria model: {e}")

    try:
        pneumonia_model = load_model(
            os.path.join(MODELS_DIR, "pneumonia.h5"),
            compile=False,
        )
        print("Pneumonia model loaded.")
    except Exception as e:
        print(f"Warning: could not load pneumonia model: {e}")


load_models()


@app.route("/", methods=["GET"])
def index():
    return "AI API Working"


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "models": {
            "diabetes": diabetes_model is not None,
            "stroke": stroke_model is not None,
            "malaria": malaria_model is not None,
            "pneumonia": pneumonia_model is not None,
        },
    })


# ===== DIABETES =====
@app.route("/api/diagnosis/diabetes", methods=["POST"])
def predict_diabetes():
    if diabetes_model is None:
        return jsonify({"message": "Diabetes model not loaded"}), 503

    data = request.get_json()
    try:
        features = np.array([[
            float(data["pregnancies"]),
            float(data["glucose"]),
            float(data["bloodpressure"]),
            float(data["skinthickness"]),
            float(data["insulin"]),
            float(data["bmi"]),
            float(data["dpf"]),
            float(data["age"]),
        ]])
        pred = diabetes_model.predict(features)[0]
        return jsonify({"pred": int(pred)})
    except Exception as e:
        return jsonify({"message": str(e)}), 400


# ===== MALARIA (ảnh) =====
@app.route("/api/diagnosis/malaria", methods=["POST"])
def predict_malaria():
    if malaria_model is None:
        return jsonify({"message": "Malaria model not loaded"}), 503

    if "image" not in request.files:
        return jsonify({"message": "No image uploaded"}), 400

    file = request.files["image"]
    img = Image.open(io.BytesIO(file.read())).convert("RGB")
    img = img.resize((36, 36))  # ĐỔI đúng input size lúc train
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = malaria_model.predict(img_array)
    print("Raw prediction:", prediction)

    if prediction.shape[-1] == 1:
        pred = int(prediction[0][0] > 0.5)
    else:
        pred = int(np.argmax(prediction, axis=1)[0])

    return jsonify({"pred": pred})


# ===== PNEUMONIA (ảnh) =====
@app.route("/api/diagnosis/pneumonia", methods=["POST"])
def predict_pneumonia():
    if pneumonia_model is None:
        return jsonify({"message": "Pneumonia model not loaded"}), 503

    if "image" not in request.files:
        return jsonify({"message": "No image uploaded"}), 400

    try:
        file = request.files["image"]

        # Chuyển sang ảnh grayscale (1 kênh)
        img = Image.open(io.BytesIO(file.read())).convert("L")

        # Resize đúng kích thước model yêu cầu
        img = img.resize((36, 36))

        # Chuyển thành numpy
        img_array = np.array(img, dtype=np.float32)

        # Chuẩn hóa
        img_array /= 255.0

        # Thêm chiều channel -> (36,36,1)
        img_array = np.expand_dims(img_array, axis=-1)

        # Thêm chiều batch -> (1,36,36,1)
        img_array = np.expand_dims(img_array, axis=0)

        print("Input shape:", img_array.shape)

        prediction = pneumonia_model.predict(img_array)
        print("Prediction:", prediction)

        if prediction.shape[-1] == 1:
            pred = int(prediction[0][0] > 0.5)
            confidence = float(prediction[0][0])
        else:
            pred = int(np.argmax(prediction, axis=1)[0])
            confidence = float(np.max(prediction))

        return jsonify({
            "pred": pred,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ===== STROKE =====
WORK_TYPE_MAPPING = {
    "Government job": "Govt_job",
    "Children": "children",
    "Never Worked": "Never_worked",
    "Private": "Private",
    "Self-employed": "Self-employed",
}


def predict_stroke_input(single_input):
    input_df = pd.DataFrame([single_input])
    encoded_cols = stroke_model["encoded_cols"]
    numeric_cols = stroke_model["numeric_cols"]
    preprocessor = stroke_model["preprocessor"]

    input_df[encoded_cols] = preprocessor.transform(input_df)
    X = input_df[numeric_cols + encoded_cols]
    prediction = stroke_model["model"].predict(X)
    return prediction


@app.route("/api/diagnosis/stroke", methods=["POST"])
def predict_stroke():
    if stroke_model is None:
        return jsonify({"message": "Stroke model not loaded"}), 503

    data = request.get_json()
    try:
        gender = data["gender"].lower()
        ever_married = data["ever_married"].lower()
        smoking_status_raw = data["smoking_status"]
        smoking_status = (
            smoking_status_raw.lower()
            if smoking_status_raw != "Unknown"
            else smoking_status_raw
        )
        work_type = WORK_TYPE_MAPPING[data["work_type"]]

        single_input = {
            "gender": gender,
            "age": float(data["age"]),
            "hypertension": int(data["hypertension"]),
            "heart_disease": int(data["heart_disease"]),
            "ever_married": ever_married,
            "work_type": work_type,
            "Residence_type": data["residence_type"],
            "avg_glucose_level": float(data["avg_glucose_level"]),
            "bmi": float(data["bmi"]),
            "smoking_status": smoking_status,
        }

        prediction = predict_stroke_input(single_input)
        return jsonify({"pred": int(prediction[0])})
    except KeyError as e:
        return jsonify({"message": f"Missing or invalid field: {e}"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 400


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4001))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False,
        use_reloader=False
    )