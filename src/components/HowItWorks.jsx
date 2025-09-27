// components/HowItWorks/HowItWorks.js
import React from 'react';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How JobMatch AI Works</h2>
          <p>Our AI-powered platform simplifies candidate matching in just four easy steps</p>
        </div>

        <div className="process-flow">
          {/* Step 1 */}
          <div className="process-step" data-step="1">
            <div className="step-icon">
              <div className="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                </svg>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="step-content">
              <h3>Select Job Opening</h3>
              <p>Choose from your current job openings or create a new one with detailed requirements and desired skills.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="process-step" data-step="2">
            <div className="step-icon">
              <div className="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="step-content">
              <h3>Choose Candidate Batch</h3>
              <p>Select a batch of candidates from your talent pool, alumni database, or new applicants.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="process-step" data-step="3">
            <div className="step-icon">
              <div className="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.25 7.756a4.5 4.5 0 103.918 2.274 4.5 4.5 0 00-3.918-2.274zM12.75 16.5a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zM6 12a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0v-7.5A.75.75 0 006 12zM6 6.75a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zM4.5 9.75a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zM3 12.75a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zM21 9.75a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zM18 12a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0v-7.5A.75.75 0 0018 12zM16.5 6.75a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5z" />
                </svg>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="step-content">
              <h3>AI Analysis & Matching</h3>
              <p>Our advanced AI analyzes resumes, skills, and experience to find the best matches for your position.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="process-step" data-step="4">
            <div className="step-icon">
              <div className="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                </svg>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="step-content">
              <h3>Review Results & Take Action</h3>
              <p>Explore detailed match reports, compare candidates, and contact the best fits directly through the platform.</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h3>Ready to Transform Your Hiring Process?</h3>
          <p>Join thousands of companies that use JobMatch AI to find perfect candidates faster</p>
          <button className="cta-button">Get Started Today</button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;