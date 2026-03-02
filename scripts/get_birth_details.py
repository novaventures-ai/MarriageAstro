import csv
with open('C:/Users/Rahul.Govalkar/Documents/Personal/Scraper ai/results/FINAL_COMBINED_RANKING_V2.csv', 'r', encoding='utf-8-sig') as f:
    r = csv.DictReader(f)
    for row in r:
        name = row['Name'].lower()
        if 'sheetal ghatad' in name or 'ashwini' in name:
            print(f"--- {row['Name']} ---")
            print("Birth:", row['DOB'], row['BirthTime'], row['BirthPlace'])
            print("Lat/Lon:", row.get('Lat'), row.get('Lon'))
