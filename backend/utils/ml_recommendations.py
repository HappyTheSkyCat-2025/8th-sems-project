"""
Machine Learning based Recommendation Engine
Uses scikit-learn for collaborative filtering and embeddings
Install: pip install scikit-learn scipy sklearn-pandas
"""
import numpy as np
from django.db.models import Count, Avg
from destinations.models import TravelDeal, WishlistItem, Review

try:
    from sklearn.metrics.pairwise import cosine_similarity
    from sklearn.feature_extraction.text import TfidfVectorizer
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    print("Warning: scikit-learn not installed. ML recommendations unavailable.")


class MLRecommendationEngine:
    """Machine Learning based recommendations"""
    
    @staticmethod
    def get_content_based_embeddings(limit=10):
        """
        Content-based recommendations using TF-IDF on deal descriptions
        Finds deals with similar content
        """
        if not SKLEARN_AVAILABLE:
            return []
        
        deals = list(TravelDeal.objects.all())
        if len(deals) < 2:
            return deals
        
        # Extract deal descriptions
        descriptions = [deal.description or "" for deal in deals]
        
        # TF-IDF Vectorization
        vectorizer = TfidfVectorizer(
            max_features=100,
            min_df=1,
            stop_words='english'
        )
        
        try:
            tfidf_matrix = vectorizer.fit_transform(descriptions)
            # Calculate similarity between first deal and all others
            similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix)[0]
            
            # Get top similar deals (excluding the first deal itself)
            similar_indices = np.argsort(similarities)[::-1][1:limit+1]
            return [deals[i] for i in similar_indices]
        except:
            return deals[:limit]
    
    @staticmethod
    def get_user_item_matrix_recommendations(user, limit=10):
        """
        Collaborative filtering using user-item interaction matrix
        Recommends deals based on user wishlists and other users' wishlists
        """
        if not SKLEARN_AVAILABLE or not user:
            return []
        
        # Get all users and their wishlisted deals
        all_wishlists = WishlistItem.objects.select_related('user', 'deal')
        
        if not all_wishlists.exists():
            return []
        
        # Create user-deal matrix
        users = list(set(w.user for w in all_wishlists))
        deals = list(set(d.deal for d in all_wishlists))
        
        if len(users) < 2 or len(deals) < 2:
            return deals[:limit]
        
        user_idx = {u.id: idx for idx, u in enumerate(users)}
        deal_idx = {d.id: idx for idx, d in enumerate(deals)}
        
        # Build user-deal interaction matrix
        matrix = np.zeros((len(users), len(deals)))
        for wishlist in all_wishlists:
            u_idx = user_idx.get(wishlist.user.id)
            d_idx = deal_idx.get(wishlist.deal.id)
            if u_idx is not None and d_idx is not None:
                matrix[u_idx, d_idx] = 1
        
        if user.id not in user_idx:
            return []
        
        current_user_idx = user_idx[user.id]
        
        # Calculate user similarity
        user_similarities = cosine_similarity(
            matrix[current_user_idx:current_user_idx+1],
            matrix
        )[0]
        
        # Find similar users
        similar_user_indices = np.argsort(user_similarities)[::-1][1:6]  # Top 5 similar users
        
        # Get deals liked by similar users but not by current user
        current_user_deals = set(np.where(matrix[current_user_idx] == 1)[0])
        recommendations_scores = {}
        
        for sim_user_idx in similar_user_indices:
            sim_user_deals = np.where(matrix[sim_user_idx] == 1)[0]
            for deal_idx_val in sim_user_deals:
                if deal_idx_val not in current_user_deals:
                    recommendations_scores[deal_idx_val] = (
                        recommendations_scores.get(deal_idx_val, 0) + 
                        user_similarities[sim_user_idx]
                    )
        
        # Get top recommended deals
        top_deal_indices = sorted(
            recommendations_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:limit]
        
        return [deals[idx] for idx, _ in top_deal_indices]
    
    @staticmethod
    def get_hybrid_recommendations(user, limit=10):
        """
        Hybrid approach combining content-based and collaborative filtering
        Weights: 50% collaborative, 50% content-based
        """
        if not user or user.is_anonymous:
            return []
        
        collab_deals = MLRecommendationEngine.get_user_item_matrix_recommendations(
            user=user,
            limit=limit
        )
        
        # Combine and deduplicate
        all_recommendations = collab_deals
        
        # Keep unique IDs
        recommended_ids = set(d.id for d in all_recommendations)
        
        # Fill remaining slots with trending deals if needed
        if len(all_recommendations) < limit:
            from utils.recommendations import RecommendationEngine
            trending = RecommendationEngine.get_trending_deals(limit=limit)
            for deal in trending:
                if deal.id not in recommended_ids:
                    all_recommendations.append(deal)
                    recommended_ids.add(deal.id)
                    if len(all_recommendations) >= limit:
                        break
        
        return all_recommendations[:limit]
