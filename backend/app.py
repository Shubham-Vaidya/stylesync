"""
StyleSync AI — Flask Backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Runs on: http://localhost:5000
Endpoints:
  GET  /garments       → list available garment files
  POST /tryon          → virtual try-on (IDM-VTON or mock)
  POST /recommend      → colour palette + recommendations
  POST /size           → recommended clothing size
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64

app = Flask(__name__)

# ── CORS ────────────────────────────────────────────────────────────────────
CORS(app, origins=["http://localhost:3000", "http://localhost:3001", "*"])

# ── Config ────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GARMENTS_DIR = os.path.join(BASE_DIR, "garments")
os.makedirs(GARMENTS_DIR, exist_ok=True)
print(f"[startup] BASE_DIR     = {BASE_DIR}")
print(f"[startup] GARMENTS_DIR = {GARMENTS_DIR}")


# ══════════════════════════════════════════════════════════════════════════════
# Health check
# ══════════════════════════════════════════════════════════════════════════════
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "StyleSync AI Backend", "version": "1.0.0"})

@app.route('/favicon.ico')
def favicon():
    return '', 204


# ══════════════════════════════════════════════════════════════════════════════
# GET /garments
# Returns list of garment filenames from the ./garments directory.
# If the directory is empty, returns a default list for demo purposes.
# ══════════════════════════════════════════════════════════════════════════════
@app.route("/garments", methods=["GET"])
def get_garments():
    try:
        files = [
            f for f in os.listdir(GARMENTS_DIR)
            if os.path.splitext(f)[1].lower() in (".jpg", ".jpeg", ".png", ".webp")
        ]
    except Exception as e:
        print(f"[/garments] error listing dir: {e}")
        files = []

    # Demo fallback if garments folder is empty
    if not files:
        files = [
            "silk_blouse.jpg",
            "cashmere_knit.jpg",
            "blazer.jpg",
            "linen_shirt.jpg",
            "trousers.jpg",
            "midi_skirt.jpg",
            "shorts.jpg",
            "leather_bag.jpg",
            "silk_scarf.jpg",
            "fedora.jpg",
            "beret.jpg",
            "gold_watch.jpg",
            "chronograph.jpg",
        ]

    return jsonify({"garments": files})


# ══════════════════════════════════════════════════════════════════════════════
# POST /tryon
# Body JSON: { person_image: "data:image/jpeg;base64,...", garment: "shirt.png" }
# Returns:   { result_image: "data:image/jpeg;base64,..." }
#
# If IDM-VTON or a real model is available, call it here.
# Otherwise returns a mock result for demo.
# ══════════════════════════════════════════════════════════════════════════════
@app.route("/tryon", methods=["POST"])
def tryon():
    data = request.get_json(force=True)

    person_image_uri = data.get("person_image", "")
    garment_filename = data.get("garment", "")

    if not person_image_uri:
        return jsonify({"error": "Missing person_image"}), 400
    if not garment_filename:
        return jsonify({"error": "Missing garment filename"}), 400

    print(f"[/tryon] garment={garment_filename}, image_length={len(person_image_uri)}")

    # ── Try real model ────────────────────────────────────────────────────
    # Uncomment and adapt for your real pipeline:
    #
    # try:
    #     result_base64 = run_idm_vton(person_image_uri, garment_filename)
    #     return jsonify({"result_image": result_base64})
    # except Exception as e:
    #     print(f"[/tryon] model error: {e}")
    #     return jsonify({"error": str(e)}), 500
    #
    # ── Demo mock: echo the person image back as the "result" ─────────────
    # In a real demo, replace with your actual AI result image.
    try:
        # Strip data URI prefix if present
        if "," in person_image_uri:
            header, encoded = person_image_uri.split(",", 1)
        else:
            header = "data:image/jpeg;base64"
            encoded = person_image_uri

        # Validate base64
        base64.b64decode(encoded)

        # Return the person image as mock result
        # (replace this with real AI output in production)
        mock_result = f"{header},{encoded}"
        return jsonify({
            "result_image": mock_result,
            "garment": garment_filename,
            "note": "Demo result — replace with real IDM-VTON output",
        })

    except Exception as e:
        print(f"[/tryon] error: {e}")
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500


# ══════════════════════════════════════════════════════════════════════════════
# POST /recommend
# Body JSON: { person_image: "data:image/jpeg;base64,..." }
# Returns: { palette: [...], recommendations: [...] }
# ══════════════════════════════════════════════════════════════════════════════
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json(force=True)
    person_image_uri = data.get("person_image", "")

    if not person_image_uri:
        return jsonify({"error": "Missing person_image"}), 400

    print(f"[/recommend] image_length={len(person_image_uri)}")

    # ── Demo mock palette + recommendations ───────────────────────────────
    # Replace with real colour extraction (colorthief, OpenCV, etc.)
    mock_palette = [
        {"color": "#2C3E50", "name": "Navy"},
        {"color": "#7F8C8D", "name": "Charcoal"},
        {"color": "#BDC3C7", "name": "Stone"},
        {"color": "#E8C99E", "name": "Cream"},
        {"color": "#C8A96E", "name": "Gold"},
    ]

    mock_recommendations = [
        {"id": 1, "name": "Silk Charmeuse Blouse",  "brand": "THE ROW",      "price": "$340",   "match": 97, "category": "Tops",        "why": "The cream silk complements your warm undertone perfectly."},
        {"id": 2, "name": "Wide-Leg Trousers",       "brand": "LEMAIRE",      "price": "$420",   "match": 94, "category": "Bottoms",     "why": "Navy balances your detected cool-warm mix."},
        {"id": 3, "name": "Cashmere Overcoat",       "brand": "LORO PIANA",   "price": "$2,800", "match": 91, "category": "Tops",        "why": "Charcoal grey creates an elegant tonal contrast."},
        {"id": 4, "name": "Asymmetric Midi Dress",   "brand": "TOTEME",       "price": "$560",   "match": 88, "category": "Tops",        "why": "Stone tones harmonize with your neutral palette."},
        {"id": 5, "name": "Structured Leather Tote", "brand": "A.P.C.",       "price": "$495",   "match": 85, "category": "Accessories", "why": "Gold hardware echoes the warm accent from your palette."},
        {"id": 6, "name": "Merino Wool Scarf",       "brand": "JOHNSTONS",    "price": "$180",   "match": 82, "category": "Accessories", "why": "A soft neutral accessory to tie the look together."},
    ]

    return jsonify({
        "palette": mock_palette,
        "recommendations": mock_recommendations,
    })


# ══════════════════════════════════════════════════════════════════════════════
# POST /size
# Body JSON: { height: 175, weight: 70, chest: 95, waist: 80, body_type: "Regular" }
# Returns: { size: "M", measurements: {...} }
# ══════════════════════════════════════════════════════════════════════════════
@app.route("/size", methods=["POST"])
def size():
    data = request.get_json(force=True)

    height    = float(data.get("height", 0) or 0)
    weight    = float(data.get("weight", 0) or 0)
    chest     = float(data.get("chest",  0) or 0)
    waist     = float(data.get("waist",  0) or 0)
    body_type = data.get("body_type", "Regular")

    if height <= 0 or weight <= 0:
        return jsonify({"error": "height and weight are required"}), 400

    bmi = weight / ((height / 100) ** 2)

    # Chest-based sizing (more accurate if provided)
    if chest > 0:
        if chest < 82:    size_label = "XS"
        elif chest < 90:  size_label = "S"
        elif chest < 98:  size_label = "M"
        elif chest < 106: size_label = "L"
        else:             size_label = "XL"
    else:
        # BMI fallback
        if bmi < 18.5:    size_label = "XS"
        elif bmi < 21.0:  size_label = "S"
        elif bmi < 24.0:  size_label = "M"
        elif bmi < 27.0:  size_label = "L"
        else:             size_label = "XL"

    print(f"[/size] h={height} w={weight} bmi={bmi:.1f} chest={chest} → {size_label}")

    return jsonify({
        "size": size_label,
        "bmi": round(bmi, 1),
        "body_type": body_type,
        "measurements": {"height": height, "weight": weight, "chest": chest, "waist": waist},
    })


# ══════════════════════════════════════════════════════════════════════════════
# Entry point
# ══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=" * 60)
    print("  StyleSync AI — Flask Backend")
    print("  Running at: http://localhost:5000")
    print("  CORS enabled for localhost:3000 and localhost:3001")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)
