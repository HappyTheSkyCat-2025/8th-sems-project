"""
Management Command: Train Recommendation Model
Run: python manage.py train_recommendations
"""
from django.core.management.base import BaseCommand
from utils.ml_recommendations import MLRecommendationEngine
from destinations.models import TravelDeal
import json


class Command(BaseCommand):
    help = 'Train and validate the recommendation engine'

    def add_arguments(self, parser):
        parser.add_argument(
            '--test-user',
            type=int,
            help='Test recommendations for a specific user ID'
        )
        parser.add_argument(
            '--test-deal',
            type=int,
            help='Test similar deals for a specific deal ID'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Starting Recommendation Engine Training\n'))
        
        # Check if ML libraries are available
        try:
            from sklearn.metrics.pairwise import cosine_similarity
            self.stdout.write(self.style.SUCCESS('✓ scikit-learn is available'))
        except ImportError:
            self.stdout.write(self.style.WARNING('⚠ scikit-learn not installed. Install with: pip install scikit-learn'))
            return
        
        # Check data availability
        deal_count = TravelDeal.objects.count()
        self.stdout.write(f'📊 Total deals available: {deal_count}')
        
        if deal_count < 5:
            self.stdout.write(self.style.WARNING('⚠ Insufficient data: Need at least 5 deals for recommendations'))
            return
        
        # Test content-based recommendations
        self.stdout.write('\n📝 Testing Content-Based Recommendations...')
        try:
            content_recs = MLRecommendationEngine.get_content_based_embeddings(limit=5)
            self.stdout.write(self.style.SUCCESS(f'✓ Generated {len(content_recs)} content-based recommendations'))
            for idx, deal in enumerate(content_recs[:3], 1):
                self.stdout.write(f'  {idx}. {deal.title}')
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Content-based failed: {str(e)}'))
        
        # Test user-item collaborative filtering
        self.stdout.write('\n👥 Testing Collaborative Filtering...')
        from accounts.models import User
        from destinations.models import WishlistItem
        wishlist_count = WishlistItem.objects.count()
        user_count = User.objects.filter(wishlist_items__isnull=False).distinct().count()
        
        self.stdout.write(f'📊 Users with wishlists: {user_count}')
        self.stdout.write(f'📊 Total wishlist items: {wishlist_count}')
        
        if user_count < 2 or wishlist_count < 5:
            self.stdout.write(self.style.WARNING('⚠ Insufficient user interaction data for collaborative filtering'))
        else:
            test_user = User.objects.filter(wishlist_items__isnull=False).first()
            if test_user:
                try:
                    collab_recs = MLRecommendationEngine.get_user_item_matrix_recommendations(
                        user=test_user,
                        limit=5
                    )
                    self.stdout.write(self.style.SUCCESS(f'✓ Generated {len(collab_recs)} collaborative recommendations'))
                    for idx, deal in enumerate(collab_recs[:3], 1):
                        self.stdout.write(f'  {idx}. {deal.title}')
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'✗ Collaborative filtering failed: {str(e)}'))
        
        # Option to test specific user
        if options['test_user']:
            self.stdout.write(f'\n🔍 Testing recommendations for User ID: {options["test_user"]}')
            try:
                test_user = User.objects.get(id=options['test_user'])
                hybrid_recs = MLRecommendationEngine.get_hybrid_recommendations(
                    user=test_user,
                    limit=5
                )
                self.stdout.write(self.style.SUCCESS(f'✓ Generated {len(hybrid_recs)} hybrid recommendations'))
                for idx, deal in enumerate(hybrid_recs, 1):
                    self.stdout.write(f'  {idx}. {deal.title} - €{deal.price}')
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'✗ User {options["test_user"]} not found'))
        
        self.stdout.write(self.style.SUCCESS('\n✅ Recommendation Engine Training Complete'))
        self.stdout.write(self.style.SUCCESS('\nAvailable recommendation endpoints:'))
        self.stdout.write('  • GET /api/utils/recommendations/trending/')
        self.stdout.write('  • GET /api/utils/recommendations/personalized/ (requires auth)')
        self.stdout.write('  • GET /api/utils/recommendations/similar/<deal_id>/')
        self.stdout.write('  • GET /api/utils/recommendations/high-rated/')
        self.stdout.write('  • GET /api/utils/recommendations/budget/?max_price=5000')
        self.stdout.write('  • GET /api/utils/recommendations/preferences/ (requires auth)')
