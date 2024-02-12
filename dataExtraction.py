import os
import sys
import re
from bson import ObjectId
import pymongo
from langchain_community.document_loaders.mongodb import MongodbLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain_community.chat_models import ChatOpenAI
from datetime import datetime, timedelta

from bson import ObjectId
import constants

client = pymongo.MongoClient("mongodb+srv://pramitbhatia25:GA45FDj59FEuqBht@cluster0.gqh1qhi.mongodb.net/?retryWrites=true&w=majority")

# Set OpenAI API key
os.environ["OPENAI_API_KEY"] = constants.APIKey

# Select database and collection
db = client['test']
collection = db['users']

sleepQuest =  "How was your sleep last night? Rate from 0 to 10."
smokeQuest = "Did you smoke today?"
alcQuest = "Did you consume alcohol today? Can you approximate how many ounces? If not just enter 0."
exercizeQuest = "How many times did you exercise in the last 7 days?"



def find_number(text):
    # Define the regular expression pattern to match numbers
    pattern = r'[-+]?\d*\.?\d+'
    
    # Find all matches of the pattern in the text
    matches = re.findall(pattern, text)
    
    # Convert the matched strings to numbers and return the first one found
    for match in matches:
        try:
            return float(match)
        except ValueError:
            pass  # Ignore if conversion to float fails
    
    # If no valid number is found, return None
    return None

def find_yes_or_no(text):
    # Define the regular expression pattern to match "yes" or "no" in various formats
    pattern = r'\b(?:yes|no|y|n)\b'
    
    # Find all matches of the pattern in the text
    matches = re.findall(pattern, text, re.IGNORECASE)
    
    # If matches are found, return the first match
    if matches:
        return matches[0].lower()  # Return the match in lowercase
    else:
        return None

def exercizeFun(document, chat):
    ai_generated_info = document.get("aiGeneratedInfo", {})
    exercize_array = ai_generated_info.get("exercise", [])
    exerString = chat.get("content")
    print("Finding Exercise Value In ", exerString)
    number=find_number(exerString)
    print(number)
    
    if number:
        exercize_array.append(number)
        print("excersize appended w number ", number)
    else:
        exercize_array.append(0)
        print("excersize appended w 0")

    return exercize_array

def alcFunc(document, chat):
    ai_generated_info = document.get("aiGeneratedInfo", {})
    alcohol_array = ai_generated_info.get("alcohol", [])
    #analyze and locate valid int
    alcString = chat.get("content")
    print("Finding Alcohol Number In This Chat: ", alcString)
    number = find_number(alcString)
    print(number)
    
    if number:
        alcohol_array.append(number)
        print("alc appended w number ", number)
    else:
        alcohol_array.append(0)
        print("alc appended w 0")

    return alcohol_array


def mentalHealthFunc(document, chat):
    ai_generated_info = document.get("aiGeneratedInfo", {})
    mhfarr = ai_generated_info.get("mentalHealthScore", [])
    smoking = ai_generated_info.get("smoking", [])
    alcohol = ai_generated_info.get("alcohol", [])
    exercise = ai_generated_info.get("exercise", [])
    age = ai_generated_info.get("age", [])

    if(len(alcohol) == 0):
        return []

    smoking = smoking[len(smoking)-1]
    alcohol = alcohol[len(alcohol)-1]
    exercise = exercise[len(exercise)-1]
    age = age[len(age)-1]

    if smoking:
        s = 1
    else:
        s = 0

    import math

    z = (0.30491) - (0.437)*(s) + 10.14374*(alcohol) + 10.32001*(math.log(age))
    e_power_minus_z = math.exp(-z)
    denominator = 1 + e_power_minus_z
    result = 100 / denominator
    print("Result:", result)
    mhfarr.append(result)
    return mhfarr


def smokeFun(document, chat):
    ai_generated_info = document.get("aiGeneratedInfo", {})
    smoking_array = ai_generated_info.get("smoking", [])
    #analyze and locate yes or no
    smokeString = chat.get("content")
    print("Finding Smoke String In ", smokeString)
    ans = find_yes_or_no(smokeString)
    print(ans)
    # Access the smoking array within aiGeneratedInfo
    if ans:
        print(ans)
        if(ans == "yes" or ans == "y"):
            smoking_array.append(True)
            print("smoking appended w ans ", ans)
        else:
            smoking_array.append(False)
            print("smoking appended w ans ", ans)
    else:
        #append null
        smoking_array.append(False)
        print("smoking appended w no")
    return smoking_array

