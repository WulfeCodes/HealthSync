import schedule
import time
import pytz
from bson import ObjectId
from datetime import datetime, timedelta

from mongo import update_chats_patient, retrieve_id, retrieve_notes
from openAI import question_generation
# Updating Info 
IDs: ObjectId = []
Patient_notes: list[dict[ObjectId, str]] = [{ObjectId('65c7b0bee0afe781d85e3f9d'): ['Hypothermia and other dummy issues']}, {ObjectId('65c7cdf6e0afe781d85e6467'): ['About to die, old age']}, {ObjectId('65c7ce1ae0afe781d85e6513'): ['mentally retarded']}]
User = 'AI'

# Consts
TIME = (datetime.now() + timedelta(seconds=10)).strftime("%H:%M:%S")
print(TIME[:-3])

def test_func(string):
    print(string)
    

def retrieve_id_helper(user_type):
    global IDs
    try:
        IDs = retrieve_id(user_type)
        print(IDs)
    except Exception as e:
        print(e)

def retrieve_notes_helper():
    global Patient_notes
    try:
        Patient_notes = retrieve_notes(IDs)
        print(Patient_notes)
    except Exception as e:
        print(e)    

hard_coded_questions = ["How was your sleep last night? Rate from 0 to 10.", "Did you smoke today?", "Did you consume alcohol today? Can you approximate how many ounces? If not just enter 0.", "How many times did you exercise in the last 7 days?"]

# print(generate_questions(ObjectId('65c7b0bee0afe781d85e3f9d')))

def send_variable_questions():
    global Patient_notes
    global User
    
    for patient in Patient_notes:
        for key, value in patient.items():
            # print(key)
            # print(value)
            question_list = question_generation(value)  # Assuming this function returns a list of questions
            for item in question_list:
                update_chats_patient(key, item, User)
                time.sleep(60)

def send_hardcode_questions():
    global User
    global hard_coded_questions
    
    for patient in Patient_notes:
        for key, value in patient.items():
            
            for item in hard_coded_questions:
                update_chats_patient(key, item, User)
                time.sleep(60)
    pass      
    

try:
    # Schedule the job
    schedule.every().day.at((datetime.now() + timedelta(seconds=5)).strftime("%H:%M:%S")).do(retrieve_id_helper,'Patient')
    schedule.every().day.at((datetime.now() + timedelta(seconds=5)).strftime("%H:%M:%S")).do(retrieve_notes_helper)
    schedule.every().day.at((datetime.now() + timedelta(seconds=5)).strftime("%H:%M:%S")).do(send_hardcode_questions)
    schedule.every().day.at((datetime.now() + timedelta(seconds=60)).strftime("%H:%M:%S")).do(send_variable_questions)

    counter = 0
    while True:
        # Check if the job is due
        schedule.run_pending()
        time.sleep(1)
        print(counter)
        counter+=1
            
except Exception as e:
    print(f"An error occurred: {e}")

