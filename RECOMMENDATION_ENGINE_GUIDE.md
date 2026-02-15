# 🎯 Recommendation Engine Implementation Guide

## Overview

This document explains how to integrate the recommendation engine into your travel platform. Multiple strategies are provided:

1. **Rule-Based** - Simple, fast, requires no ML
2. **Collaborative Filtering** - Based on user behavior similarities
3. **Content-Based** - Based on deal attributes
4. **Hybrid** - Combines multiple approaches
5. **ML-Based** - Advanced scikit-learn powered

---

## ✅ Quick Start

### 1. **No Installation Needed for Basic Features**
Basic recommendations are built into `utils/recommendations.py` and `utils/recommendation_views.py` with zero dependencies.

### 2. **For ML Features (Optional)**
```bash
pip install scikit-learn scipy
```

### 3. **Test the Installation**
```bash
python manage.py train_recommendations
```

---

## 📋 API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. **Trending Deals**
```
GET /api/utils/recommendations/trending/?limit=10
```
Returns most wishlisted and highest-rated deals.

**Example Response:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "title": "Paris Romance",
      "country": "France",
      "price": "€2500",
      "themes": ["romance", "culture"]
    }
  ]
}
```

#### 2. **Similar Deals**
```
GET /api/utils/recommendations/similar/<deal_id>/?limit=5
```
Finds deals with similar country, theme, or style.

#### 3. **High-Rated Deals**
```
GET /api/utils/recommendations/high-rated/?min_rating=4.0&limit=10
```
Shows deals with average rating ≥ min_rating.

#### 4. **Budget-Friendly Deals**
```
GET /api/utils/recommendations/budget/?max_price=3000&limit=10
```
Finds deals within specified budget.

---

### Authenticated Endpoints (Login Required)

#### 5. **Personalized Recommendations**
```
GET /api/utils/recommendations/personalized/?limit=10
Authorization: Bearer <token>
```
Smart recommendations based on user's wishlist preferences, themes, and styles. Falls back to trending if user has no wishlist.

**Features:**
- Analyzes user's wishlisted deals
- Extracts preferred themes and styles
- Recommends similar deals not yet wishlisted
- Weighted by popularity and ratings

#### 6. **User Preferences & Similar Users**
```
GET /api/utils/recommendations/preferences/
Authorization: Bearer <token>
```
Shows user's category preferences and recommendations from similar users.

**Response:**
```json
{
  "preferences": {
    "Adventure": 3,
    "Culture": 2,
    "Beach": 1
  },
  "recommendations_from_similar_users": {
    "count": 5,
    "results": [...]
  }
}
```

---

## 🛠️ How to Use in Frontend (React)

### Example: Fetch Trending Deals
```javascript
// utils/api.js
export const fetchTrendingDeals = async (limit = 10) => {
  const response = await axios.get(`/api/utils/recommendations/trending/`, {
    params: { limit }
  });
  return response.data.results;
};

// src/components/TrendingDeals.jsx
import { useEffect, useState } from 'react';
import { fetchTrendingDeals } from '../utils/api';