def ageFunc(document, chat):
    if(len(document.get("chats")) == 1):
        return []
    ai_generated_info = document.get("aiGeneratedInfo", {})
    agearr = ai_generated_info.get("age", [])
    agearr.append(document.get("age"))
    return agearr

def sleepFun(document, chat):
    ai_generated_info = document.get("aiGeneratedInfo", {})
    sleeping_array = ai_generated_info.get("sleep_efficiency", [])
    #analyze and locate 0-10
    sleepString = chat.get("content")
    print("Finding Sleep String In ", sleepString)
    number = find_number(sleepString)
    if number:
        print("sleeping appended w number ", number)
        sleeping_array.append(number)
    else:
        sleeping_array.append(0)
        print("sleeping appended w 0")
    return sleeping_array

def contains_sleep_question(temp_str):
    sleep_pattern = re.escape("How was your sleep last night? Rate from 0 to 10.")
    return bool(re.search(sleep_pattern, temp_str, re.IGNORECASE))

def contains_smoke_question(temp_str):
    smoke_pattern = re.escape("Did you smoke today?")
    return bool(re.search(smoke_pattern, temp_str, re.IGNORECASE))

def contains_alcohol_question(temp_str):
    alc_pattern = re.escape("Did you consume alcohol today? Can you approximate how many ounces? If not just enter 0.")
    return bool(re.search(alc_pattern, temp_str, re.IGNORECASE))

def contains_exercise_question(temp_str):
    exercise_pattern = re.escape("How many times did you exercise in the last 7 days?")
    return bool(re.search(exercise_pattern, temp_str, re.IGNORECASE))


def update_document(collection, document_id, updated_data):
    # Update the document in the collection
    collection.update_one({"_id": document_id}, {"$set": updated_data})

def dataExtract(collection):
    sleepBool = False
    smokeBool = False
    alcBool = False
    exerBool = False
    checker = False
    
    for document in collection.find():
    # Check if the document type is "doctor"
        if document.get("type") == "Patient":
            for chat in document.get("chats", []):
                tempStr = chat.get("content")  
            # Assuming chat date is in the format "YYYY-MM-DD"
                chat_date = datetime.strptime(chat.get("date"), "%Y-%m-%d")
                today = datetime.now().date()
                yesterday = today - timedelta(days=1)
            # Check if chat date is the same as the current date
                if chat_date.date() == today or chat_date.date() == yesterday:
                    if checker:
                        if exerBool:
                            updated_data = {"aiGeneratedInfo.exercise": exercizeFun(document, chat)}
                            exerBool=False
                            checker=False
                        elif alcBool:
                            updated_data = {"aiGeneratedInfo.alcohol": alcFunc(document, chat)}
                            alcBool=False
                            checker=False
                        elif sleepBool:
                            updated_data = {"aiGeneratedInfo.sleep_efficiency": sleepFun(document, chat)}
                            sleepBool=False
                            checker=False
                        elif smokeBool:
                            updated_data = {"aiGeneratedInfo.smoking": smokeFun(document, chat)}
                            smokeBool=False
                            checker=False

                        update_document(collection, document["_id"], updated_data)

                    else:
                        print("TEMP STR")
                        print(tempStr)

                        if contains_smoke_question(tempStr):
                            print("Found Smoke Q")
                            smokeBool = True
                            checker=True

                        elif contains_exercise_question(tempStr):
                            print("Found Exercise Q")
                            exerBool = True
                            checker=True

                        elif contains_alcohol_question(tempStr):
                            print("Found Alcohol Q")
                            alcBool = True
                            checker=True

                        elif contains_sleep_question(tempStr):
                            print("Found Sleep Q")
                            sleepBool=True
                            checker=True

                        else:
                            continue
                        
                else:
                    continue

            updated_data = {"aiGeneratedInfo.age": ageFunc(document, chat)}
            update_document(collection, document["_id"], updated_data)

            updated_data = {"aiGeneratedInfo.mentalHealthScore": mentalHealthFunc(document, chat)}
            update_document(collection, document["_id"], updated_data)

        else:
            print("Not A PATIENT!")
dataExtract(collection)