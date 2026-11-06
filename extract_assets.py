from PIL import Image
import os

img_path = r'C:\Users\Lenovo\.gemini\antigravity\brain\c9d31007-512a-43f0-8e7c-67fa6583f62c\.user_uploaded\media_1793388732929_ac192ce5.jpg'
out_dir = r'd:\Downloads\Living_Relationships_Fullstack_Realtime_WebSocket\living_relationships_fullstack\frontend\public'

img = Image.open(img_path)
w, h = img.size
print(f'Input image size: {w}x{h}')

# 1. Official Logo (navbar top left)
logo = img.crop((12, 10, 185, 52))
logo.save(os.path.join(out_dir, 'maanmitra-original-logo.png'))

# 2. Hero Couple Right Visual
hero_img = img.crop((328, 80, 672, 368))
hero_img.save(os.path.join(out_dir, 'hero-couple-reference.jpg'), quality=95)

# 3. Card 1 (Find Your Partner)
card1 = img.crop((22, 380, 235, 502))
card1.save(os.path.join(out_dir, 'card-partner-reference.jpg'), quality=95)

# 4. Card 2 (Expert Counselling)
card2 = img.crop((249, 380, 444, 502))
card2.save(os.path.join(out_dir, 'card-counselling-reference.jpg'), quality=95)

# 5. Card 3 (Live-in Guidance)
card3 = img.crop((458, 380, 660, 502))
card3.save(os.path.join(out_dir, 'card-guidance-reference.jpg'), quality=95)

# 6. Bottom CTA couple background
cta_couple = img.crop((480, 824, 674, 936))
cta_couple.save(os.path.join(out_dir, 'cta-couple-reference.jpg'), quality=95)

print('All assets extracted successfully!')

