// Folder Structure:
/*
src/
  ├── components/
  │   ├── JobCard/
  │   │   ├── JobCard.js
  │   │   ├── JobCard.css
  │   │   └── index.js
  │   ├── BatchSelector/
  │   │   ├── BatchSelector.js
  │   │   ├── BatchSelector.css
  │   │   └── index.js
  │   ├── StudentDetail/
  │   │   ├── StudentDetail.js
  │   │   ├── StudentDetail.css
  │   │   └── index.js
  │   └── SkeletonLoader/
  │       ├── SkeletonLoader.js
  │       ├── SkeletonLoader.css
  │       └── index.js
  ├── hooks/
  │   ├── useFetch.js
  │   └── index.js
  ├── styles/
  │   ├── theme.css
  │   ├── animations.css
  │   └── globals.css
  ├── utils/
  │   ├── constants.js
  │   ├── mockData.js
  │   └── index.js
  ├── App.js
  └── index.js
*/

// Here's the complete implementation in a single file for demonstration:
import React, { useState, useEffect,useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BatchManagement from './components/batches';
import './styles/theme.css';
import HowItWorks from './components/HowItWorks';
// import './styles/animations.css';
// import './styles/globals.css';

// // Mock Data (would be in utils/mockData.js)
// const mockJobs = [
//   {
//     id: 1,
//     title: "Frontend Developer",
//     company: "TechCorp Inc.",
//     location: "Remote",
//     description: "We are looking for a skilled frontend developer with experience in React and modern JavaScript frameworks. You will be responsible for building user interfaces and implementing responsive designs.",
//     tags: ["React", "JavaScript", "CSS", "HTML5"],
//     salary: "$90,000 - $120,000",
//     posted: "2 days ago"
//   },
//   {
//     id: 2,
//     title: "Backend Engineer",
//     company: "DataSystems Ltd.",
//     location: "New York, NY",
//     description: "Join our backend team to build scalable APIs and services. Experience with Node.js, Python, or Go required. Knowledge of database systems and cloud infrastructure is a plus.",
//     tags: ["Node.js", "Python", "SQL", "AWS"],
//     salary: "$100,000 - $140,000",
//     posted: "5 days ago"
//   },
//   {
//     id: 3,
//     title: "UX/UI Designer",
//     company: "CreativeMinds Agency",
//     location: "San Francisco, CA",
//     description: "We need a talented designer to create beautiful and functional user experiences. You should have a strong portfolio and expertise in design tools like Figma or Sketch.",
//     tags: ["Figma", "UI Design", "User Research", "Prototyping"],
//     salary: "$85,000 - $110,000",
//     posted: "1 week ago"
//   }
// ];

const mockBatches = [
  { id: 1, name: "Batch 2023 - Computer Science", count: 24 },
  { id: 2, name: "Batch 2023 - Data Science", count: 18 },
  { id: 3, name: "Batch 2024 - Web Development", count: 32 }
];

const mockStudents = [
  {
    id: 1,
    name: "John Doe",
    matching_percentage: 85,
    avatar: "https://i.pravatar.cc/150?img=1",
    keywords: ["React", "JavaScript", "CSS", "HTML5", "Redux"],
    missingKeywords: ["TypeScript", "Jest"],
    skillsToStrengthen: ["Testing", "Performance Optimization"],
    status: "Highly Matched"
  },
  {
    id: 2,
    name: "Jane Smith",
    matching_percentage: 72,
    avatar: "https://i.pravatar.cc/150?img=2",
    keywords: ["JavaScript", "CSS", "Responsive Design"],
    missingKeywords: ["React", "Redux", "TypeScript"],
    skillsToStrengthen: ["Modern Frameworks", "State Management"],
    status: "Moderate Match"
  },
  {
    id: 3,
    name: "Alex Johnson",
    matching_percentage: 93,
    avatar: "https://i.pravatar.cc/150?img=3",
    keywords: ["React", "TypeScript", "Jest", "Redux", "CSS"],
    missingKeywords: ["GraphQL"],
    skillsToStrengthen: ["Advanced API Integration"],
    status: "Excellent Match"
  }
];

// JobCard Component
const JobCard = ({ job, onAnalyze, isExpanded, children }) => {
  return (
    <div className={`job-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="job-card-header">
        <div className="job-basic-info">
          <div className="job-title-container">
            <h3 className="job-title">{job.title}</h3>
            <span className="job-company">{job.company.name}</span>
          </div>
          <div className="job-meta">
            <span className="job-location">
              <i className="fas fa-map-marker-alt"></i>
              {job.company.location}
            </span>
            <span className="job-salary">
              <i className="fas fa-dollar-sign"></i>
              {job.salary_range.min}
            </span>
            <span className="job-posted">
              <i className="fas fa-clock"></i>
              {job.date_posted}
            </span>
          </div>
        </div>
        <div className="job-action">
          <button 
            className="analyze-button"
            onClick={() => onAnalyze(job.id)}
          >
            <i className="fas fa-chart-line"></i>
            Analyze Batch
          </button>
        </div>
      </div>

      <div className="job-content">
        <p className="job-description">{job.description}</p>
        
        <div className="job-tags">
          {job.skills.map(tag => (
            <span key={tag} className="job-tag">{tag}</span>
          ))}
        </div>
      </div>

      {isExpanded && children}
    </div>
  );
};

// BatchSelector Component
const BatchSelector = ({ batches, onSelect }) => {
  const [selectedBatch, setSelectedBatch] = useState('');

  const handleAnalyze = () => {
    if (selectedBatch) {
      onSelect(selectedBatch);
    }
  };

  return (
    <div className="batch-selector">
      <div className="batch-selector-header">
        <h4 className="batch-selector-title">
          <i className="fas fa-users"></i>
          Select a student batch to analyze
        </h4>
      </div>
      
      <div className="batch-grid">
        {batches.map(batch => (
          <div 
            key={batch.id}
            className={`batch-card ${selectedBatch === batch.id ? 'selected' : ''}`}
            onClick={() => setSelectedBatch(batch.id)}
          >
            <div className="batch-info">
              <h5>{batch.batch_name}</h5>
              <span className="batch-count">{batch.student_count} students</span>
            </div>
            <div className="batch-select-radio">
              <div className="radio-dot"></div>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="batch-analyze-button"
        onClick={handleAnalyze}
        disabled={!selectedBatch}
      >
        <i className="fas fa-brain"></i>
        Analyze with AI
      </button>
    </div>
  );
};

// StudentDetail Component
const StudentDetail = ({ student }) => {
  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="student-detail">
      <div className="student-header">
        <div className="student-info">
          {/* <img src={student.avatar} alt={student.name} className="student-avatar" /> */}
          <div className="student-details">
            <h3 className="student-name">{student.name}</h3>
            <span className={`student-status ${getScoreClass(student.matching_percentage)}`}>
              {student.status}
            </span>
          </div>
        </div>
        <div className={`match-score ${getScoreClass(student.matching_percentage)}`}>
          {student.matching_percentage}% Match
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${student.matching_percentage}%`,
              backgroundColor: `var(--${getScoreClass(student.matching_percentage).split('-')[1]}-color)`
            }}
          ></div>
        </div>
      </div>

      <div className="student-details-grid">
        <div className="detail-section">
          <h4 className="detail-title">
            <i className="fas fa-check-circle"></i>
            Matching Keywords
          </h4>
          <div className="keyword-list">
            {student.keywords.map(keyword => (
              <span key={keyword} className="keyword">{keyword}</span>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h4 className="detail-title">
            <i className="fas fa-plus-circle"></i>
            Keywords to Add
          </h4>
          <div className="keyword-list">
            {student.missing_keywords.map(keyword => (
              <span key={keyword} className="keyword keyword-missing">{keyword}</span>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h4 className="detail-title">
            <i className="fas fa-bolt"></i>
            Skills to Strengthen
          </h4>
          <ul className="skills-list">
            {student.areas_to_strengthen.map(skill => (
              <li key={skill}>
                <i className="fas fa-arrow-right"></i>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// SkeletonLoader Component
const SkeletonLoader = ({ type, count = 1 }) => {
  if (type === 'job') {
    return Array(count).fill(0).map((_, i) => (
      <div key={i} className="skeleton-job">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-text" style={{width: '80%'}}></div>
        <div className="skeleton-line skeleton-button"></div>
      </div>
    ));
  }
  
  if (type === 'student') {
    return Array(count).fill(0).map((_, i) => (
      <div key={i} className="skeleton-student">
        <div className="skeleton-student-header">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-student-info">
            <div className="skeleton-line skeleton-name"></div>
            <div className="skeleton-line skeleton-status"></div>
          </div>
        </div>
        <div className="skeleton-progress"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line" style={{width: '80%'}}></div>
      </div>
    ));
  }
  
  return null;
};

// Main App Component
const App = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const[Batches,setBatches]=useState([])

  // TODO: Replace with real API call
  const jobsContainerRef = useRef(null);
  useEffect(() => {
  const fetchjobs=async ()=>{
        const res= await fetch('http://127.0.0.1:8000')

     const data=await res.json()
      setJobs(data)
  }

  fetchjobs()
  setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleAnalyze = (jobId) => {
    setSelectedJob(jobs.find(job => job.id === jobId));
    setAnalysisResults(null)
  };

  const handleBatchSelect = async (batchId) => {
    // TODO: Replace with real API call
    setAnalyzing(true);

    const payload={
      "jobid":selectedJob,
      "batch_id":batchId
    }
    const response=await fetch("http://127.0.0.1:8000/results/analyze",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify(payload)
    })
   
    const data=await response.json()

    console.log(data)
    setAnalysisResults(data.results)
    setAnalyzing(false)
    // setTimeout(() => {
    //   setAnalysisResults(mockStudents);
    //   setAnalyzing(false);
    // }, 2000);
  };

  const [currentPage, setCurrentPage] = useState(1);
const jobsPerPage = 10;

// Compute the jobs to display on the current page
const indexOfLastJob = currentPage * jobsPerPage;
const indexOfFirstJob = indexOfLastJob - jobsPerPage;
const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

// Total number of pages
const totalPages = Math.ceil(jobs.length / jobsPerPage);

useEffect(() => {
  if (jobsContainerRef.current) {
    jobsContainerRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [currentPage]);

  useEffect(()=>{
    const fetch_batches=async ()=>{
    const res=await fetch('http://127.0.0.1:8000/batches')

    const data=await res.json()
    setBatches(data)
  }
fetch_batches()
  },[])

  return (
     <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-brain"></i>
              <Link to="/">JobMatch</Link>
            </div>
            <nav className="header-nav">
              {/* Converted nav links to React Router Links */}
              <Link to="/features">Features</Link>
              <Link to="/how-it-works">How It Works</Link>
              <Link to="/batches">Batches</Link>
              <Link to="/get-started">
                <button className="cta-button">Get Started</button>
              </Link>
            </nav>
          </div>
        </header>

        <Routes>
          {/* Default Home Route */}
          <Route
            path="/"
            element={
              <main className="app-main">
                <div className="app-hero">
                  <div className="hero-content">
                    <h1>AI-Powered Candidate Matching</h1>
                    <p>
                      Find the perfect candidates for your job openings with
                      our advanced AI matching technology
                    </p>
                  </div>
                </div>

                <section className="jobs-section">
                  <div className="section-header">
                    <h2>Current Job Openings</h2>
                    <p>Select a job to analyze candidate matches</p>
                  </div>

                  <div className="jobs-container" ref={jobsContainerRef}>
                    {loading ? (
                      <SkeletonLoader type="job" count={3} />
                    ) : (
                      currentJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onAnalyze={handleAnalyze}
                          isExpanded={selectedJob?.id === job.id}
                        >
                          {selectedJob?.id === job.id && (
                            <BatchSelector
                              batches={Batches}
                              onSelect={handleBatchSelect}
                            />
                          )}

                          {analysisResults && selectedJob?.id === job.id && (
                            <section className="results-section">
                              {/* analysisResults content */}
                              <div className="section-header">
                                <h2>
                                  Analysis Results for {selectedJob.title}
                                </h2>
                                <p>
                                  AI-powered match results for your selected
                                  batch
                                </p>
                              </div>
                              <div className="results-header">
                                <div className="results-stats">
                                  <div className="stat">
                                    <span className="stat-value">
                                      {analysisResults.length}
                                    </span>
                                    <span className="stat-label">
                                      Candidates Analyzed
                                    </span>
                                  </div>
                                  <div className="stat">
                                    <span className="stat-value">
                                      {Math.round(
                                        analysisResults.reduce(
                                          (acc, student) =>
                                            acc + student.matching_percentage,
                                          0
                                        ) / analysisResults.length
                                      )}
                                      %
                                    </span>
                                    <span className="stat-label">
                                      Average Match
                                    </span>
                                  </div>
                                  <div className="stat">
                                    <span className="stat-value">
                                      {
                                        analysisResults.filter(
                                          (student) =>
                                            student.matching_percentage >= 80
                                        ).length
                                      }
                                    </span>
                                    <span className="stat-label">
                                      Highly Matched
                                    </span>
                                  </div>
                                </div>

                                <div className="results-actions">
                                  <button className="action-button">
                                    <i className="fas fa-download"></i>
                                    Export Results
                                  </button>
                                  <button className="action-button primary">
                                    <i className="fas fa-user-plus"></i>
                                    Contact Candidates
                                  </button>
                                </div>
                              </div>

                              <div className="students-container">
                                {analysisResults.map((student) => (
                                  <StudentDetail
                                    key={student.id}
                                    student={student}
                                  />
                                ))}
                              </div>
                            </section>
                          )}
                        </JobCard>
                      ))
                    )}
                  </div>

                  {/* Pagination */}
                  {!loading && totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="page-nav"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`page-number ${
                            currentPage === i + 1 ? "active" : ""
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        className="page-nav"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </section>

                {analyzing && (
                  <div className="analyzing-overlay">
                    <div className="analyzing-content">
                      <div className="spinner"></div>
                      <h3>Analyzing candidates with AI</h3>
                      <p>This may take a few moments...</p>
                    </div>
                  </div>
                )}
              </main>
            }
          />

          {/* Example additional routes for nav links */}
          <Route path="/features" element={<div>Features Page</div>} />
          <Route path="/how-it-works" element={<HowItWorks/>} />
          <Route path="/batches" element={<BatchManagement/>} />
          <Route path="/get-started" element={<div>Get Started Page</div>} />
        </Routes>

        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <i className="fas fa-brain"></i>
                <h2>JobMatch AI</h2>
              </div>
              <p>Revolutionizing recruitment with artificial intelligence</p>
            </div>

            <div className="footer-section">
              <h3>Product</h3>
              <Link to="/features">Features</Link>
              <Link to="/pricing">Pricing</Link>
              <a href="#">Case Studies</a>
            </div>

            <div className="footer-section">
              <h3>Resources</h3>
              <a href="#">Blog</a>
              <a href="#">Help Center</a>
              <a href="#">API Documentation</a>
            </div>

            <div className="footer-section">
              <h3>Company</h3>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2023 JobMatch AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

// Render the app
export default App;