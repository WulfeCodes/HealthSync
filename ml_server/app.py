from flask import Flask, jsonify, request
from flask_cors import CORS
from time import sleep
from openai import OpenAI
client = OpenAI()
import os
import sys
from bson import ObjectId
import pymongo
from langchain_community.document_loaders.mongodb import MongodbLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain_community.chat_models import ChatOpenAI

from bson import ObjectId
import constants


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route("/api/getAIResponse", methods=["GET", "POST"])
def getAIResponse():
    if request.method == "POST":
        try:
            sleep(1)
            data = request.get_json()
            email = data.get("email", "")
            chats = data.get("chats", "")
            content_list = [chat['content'] for chat in chats]
            # try:
            #     LLM(email, content_list[len(content_list)-1])
            # except Exception as e:
            #     print(e)
            res = getR(email, content_list)
            print(res)
        except Exception as e:
            print("EXCPETION")
            print(e)
    return jsonify({"status":"ok", "ai_response": res})


def getR(email, chats):
    print("Fetching R")
    roles = []
    roles.append("system")  # Add the system role

    # Define the system message
    bg = getBg(email)
    import ast  # Import ast module to parse the string into a dictionary

        # Assuming bg contains the document data
    document_data_str = bg[0].page_content
    print(document_data_str)

    # Extracting relevant fields
    document_data_dict = eval(document_data_str)  # Convert the string to a dictionary
    patient_name = document_data_dict.get('name', '')
    patient_age = document_data_dict.get('age', '')
    patient_phone = document_data_dict.get('phone', '')
    patient_email = document_data_dict.get('email', '')
    notes = document_data_dict.get('notes', [])

    # Constructing the summary
    summary = f"Patient Summary:\n"
    summary += f"Name: {patient_name}\n"
    summary += f"Age: {patient_age}\n"
    summary += f"Phone: {patient_phone}\n"
    summary += f"Email: {patient_email}\n"
    summary += f"Notes: {notes[0]}\n"

    print(summary)

    system_message = f"You are an assistant AI that's designed to help out a doctor with data collection. DO NOT ASK ANY QUESTIONS TO THE PATIENT. YOU HAVE ACCESS TO THE PATIENTS DIAGNOSIS, the patients diagnosis is in the notes of teh summary provided. Make sure to comfort the patient and communicate. Here is some background information about the patient:{summary} Remember to not ask any questions at all! We have a separate script for that... YOU ARE NOT PERMITTED TO ASK QUESTIONS!"

    # Construct the completion messages
    completion_messages = [{"role": "system", "content": system_message}]

    for cha in chats:
        role, message = cha.split(":", 1)  # Split only once to preserve any colons in the message
        roles.append("assistant" if role.strip() == "AI" else "user")  # Map AI to assistant or system, other roles to user
        completion_messages.append({"role": "assistant" if role.strip() == "AI" else "user", "content": message.strip()})

    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=completion_messages)

    result = response.choices[0].message.content
    return result


def getBg(email):
    # Initialize MongoDB client with correct connection string
    client = pymongo.MongoClient("mongodb+srv://pramitbhatia25:GA45FDj59FEuqBht@cluster0.gqh1qhi.mongodb.net/?retryWrites=true&w=majority")

    # Select database and collection
    db = client['test']
    collection = db['users']

    def initCustomModel(email):
        filter_criteria = {"email": email}
        document = collection.find_one(filter=filter_criteria, projection={"notes": 1})
        if document:
            # Load JSON data using JSONLoader
            loader = MongodbLoader(
                connection_string="mongodb+srv://pramitbhatia25:GA45FDj59FEuqBht@cluster0.gqh1qhi.mongodb.net/?retryWrites=true&w=majority",
                db_name="test",
                collection_name="users",
                filter_criteria=filter_criteria,
                )
            
            return loader.load()
        else:
            print('Error: Document not found')
            return "Error"

    return initCustomModel(email)


if __name__ == "__main__":
    app.run(debug=True)
