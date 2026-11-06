import urllib.request
import re
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

def get_unsplash_photos(slug):
    url = f'https://unsplash.com/s/photos/{slug}'
    req = urllib.request.Request(url, headers=headers)
    try:
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')
        matches = re.findall(r'https://images\.unsplash\.com/photo-([0-9a-zA-Z\-]+)', html)
        unique = list(dict.fromkeys(matches))[:8]
        print(f'{slug}: found {len(unique)} photos')
        for m in unique[:4]:
            print(f'   photo-{m}')
        return unique
    except Exception as e:
        print(f'{slug} error: {e}')
        return []

get_unsplash_photos('couple-sunset-mountains')
get_unsplash_photos('happy-couple-romantic-sunset')
get_unsplash_photos('female-therapist-counselor')
get_unsplash_photos('hands-holding-house')
get_unsplash_photos('romantic-couple-silhouette')
