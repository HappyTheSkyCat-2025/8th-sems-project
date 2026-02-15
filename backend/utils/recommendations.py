"""
Simple Recommendation Engine for Travel Deals
Provides multiple recommendation strategies
"""
from django.db.models import Q, Count, Avg
from destinations.models import TravelDeal, WishlistItem, Review


class RecommendationEngine:
    """Base recommendation engine class"""
    
    @staticmethod
    def get_trending_deals(limit=10):
        """Get most wishlisted/reviewed deals"""
        return TravelDeal.objects.annotate(
            wishlist_count=Count('wishlisted_by'),
            review_count=Count('reviews'),
            avg_rating=Avg('reviews__rating')
        ).order_by('-wishlist_count', '-avg_rating')[:limit]
    
    @staticmethod
    def get_deals_by_theme(themes, limit=10):
        """Get deals matching specific themes"""
        return TravelDeal.objects.filter(
            themes__overlap=themes
        ).distinct()[:limit]
    
    @staticmethod
    def get_similar_deals(deal_id, limit=5):
        """Get deals similar to a given deal (same country, theme, style)"""
        deal = TravelDeal.objects.get(id=deal_id)
        similar = TravelDeal.objects.filter(
            Q(country=deal.country) |
            Q(themes__overlap=deal.themes) |
            Q(style=deal.style)
        ).exclude(id=deal_id).distinct()[:limit]
        return similar
    
    @staticmethod
    def get_high_rated_deals(min_rating=4.0, limit=10):
        """Get deals with high average ratings"""
        return TravelDeal.objects.annotate(
            avg_rating=Avg('reviews__rating')
        ).filter(
            avg_rating__gte=min_rating,
            reviews__is_approved=True
        ).order_by('-avg_rating')[:limit]
    
    @staticmethod
    def get_budget_friendly_deals(max_price=5000, limit=10):
        """Get deals within a budget (requires numeric price)"""
        try:
            deals = []
            for deal in TravelDeal.objects.all():
                try:
                    price = float(deal.price.replace('€', '').replace(',', '').strip())
                    if price <= max_price:
                        deals.append(deal)
                except ValueError:
                    continue
            return deals[:limit]
        except:
            return []


class UserBasedRecommendations(RecommendationEngine):
    """Recommendations based on user behavior"""
    
    @staticmethod
    def get_user_recommendations(user, limit=10):
        """
        Personalized recommendations based on:
        1. User's wishlist themes
        2. Countries they've wishlisted
        3. Rating preferences
        """
        if not user or user.is_anonymous:
            return RecommendationEngine.get_trending_deals(limit)
        
        # Get user's wishlist
        wishlist = WishlistItem.objects.filter(user=user).select_related('deal')
        if not wishlist.exists():
            return RecommendationEngine.get_trending_deals(limit)
        
        # Extract themes and countries from wishlist
        wishlisted_deals = [item.deal for item in wishlist]
        user_themes = set()
        user_countries = set()
        user_styles = set()
        
        for deal in wishlisted_deals:
            user_themes.update(deal.themes or [])
            user_countries.add(deal.country_id)
            if deal.style:
                user_styles.add(deal.style)
        
        # Recommend deals matching user preferences
        recommendations = TravelDeal.objects.filter(
            Q(themes__overlap=list(user_themes)) |
            Q(country_id__in=user_countries) |
            Q(style__in=user_styles)
        ).exclude(
            id__in=[deal.id for deal in wishlisted_deals]
        ).annotate(
            wishlist_count=Count('wishlisted_by'),
            avg_rating=Avg('reviews__rating')
        ).order_by('-wishlist_count', '-avg_rating')[:limit]
        
        return recommendations
    
    @staticmethod
    def get_category_preferences(user):
        """Get user's preferred categories based on wishlist"""
        if not user or user.is_anonymous:
            return {}
        
        wishlist = WishlistItem.objects.filter(user=user).select_related('deal')
        categories = {}
        
        for item in wishlist:
            if item.deal.category:
                cat_name = item.deal.category.name
                categories[cat_name] = categories.get(cat_name, 0) + 1
        
        return categories


class CollaborativeFiltering(RecommendationEngine):
    """Recommendations based on similar users"""
    
    @staticmethod
    def get_recommendations_from_similar_users(user, limit=10):
        """
        Find users with similar wishlists and recommend their favorite deals
        """
        if not user or user.is_anonymous:
            return RecommendationEngine.get_trending_deals(limit)
        
        user_wishlist = set(
            WishlistItem.objects.filter(user=user).values_list('deal_id', flat=True)
        )
        
        if not user_wishlist:
            return RecommendationEngine.get_trending_deals(limit)
        
        # Find users with overlapping wishlists
        similar_users = WishlistItem.objects.filter(
            deal_id__in=user_wishlist
        ).values('user_id').annotate(
            similarity_score=Count('id')
        ).order_by('-similarity_score').values_list('user_id', flat=True)[:50]
        
        # Get deals from similar users that current user hasn't wishlisted
        recommendations = TravelDeal.objects.filter(
            wishlisted_by__user_id__in=similar_users
        ).exclude(
            id__in=user_wishlist
        ).annotate(
            wishlist_count=Count('wishlisted_by'),
            avg_rating=Avg('reviews__rating')
        ).order_by('-wishlist_count', '-avg_rating')[:limit]
        
        return recommendations
