import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import './Results.css';

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const q = query(collection(db, 'results'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const resultsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
        setResults(resultsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results: ", error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h1>Kết Quả Bốc Lì Xì</h1>
      <div className="results-grid">
        {results.map((result) => (
          <div key={result.id} className="result-card">
            <h3>{result.username}</h3>
            <p>{result.presentTitle}</p>
            <p className="timestamp">
              {result.timestamp?.toLocaleString('vi-VN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Results; 