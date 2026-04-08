import { useState, useRef } from 'react';
import { interviewAPI } from '../services/api';

export default function Interview() {
  const [step, setStep] = useState('setup');
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState('text');
  const recognitionRef = useRef(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Your browser does not support voice input. Please use Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(transcript);
    };

    recognition.onerror = (event) => {
      setError('Voice recognition error: ' + event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setError('');
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const startInterview = async () => {
    if (!jobRole || !jobDescription) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await interviewAPI.start({ jobRole, jobDescription });
      setInterview(res.data);
      setStep('interview');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview');
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError('Please provide an answer');
      return;
    }
    if (isRecording) stopRecording();
    setLoading(true);
    setError('');
    try {
      const res = await interviewAPI.submitAnswer({
        interviewId: interview.interviewId,
        questionIndex: currentQuestion,
        userAnswer: answer
      });
      setEvaluations([...evaluations, {
        ...res.data.evaluation,
        question: interview.questions[currentQuestion],
        userAnswer: answer
      }]);

      if (currentQuestion + 1 >= interview.questions.length) {
        setStep('results');
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
    }
    setLoading(false);
  };

  // ─── Setup Screen ───
  if (step === 'setup') return (
    <div className="container">
      <h2 style={{ marginBottom: '1.5rem' }}>🎤 Mock Interview</h2>
      <div className="card">
        {error && <p className="error">{error}</p>}
        <input
          placeholder="Job Role (e.g. Backend Developer)"
          value={jobRole}
          onChange={e => setJobRole(e.target.value)}
        />
        <textarea
          rows={5}
          placeholder="Job Description..."
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
        />

        {/* Input Mode Toggle */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            className={`btn ${inputMode === 'text' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setInputMode('text')}
            style={{ flex: 1 }}
          >
            ⌨️ Text Mode
          </button>
          <button
            className={`btn ${inputMode === 'voice' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setInputMode('voice')}
            style={{ flex: 1 }}
          >
            🎤 Voice Mode
          </button>
        </div>

        <button
          className="btn btn-primary"
          onClick={startInterview}
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Generating Questions...' : 'Start Interview'}
        </button>
      </div>
    </div>
  );

  // ─── Interview Screen ───
  if (step === 'interview') return (
    <div className="container">
      {/* Progress Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h2>🎤 Interview</h2>
          <span style={{ color: '#888' }}>
            {currentQuestion + 1} / {interview.questions.length}
          </span>
        </div>
        <div style={{ background: '#2a2a2a', borderRadius: '10px', height: '6px' }}>
          <div style={{
            background: '#6c63ff',
            height: '100%',
            borderRadius: '10px',
            width: `${((currentQuestion + 1) / interview.questions.length) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div className="card">
        {error && <p className="error">{error}</p>}

        {/* Question */}
        <div style={{
          background: '#0f0f0f',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          borderLeft: '3px solid #6c63ff'
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
            {interview.questions[currentQuestion]}
          </p>
        </div>

        {/* Input Mode */}
        {inputMode === 'text' ? (
          <textarea
            rows={6}
            placeholder="Type your answer here..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          />
        ) : (
          <div>
            {/* Voice Visualizer */}
            <div style={{
              background: '#0f0f0f',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1rem',
              border: `2px solid ${isRecording ? '#6c63ff' : '#2a2a2a'}`,
              transition: 'border 0.3s ease'
            }}>
              {/* Animated Mic */}
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                animation: isRecording ? 'pulse 1s infinite' : 'none'
              }}>
                {isRecording ? '🔴' : '🎤'}
              </div>

              <p style={{ color: '#888', marginBottom: '1rem' }}>
                {isRecording ? 'Listening... speak your answer' : 'Click to start speaking'}
              </p>

              {/* Toggle Record Button */}
              <button
                className={`btn ${isRecording ? 'btn-secondary' : 'btn-primary'}`}
                onClick={isRecording ? stopRecording : startRecording}
                style={{ minWidth: '160px' }}
              >
                {isRecording ? '⏹ Stop Recording' : '🎤 Start Speaking'}
              </button>
            </div>

            {/* Transcript Box */}
            {answer && (
              <div style={{
                background: '#0f0f0f',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid #2a2a2a'
              }}>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                  Transcript:
                </p>
                <p style={{ color: '#fff', lineHeight: '1.6' }}>{answer}</p>
              </div>
            )}

            {/* Edit option */}
            {answer && (
              <textarea
                rows={3}
                placeholder="Edit transcript if needed..."
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                style={{ marginBottom: '0' }}
              />
            )}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={submitAnswer}
          disabled={loading || !answer.trim()}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {loading
            ? 'Evaluating...'
            : currentQuestion + 1 === interview.questions.length
              ? '✅ Submit Final Answer'
              : '➡️ Next Question'}
        </button>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );

  // ─── Results Screen ───
  if (step === 'results') {
    const avgScore = Math.round(
      evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
    );

    return (
      <div className="container">
        {/* Overall Score */}
        <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Interview Complete! 🎉</h2>
          <h1 style={{
            fontSize: '4rem',
            color: avgScore >= 7 ? '#51cf66' : avgScore >= 5 ? '#ffd43b' : '#ff6b6b'
          }}>
            {avgScore}/10
          </h1>
          <p style={{ color: '#888' }}>Overall Score</p>
        </div>

        <h3 style={{ marginBottom: '1rem' }}>📊 Detailed Results</h3>

        {evaluations.map((ev, i) => (
          <div key={i} className="card">
            <p style={{ color: '#888', fontSize: '0.85rem' }}>Question {i + 1}</p>
            <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>{ev.question}</p>

            {/* Your Answer */}
            <div style={{
              background: '#0f0f0f',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '0.75rem',
              borderLeft: '3px solid #333'
            }}>
              <p style={{ color: '#888', fontSize: '0.8rem' }}>Your Answer:</p>
              <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{ev.userAnswer}</p>
            </div>

            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: ev.score >= 7 ? '#51cf66' : ev.score >= 5 ? '#ffd43b' : '#ff6b6b'
              }}>
                {ev.score}/10
              </span>
            </div>

            <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              {ev.feedback}
            </p>
            <p style={{ color: '#6c63ff', fontSize: '0.85rem' }}>
              <strong>Ideal:</strong> {ev.idealAnswer}
            </p>
          </div>
        ))}

        <button
          className="btn btn-secondary"
          onClick={() => {
            setStep('setup');
            setEvaluations([]);
            setCurrentQuestion(0);
            setAnswer('');
            setInterview(null);
          }}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          Start New Interview
        </button>
      </div>
    );
  }
}