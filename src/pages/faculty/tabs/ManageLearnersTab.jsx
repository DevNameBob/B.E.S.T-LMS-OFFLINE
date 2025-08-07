import { useState, useEffect } from 'react';
import SummaryCard from '../../../components/cards/SummaryCard';
import {
  UserPlusIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import axiosInstance from '../../../api/axiosInstance';
import styles from './ManageLearnersTab.module.css';

const USE_BACKEND = false;

const mockLearners = [
  {
    _id: 'l1',
    name: 'Thabo Mokoena',
    email: 'thabo@school.edu',
    password: '123456',
    grade: '10',
    status: 'Active',
    address: '123 Main St',
    allergies: 'None',
    medicalConditions: 'Asthma',
    emergencyContactName: 'Nomsa Mokoena',
    emergencyContactNumber: '0821234567',
    medicalAid: 'Discovery',
    parentName: 'Nomsa Mokoena',
    relationship: 'Mother',
    parentContact: '0821234567',
    parentEmail: 'nomsa@family.com',
  },
  {
    _id: 'l2',
    name: 'Ayanda Nkosi',
    email: 'ayanda@school.edu',
    password: 'abcdef',
    grade: '9',
    status: 'Inactive',
    address: '456 School Rd',
    allergies: 'Peanuts',
    medicalConditions: '',
    emergencyContactName: 'Sipho Nkosi',
    emergencyContactNumber: '0839876543',
    medicalAid: '',
    parentName: 'Sipho Nkosi',
    relationship: 'Father',
    parentContact: '0839876543',
    parentEmail: 'sipho@family.com',
  },
];

export default function ManageLearnersTab() {
  const [learners, setLearners] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [step, setStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    grade: '',
    status: 'Active',
    address: '',
    allergies: '',
    medicalConditions: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    medicalAid: '',
    parentName: '',
    relationship: '',
    parentContact: '',
    parentEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLearners = async () => {
    if (!USE_BACKEND) {
      setLearners(mockLearners);
      return;
    }
    try {
      const res = await axiosInstance.get('/learners');
      setLearners(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch learners:', err);
      setLearners([]);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, []);

  useEffect(() => {
    if (expandedId) {
      const learner = learners.find((l) => l._id === expandedId);
      if (learner) setEditForm(learner);
    }
  }, [expandedId, learners]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const newLearner = { ...form, _id: Date.now().toString() };
    try {
      if (!USE_BACKEND) {
        setLearners((prev) => [...prev, newLearner]);
      } else {
        await axiosInstance.post('/learners', form);
        await fetchLearners();
      }
      setForm({
        name: '',
        email: '',
        password: '',
        grade: '',
        status: 'Active',
        address: '',
        allergies: '',
        medicalConditions: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        medicalAid: '',
        parentName: '',
        relationship: '',
        parentContact: '',
        parentEmail: '',
      });
      setShowModal(false);
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.error || 'Enrolment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this learner?')) return;
    try {
      if (!USE_BACKEND) {
        setLearners((prev) => prev.filter((l) => l._id !== id));
      } else {
        await axiosInstance.delete(`/learners/${id}`);
        await fetchLearners();
      }
      setExpandedId(null);
    } catch (err) {
      console.error('Failed to delete learner:', err);
    }
  };

  const filtered = learners.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.summaryGrid}>
        <SummaryCard icon={<UserGroupIcon className="w-6 h-6" />} label="Total Learners" value={learners.length} />
        <SummaryCard icon={<UserPlusIcon className="w-6 h-6" />} label="New This Term" value="36" />
        <SummaryCard icon={<ArrowTrendingUpIcon className="w-6 h-6" />} label="Withdrawals" value="5" />
      </div>

      {!expandedId && (
        <div className={styles.tableWrapper}>
          <div className={styles.tableHeader}>
            <h2>Manage Learners</h2>
            <button onClick={() => setShowModal(true)} className={styles.primaryButton}>
              + Enrol New Learner
            </button>
          </div>

          <div className={styles.searchWrapper}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search learners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((learner) => (
                <tr
                  key={learner._id}
                  className={styles.tableRow}
                  onClick={() => setExpandedId(learner._id)}
                >
                  <td>{learner.name}</td>
                  <td>{learner.email}</td>
                  <td>{learner.grade}</td>
                  <td>
                    <span className={
                      learner.status === 'Active'
                        ? styles.statusActive
                        : styles.statusInactive
                    }>
                      {learner.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {expandedId && (
        <div className={styles.tableWrapper}>
          <button
            onClick={() => {
              setExpandedId(null);
              setIsEditing(false);
            }}
            className="mb-4 text-gray-500 hover:text-gray-700"
          >
            ← Back to Learners
          </button>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Learner Profile</h2>
          <div className="space-y-2">
            {[
              ['Email', 'email'],
              ['Password', 'password'],
              ['Grade', 'grade'],
              ['Status', 'status'],
              ['Address', 'address'],
              ['Allergies', 'allergies'],
              ['Medical Conditions', 'medicalConditions'],
              ['Emergency Contact Name', 'emergencyContactName'],
              ['Emergency Contact Number', 'emergencyContactNumber'],
              ['Medical Aid', 'medicalAid'],
              ['Parent Name', 'parentName'],
              ['Relationship', 'relationship'],
              ['Parent Contact', 'parentContact'],
              ['Parent Email', 'parentEmail'],
            ].map(([label, key]) => (
              <div key={key}>
                <strong>{label}:</strong>{' '}
                {key === 'password' ? (
                  isEditing ? (
                    <>
                      <input
                        type="password"
                        name="password"
                        value={editForm.password || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, password: e.target.value })
                        }
                        className="border px-2 py-1 rounded text-sm w-full mt-1"
                      />
                      <small className="text-gray-500 block">
                        Changing the password will update their login credentials.
                      </small>
                    </>
                  ) : (
                    <span className="italic text-gray-500">Hidden for security</span>
                  )
                ) :                  isEditing ? (
                    <input
                      type="text"
                      name={key}
                      value={editForm[key] || ''}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [key]: e.target.value })
                      }
                      className="border px-2 py-1 rounded text-sm w-full mt-1"
                    />
                  ) : (
                    <span>{editForm[key]}</span>
                  )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className={styles.primaryButton}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setLearners((prev) =>
                      prev.map((l) =>
                        l._id === expandedId ? { ...l, ...editForm } : l
                      )
                    );
                    setIsEditing(false);
                  }}
                  className={styles.primaryButton}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={styles.secondaryButton}
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={() => handleDelete(expandedId)}
              className={styles.dangerButton}
            >
              Delete Learner
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Enrol New Learner</h3>
              <button onClick={() => setShowModal(false)}>
                <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {step === 1 && (
                <>
                  <label>Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <label>Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <label>Grade</label>
                  <input
                    type="text"
                    value={form.grade}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    required
                  />
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </>
              )}

              {step === 2 && (
                <>
                  <label>Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                  <label>Allergies</label>
                  <input
                    type="text"
                    value={form.allergies}
                    onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                  />
                  <label>Medical Conditions</label>
                  <input
                    type="text"
                    value={form.medicalConditions}
                    onChange={(e) =>
                      setForm({ ...form, medicalConditions: e.target.value })
                    }
                  />
                  <label>Emergency Contact Name</label>
                  <input
                    type="text"
                    value={form.emergencyContactName}
                    onChange={(e) =>
                      setForm({ ...form, emergencyContactName: e.target.value })
                    }
                  />
                  <label>Emergency Contact Number</label>
                  <input
                    type="text"
                    value={form.emergencyContactNumber}
                    onChange={(e) =>
                      setForm({ ...form, emergencyContactNumber: e.target.value })
                    }
                  />
                  <label>Medical Aid</label>
                  <input
                    type="text"
                    value={form.medicalAid}
                    onChange={(e) => setForm({ ...form, medicalAid: e.target.value })}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <label>Parent Name</label>
                  <input
                    type="text"
                    value={form.parentName}
                    onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                  />
                  <label>Relationship</label>
                  <input
                    type="text"
                    value={form.relationship}
                    onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  />
                  <label>Parent Contact</label>
                  <input
                    type="text"
                    value={form.parentContact}
                    onChange={(e) => setForm({ ...form, parentContact: e.target.value })}
                  />
                  <label>Parent Email</label>
                  <input
                    type="email"
                    value={form.parentEmail}
                    onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
                  />
                </>
              )}

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.modalFooter}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className={styles.secondaryButton}
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className={styles.primaryButton}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.primaryButton}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}