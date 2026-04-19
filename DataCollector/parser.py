import requests
import codecs
import json
import re
import os

random = requests.get("https://gram.cerm.ru/?mod=spelling").content
with codecs.open("random.html", "wb") as f:
    f.write(random)

data = re.search(r"<div id=\"spelling_alphabetical_words_nav\">.+Я</a></div>", random.decode()) 

links = data.group().replace('<div id=\"spelling_alphabetical_words_nav\">', "").split("</a>")[:-1]

links = {link[-1]: link.replace('<a href="', "")[:-3] for link in links}

try:
    os.mkdir("Words")
except FileExistsError:
    pass 

dictionary = {}

for letter in links.keys():
    print(f"Processing letter: {letter}")
    response = requests.get(links[letter]).content
    with codecs.open(f"Words/{letter}.html", "wb") as f:
        f.write(response)
    response = response.decode()

    data = re.search(r"<div id=\"spelling_search_results\">(.*?)</div>", response, re.DOTALL).group().strip()

    words = data.replace("<div id=\"spelling_search_results\">", "").replace("</div>", "").strip()

    words = re.findall(r"<a class=\"spelling_search_result\" href=\"https://gram.cerm.ru/spelling/(.*?)\">(.*?)</a>", words)

    words = [re.findall(r"(.*?)<span class=\"right\">(.*?)</span>(.*)", word[1]) for word in words]

    answers = {word[0][0].lower() + word[0][2].lower(): word[0][1].lower() for word in words}

    with codecs.open(f"Words/{letter}.json", "w") as f:
        json.dump(answers, f)
    print(f"--Letter: {letter} writed")

    dictionary.update(answers)

with codecs.open("answers.json", "w") as f:
        json.dump(dictionary, f)
print("Complete")