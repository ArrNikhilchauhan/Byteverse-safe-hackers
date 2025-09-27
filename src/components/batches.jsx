import React, { useState, useEffect } from 'react';
import '../styles/batches.css';

const BatchManagement = () => {
  // Sample initial data
  // const initialBatches = [
  //   {
  //     id: "BATCH01",
  //     name: "Batch A",
  //     department: "Computer Science",
  //     year: 2025,
  //     students: ["STU0001", "STU0002"]
  //   },
  //   {
  //     id: "BATCH02",
  //     name: "Batch B",
  //     department: "Electrical Engineering",
  //     year: 2024,
  //     students: ["STU0003"]
  //   }
  // ];

  const initialStudents = [
    {
      id: "STU0001",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      batch: "Batch A",
      course: "B.Tech Computer Science",
      resume_url: "https://example.com/resumes/john_doe.pdf",
      skills: ["Python", "Data Science", "Machine Learning"],
      dob: "2003-05-12"
    },
    {
      id: "STU0002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "0987654321",
      batch: "Batch A",
      course: "B.Tech Computer Science",
      resume_url: "https://example.com/resumes/jane_smith.pdf",
      skills: ["Java", "Web Development", "JavaScript"],
      dob: "2002-11-24"
    },
    {
      id: "STU0003",
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "5551234567",
      batch: "Batch B",
      course: "B.Tech Electrical Engineering",
      resume_url: "https://example.com/resumes/robert_johnson.pdf",
      skills: ["Circuit Design", "MATLAB", "Power Systems"],
      dob: "2001-07-15"
    }
  ];

  useEffect(()=>{
    const fetch_batches=async ()=>{
    const res=await fetch('http://127.0.0.1:8000/batches')

    const data=await res.json()
    setBatches(data)
  }
fetch_batches()
  },[])

   useEffect(()=>{
    const fetch_student=async ()=>{
    const res=await fetch('http://127.0.0.1:8000/students/fetch')

    const data=await res.json()
    console.log(data)
    setStudents(Array.isArray(data) ? data : []);
  }
fetch_student()
  },[])

  // State management
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchSearch, setBatchSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: '', id: '' });
  
  const studentsPerPage = 10;

  // Filter batches based on search
const filteredBatches = batches.filter(batch => 
    (batch?.batch_name?.toLowerCase() ?? "").includes(batchSearch.toLowerCase()) ||
    (batch?.department?.toLowerCase() ?? "").includes(batchSearch.toLowerCase())
);


  // Get students for selected batch with filters
  const getFilteredStudents = () => {
    if (!selectedBatch) return [];
    
    let filtered = students.filter(student => 
      student.batch_id === selectedBatch.id
    );
    
    if (studentSearch) {
      filtered = filtered.filter(student => 
        student.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase())
      );
    }
    
    if (skillFilter) {
      filtered = filtered.filter(student => 
        student.skills.split(",").some(skill => 
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }
    
    return filtered;
  };

  const filteredStudents = getFilteredStudents();
  
  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Handle batch selection
  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setCurrentPage(1);
  };

  // Handle batch form submission
  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
   const newBatch = editingBatch
  ? {
      id: editingBatch.id,
      batch_name: formData.get('name'),
      department: formData.get('department'),
      year: parseInt(formData.get('year')),
      students: editingBatch.students
    }
  : {
      batch_name: formData.get('name'),
      department: formData.get('department'),
      year: parseInt(formData.get('year'))
    };
    try{ 
      let response;

      if(editingBatch){
        response=await fetch(`http://localhost:8000/batches/${selectedBatch.id}`,{
          method:"PUT",
          headers:{"content-type":"application/json"},
          body:JSON.stringify(newBatch)
        })
      }
      else{
        console.log(newBatch)
        response=await fetch('http://localhost:8000/batches/add',{
          method:"POST",
          headers:{"content-type":"application/json"},
          body:JSON.stringify(newBatch)
        })
      }

      if(!response.ok) throw new Error("Failed to add Batch")

     const savebatch= await response.json()
     console.log("batch",savebatch)
      if (editingBatch) {
      setBatches(batches.map(b => b.id === editingBatch.id ? savebatch : b));
    } else {
      setBatches([...batches, savebatch]);
    }
    
    setShowBatchModal(false);
    setEditingBatch(null);
  }
  catch (err) {
    console.error("Error submitting Batch:", err);
    alert("Failed to save Batch. Try again!");
  }
   
  };

  // Handle student form submission
const handleStudentSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const skills = formData.get("skills").split(",").map(s => s.trim());

const formDataToSend = new FormData();
formDataToSend.append("full_name", formData.get("name"));
formDataToSend.append("email", formData.get("email"));
formDataToSend.append("phone", formData.get("phone"));
formDataToSend.append("dob", formData.get("dob"));
formDataToSend.append("course", formData.get("course"));
formDataToSend.append("resume_text", "this is a plain text"); // default text
formDataToSend.append("batch_id", selectedBatch.id);
formDataToSend.append("skills",skills);       // send array as JSON string

// Add the PDF file
formDataToSend.append("resume_file", formData.get("resume"));


  try {
    let response;

    if (editingStudent) {
      response = await fetch(`http://localhost:8000/students/${editingStudent.id}`, {
        method: "PUT",
        body: formDataToSend
      });
    } else {
      
      response = await fetch("http://localhost:8000/students/add", {
        method: "POST",
        body: formDataToSend
      });
    }

    if (!response.ok) throw new Error("Failed to save student");
const savedStudent = await response.json();

// Convert skills from "Python,ML" → ["Python", "ML"]
// savedStudent.skills = savedStudent.skills 
//   ? savedStudent.skills.split(",").map(s => s.trim()) 
//   : [];

// Update local state
if (editingStudent) {
  setStudents(students.map(s => s.id === editingStudent.id ? savedStudent : s));
} else {
  setStudents([...students, savedStudent]);
}

    setShowStudentModal(false);
    setEditingStudent(null);
  } catch (err) {
    console.error("Error submitting student:", err);
    alert("Failed to save student. Try again!");
  }
};


  // Handle delete operations
  const handleDelete = () => {
    if (deleteConfirm.type === 'batch') {
      setBatches(batches.filter(b => b.id !== deleteConfirm.id));
      setStudents(students.filter(s => s.batch !== batches.find(b => b.id === deleteConfirm.id)?.name));
      if (selectedBatch && selectedBatch.id === deleteConfirm.id) {
        setSelectedBatch(null);
      }
    } else if (deleteConfirm.type === 'student') {
      setStudents(students.filter(s => s.id !== deleteConfirm.id));
      // Remove student from batch
      setBatches(batches.map(b => 
        b.id === selectedBatch.id 
          ? {...b, students: b.students.filter(id => id !== deleteConfirm.id)}
          : b
      ));
    }
    
    setDeleteConfirm({ show: false, type: '', id: '' });
  };

  console.log(students)
  return (
    <div className="batch-management-container">
      {/* <div className="batch-management-header">
        <h1>Batch Management</h1>
        <p>Manage student batches and profiles</p>
      </div> */}

      <div className="batch-management-content">
        {/* Batch List Panel */}
        <div className="batch-panel">
          <div className="panel-header">
            <h2>Batches</h2>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setEditingBatch(null);
                setShowBatchModal(true);
              }}
            >
              + Add Batch
            </button>
          </div>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search batches..."
              value={batchSearch}
              onChange={(e) => setBatchSearch(e.target.value)}
            />
          </div>
          
          <div className="batch-list">
            {filteredBatches.map(batch => (
              <div 
                key={batch.id} 
                className={`batch-card ${selectedBatch?.id === batch.id ? 'selected' : ''}`}
                onClick={() => handleBatchSelect(batch)}
              >
                <div className="batch-card-header">
                  <h3>{batch.batch_name}</h3>
                </div>
                <div className="batch-card-body">
                  <p>{batch.department}</p>
                  <p>{batch.student_count} students</p>
                </div>
                <div className="batch-card-actions">
                  <button 
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBatch(batch);
                      setShowBatchModal(true);
                    }}
                  >
                    <i className="icon-edit">✏️</i>
                  </button>
                  <button 
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm({ show: true, type: 'batch', id: batch.id });
                    }}
                  >
                    <i className="icon-delete">🗑️</i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student List Panel */}
        <div className="student-panel">
          {selectedBatch ? (
            <>
              <div className="panel-header">
                <h2>Students in {selectedBatch.name}</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingStudent(null);
                    setShowStudentModal(true);
                  }}
                >
                  + Add Student
                </button>
              </div>
              
              <div className="filters">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Filter by skill..."
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                />
              </div>
              
              <div className="student-table-container">
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Skills</th>
                      <th>Resume</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map(student => (
                      <tr key={student.id}>
                        <td>{student.full_name}</td>
                        <td>{student.email}</td>
                        <td>{student.phone}</td>
                        <td>
                          <div className="skill-tags">
                            {student.skills.split(",").map((skill, index) => (
                              <span key={index} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                          {/* {student.skills} */}
                        </td>
                        <td>
                          <a 
                            href={`http://127.0.0.1:8000${student.resume_url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-link"
                          >
                            View Resume
                          </a>
                        </td>
                        {/* <td>{student.resume_text}</td> */}
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon"
                              onClick={() => {
                                setEditingStudent(student);
                                setShowStudentModal(true);
                              }}
                            >
                              <i className="icon-edit">✏️</i>
                            </button>
                            <button 
                              className="btn-icon"
                              onClick={() => setDeleteConfirm({ 
                                show: true, 
                                type: 'student', 
                                id: student.id 
                              })}
                            >
                              <i className="icon-delete">🗑️</i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredStudents.length === 0 && (
                  <div className="empty-state">
                    <p>No students found in this batch.</p>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-batch-selection">
              <p>Select a batch to view and manage students</p>
            </div>
          )}
        </div>
      </div>

      {/* Batch Form Modal */}
      {showBatchModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingBatch ? 'Edit Batch' : 'Add New Batch'}</h2>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowBatchModal(false);
                  setEditingBatch(null);
                }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleBatchSubmit}>
              <div className="form-group">
                <label>Batch Name</label>
                <input 
                  type="text" 
                  name="name"
                  defaultValue={editingBatch?.name || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input 
                  type="text" 
                  name="department"
                  defaultValue={editingBatch?.department || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input 
                  type="number" 
                  name="year"
                  min="2000"
                  max="2100"
                  defaultValue={editingBatch?.year || new Date().getFullYear()}
                  required 
                />
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowBatchModal(false);
                    setEditingBatch(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingBatch ? 'Update Batch' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Form Modal */}
      {showStudentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowStudentModal(false);
                  setEditingStudent(null);
                  setResumeFile(null);
                }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleStudentSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  defaultValue={editingStudent?.name || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email"
                  defaultValue={editingStudent?.email || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  defaultValue={editingStudent?.phone || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input 
                  type="date" 
                  name="dob"
                  defaultValue={editingStudent?.dob || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Course</label>
                <input 
                  type="text" 
                  name="course"
                  defaultValue={editingStudent?.course || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input 
                  type="text" 
                  name="skills"
                  defaultValue={editingStudent?.skills || ''}
                  placeholder="Python, JavaScript, Data Science"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Resume</label>
                <input 
                name='resume'
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  required={!editingStudent}
                />
                {editingStudent && !resumeFile && (
                  <p className="file-note">Current file: {editingStudent.resume_text}</p>
                )}
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowStudentModal(false);
                    setEditingStudent(null);
                    setResumeFile(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete this {deleteConfirm.type}? 
                This action cannot be undone.
              </p>
            </div>
            <div className="form-actions">
              <button 
                className="btn-secondary"
                onClick={() => setDeleteConfirm({ show: false, type: '', id: '' })}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManagement;