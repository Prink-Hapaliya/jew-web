from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for specific origin (React frontend running on localhost:3000)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Replace with your actual frontend URL if necessary

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client.authdb
users_collection = db.users

# Signup route
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # Save user in the database
    user = {"username": username, "email": email, "password": hashed_password.decode("utf-8")}
    users_collection.insert_one(user)
    return jsonify({"message": "User registered successfully"}), 201

# Login route
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Find the user in the database
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if password matches
    if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Example route for /speak_next_word
# @app.route("/speak_next_word", methods=["GET", "OPTIONS"])
# def speak_next_word():
#     return jsonify({"message": "No action for this endpoint."}), 404


# Start the Flask app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
