import pymongo
from bson import ObjectId
from datetime import datetime, date

client = pymongo.MongoClient("mongodb+srv://pramitbhatia25:GA45FDj59FEuqBht@cluster0.gqh1qhi.mongodb.net/?retryWrites=true&w=majority")

db = client['test']
users = db['users']


def update_chats_patient(patient_id: ObjectId, content: str, username):
    filter_criteria = {'type': 'Patient', '_id': patient_id}
    
    current_date = date.today()
    current_time = datetime.now().strftime("%I:%M:%S %p")
    chat_object = {
        'content': f"{username}: {content}",
        'date': str(current_date),
        'time': str(current_time)
    }
    existing_chats = users.find_one(filter_criteria, projection={'chats': 1})
    if existing_chats and isinstance(existing_chats.get('chats'), list):
        update_operation = {
            "$addToSet": {"chats": {"$each": [chat_object]}}
        }
    else:
        update_operation = {
            "$set": {"chats": [chat_object]}
        }
    updated = users.update_one(filter_criteria, update_operation)
    print(f'Matched {updated.matched_count} document(s) and modified {updated.modified_count} document(s)')
    return updated


def retrieve_id(user_type) -> list:
    '''
    Return Id for patient or doctors
    'pass user_type: 'Doctor' / 'Patient'
    '''
    cursor = users.find({'type':user_type}).distinct('_id')
    return cursor

def retrieve_notes(patient_ids):
    notes = []
    for patient_id in patient_ids:
        try:
            patient_id_obj = ObjectId(patient_id)
            query = {'_id': patient_id_obj}
            note = users.find_one(query).get('notes', [])
            notes.append({patient_id: note})
        except Exception as e:
            print(e)
    return notes


