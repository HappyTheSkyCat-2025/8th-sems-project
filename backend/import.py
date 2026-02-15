import os
import csv
import django
import re
import random
from datetime import datetime, timedelta
from django.utils.text import slugify

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from destinations.models import (
    Region, Country, TravelDeal, TravelDealDate, 
    TravelImage, ItineraryDay, Review, FAQ
)

# --- Helper: Normalization & Cleaning ---

def clean_price(price_str):
    if not price_str: return 0.0
    cleaned = re.sub(r'[^\d.]', '', str(price_str))
    try: return float(cleaned)
    except ValueError: return 0.0

def normalize_geo(dest_string):
    mapping = {"UK": "United Kingdom", "USA": "United States", "Aus": "Australia", "UAE": "United Arab Emirates"}
    parts = [p.strip() for p in dest_string.split(',')]
    city = parts[0]
    raw_country = parts[1] if len(parts) > 1 else parts[0]
    country = mapping.get(raw_country, raw_country)
    return city, country

# --- Helper: Synthetic Data Generators ---

def generate_itinerary(deal, days):
    """Generates a day-by-day itinerary if none exists."""
    activities = [
        "Walking tour of the old town", "Visit the local museum", "Traditional lunch at a local bistro",
        "Exploring the central market", "Guided hike to scenic viewpoints", "Relaxation at a local park",
        "Evening dinner cruise", "Shopping in the fashion district", "Visit to historic landmarks"
    ]
    for i in range(1, int(days) + 1):
        ItineraryDay.objects.get_or_create(
            travel_deal=deal,
            day_number=i,
            defaults={
                'location': deal.city,
                'activities': {"morning": random.choice(activities), "afternoon": random.choice(activities)},
                'meals': {"breakfast": "Hotel", "lunch": "Local Restaurant", "dinner": "Not Included"}
            }
        )

def generate_images(deal):
    """Attaches synthetic/scraped image URLs from Unsplash."""
    if not deal.travel_image_set.exists():
        # Using Unsplash source URLs for specific cities
        for i in range(3):
            image_url = f"https://source.unsplash.com/featured/1200x800?{slugify(deal.city)},travel,{i}"
            TravelImage.objects.create(travel_deal=deal, image_url=image_url)

def generate_faqs(country_obj):
    """Generates generic FAQs for a country."""
    questions = [
        (f"Is it safe to travel to {country_obj.name}?", f"Yes, {country_obj.name} is generally safe for tourists. Always follow local guidance."),
        (f"What is the best time to visit?", "The peak season is usually between May and September."),
        ("Do I need a visa?", f"Visa requirements for {country_obj.name} depend on your nationality. Please check with your embassy.")
    ]
    for q, a in questions:
        FAQ.objects.get_or_create(country=country_obj, question=q, defaults={'answer': a})

# --- Main Import Function ---

def run_import():
    csv_file_path = 'Travel details dataset.csv'
    default_region, _ = Region.objects.get_or_create(name="Global")

    with open(csv_file_path, mode='r', encoding='utf-8-sig') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            if not row.get('Destination'): continue

            # 1. Geography
            city_name, country_name = normalize_geo(row['Destination'])
            country_obj, _ = Country.objects.get_or_create(
                slug=slugify(country_name),
                defaults={'name': country_name, 'region': default_region}
            )

            # 2. Travel Deal (Deduplicated by City + Days)
            days = int(float(row.get('Duration (days)', 0)))
            deal_slug = slugify(f"{city_name}-{days}-days")
            acc_cost = clean_price(row.get('Accommodation cost'))
            
            deal, created = TravelDeal.objects.update_or_create(
                slug=deal_slug,
                defaults={
                    'title': f"{days} Days in {city_name}",
                    'country': country_obj,
                    'city': city_name,
                    'days': days,
                    'price': f"€{acc_cost}",
                }
            )

            # 3. Travel Deal Date
            try:
                start_dt = datetime.strptime(row['Start date'], '%m/%d/%Y').date()
                trans_cost = clean_price(row.get('Transportation cost'))
                
                TravelDealDate.objects.get_or_create(
                    travel_deal=deal,
                    start_date=start_dt,
                    defaults={
                        'end_date': start_dt + timedelta(days=days),
                        'original_price': f"€{acc_cost + trans_cost}",
                        'discounted_price': f"€{acc_cost + trans_cost}",
                    }
                )
            except: pass

            # 4. Populate Synthetic/Scraped Data
            generate_itinerary(deal, days)
            generate_images(deal)
            generate_faqs(country_obj)
            
            # 5. Create Review from CSV Traveler
            Review.objects.get_or_create(
                travel_deal=deal,
                name=row.get('Traveler name', 'Anonymous'),
                defaults={
                    'rating': random.randint(4, 5),
                    'content': f"Amazing trip! Being from {row.get('Traveler nationality')}, I found the {row.get('Accommodation type')} in {city_name} to be wonderful.",
                    'is_approved': True
                }
            )

            print(f"Processed: {city_name} ({'New' if created else 'Updated'})")

if __name__ == "__main__":
    run_import()