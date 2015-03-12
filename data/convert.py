#!/usr/bin/env python
import csv
import json

def csv2json(filename):
    reader = csv.reader(open(filename))

    items = []
    header = next(reader)
    for row in reader:
        item = dict(zip(header, row))
        items.append(item)

    f = open(filename.replace(".csv", ".json"), "w")
    f.write(json.dumps(items, ensure_ascii=False, indent=True))
    f.close()

if __name__ == "__main__":
    filenames = ["enemy_info.csv", "area.csv", "collection.csv", "player.csv"]

    for filename in filenames:
        csv2json(filename)
    

