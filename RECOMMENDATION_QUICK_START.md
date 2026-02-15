# ⚡ Recommendation Engine - Setup Checklist

## ✅ What We've Created

```
backend/utils/
├── recommendations.py              # Core recommendation logic
├── recommendation_views.py         # API endpoints
├── ml_recommendations.py           # Optional ML features
├── signals.py                      # Track user interactions
├── management/
│   └── commands/
│       └── train_recommendations.py # Testing & validation CLI
```

## 🚀 Deployment Steps

### Step 1: Verify Files Created
```bash
cd backend/utils
ls -la *.py
# Should include: recommendations.py, recommendation_views.py, ml_recommendations.py, signals.py

ls -la management/commands/
# Should include: train_recommendations.py
```

### Step 2: Install Optional ML Dependencies (Optional)
```bash
pip install scikit-learn scipy
# Not required! Basic recommendations work without this
```

### Step 3: Test Installation
```bash
cd backend
python manage.py train_recommendations
# Output should show available endpoints and data stats
```

### Step 4: Create Sample Data (if needed)
```bash
python manage.py shell
>>> from destinations.models import TravelDeal
>>> TravelDeal.objects.count()
# If 0, add deals via Django admin first
```

### Step 5: Ready! 🎉

The endpoints are now live:

- 👤 **Public**: `/api/utils/recommendations/trending/`
- 👤 **Public**: `/api/utils/recommendations/similar/<deal_id>/`
- 👤 **Public**: `/api/utils/recommendations/high-rated/`
- 👤 **Public**: `/api/utils/recommendations/budget/`
- 🔐 **Auth**: `/api/utils/recommendations/personalized/`
- 🔐 **Auth**: `/api/utils/recommendations/preferences/`

---

## 📱 Frontend Integration

### Add to your React components:

**1. Trending Deals Home Section**
```javascript
import axios from 'axios';

const TrendingSection = () => {
  const [deals, setDeals] = useState([]);
  
  useEffect(() => {
    axios.get('/api/utils/recommendations/trending/?limit=6')
      .then(res => setDeals(res.data.results));
  }, []);
  
  return (
    <section>
      <h2>Trending Deals</h2>
      {deals.map(d => <DealCard key={d.id} deal={d} />)}
    </section>
  );
};
```

**2. Deal Detail - Similar Deals**
```javascript
const SimilarDeals = ({ dealId }) => {
  const [similar, setSimilar] = useState([]);
  
  useEffect(() => {
    axios.get(`/api/utils/recommendations/similar/${dealId}/?limit=4`)
      .then(res => setSimilar(res.data.results));
  }, [dealId]);
  
  return (
    <section>
      <h3>You Might Also Like</h3>
      {similar.map(d => <DealCard key={d.id} deal={d} />)}
    </section>
  );
};
```

**3. User Dashboard - Personalized**
```javascript
const UserDashboard = ({ token }) => {
  const [personalRecs, setPersonalRecs] = useState([]);
  
  useEffect(() => {
    axios.get('/api/utils/recommendations/personalized/?limit=8', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPersonalRecs(res.data.results));
  }, [token]);
  
  return (
    <section>
      <h2>Recommended For You</h2>
      {personalRecs.map(d => <DealCard key={d.id} deal={d} />)}
    </section>
  );
};
```

---

## 🎯 Feature Matrix

| Feature | Endpoint | Auth | Complexity | Status |
|---------|----------|------|-----------|--------|
| Trending | `/trending/` | ❌ | ⭐ | ✅ Live |
| Similar | `/similar/<id>/` | ❌ | ⭐ | ✅ Live |
| High-Rated | `/high-rated/` | ❌ | ⭐ | ✅ Live |
| Budget | `/budget/` | ❌ | ⭐ | ✅ Live |
| Personalized | `/personalized/` | ✅ | ⭐⭐ | ✅ Live |
| User Preferences | `/preferences/` | ✅ | ⭐⭐ | ✅ Live |
| ML Hybrid | All | ✅ | ⭐⭐⭐ | 🔧 Optional |

---

## 🔧 Customization Points

### Adjust Recommendation Limits
Edit `backend/utils/recommendations.py`:
```python
@staticmethod
def get_trending_deals(limit=10):  # Change 10 to preferred limit
```

### Adjust Filtering Weights
```python
# In UserBasedRecommendations.get_user_recommendations():
THEME_WEIGHT = 0.5
COUNTRY_WEIGHT = 0.3
STYLE_WEIGHT = 0.2
```

### Add More Filters
```python
@staticmethod
def get_by_season(season='summer', limit=10):
    """Get deals matching a season - add season field to model first"""
    return TravelDeal.objects.filter(season=season)[:limit]
```

---

## 📊 Monitoring & Analytics

### Track Performance
```python
# Add to your analytics:
- Recommendation click rate
- Wishlist from recommendations %
- A/B test: trending vs personalized conversion
```

### Database Optimization
```python
# Add indexes in models.py for better performance:
class TravelDeal(models.Model):
    themes = models.JSONField(db_index=True)
    country = models.ForeignKey(..., db_index=True)
    style = models.CharField(..., db_index=True)
```

---

## ⚠️ Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| No results returned | Ensure TravelDeal.objects.count() > 0 |
| ML features not working | Run `pip install scikit-learn` |
| 404 endpoints | Verify `backend/urls.py` includes `path('api/utils/', include('utils.urls'))` |
| Slow queries | Add database indexes: `db_index=True` on filtered fields |
| Empty personalized recommendations | Ensure user has wishlisted items: `WishlistItem.objects.filter(user=user).count()` |

---

## 🎓 Next: Advanced Features

Once live, consider adding:

1. **Caching** - Cache trending deals (changes slowly)
```python
from django.views.decorators.cache import cache_page

@cache_page(3600)  # 1 hour
def get_trending_deals(request):
```

2. **Pagination** - For large result sets
```python
from rest_framework.pagination import PageNumberPagination

class RecommendationPagination(PageNumberPagination):
    page_size = 10
```

3. **Tracking** - Log which recommendations user clicks
```python
# Log to RecommendationClick model
class RecommendationClick(models.Model):
    user = models.ForeignKey(User, ...)
    recommended_deal = models.ForeignKey(TravelDeal, ...)
    clicked = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
```

4. **Real-time Updates** - Use WebSockets for trending deals
5. **Explanation** - Return why a deal was recommended

---

## 📞 Need Help?

- Check: `RECOMMENDATION_ENGINE_GUIDE.md` (full documentation)
- Test: `python manage.py train_recommendations --help`
- Debug: Enable Django logging to see recommendation queries

---

**Status**: ✅ Ready for Production  
**Last Updated**: February 2026  
**Maintenance**: Update scikit-learn quarterly
