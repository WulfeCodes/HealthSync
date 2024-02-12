import os
import sys
from bson import ObjectId
import pymongo
from langchain_community.document_loaders.mongodb import MongodbLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain_community.chat_models import ChatOpenAI
from datetime import datetime

from bson import ObjectId
import constants

client = pymongo.MongoClient("mongodb+srv://pramitbhatia25:GA45FDj59FEuqBht@cluster0.gqh1qhi.mongodb.net/?retryWrites=true&w=majority")

# Set OpenAI API key
os.environ["OPENAI_API_KEY"] = constants.APIKey

# Select database and collection
db = client['test']
collection = db['users']

filter

def summarizeOnePatient(collection):
    for document in collection.find():
    # Check if the document type is "doctor"
        if document.get("type") == "Patient":
                print("Found a patient")
        # Iterate through patients in the document
                recent_chats = []
            # Iterate through chats for the patient
                for chat in document.get("chats", []):
                    print(chat)
                # Assuming chat date is in the format "YYYY-MM-DD"
                    chat_date = datetime.strptime(chat.get("date"), "%Y-%m-%d")
                    print(chat_date)
                # Check if chat date is the same as the current date
                    if chat_date.date() == datetime.now().date():
                        recent_chats.append(chat)
                    else:
                    # Print recent chats for the current patient
                        object_id = document.get("_id")
                        filter_criteria = {"_id": object_id}
                        loader = MongodbLoader(
                            connection_string="mongodb+srv://pramitbhatia25:GA45FDj59FEuqBht@cluster0.gqh1qhi.mongodb.net/?retryWrites=true&w=majority",
                            db_name="test",
                            collection_name="users",
                            filter_criteria=filter_criteria,
                        )
                        query = "summarize the chats and seperate them by periods" + str(recent_chats)
                        print("Query:", query)
                        index = VectorstoreIndexCreator().from_loaders([loader])
                        #print("Result:", index.query(query))
                        result = index.query(query)
                        print("ok")
                        doctorEmail = document.get("doctorEmail")
                        docQuery = {"doctorEmail": doctorEmail}

                        docDoc = collection.find(docQuery)

                        for doc in docDoc:
    # Process each document as needed
                            doctoraiGen = doc.get("aiGeneratedInfo", [])
                            doctor_summary = doctoraiGen.get("doctorSummary", [])
                            doctor_summary.append(result)
                            collection.update_one({"_id": doc["_id"]}, {"$set": {"aiGeneratedInfo.doctorSummary": doctor_summary}})
                            print("Success!")
                        #append docDoc's doctorSummary
                        #summarize, then send to doctor
                    # Clear recent_chats for the next patient
                        recent_chats = []
                    # Move to the next patient
                        next

summarizeOnePatient(collection)