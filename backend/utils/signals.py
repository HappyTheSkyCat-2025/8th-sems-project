"""
Signal handlers to track recommendation interactions
Helps improve recommendations over time
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from destinations.models import WishlistItem, Review, TravelDeal
from django.utils import timezone


# Optional: Track when wishlists are created (good for analytics)
@receiver(post_save, sender=WishlistItem)
def track_wishlist_addition(sender, instance, created, **kwargs):
    """
    When user wishlists a deal, we could:
    1. Update recommendation popularity scores
    2. Log the interaction for analytics
    3. Trigger notification to similar users
    """
    if created:
        # Log interaction (example)
        print(f"User {instance.user.email} wishlisted {instance.deal.title}")
        
        # Could trigger recommendation update for other users
        # notify_similar_users(instance.user, instance.deal)
        pass


@receiver(post_save, sender=Review)
def track_review_submission(sender, instance, created, **kwargs):
    """
    When user reviews a deal, update recommendation scores
    High-rated deals should be ranked higher
    """
    if created and instance.is_approved:
        # Update deal popularity based on review rating
        deal = instance.travel_deal
        try:
            avg_rating = deal.reviews.filter(is_approved=True).values('rating').aggregate(
                avg=__import__('django.db.models', fromlist=['Avg']).Avg('rating')
            )['avg']
            
            # Could cache this or store in separate model
            print(f"Deal {deal.title} now has average rating: {avg_rating}")
        except:
            pass


def reset_deal_recommendation_score(deal):
    """
    Helper to recalculate a deal's recommendation score
    Useful when deal details change
    """
    from django.db.models import Count, Avg
    
    # Recalculate metrics
    wishlist_count = deal.wishlisted_by.count()
    review_count = deal.reviews.filter(is_approved=True).count()
    avg_rating = deal.reviews.filter(is_approved=True).aggregate(
        avg=Avg('rating')
    )['avg'] or 0
    
    # Store or use these metrics for ranking
    recommendation_score = (
        (wishlist_count * 0.4) +  # 40% weight on wishes
        (review_count * 0.3) +     # 30% weight on review count
        (avg_rating * 0.3)         # 30% weight on rating
    )
    
    return recommendation_score
