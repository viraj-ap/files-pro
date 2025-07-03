from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from utils import convert_file, compress_video, compress_image

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route("/convert", methods=["POST"])
def convert():
    file = request.files["file"]
    target_format = request.form["target"]
    operation = request.form["operation"]  

    filename = secure_filename(file.filename)
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(input_path)

    output_filename = os.path.splitext(filename)[0] + f"_converted.{target_format}"
    output_path = os.path.join(PROCESSED_FOLDER, output_filename)

    if operation == "convert":
        convert_file(input_path, output_path)
    elif operation == "compress_video":
        compress_video(input_path, output_path)
    elif operation == "compress_image":
        compress_image(input_path, output_path)
    else:
        return jsonify({"error": "Invalid operation"}), 400

    return send_file(output_path, as_attachment=True)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)

