import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendations = ({ dealId }) => {

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchRecommendations = async () => {
      try {

        const response = await axios.get(
          `http://127.0.0.1:8000/api/recommendations/${dealId}/`
        );

        setRecommendations(response.data.recommendations);

      } catch (error) {
        console.error("Error loading recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();

  }, [dealId]);


  if (loading) return <p>Loading recommendations...</p>;

  if (!recommendations.length)
    return <p>No recommendations available.</p>;


  return (
    <div className="container mt-5">

      <h3>Recommended Trips</h3>

      <div className="row">

        {recommendations.map((deal) => (

          <div key={deal.id} className="col-md-4 mb-4">

            <div className="card">

              {deal.image && (
                <img
                  src={`http://127.0.0.1:8000${deal.image}`}
                  className="card-img-top"
                  alt={deal.title}
                />
              )}

              <div className="card-body">

                <h5>{deal.title}</h5>

                <p>{deal.city}, {deal.country}</p>

                <p>{deal.price}</p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Recommendations;
