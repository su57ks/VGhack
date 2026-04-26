import json
import codecs

with codecs.open("answers.json", "r", "utf_8_sig") as f:
    data = json.load(f)

print(data.get(input(), "unknown"))