import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

from destinations.models import TravelDeal


class MLRecommendationEngine:

    @staticmethod
    def load_data():
        """Load travel deals from Django database into DataFrame"""
        deals = TravelDeal.objects.all().values(
            "id",
            "city",
            "country__name",
            "days",
            "price",
        )

        df = pd.DataFrame(list(deals))

        if df.empty:
            return None

        # Create content column
        df["content"] = (
            df["city"].fillna("")
            + " "
            + df["country__name"].fillna("")
            + " "
            + df["price"].fillna("")
        )

        return df


    @staticmethod
    def compute_similarity(df):
        """Compute TF-IDF similarity matrix"""

        tfidf = TfidfVectorizer(stop_words="english")

        tfidf_matrix = tfidf.fit_transform(df["content"])

        cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

        return cosine_sim


    @staticmethod
    def get_recommendations(deal_id, num=5):
        df = MLRecommendationEngine.load_data()

        if df is None:
            return TravelDeal.objects.none()

        cosine_sim = MLRecommendationEngine.compute_similarity(df)

        idx = df.index[df["id"] == deal_id]

        if len(idx) == 0:
            return TravelDeal.objects.none()

        idx = idx[0]

        sim_scores = list(enumerate(cosine_sim[idx]))

        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        sim_scores = sim_scores[1:num+1]

        deal_indices = [df.iloc[i[0]]["id"] for i in sim_scores]

        return TravelDeal.objects.filter(id__in=deal_indices)
