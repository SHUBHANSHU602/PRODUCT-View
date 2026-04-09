import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Landing.module.css';

export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={s.landing}>
      {/* ───── Navbar ───── */}
      <nav className={s.navbar} id="navbar">
        <div className={s.navLogo}>MockMate</div>

        <ul className={s.navLinks}>
          <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a></li>
          <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing'); }}>Pricing</a></li>
          <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About</a></li>
        </ul>

        <div className={s.navActions}>
          <button className={s.btnLogin} onClick={() => navigate('/login')}>Log in</button>
          <button className={s.btnCta} onClick={() => navigate('/register')}>Start Free</button>
        </div>

        <button className={s.hamburger} onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={menuOpen ? s.mobileMenuOpen : s.mobileMenu}>
        <button className={s.mobileClose} onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a>
        <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing'); }}>Pricing</a>
        <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About</a>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Log in</a>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Start Free →</a>
      </div>

      {/* ───── Hero ───── */}
      <section className={s.hero} id="hero">
        <div className={s.heroBg} />
        <div className={`${s.heroOrb} ${s.heroOrb1}`} />
        <div className={`${s.heroOrb} ${s.heroOrb2}`} />

        <div className={s.heroContent}>
          <div className={s.heroBadge}>
            <span>🚀</span> AI-Powered Career Platform
          </div>

          <h1 className={s.heroTitle}>
            Land Your Dream Job<br />
            with <span className={s.heroTitleAccent}>AI-Powered Interview Prep</span>
          </h1>

          <p className={s.heroSubtitle}>
            Practice realistic mock interviews, get instant AI feedback on your
            resume, and build job-winning documents — all in one platform.
          </p>

          <div className={s.heroButtons}>
            <button className={s.btnHeroPrimary} onClick={() => navigate('/register')}>
              Start Free →
            </button>
            <button className={s.btnHeroSecondary} onClick={() => scrollTo('about')}>
              ▶ Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* ───── Stats Bar ───── */}
      <section className={s.stats} id="stats">
        {[
          { num: '10,000+', label: 'Interviews Taken' },
          { num: '95%', label: 'Satisfaction Rate' },
          { num: '50+', label: 'Resume Templates' },
          { num: 'FAANG', label: 'Ready Prep' },
        ].map((stat) => (
          <div className={s.statCard} key={stat.label}>
            <div className={s.statNumber}>{stat.num}</div>
            <div className={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ───── Features ───── */}
      <section className={s.section} id="features">
        <div className={s.sectionHeader}>
          <div className={s.sectionTag}>Features</div>
          <h2 className={s.sectionTitle}>Everything You Need to Get Hired</h2>
          <p className={s.sectionSubtitle}>
            MockMate combines cutting-edge AI with proven interview prep
            strategies to give you an unfair advantage.
          </p>
        </div>

        <div className={s.featuresGrid}>
          {[
            {
              icon: '🎙️',
              title: 'AI Mock Interview',
              desc: 'Practice with our AI interviewer that adapts to your role, experience level, and target company. Get real-time feedback on your answers.',
            },
            {
              icon: '📄',
              title: 'Resume Analyzer',
              desc: 'Upload your resume and get an instant, detailed ATS compatibility score with actionable suggestions to improve your chances.',
            },
            {
              icon: '✨',
              title: 'Resume Generator',
              desc: 'Build a professional, ATS-optimized resume from scratch using AI-powered templates tailored to your industry.',
            },
          ].map((f) => (
            <div className={s.featureCard} key={f.title}>
              <div className={s.featureIcon}>{f.icon}</div>
              <h3 className={s.featureTitle}>{f.title}</h3>
              <p className={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className={s.howItWorks} id="about">
        <div className={s.stepsContainer}>
          <div className={s.sectionHeader}>
            <div className={s.sectionTag}>How It Works</div>
            <h2 className={s.sectionTitle}>Three Steps to Your Dream Job</h2>
            <p className={s.sectionSubtitle}>
              Our streamlined process makes interview prep effortless and effective.
            </p>
          </div>

          <div className={s.stepsGrid}>
            {[
              {
                num: '📤',
                title: 'Upload Resume',
                desc: 'Drop in your resume and let our AI analyze strengths, weaknesses, and ATS compatibility.',
              },
              {
                num: '🎯',
                title: 'Practice Interview',
                desc: 'Run realistic mock interviews powered by Groq AI, tailored to your target role and company.',
              },
              {
                num: '🏆',
                title: 'Get Hired',
                desc: 'Walk into your real interview with confidence, backed by data-driven preparation.',
              },
            ].map((step, i) => (
              <div className={s.step} key={step.title}>
                <div className={s.stepNumber}>{step.num}</div>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Pricing ───── */}
      <section className={s.section} id="pricing">
        <div className={s.sectionHeader}>
          <div className={s.sectionTag}>Pricing</div>
          <h2 className={s.sectionTitle}>Simple, Transparent Pricing</h2>
          <p className={s.sectionSubtitle}>
            Start for free. Upgrade when you're ready to go all-in on your career.
          </p>
        </div>

        <div className={s.pricingGrid}>
          {/* Free */}
          <div className={s.pricingCard}>
            <div className={s.pricingName}>Free</div>
            <div className={s.pricingPrice}>$0<span>/month</span></div>
            <p className={s.pricingDesc}>Perfect for getting started with AI interview prep.</p>
            <ul className={s.pricingFeatures}>
              <li>3 mock interviews / month</li>
              <li>Basic resume analysis</li>
              <li>1 resume template</li>
              <li className={s.pricingDisabled}>Priority AI feedback</li>
              <li className={s.pricingDisabled}>FAANG-specific prep</li>
            </ul>
            <button className={s.btnPricingFree} onClick={() => navigate('/register')}>
              Get Started Free
            </button>
          </div>

          {/* Pro */}
          <div className={s.pricingCardPro}>
            <div className={s.pricingBadge}>Most Popular</div>
            <div className={s.pricingName}>Pro</div>
            <div className={s.pricingPrice}>$19<span>/month</span></div>
            <p className={s.pricingDesc}>Unlimited prep for serious job seekers.</p>
            <ul className={s.pricingFeatures}>
              <li>Unlimited mock interviews</li>
              <li>Advanced resume analysis</li>
              <li>50+ premium templates</li>
              <li>Priority AI feedback</li>
              <li>FAANG-specific prep</li>
            </ul>
            <button className={s.btnPricingPro} onClick={() => navigate('/register')}>
              Start Pro Trial
            </button>
          </div>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className={s.testimonials} id="testimonials">
        <div className={s.testimonialsInner}>
          <div className={s.sectionHeader}>
            <div className={s.sectionTag}>Testimonials</div>
            <h2 className={s.sectionTitle}>Loved by Job Seekers</h2>
            <p className={s.sectionSubtitle}>
              See what our community has to say about their MockMate experience.
            </p>
          </div>

          <div className={s.testimonialsGrid}>
            {[
              {
                initials: 'AP',
                name: 'Arjun Patel',
                role: 'SDE @ Google',
                text: 'MockMate\'s AI interviewer felt incredibly real. I practiced 20+ sessions before my Google on-site and landed the offer. This tool is a game-changer.',
              },
              {
                initials: 'SK',
                name: 'Sarah Kim',
                role: 'PM @ Meta',
                text: 'The resume analyzer caught issues my friends and career coaches missed. My callback rate went from 5% to 40% after applying the suggestions.',
              },
              {
                initials: 'MR',
                name: 'Marcus Rodriguez',
                role: 'DS @ Amazon',
                text: 'As a career switcher, I was terrified of interviews. MockMate gave me the confidence and structure I needed. Worth every penny of the Pro plan.',
              },
            ].map((t) => (
              <div className={s.testimonialCard} key={t.name}>
                <div className={s.testimonialStars}>★★★★★</div>
                <p className={s.testimonialText}>"{t.text}"</p>
                <div className={s.testimonialAuthor}>
                  <div className={s.testimonialAvatar}>{t.initials}</div>
                  <div>
                    <div className={s.testimonialName}>{t.name}</div>
                    <div className={s.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA Banner ───── */}
      <section className={s.ctaBanner}>
        <div className={s.ctaBannerInner}>
          <h2 className={s.ctaBannerTitle}>Ready to Ace Your Next Interview?</h2>
          <p className={s.ctaBannerText}>
            Join 10,000+ job seekers already using MockMate to land their dream roles.
          </p>
          <button className={s.ctaBannerBtn} onClick={() => navigate('/register')}>
            Get Started for Free →
          </button>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div>
            <div className={s.footerLogo}>MockMate</div>
            <p className={s.footerDesc}>
              AI-powered interview prep and resume tools to help you land your dream job faster.
            </p>
          </div>

          <div>
            <div className={s.footerColTitle}>Product</div>
            <ul className={s.footerLinks}>
              <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a></li>
              <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing'); }}>Pricing</a></li>
              <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo('testimonials'); }}>Testimonials</a></li>
            </ul>
          </div>

          <div>
            <div className={s.footerColTitle}>Resources</div>
            <ul className={s.footerLinks}>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>

          <div>
            <div className={s.footerColTitle}>Legal</div>
            <ul className={s.footerLinks}>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className={s.footerBottom}>
          <div className={s.footerCopy}>© 2026 MockMate. All rights reserved.</div>
          <div className={s.footerSocials}>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="GitHub">⌨</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
