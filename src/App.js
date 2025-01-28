import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Aos from "aos";
import "aos/dist/aos.css";
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Results from './Results';

function App() {
  const [selected, setSelected] = useState('0');
  const [transitioned, setTransitioned] = useState(false); // Track transition state
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track the hovered index for background color change
  const [loading, setLoading] = useState(true); // Track loading state, setLoading function is defined here
  const [contentVisible, setContentVisible] = useState(false); // Track content visibility after loading
  const [showPopup, setShowPopup] = useState(true); // Control visibility of the popup
  const [result,setResult] = useState();
  const [username, setUsername] = useState(''); // Add this near your other state declarations

  const images_front = [
    '/img/Lixi_1.png',
    '/img/Lixi_2.png',
    '/img/Lixi_3.png',
    '/img/Lixi_4.png'
  ];

  const images_back = [
    '/img/Lixi_back_1.png',
    '/img/Lixi_back_2.png',
    '/img/Lixi_back_3.png',
    '/img/Lixi_back_4.png'
  ];

  const present = [
    {
      title: "Móc khóa tịnh tâm",
      image: '/img/present/present_1.png'
    },
    {
      title: "Mèo đăm chiêu (Random)",
      image: '/img/present/present_2.jpg'
    },
    {
      title: "Móc khóa tích đức +1",
      image: '/img/present/present_3.png'
    },
    {
      title: "Tất Vô Tri",
      image: '/img/present/present_4.png'
    },
    {
      title: "Mini Planting Kit: Gieo Thông Thái",
      image: '/img/present/present_5.png'
    },
    {
      title: "Tranh Mãi Dell Thành Công",
      image: '/img/present/present_6.png'
    },
    {
      title: "Tranh Rồng Bay Phượng Múa",
      image: '/img/present/present_7.png'
    },
    {
      title: "Trứng chó Shiba",
      image: '/img/present/present_8.png'
    },
    {
      title: "Ly sứ Phong Cách",
      image: '/img/present/present_9.png'
    },
    {
      title: "Đèn tịnh tâm Pepe",
      image: '/img/present/present_10.png'
    }
  ]

  const colors = [
    '#F7FF88', // Color for the first div
    '#6DB1FF', // Color for the second div
    '#33D1BF', // Color for the third div
    '#5845FF' // Color for the fourth div
  ];

  useEffect(() => {
    Aos.init({duration: 2000});
  }, []);

  const handleSelect = async (index) => {
    if (selected !== '0') return;
    setSelected(String(index + 1));
    
    const randomResult = getRandomPresent();
    setResult(randomResult);

    try {
      const docData = {
        username: username,
        presentId: randomResult,
        presentTitle: present[randomResult-1].title,
        timestamp: serverTimestamp(),
      };
      console.log('Saving to Firebase:', docData);
      await addDoc(collection(db, 'results'), docData);
      console.log('Successfully saved to Firebase');
    } catch (error) {
      console.error("Error saving result to Firebase: ", error);
    }
  };

  // Trigger the "transitioned" class after selection
  useEffect(() => {
    if (selected !== '0') {
      setTransitioned(true);
    }
  }, [selected]);


  // Change the background color of the body when hovering or selecting
  useEffect(() => {
    // Apply transition effect for the background color change
    document.body.style.transition = 'background-color 0.5s ease'; // 0.5s transition for smooth color change

    if (selected !== '0') {
      // Set body background color based on selected div
      document.body.style.backgroundColor = "colors[Number(selected) - 1]";
    } else if (hoveredIndex !== null) {
      // Change the body background color based on hover
      document.body.style.backgroundColor = colors[hoveredIndex];
    } else {
      // Reset the body background color
      document.body.style.backgroundColor = '';
    }
  }, [selected, hoveredIndex]);

  // Loading screen effect: hide after 4 seconds
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Hide loading screen after 4 seconds
      setContentVisible(true); 
    }, 4000);
  }, []);

  const handlePopupClose = () => { setShowPopup(false) }

  function getRandomPresent() {
    const random = Math.random() * 100; // Generate a random number between 0 and 100
  
    if (random < 1) return 10;          // 1%
    if (random < 3) return 9;           // 2%
    if (random < 7) return 6;           // 4%
    if (random < 11) return 7;          // 4%
    if (random < 19) return 5;          // 8%
    if (random < 31) return 1;          // 12%
    if (random < 46) return 2;          // 15%
    if (random < 61) return 4;          // 15%
    if (random < 76) return 8;          // 15%
    return 3;                           // Remaining probability
  }

  const renderWrapper = (index) => {
    const isVisible = selected === '0' || selected === String(index + 1);
    const isSelected = selected === String(index + 1);
    const isTransitioned = transitioned && isSelected;

    if (!isVisible) return null; // Do not render non-visible wrappers

    if (result) {
      return (
      <div className='result-wrapper' data-aos="zoom-in"> 
        <h2>Xin chúc mừng <span className="username-text">{username}</span>, bạn trúng một</h2>
        <h1>{present[result-1].title}</h1>
        <img src={present[result-1].image} />
      </div>
      )
    }

    return (
      <div 
        className={`lixi-wrapper ${isVisible ? 'show' : ''} ${isSelected ? 'selected' : ''} ${isTransitioned ? 'transitioned' : ''}`} 
        onClick={() => handleSelect(index)} // Use handleSelect function for click
        onMouseEnter={() => setHoveredIndex(index)} // Set hovered index on hover
        onMouseLeave={() => setHoveredIndex(null)} // Reset hovered index when leaving
        key={index}
      >
        <div className='lixi-face front'>
          <img src={images_front[index]} alt={`Lixi ${index + 1}`} />
        </div>
        <div className='lixi-face back'>
          <img src={images_back[index]} alt={`Lixi ${index + 1}`} />
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            {/* Loading screen */}
            {loading ? (
              <div className="loading-screen">
                <div className="spinner"></div>
              </div>
            ) : (
              <>
                {showPopup && (
                  <div className={`popup-overlay ${contentVisible ? 'fade-in' : ''}`}>
                    <div className="popup-content">
                      <h2>Bốc Lì Xì 2025</h2>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="name-input">Your name:</label>
                        <input 
                          id="name-input"
                          type="text"
                          placeholder="Enter your name"
                          className="name-input"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <button onClick={handlePopupClose}>Bốc Ngay</button>
                    </div>
                  </div>
                )} 
                
                {/* Add a link to results page */}
                <Link to="/results" className="results-link">
                  View All Results
                </Link>
                
                {/* Main Content */}
                <div className={`lixi-group ${contentVisible ? 'fade-in' : ''}`}>
                  {images_front.map((_, index) => renderWrapper(index))}
                </div>
                
                {result && 
                  <div className='star'>
                    <img src='/img/star.svg' data-aos="zoom-in"/>
                  </div>
                }
              </>
            )}
          </div>
        } />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;