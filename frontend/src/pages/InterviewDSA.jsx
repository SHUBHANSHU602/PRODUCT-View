import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { dsaAPI } from '../services/api';
import s from './InterviewDSA.module.css';

/* ─── Language boilerplate fallbacks ─── */
const DEFAULT_BOILERPLATE = {
  javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction solve(nums) {\n  // Write your code here\n  \n}\n`,
  python: `class Solution:\n    def solve(self, nums: list[int]) -> int:\n        # Write your code here\n        pass\n`,
  java: `class Solution {\n    public int solve(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}\n`,
  cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};\n`,
};

const LANG_MAP = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
};

const LANG_LABELS = {
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
};

export default function InterviewDSA() {
  const navigate = useNavigate();

  // ─── Config from localStorage ───
  const [config] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('interviewConfig')) || {};
    } catch {
      return {};
    }
  });

  // ─── Core state ───
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('problem');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_BOILERPLATE.javascript);
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  // ─── Timer ───
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const timerRef = useRef(null);

  // ─── Chat ───
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [aiStatus, setAiStatus] = useState('Listening...');
  const [aiTyping, setAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  // ─── Voice input ───
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const boilerplateRef = useRef(DEFAULT_BOILERPLATE.javascript);

  // ─── TTS (Text-to-Speech) ───
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);

  // ─── Keep muted ref in sync ───
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // ─── Load TTS voices (async in some browsers) ───
  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // ─── speakText utility ───
  const speakText = useCallback((text) => {
    if (isMutedRef.current) return;
    window.speechSynthesis.cancel();

    // Strip markdown formatting
    const clean = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/#{1,6}\s?/g, '')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google US English') ||
      v.name.includes('Microsoft David') ||
      v.name.includes('Daniel') ||
      (v.lang === 'en-US' && v.localService === false)
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setAiStatus('Speaking...');
    utterance.onend = () => setAiStatus('Listening...');
    utterance.onerror = () => setAiStatus('Listening...');

    window.speechSynthesis.speak(utterance);
  }, []);

  // ─── Fetch problem on mount ───
  useEffect(() => {
    fetchProblem();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  // ─── Start timer when problem loads ───
  useEffect(() => {
    if (problem && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [problem]);

  // ─── Scroll chat to bottom ───
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiTyping]);

  const fetchProblem = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await dsaAPI.start({
        role: config.jobTitle || 'Software Engineer',
        company: config.company || '',
        experience: config.experience || 'fresher',
        language,
      });

      const data = res.data;
      setProblem(data);

      // Set boilerplate code
      const bp = data.boilerplate?.[language] || DEFAULT_BOILERPLATE[language];
      setCode(bp);
      // Store the current boilerplate so we can detect unchanged code
      boilerplateRef.current = bp;

      // AI opening message
      const opening = `Hello! I've loaded a **${data.difficulty}** problem for you — "${data.title}". Take your time to read it carefully. If you have any doubts about the problem statement, ask me. When you're ready, walk me through your approach before you start coding.`;
      setMessages([{ role: 'assistant', content: opening }]);

      // Speak the opening message after a short delay for voices to load
      setTimeout(() => speakText(opening), 600);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate problem. Please try again.');
    }
    setLoading(false);
  };

  // ─── Timer formatter ───
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // ─── Language change ───
  const handleLangChange = (newLang) => {
    setLanguage(newLang);
    const bp = problem?.boilerplate?.[newLang] || DEFAULT_BOILERPLATE[newLang];
    setCode(bp);
    boilerplateRef.current = bp;
  };

  // ─── Check if code is unchanged boilerplate ───
  const isCodeEmpty = () => {
    const trimmed = code.trim();
    if (!trimmed) return true;
    // Compare against current boilerplate (strip whitespace for robust comparison)
    const normalize = (s) => s.replace(/\s+/g, '');
    const currentBP = boilerplateRef.current || DEFAULT_BOILERPLATE[language];
    return normalize(trimmed) === normalize(currentBP);
  };

  // ─── Run code (AI-evaluated) ───
  const handleRunCode = async () => {
    setShowOutput(true);
    setEvalResult(null);
    if (isCodeEmpty()) {
      setOutput('⚠️ Please write your solution before submitting.');
      return;
    }
    setRunning(true);
    setOutput('Running code against test cases...');
    try {
      const res = await dsaAPI.evaluate({
        code,
        language,
        problemTitle: problem?.title || '',
        problemDescription: problem?.description || '',
        userRole: config.jobTitle || 'Software Engineer',
        company: config.company || '',
      });
      const data = res.data;
      setEvalResult(data);
      setOutput('');
    } catch (err) {
      setOutput('⚠️ Failed to run code. Please try again.');
    }
    setRunning(false);
  };

  // ─── Submit code (AI evaluation) ───
  const handleSubmitCode = async () => {
    setShowOutput(true);
    if (isCodeEmpty()) {
      setOutput('⚠️ Please write your solution before submitting.');
      return;
    }
    setSubmitting(true);
    setEvalResult(null);
    setOutput('Evaluating your solution...');
    try {
      const res = await dsaAPI.evaluate({
        code,
        language,
        problemTitle: problem?.title || '',
        problemDescription: problem?.description || '',
        userRole: config.jobTitle || 'Software Engineer',
        company: config.company || '',
      });
      const data = res.data;
      setEvalResult(data);
      setOutput('');
      // Also tell the AI interviewer about the result
      const passed = data.testResults?.filter(t => t.passed).length || 0;
      const total = data.testResults?.length || 5;
      sendMessage(`I've submitted my solution. ${passed}/${total} test cases passed. Can you review my code and suggest improvements?`);
    } catch (err) {
      setOutput('⚠️ Failed to evaluate code. Please try again.');
    }
    setSubmitting(false);
  };

  // ─── Send chat message ───
  const sendMessage = useCallback(async (text) => {
    if (!text?.trim()) return;

    const userMsg = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setAiTyping(true);
    setAiStatus('Thinking...');

    try {
      const res = await dsaAPI.chat({
        message: text.trim(),
        problemContext: problem ? {
          title: problem.title,
          difficulty: problem.difficulty,
          description: problem.description,
        } : {},
        conversationHistory: [...messages, userMsg].slice(-10),
      });

      const aiMsg = { role: 'assistant', content: res.data.reply };
      setMessages((prev) => [...prev, aiMsg]);

      // Speak the AI reply
      speakText(res.data.reply);
    } catch (err) {
      const errText = "I'm having trouble connecting right now. Please try again.";
      const errMsg = { role: 'assistant', content: errText };
      setMessages((prev) => [...prev, errMsg]);
      speakText(errText);
    }
    setAiTyping(false);
  }, [messages, problem]);

  // ─── Quick AI buttons ───
  const handleQuickAI = (prompt) => {
    sendMessage(prompt);
  };

  // ─── Voice input ───
  const toggleVoice = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please use Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setChatInput(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  // ─── Toggle mute ───
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (next) window.speechSynthesis.cancel();
  };

  // ─── Skip problem ───
  const handleSkip = () => {
    if (window.confirm('Are you sure you want to skip this problem?')) {
      window.speechSynthesis.cancel();
      setTimeLeft(45 * 60);
      setOutput('');
      setShowOutput(false);
      setMessages([]);
      fetchProblem();
    }
  };

  // ─── Submit interview ───
  const handleEndInterview = () => {
    if (window.confirm('Are you sure you want to end the interview?')) {
      window.speechSynthesis.cancel();
      navigate('/dashboard');
    }
  };

  // ─── Chat submit handler ───
  const handleChatSubmit = (e) => {
    e.preventDefault();
    sendMessage(chatInput);
  };

  // ─── Loading State ───
  if (loading) {
    return (
      <div className={s.loadingScreen}>
        <div className={s.loadingSpinner} />
        <div className={s.loadingText}>Generating your DSA problem...</div>
        <div className={s.loadingSubtext}>
          Tailored for {config.jobTitle || 'Software Engineer'}
          {config.company ? ` at ${config.company}` : ''}
        </div>
      </div>
    );
  }

  // ─── Error State ───
  if (error) {
    return (
      <div className={s.errorScreen}>
        <div className={s.errorIcon}>⚠️</div>
        <div className={s.errorTitle}>Failed to load problem</div>
        <div className={s.errorMsg}>{error}</div>
        <button className={s.btnRetry} onClick={fetchProblem}>
          Try Again
        </button>
      </div>
    );
  }

  const isTimeLow = timeLeft <= 300; // 5 minutes

  return (
    <div className={s.page}>
      {/* ══════════ LEFT PANEL ══════════ */}
      <div className={s.leftPanel}>
        {/* Top bar */}
        <div className={s.problemTopBar}>
          <div className={s.problemTitleWrap}>
            <span className={s.problemTitle}>{problem?.title || 'Problem'}</span>
            <span className={`${s.diffBadge} ${
              problem?.difficulty === 'Easy' ? s.diffEasy :
              problem?.difficulty === 'Medium' ? s.diffMedium : s.diffHard
            }`}>
              {problem?.difficulty || 'Medium'}
            </span>
          </div>
          <div className={`${s.timer} ${isTimeLow ? s.timerDanger : ''}`}>
            <span className={s.timerIcon}>⏱️</span>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Tabs */}
        <div className={s.tabs}>
          <button
            className={`${s.tab} ${activeTab === 'problem' ? s.tabActive : ''}`}
            onClick={() => setActiveTab('problem')}
          >
            Problem
          </button>
          <button
            className={`${s.tab} ${activeTab === 'hints' ? s.tabActive : ''}`}
            onClick={() => setActiveTab('hints')}
          >
            Hints
          </button>
          <button
            className={`${s.tab} ${activeTab === 'solution' ? s.tabActive : ''}`}
            onClick={() => setActiveTab('solution')}
          >
            <span className={s.tabLocked}>
              Solution <span className={s.lockIcon}>🔒</span>
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className={s.problemContent}>
          {activeTab === 'problem' && (
            <>
              <div className={s.problemDesc}>{problem?.description}</div>

              {problem?.examples?.length > 0 && (
                <>
                  <div className={s.sectionLabel}>Examples</div>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className={s.exampleBlock}>
                      <div className={s.exampleLabel}>Example {i + 1}</div>
                      <div className={s.exampleLine}>
                        <strong>Input:</strong> {ex.input}
                      </div>
                      <div className={s.exampleLine}>
                        <strong>Output:</strong> {ex.output}
                      </div>
                      {ex.explanation && (
                        <div className={s.exampleLine}>
                          <strong>Explanation:</strong> {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {problem?.constraints?.length > 0 && (
                <>
                  <div className={s.sectionLabel}>Constraints</div>
                  <ul className={s.constraintsList}>
                    {problem.constraints.map((c, i) => (
                      <li key={i} className={s.constraintItem}>{c}</li>
                    ))}
                  </ul>
                </>
              )}

              <div className={s.aiQuickBtns}>
                <button className={s.aiQuickBtn} onClick={() => handleQuickAI('Give me a hint for this problem')}>
                  💡 Give me a hint
                </button>
                <button className={s.aiQuickBtn} onClick={() => handleQuickAI('Explain this problem in simpler terms')}>
                  📖 Explain the problem
                </button>
                <button className={s.aiQuickBtn} onClick={() => handleQuickAI(`Here is my current approach for the problem. Can you check it?\n\nMy code:\n${code}`)}>
                  🔍 Check my approach
                </button>
              </div>
            </>
          )}

          {activeTab === 'hints' && (
            <ul className={s.hintsList}>
              {(problem?.hints || ['Think about the brute force approach first', 'Consider using a hash map for O(n) lookup', 'Can you optimize space complexity?']).map((hint, i) => (
                <li key={i} className={s.hintItem}>
                  <span className={s.hintNum}>{i + 1}</span>
                  <span className={s.hintText}>{hint}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'solution' && (
            <div className={s.lockedOverlay}>
              <div className={s.lockedIcon}>🔒</div>
              <div className={s.lockedTitle}>Solution Locked</div>
              <div className={s.lockedDesc}>
                Upgrade to Pro to unlock detailed solutions, optimal approaches, and video explanations.
              </div>
              <button className={s.upgradeBtn} onClick={() => navigate('/pricing')}>
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>

        {/* ── Editor Section ── */}
        <div className={s.editorSection}>
          <div className={s.editorTopBar}>
            <select
              className={s.langSelect}
              value={language}
              onChange={(e) => handleLangChange(e.target.value)}
            >
              {Object.entries(LANG_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <div className={s.editorBtns}>
              <button className={s.btnRun} onClick={handleRunCode} disabled={submitting || running}>
                {running ? '⏳ Running...' : '▶ Run'}
              </button>
              <button className={s.btnSubmitCode} onClick={handleSubmitCode} disabled={submitting || running}>
                {submitting ? '⏳ Evaluating...' : '✓ Submit'}
              </button>
            </div>
          </div>

          <div className={s.editorWrap}>
            <Editor
              height="100%"
              language={LANG_MAP[language]}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12 },
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                tabSize: 2,
                wordWrap: 'on',
                automaticLayout: true,
                suggest: { showKeywords: true },
              }}
            />
          </div>

          {showOutput && (
            <div className={s.outputPanel}>
              <div className={s.outputLabel}>Output</div>
              {output && <pre className={s.outputText}>{output}</pre>}
              {evalResult && (
                <div className={s.evalResults}>
                  <div className={s.evalSummary}>
                    <span className={evalResult.overallPassed ? s.evalSummaryPass : s.evalSummaryFail}>
                      {evalResult.overallPassed ? '🎉' : '❌'}{' '}
                      {evalResult.testResults?.filter(t => t.passed).length || 0}/{evalResult.testResults?.length || 5} test cases passed
                    </span>
                  </div>
                  <div className={s.testCasesList}>
                    {evalResult.testResults?.map((t) => (
                      <div key={t.id} className={`${s.testCaseRow} ${t.passed ? s.testCasePass : s.testCaseFail}`}>
                        <div className={s.testCaseHeader}>
                          <span className={t.passed ? s.testIconPass : s.testIconFail}>
                            {t.passed ? '✓' : '✗'}
                          </span>
                          <span className={s.testCaseId}>Test {t.id}</span>
                          <span className={t.passed ? s.testStatusPass : s.testStatusFail}>
                            {t.passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        {!t.passed && (
                          <div className={s.testCaseDetails}>
                            <div className={s.testDetailLine}><span className={s.testDetailLabel}>Input:</span> {t.input}</div>
                            <div className={s.testDetailLine}><span className={s.testDetailLabel}>Expected:</span> {t.expected}</div>
                            <div className={s.testDetailLine}><span className={s.testDetailLabel}>Got:</span> <span className={s.testGotValue}>{t.got}</span></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={s.complexityRow}>
                    <span className={s.complexityItem}>⏱ Time: {evalResult.timeComplexity || 'N/A'}</span>
                    <span className={s.complexityItem}>💾 Space: {evalResult.spaceComplexity || 'N/A'}</span>
                  </div>
                  {evalResult.feedback && (
                    <div className={s.feedbackBlock}>
                      <span className={s.feedbackIcon}>💬</span>
                      <span className={s.feedbackText}>{evalResult.feedback}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════════ RIGHT PANEL ══════════ */}
      <div className={s.rightPanel}>
        {/* AI Header */}
        <div className={s.aiHeader}>
          <div className={s.avatarWrap}>
            {aiStatus === 'Speaking...' && (
              <>
                <span className={`${s.ripple} ${s.ripplePurple}`} />
                <span className={`${s.ripple} ${s.ripplePurple} ${s.ripple2}`} />
                <span className={`${s.ripple} ${s.ripplePurple} ${s.ripple3}`} />
              </>
            )}
            <div className={`${s.avatar} ${
              aiStatus === 'Speaking...' ? s.avatarSpeaking :
              aiStatus === 'Thinking...' ? s.avatarThinking : ''
            }`}>
              A
            </div>
          </div>
          <div className={s.aiInfo}>
            <div className={s.aiName}>Alex — AI Interviewer</div>
            <div className={s.aiStatus}>
              <span className={`${s.statusDot} ${
                aiStatus === 'Thinking...' ? s.statusDotThinking :
                aiStatus === 'Speaking...' ? s.statusDotSpeaking : ''
              }`} />
              {aiStatus}
            </div>
          </div>
          <button
            className={`${s.muteBtn} ${isMuted ? s.muteBtnActive : ''}`}
            onClick={toggleMute}
            title={isMuted ? 'Unmute AI voice' : 'Mute AI voice'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>

        {/* Chat Area */}
        <div className={s.chatArea}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${s.msgWrap} ${msg.role === 'user' ? s.msgWrapUser : s.msgWrapAi}`}
            >
              <div className={`${s.msgBubble} ${
                msg.role === 'user' ? s.msgBubbleUser : s.msgBubbleAi
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {aiTyping && (
            <div className={`${s.msgWrap} ${s.msgWrapAi}`}>
              <div className={s.typingIndicator}>
                <span className={s.typingDot} />
                <span className={s.typingDot} />
                <span className={s.typingDot} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className={s.chatInputArea}>
          <form className={s.chatInputWrap} onSubmit={handleChatSubmit}>
            <input
              className={s.chatInput}
              type="text"
              placeholder="Type a message to your interviewer..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={aiTyping}
            />
            <div className={s.micWrap}>
              {isRecording && (
                <>
                  <span className={`${s.rippleMic} ${s.rippleGreen}`} />
                  <span className={`${s.rippleMic} ${s.rippleGreen} ${s.ripple2}`} />
                  <span className={`${s.rippleMic} ${s.rippleGreen} ${s.ripple3}`} />
                </>
              )}
            <button
              type="button"
              className={`${s.micBtn} ${isRecording ? s.micBtnActive : ''}`}
              onClick={toggleVoice}
              title={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              🎤
            </button>
            </div>
            <button
              type="submit"
              className={s.sendBtn}
              disabled={!chatInput.trim() || aiTyping}
              title="Send message"
            >
              ➤
            </button>
          </form>
        </div>

        {/* Bottom Actions */}
        <div className={s.bottomActions}>
          <button className={s.btnSkip} onClick={handleSkip}>
            ⏭ Skip Problem
          </button>
          <button className={s.btnEndInterview} onClick={handleEndInterview}>
            ✓ Submit Interview
          </button>
        </div>
      </div>
    </div>
  );
}
