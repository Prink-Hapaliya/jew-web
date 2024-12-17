from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import os
from werkzeug.utils import secure_filename
from EmailStore import EmailStore

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for the frontend (React on localhost:3000)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

#email object
EmailStore = EmailStore()


# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client.authdb
users_collection = db.users

# Set the upload folder and allowed extensions
UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


# save email
# images_collection=None




# Helper function for hashing passwords
def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

# Helper function for verifying passwords
def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

# Helper function to check file extension
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# def save_email(email_id):
#     print(type(email_id))
#     get_email().email=email_id
#     print("save_email",email_id)
    
# def get_email():
#     email = ""
#     print("get_email",email)
    
# Signup route
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    # Check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    # Save user to the database
    user = {
        "username": username,
        "email": email,
        "password": hash_password(password),
    }
    users_collection.insert_one(user)

    return jsonify({"message": "User registered successfully"}), 201

# Login route
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    # Find user in the database
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if password matches
    if verify_password(password, user["password"]):
        EmailStore.save_email(email)
        
        user_db_name = email.replace("@", "_").replace(".", "_") 
        user_db = client[user_db_name]
        images_collection = user_db.ring
        print(user_db_name)
        print(user_db)
        print(images_collection)
        print(type(images_collection))
        print("*")
        print("done database connection")
        return jsonify({"success": True, "message": "Login successful!"}), 200
    else:
        email = None
        return jsonify({"success": False, "message": "Invalid credentials"}), 401
    
@app.route('/api/images', methods=['GET'])
def get_images():
    try:
        email = EmailStore.get_email()
        print(email)    
        user_db_name = email.replace("@", "_").replace(".", "_") 
        user_db = client[user_db_name]
        images_collection = user_db.ring
        # Query parameters for pagination
        page = int(request.args.get('page', 1))  # Default to page 1
        page_size = int(request.args.get('page_size', 25))  # Default to 25 images per page
        print("page_size",page_size)
        print("images_collection",images_collection)
        # Find all image paths
        all_images_cursor = images_collection.find()
        print("image",all_images_cursor)
        all_images = [doc["image_path"] for doc in all_images_cursor]
        print("image",all_images)
        print("%"*10)
        # Paginate the results
        start = (page - 1) * page_size
        end = start + page_size
        paginated_images = all_images[start:end]

        return jsonify({
            "images": paginated_images,
            "page": page,
            "total": len(all_images),
            "pages": -(-len(all_images) // page_size)  # Ceiling division for total pages
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
    
    
# Route to show the upload form
@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Get form data
        price = request.form['price']
        detail = request.form['detail']
        image = request.files['image']

        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)

            # Save product to MongoDB
            mongo.db.products.insert_one({
                'price': price,
                'detail': detail,
                'imagePath': image_path
            })

            return redirect(url_for('index'))

    return render_template('upload.html')


    
# Handle unknown routes
@app.errorhandler(404)
def not_found(e):
    return jsonify({"message": "Endpoint not found"}), 404

# Start the Flask app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
