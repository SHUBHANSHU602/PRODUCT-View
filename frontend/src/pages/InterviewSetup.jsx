import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './InterviewSetup.module.css';

const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta',
  'Netflix', 'Tesla', 'NVIDIA',
  'Infosys', 'TCS', 'Wipro', 'HCL Technologies',
  'Flipkart', 'Razorpay', 'Zomato', 'Paytm',
  'PhonePe', 'CRED', 'Swiggy', 'Zerodha',
  'Adobe', 'Salesforce', 'Oracle', 'Intel',
  'Uber', 'Airbnb', 'Stripe', 'Spotify',
];

const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher (0 years)' },
  { value: '1-3', label: '1–3 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '5+', label: '5+ years' },
];

const INTERVIEW_TYPES = [
  {
    id: 'behavioral',
    icon: '🎙️',
    name: 'Behavioral',
    desc: 'Situational + HR questions based on your role, experience, and target company.',
    tag: 'Voice + Avatar',
  },
  {
    id: 'dsa',
    icon: '💻',
    name: 'DSA / Coding',
    desc: 'Data structures, algorithms, and problem-solving challenges with live IDE.',
    tag: 'IDE + AI Assistant',
  },
  {
    id: 'aptitude',
    icon: '🧠',
    name: 'Aptitude',
    desc: 'Logical reasoning, quantitative aptitude, and verbal ability questions.',
    tag: 'MCQ Based',
  },
];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 — Role
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Step 2 — Type
  const [interviewType, setInterviewType] = useState('');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredCompanies = company.trim()
    ? COMPANIES.filter((c) =>
        c.toLowerCase().includes(company.toLowerCase())
      )
    : COMPANIES;

  const canProceedStep1 = jobTitle.trim() && experience;
  const canProceedStep2 = !!interviewType;

  const handleStart = () => {
    const config = {
      jobTitle: jobTitle.trim(),
      company: company.trim(),
      jobDescription: jobDescription.trim(),
      experience,
      interviewType,
    };
    localStorage.setItem('interviewConfig', JSON.stringify(config));

    const routes = {
      behavioral: '/interview/behavioral',
      dsa: '/interview/dsa',
      aptitude: '/interview/aptitude',
    };
    navigate(routes[interviewType] || '/interview');
  };

  const getStepDotClass = (n) => {
    if (n < step) return `${s.stepDot} ${s.stepDotDone}`;
    if (n === step) return `${s.stepDot} ${s.stepDotActive}`;
    return s.stepDot;
  };

  const getStepLabelClass = (n) => {
    if (n < step) return `${s.stepLabel} ${s.stepLabelDone}`;
    if (n === step) return `${s.stepLabel} ${s.stepLabelActive}`;
    return s.stepLabel;
  };

  const experienceLabel =
    EXPERIENCE_LEVELS.find((e) => e.value === experience)?.label || '';

  const typeLabel =
    INTERVIEW_TYPES.find((t) => t.id === interviewType)?.name || '';

  return (
    <div className={s.page}>
      {/* Top bar */}
      <div className={s.topbar}>
        <div className={s.logo} onClick={() => navigate('/')}>MockMate</div>
        <button className={s.backBtn} onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
      </div>

      <div className={s.container}>
        {/* Step Progress */}
        <div className={s.progress}>
          <div className={s.stepIndicator}>
            <div className={getStepDotClass(1)}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className={getStepLabelClass(1)}>Role</span>
          </div>

          <div className={step > 1 ? `${s.stepLine} ${s.stepLineDone}` : s.stepLine} />

          <div className={s.stepIndicator}>
            <div className={getStepDotClass(2)}>
              {step > 2 ? '✓' : '2'}
            </div>
            <span className={getStepLabelClass(2)}>Type</span>
          </div>

          <div className={step > 2 ? `${s.stepLine} ${s.stepLineDone}` : s.stepLine} />

          <div className={s.stepIndicator}>
            <div className={getStepDotClass(3)}>3</div>
            <span className={getStepLabelClass(3)}>Start</span>
          </div>
        </div>

        {/* ─── Step 1: Role Setup ─── */}
        {step === 1 && (
          <div className={s.stepContent} key="step1">
            <h1 className={s.heading}>Tell us about the role</h1>
            <p className={s.subheading}>
              We'll tailor your interview questions to match the role and company.
            </p>

            <div className={s.formGroup}>
              <label className={s.label}>Job Title / Role *</label>
              <input
                className={s.input}
                type="text"
                placeholder="e.g. Software Engineer, Data Scientist"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className={s.formGroup}>
              <label className={s.label}>Target Company</label>
              <div className={s.inputWrapper} ref={dropdownRef}>
                <input
                  className={s.input}
                  type="text"
                  placeholder="e.g. Google, Microsoft, Flipkart"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
                {showDropdown && filteredCompanies.length > 0 && (
                  <div className={s.dropdown}>
                    {filteredCompanies.slice(0, 8).map((c) => (
                      <div
                        key={c}
                        className={s.dropdownItem}
                        onClick={() => {
                          setCompany(c);
                          setShowDropdown(false);
                        }}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={s.formGroup}>
              <label className={s.label}>Paste Job Description (optional)</label>
              <textarea
                className={s.textarea}
                placeholder="Paste the JD here and we'll tailor questions specifically to it..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className={s.formGroup}>
              <label className={s.label}>Experience Level *</label>
              <select
                className={s.select}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">Select experience level</option>
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={s.actions}>
              <button
                className={s.btnNext}
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
              >
                Next → Choose Interview Type
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 2: Interview Type ─── */}
        {step === 2 && (
          <div className={s.stepContent} key="step2">
            <h1 className={s.heading}>Choose Interview Type</h1>
            <p className={s.subheading}>
              Select the type of interview you want to practice.
            </p>

            <div className={s.typeGrid}>
              {INTERVIEW_TYPES.map((type) => (
                <div
                  key={type.id}
                  className={`${s.typeCard} ${interviewType === type.id ? s.typeCardSelected : ''}`}
                  onClick={() => setInterviewType(type.id)}
                >
                  <div className={s.typeIconWrap}>{type.icon}</div>
                  <div className={s.typeBody}>
                    <div className={s.typeName}>{type.name}</div>
                    <div className={s.typeDesc}>{type.desc}</div>
                    <span className={s.typeTag}>{type.tag}</span>
                  </div>
                  <div
                    className={`${s.typeCheck} ${interviewType === type.id ? s.typeCheckSelected : ''}`}
                  >
                    ✓
                  </div>
                </div>
              ))}
            </div>

            <div className={s.actions}>
              <button className={s.btnBack} onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className={s.btnNext}
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
              >
                Next → Review & Start
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3: Confirm & Start ─── */}
        {step === 3 && (
          <div className={s.stepContent} key="step3">
            <h1 className={s.heading}>Ready to begin?</h1>
            <p className={s.subheading}>
              Review your setup below, then start your interview.
            </p>

            <div className={s.summaryCard}>
              <div className={s.summaryTitle}>📋 Interview Summary</div>

              <div className={s.summaryRow}>
                <span className={s.summaryLabel}>Role</span>
                <span className={s.summaryValue}>{jobTitle}</span>
              </div>

              {company && (
                <div className={s.summaryRow}>
                  <span className={s.summaryLabel}>Company</span>
                  <span className={s.summaryValue}>{company}</span>
                </div>
              )}

              <div className={s.summaryRow}>
                <span className={s.summaryLabel}>Experience</span>
                <span className={s.summaryValue}>{experienceLabel}</span>
              </div>

              <div className={s.summaryRow}>
                <span className={s.summaryLabel}>Interview Type</span>
                <span className={`${s.summaryValue} ${s.summaryValueAccent}`}>
                  {typeLabel}
                </span>
              </div>

              {jobDescription && (
                <div className={s.summaryRow}>
                  <span className={s.summaryLabel}>Job Description</span>
                  <span className={s.summaryValue}>Provided ✓</span>
                </div>
              )}
            </div>

            <div className={s.readyBanner}>
              <div className={s.readyIcon}>🚀</div>
              <div className={s.readyTitle}>You're all set!</div>
              <div className={s.readyDesc}>
                Your AI interviewer is ready. The session will include 5 questions tailored to your profile. Good luck!
              </div>
            </div>

            <div className={s.actions}>
              <button className={s.btnBack} onClick={() => setStep(2)}>
                ← Back
              </button>
              <button className={s.btnStart} onClick={handleStart}>
                Start Interview →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
