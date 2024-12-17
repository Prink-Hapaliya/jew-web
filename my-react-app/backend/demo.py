import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["prink_gmail_com"]
mycol = mydb["ring"]

mydict = { "image_path": "C:\\Users\\prink\\Documents\\full_jew_app\\my-react-app\\frontend\\src\\components\\Assets\\person.png", "address": "Highway 37" }

x = mycol.insert_one(mydict)
