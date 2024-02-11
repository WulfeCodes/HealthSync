from openai import OpenAI
from pydantic import generics
OPENAI_API_KEY='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'


client = OpenAI(
    api_key=OPENAI_API_KEY,
)


messages=[
    {"role": "system", "content": "You're a friendly therapist assistant. Your job is to ask about the user's day and greet them."},
]
def ask_about_day(message_list: list, user_input: str) -> list:
  message_list.append({"role": "user", "content": user_input})
  
  response = client.chat.completions.create(
  model="gpt-3.5-turbo-0613",
  messages=message_list,
  temperature=1.5
  )
  
  message_list.append({"role": "assistant", "content": ' '.join(response.choices[0].message.content.split('\n'))})
  return message_list


def question_generation(notes):
  messages = [{
    "role": "system", "content": f"Analyse the notes that doctor collected - {notes}. Generate exactly 4 questions that can be asked on a daily basis to the patient for Data Analysis. The questions should be strictly separated by printing every question in a newline."
    }]
  response = client.chat.completions.create(
  model="gpt-3.5-turbo-0613",
  messages=messages,
  temperature=0.1
  )
  print(response.choices[0].message.content.split("\n"))
  return response.choices[0].message.content.split("\n")

def listify_string(str):
  messages = [{
    "role": "system", "content": "Convert the list of questions given to you to an a",
  }]
  response = client.chat.completions.create(
  model="gpt-3.5-turbo-0613",
  messages=messages,
  temperature=0.1
  )
  print(response.choices[0].message.content.replace("\n", "").split("@"))
  return response.choices[0].message.content.replace("\n", "").split("@")

question_generation("This patient has hypothermia.")