export function TrendingDeals() {
  const [deals, setDeals] = useState([]);
  
  useEffect(() => {
    fetchTrendingDeals(10).then(setDeals);
  }, []);
  
  return (
    <div className="deals-grid">
      {deals.map(deal => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}
```

### Example: Personalized Recommendations
```javascript
// Requires user to be logged in
export const fetchPersonalizedRecs = async (token, limit = 10) => {
  const response = await axios.get(
    `/api/utils/recommendations/personalized/`,
    {
      params: { limit },
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data.results;
};
```

### Example: "You Might Also Like"
```javascript
export const fetchSimilarDeals = async (dealId, limit = 5) => {
  const response = await axios.get(
    `/api/utils/recommendations/similar/${dealId}/`,
    { params: { limit } }
  );
  return response.data.results;
};

// Use in DealDetailPage.jsx
<section className="similar-deals">
  <h3>You Might Also Like</h3>
  {similarDeals.map(deal => (
    <DealCard key={deal.id} deal={deal} />
  ))}
</section>
```

---

## 🧠 Recommendation Strategy Comparison

| Feature | Rule-Based | Collaborative | Content-Based | ML Hybrid |
|---------|-----------|---------------|---------------|-----------|
| **Implementation Time** | Hours | Days | Days | Days |
| **Data Required** | Minimal | Users + Wishlists | Deal descriptions | All |
| **Accuracy** | Low-Medium | High (many users) | Medium | Very High |
| **Cold Start Problem** | No | Yes | No | Moderate |
| **Dependencies** | None | Django ORM | None | scikit-learn |
| **Best For** | MVP | Mature app | Initial launch | Scale |

---

## 📊 Behind the Scenes

### Rule-Based (Used by Default)

**Trending Deals:**
```python
# Counts wishlists and reviews, sorts by popularity
queryset.annotate(
    wishlist_count=Count('wishlisted_by'),
    avg_rating=Avg('reviews__rating')
).order_by('-wishlist_count', '-avg_rating')
```

**Similar Deals:**
```python
# Matches by country, themes, or style
TravelDeal.objects.filter(
    Q(country=deal.country) |
    Q(themes__overlap=deal.themes) |
    Q(style=deal.style)
)
```

**User-Based:**
```python
# Extracts themes from user's wishlist, recommends deals with matching themes
user_themes = set()
for deal in user_wishlist:
    user_themes.update(deal.themes)

recommendations = TravelDeal.objects.filter(
    themes__overlap=list(user_themes)
)
```

### Collaborative Filtering

**How it Works:**
1. Creates a user × deal interaction matrix
2. Calculates similarity between current user and all other users
3. Recommends deals liked by similar users that current user hasn't wishlisted

**Advantages:**
- Discovers deals user wouldn't find by theme (serendipity)
- Works well with engaged users
- No content analysis needed

**Limitations:**
- Needs critical mass of users
- New users get no recommendations until they wishlist items

### Content-Based (TF-IDF)

**How it Works:**
1. Vectorizes deal descriptions using TF-IDF
2. Calculates similarity between documents
3. Recommends deals with similar descriptions

**Advantages:**
- Works with few users
- New deals get recommendations immediately
- Interpretable (based on actual content)

---

## 🔧 Advanced Configuration

### Customize Recommendation Weights

Edit `utils/recommendations.py`:

```python
@staticmethod
def get_user_recommendations(user, limit=10):
    # Adjust these weights:
    THEME_WEIGHT = 0.5
    COUNTRY_WEIGHT = 0.3
    STYLE_WEIGHT = 0.2
    
    # Or use Django settings
    from django.conf import settings
    limit = getattr(settings, 'RECOMMENDATION_LIMIT', 10)
```

### Add Custom Filters

```python
@staticmethod
def get_adventure_for_budget_users(user, max_price=2000, limit=5):
    """Get adventure deals for budget-conscious users"""
    recommendations = UserBasedRecommendations.get_user_recommendations(user)
    return [d for d in recommendations 
            if float(d.price.replace('€', '')) <= max_price][:limit]
```

### Track Recommendation Performance

Add to `utils/models.py`:

```python
from django.db import models

class RecommendationClick(models.Model):
    """Track which recommendations users interact with"""
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    recommended_deal = models.ForeignKey('destinations.TravelDeal', on_delete=models.CASCADE)
    recommendation_type = models.CharField(
        max_length=50, 
        choices=[
            ('trending', 'Trending'),
            ('personalized', 'Personalized'),
            ('similar', 'Similar'),
            ('collab', 'Collaborative'),
        ]
    )
    clicked = models.BooleanField(default=False)
    wishlisted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

Then use Django signals to track interactions:

```python
from django.db.models.signals import post_save
from destinations.models import WishlistItem

def track_recommendation_success(sender, instance, created, **kwargs):
    if created:
        # Find if this was from a recommendation
        RecommendationClick.objects.filter(
            user=instance.user,
            recommended_deal=instance.deal,
            clicked=False
        ).update(wishlisted=True)

post_save.connect(track_recommendation_success, sender=WishlistItem)
```

---

## 🎓 Learning Resources

- **Collaborative Filtering**: https://developers.google.com/machine-learning/recommendation
- **Content-Based Filtering**: https://en.wikipedia.org/wiki/Collaborative_filtering
- **scikit-learn**: https://scikit-learn.org/
- **Django Q Objects**: https://docs.djangoproject.com/en/stable/topics/db/queries/#complex-lookups-with-q-objects

---

## 🚀 Next Steps

1. **Deploy**: Push to production and monitor API usage
2. **A/B Test**: Compare different recommendation strategies
3. **Gather Data**: Collect clicks, wishlists, reviews
4. **Iterate**: Use performance data to improve algorithms
5. **Scale**: Consider caching recommendations as deals grow

---

## 📞 Troubleshooting

**Q: No recommendations returned?**
- Check if deals exist: `TravelDeal.objects.count()`
- Ensure user has wishlisted items (for personalized)
- Review `train_recommendations` output

**Q: ML recommendations not working?**
- Run: `pip install scikit-learn`
- Check: `python manage.py train_recommendations`
- Verify data: `WishlistItem.objects.count()`

**Q: Performance issues?**
- Add caching: `from django.views.decorators.cache import cache_page`
- Use pagination: `?limit=10`
- Index database fields: `db_index=True` on `themes`, `country`, `style`

---

**Created**: February 2026  
**Status**: Production Ready  
**Maintenance**: Keep scikit-learn updated for security patches
