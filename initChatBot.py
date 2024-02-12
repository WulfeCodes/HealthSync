import os
import sys
from bson import ObjectId
import pymongo
from langchain_community.document_loaders.mongodb import MongodbLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain_community.chat_models import ChatOpenAI

from bson import ObjectId
import constants

# Initialize MongoDB client with correct connection string
client = pymongo.MongoClient("mongodb+srv://pramitbhatia25:GA45FDj59FEuqBht@cluster0.gqh1qhi.mongodb.net/?retryWrites=true&w=majority")

# Set OpenAI API key
os.environ["OPENAI_API_KEY"] = constants.APIKey

# Select database and collection
db = client['test']
collection = db['users']

def initCustomModel(object_id):
    filter_criteria = {"_id": object_id}
    document = collection.find_one(filter=filter_criteria, projection={"notes": 1})
    if document:
# Load JSON data using JSONLoader
        notes = document.get("notes", [])
        notes_text = "\n".join(notes) 
        loader = MongodbLoader(
            connection_string="mongodb+srv://pramitbhatia25:GA45FDj59FEuqBht@cluster0.gqh1qhi.mongodb.net/?retryWrites=true&w=majority",
            db_name="test",
            collection_name="users",
            filter_criteria=filter_criteria,
            )
        # var=loader.load()
        # print(var)s

        index = VectorstoreIndexCreator().from_loaders([loader])
        print("Index: ", index)
        query = sys.argv[1]
        print("Query:", query)
        print("Result:", index.query(query, llm=ChatOpenAI()))
    else:
        print('Error: Document not found')

initCustomModel(ObjectId("65c8a06e3a46efa1754079cc"))

