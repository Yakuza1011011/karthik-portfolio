import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useIsPresent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import BlurText from './BlurText';
import CountUp from './CountUp';
import GlowCursor from './GlowCursor';
import MagicRings from './MagicRings';
import StarBorder from './StarBorder';
import TechText from './TechText';
import TextPressure from './TextPressure';
import Shuffle from './Shuffle';
import LogoLoop from './LogoLoop';
import SkillsDropdown from './SkillsDropdown';
import ProjectsScene from './ProjectsScene';
import ContactScene from './ContactScene';
import { returnScrollEase } from './returnScrollEase';
import { SiHtml5, SiCss, SiJavascript, SiReact, SiBootstrap, SiNodedotjs, SiPostgresql, SiCplusplus, SiPython } from 'react-icons/si';
import karthikPortrait from './karthik-portrait.webp';
import './page.css';

function PortfolioIntro({ onDive, returning }) {
  const [phase, setPhase] = useState(returning ? 'centered' : 'counting');
  const previousPositions = useRef([]);
  const revealPortfolio = phase !== 'counting';

  const finishCounterExit = event => {
    if (event.animationName !== 'counter-exit') return;
    const sections = event.currentTarget.querySelectorAll('.portfolio-wordmark, .below-counter');
    previousPositions.current = Array.from(sections, element => ({
      element,
      top: element.getBoundingClientRect().top,
    }));
    setPhase('centered');
  };

  useLayoutEffect(() => {
    if (phase !== 'centered' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Start each section at its last visible position in the new, centered layout.
    const moves = previousPositions.current.map(({ element, top }) => {
      const offset = top - element.getBoundingClientRect().top;
      return element.animate([{ top: `${offset}px` }, { top: '0px' }], {
        duration: 800,
        easing: 'cubic-bezier(0.33, 0, 0.2, 1)',
      });
    });
    return () => moves.forEach(move => move.cancel());
  }, [phase]);

  return (
    <div className="counter-overlay" data-phase={phase} onAnimationEnd={finishCounterExit}>
      {revealPortfolio && (
        <TechText
          text="THE PORTFOLIO"
          fontWeight={700}
          fontSize={192}
          reveal="letter"
          dashLength={4}
          dashGap={2}
          specks={15}
          intro="assemble"
          introDuration={2}
          draggable
          clickKick
          guides={false}
          className="portfolio-wordmark"
        />
      )}
      {phase !== 'centered' && (
        <CountUp
          from={0}
          to={100}
          mode="count"
          easing="easeOut"
          separator=","
          duration={1}
          trigger="view"
          onEnd={() => setPhase('fading')}
          className="count-up-text"
        />
      )}
      {revealPortfolio && (
        <div className="below-counter">
          <BlurText
            text="KARTHIK SREENIVASAN"
            effect="blur"
            animateBy="words"
            direction="top"
            staggerFrom="start"
            trigger="load"
            delay={200}
            stepDuration={0.35}
            blur={10}
            distance={50}
            className="name-caption"
          />
          <StarBorder
            className="greeting-button"
            onClick={onDive}
            color="#1558c9"
            trailColor="#030407"
            duration={3}
            direction="clockwise"
            stars={1}
            trailLength={0.45}
            thickness={1}
            radius={12}
            glow={0.8}
            hover="lap"
            sparkle={false}
            clickPulse
            theme="dark"
          >
            DIVE
          </StarBorder>
        </div>
      )}
    </div>
  );
}

function PageScene({ page, focusOnEnter, children }) {
  const isPresent = useIsPresent();
  const reduced = useReducedMotion();
  const section = useRef(null);
  const second = page === 'karthik';

  useLayoutEffect(() => {
    if (!isPresent || !focusOnEnter) return;
    section.current?.querySelector(second ? 'h1' : '.greeting-button')?.focus({ preventScroll: true });
  }, [isPresent, focusOnEnter, second]);

  return (
    <motion.section
      ref={section}
      aria-label={second ? 'About, skills, projects and contact' : 'Portfolio introduction'}
      inert={!isPresent}
      className={`portfolio-scene${second ? ' content-scene' : ''}`}
      initial={{ opacity: 0, y: reduced ? 0 : second ? 22 : -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : second ? 22 : -14 }}
      transition={{ duration: reduced ? 0 : isPresent ? 0.72 : 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

const aboutHash = '#karthik';
const skillsHash = '#skills';
const projectsHash = '#projects';
const contactHash = '#contact';
const currentPage = () => [aboutHash, skillsHash, projectsHash, contactHash].includes(window.location.hash) ? 'karthik' : 'intro';

const aboutCaptions = [
  { text: 'CSE Student', side: 'left' },
  { text: 'At JSS-STU', side: 'right' },
];

const skillLogos = [
  { node: <SiHtml5 />, title: 'HTML5', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML', hoverColor: '#e34f26' },
  { node: <SiCss />, title: 'CSS', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS', hoverColor: '#663399' },
  { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', hoverColor: '#f7df1e' },
  { node: <SiReact />, title: 'ReactJS', href: 'https://react.dev', hoverColor: '#61dafb' },
  { node: <SiBootstrap />, title: 'Bootstrap', href: 'https://getbootstrap.com', hoverColor: '#7952b3' },
  { node: <SiNodedotjs />, title: 'NodeJS', href: 'https://nodejs.org', hoverColor: '#5fa04e' },
  { node: <SiPostgresql />, title: 'PostgreSQL', href: 'https://www.postgresql.org', hoverColor: '#4169e1' },
  { node: <SiCplusplus />, title: 'C++', href: 'https://isocpp.org', hoverColor: '#00599c' },
  { node: <SiPython />, title: 'Python', href: 'https://www.python.org', hoverColor: '#3776ab' },
];

const competitiveSkills = ['C++', 'Python', 'C', 'LeetCode'];
const competitiveLinks = { LeetCode: 'https://leetcode.com/u/Aero1103/' };
const fullStackSkills = skillLogos.map(({ title }) => title).filter(title => !competitiveSkills.includes(title));
const videoTools = ['Adobe Photoshop', 'Adobe After Effects', 'Adobe Premiere Pro', 'Cap Cut', 'Canva'];
const aiSkills = ['GenAI', 'Machine Learning', 'Prompting'];

function PortfolioPages() {
  const scrollContainer = useRef(null);
  const scrollToSkills = useRef(null);
  const scrollToTop = useRef(null);
  const aboutSection = useRef(null);
  const stackSection = useRef(null);
  const skillsSection = useRef(null);
  const projectsSection = useRef(null);
  const projectsStack = useRef(null);
  const contactSection = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ container: scrollContainer, target: aboutSection, offset: ['start start', 'end start'] });
  const { scrollYProgress: projectsProgress } = useScroll({ container: scrollContainer, target: projectsStack, offset: ['start end', 'start start'] });
  const { scrollYProgress: contactProgress } = useScroll({ container: scrollContainer, target: contactSection, offset: ['start end', 'start start'] });
  // Both sides of the stack ease to rest at the same scroll positions.
  const swing = useTransform(projectsProgress, p => p * p * (3 - 2 * p));
  const contactSwing = useTransform(contactProgress, p => p * p * p * (p * (p * 6 - 15) + 10));
  const aboutOpacity = useTransform(scrollYProgress, [0, 0.2, 0.95], [1, 0.95, 0]);
  const aboutY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const skillsY = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const skillsScale = useTransform(swing, [0, 1], [1, 0.965]);
  const skillsRotate = useTransform(swing, [0, 1], [0, -1.25]);

  useLayoutEffect(() => {
    const scroll = scrollContainer.current;
    if (!scroll) return;
    let target = scroll.scrollTop;
    let animating = false;
    let wheelFrame = 0;
    let returnFrame = 0;
    let lastTick = 0;
    const clampScroll = top => Math.max(0, Math.min(top, scroll.scrollHeight - scroll.clientHeight));
    const cancelScroll = () => {
      cancelAnimationFrame(wheelFrame);
      wheelFrame = 0;
      cancelAnimationFrame(returnFrame);
      returnFrame = 0;
      if (animating) scroll.scrollTo({ top: scroll.scrollTop, behavior: 'instant' });
      animating = false;
      target = scroll.scrollTop;
    };
    const moveTo = (top, instant = false) => {
      cancelAnimationFrame(wheelFrame);
      wheelFrame = 0;
      cancelAnimationFrame(returnFrame);
      returnFrame = 0;
      target = clampScroll(top);
      animating = !instant && !reduced;
      // Browser-managed easing stays fluid while the letter effects animate.
      scroll.scrollTo({ top: target, behavior: animating ? 'smooth' : 'instant' });
    };
    const scrollToPage = (instant = false) => {
      const hash = window.location.hash;
      if (![aboutHash, skillsHash, projectsHash, contactHash].includes(hash)) return;
      const skillsTop = stackSection.current?.offsetTop || 0;
      const projectsTop = skillsTop + (projectsStack.current?.offsetTop || 0);
      const contactTop = projectsTop + (contactSection.current?.offsetTop || 0);
      moveTo(hash === contactHash ? contactTop : hash === projectsHash ? projectsTop : hash === skillsHash ? skillsTop : 0, instant);
    };
    const glide = now => {
      const dt = Math.min(now - lastTick, 50);
      lastTick = now;
      const remaining = target - scroll.scrollTop;
      // Keep one continuous wheel glide instead of restarting a smooth scroll per tick.
      if (Math.abs(remaining) <= 1) {
        scroll.scrollTop = target;
        wheelFrame = 0;
        return;
      }
      const step = Math.max(1, Math.abs(remaining) * (1 - Math.exp(-dt / 100)));
      scroll.scrollTop += Math.sign(remaining) * Math.min(Math.abs(remaining), step);
      wheelFrame = requestAnimationFrame(glide);
    };
    const onWheel = event => {
      // Keep zoom, horizontal gestures, touch, and reduced-motion scrolling native.
      if (reduced || event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroll.clientHeight : 1;
      const delta = event.deltaY * unit;
      if (!delta) return;
      if (returnFrame) cancelScroll();
      event.preventDefault();
      const skillsTop = stackSection.current.offsetTop;
      if (wheelFrame || (scroll.scrollTop >= skillsTop - 1 && (delta > 0 || scroll.scrollTop > skillsTop + 1))) {
        if (!wheelFrame) {
          cancelScroll();
          lastTick = performance.now();
          wheelFrame = requestAnimationFrame(glide);
        }
        if ((target - scroll.scrollTop) * delta < 0) target = scroll.scrollTop;
        target = clampScroll(target + delta);
        return;
      }
      const next = clampScroll((animating ? target : scroll.scrollTop) + delta);
      if (next !== target || !animating) moveTo(next);
    };
    const onScrollEnd = () => {
      if (!wheelFrame && !returnFrame) {
        animating = false;
        target = scroll.scrollTop;
        // An interrupted return stays flat until an endpoint, avoiding a mid-page snap.
        if (target <= 1 || target >= scroll.scrollHeight - scroll.clientHeight - 1) {
          delete scroll.dataset.returning;
        }
      }
    };
    const onKeyDown = event => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) cancelScroll();
    };
    scrollToSkills.current = () => moveTo(stackSection.current?.offsetTop || scroll.clientHeight);
    scrollToTop.current = () => {
      if (returnFrame) return;
      cancelScroll();
      const startTop = scroll.scrollTop;
      const finishAtAbout = () => {
        target = 0;
        animating = false;
        scroll.scrollTop = 0;
        delete scroll.dataset.returning;
        if (window.location.hash !== aboutHash) window.history.pushState(null, '', aboutHash);
        aboutSection.current?.querySelector('.back-link')?.focus({ preventScroll: true });
      };
      if (reduced || startTop <= 1) {
        moveTo(0, true);
        finishAtAbout();
        return;
      }
      scroll.dataset.returning = 'true';
      const duration = Math.min(5000, Math.max(2800, startTop * 1.15));
      let previousFrame = performance.now();
      let elapsed = 0;
      target = 0;
      animating = true;
      const returnToAbout = now => {
        // Slow down after a missed frame instead of jumping ahead to catch the clock.
        elapsed += Math.min(Math.max(now - previousFrame, 0), 32);
        previousFrame = now;
        const progress = Math.min(1, elapsed / duration);
        const ease = returnScrollEase(progress);
        scroll.scrollTop = startTop * (1 - ease);
        if (progress < 1) {
          returnFrame = requestAnimationFrame(returnToAbout);
          return;
        }
        returnFrame = 0;
        finishAtAbout();
      };
      returnFrame = requestAnimationFrame(returnToAbout);
    };
    scrollToPage(true);
    const followHash = () => scrollToPage();
    scroll.addEventListener('wheel', onWheel, { passive: false });
    scroll.addEventListener('pointerdown', cancelScroll, { passive: true });
    scroll.addEventListener('touchstart', cancelScroll, { passive: true });
    scroll.addEventListener('keydown', onKeyDown);
    scroll.addEventListener('scrollend', onScrollEnd);
    const updateGeometry = () => {
      cancelScroll();
      stackSection.current?.style.setProperty('--skills-pin-top', `${Math.min(0, scroll.clientHeight - (skillsSection.current?.offsetHeight || 0))}px`);
      // Taller mobile project grids remain scrollable before their last card pins.
      projectsStack.current?.style.setProperty('--projects-pin-top', `${Math.min(0, scroll.clientHeight - (projectsSection.current?.offsetHeight || 0))}px`);
    };
    updateGeometry();
    const resizeObserver = new ResizeObserver(updateGeometry);
    resizeObserver.observe(scroll);
    if (skillsSection.current) resizeObserver.observe(skillsSection.current);
    if (projectsSection.current) resizeObserver.observe(projectsSection.current);
    window.addEventListener('hashchange', followHash);
    window.addEventListener('popstate', followHash);
    return () => {
      cancelScroll();
      delete scroll.dataset.returning;
      scrollToSkills.current = null;
      scrollToTop.current = null;
      resizeObserver.disconnect();
      scroll.removeEventListener('wheel', onWheel);
      scroll.removeEventListener('pointerdown', cancelScroll);
      scroll.removeEventListener('touchstart', cancelScroll);
      scroll.removeEventListener('keydown', onKeyDown);
      scroll.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('hashchange', followHash);
      window.removeEventListener('popstate', followHash);
    };
  }, [reduced]);

  return (
    <>
      <div ref={scrollContainer} className="portfolio-scroll" tabIndex={0} aria-label="About, skills, projects and contact pages">
        <section ref={aboutSection} id="karthik" className="scroll-page pressure-scene" aria-label="About Karthik">
          <a className="back-link" href="#home">
            <span aria-hidden="true">←</span> Back
          </a>
          <motion.div className="about-artwork" style={reduced ? undefined : { opacity: aboutOpacity, y: aboutY }}>
            <div className="pressure-stage">
              <TextPressure
                text="KARTHIK"
                fontFamily="Roboto Flex"
                flex width weight
                italic={false}
                radius={0.5}
                smoothing={0.5}
                idle="wave"
                idleSpeed={1}
                clickRipple
                minFontSize={36}
              />
              {aboutCaptions.map(({ text, side }) => (
                <BlurText
                  key={side}
                  text={text}
                  effect="blur"
                  animateBy="words"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={200}
                  stepDuration={0.35}
                  blur={10}
                  distance={5}
                  focusOnHover
                  className={`about-caption about-caption--${side}`}
                />
              ))}
            </div>
            <img
              className="pressure-portrait"
              src={karthikPortrait}
              alt="Portrait of Karthik wearing dark sunglasses"
              width={1317}
              height={1194}
              draggable={false}
            />
          </motion.div>
          <a className="scroll-cue" href="#skills" onClick={event => {
            event.preventDefault();
            if (window.location.hash !== skillsHash) window.history.pushState(null, '', skillsHash);
            scrollToSkills.current?.();
          }}>Scroll <span aria-hidden="true">↓</span></a>
        </section>
        <div ref={stackSection} className="skills-projects-stack">
        <motion.section ref={skillsSection} id="skills" className="scroll-page skills-scene" aria-label="Skills"
          style={reduced ? undefined : { scale: skillsScale, rotate: skillsRotate }}>
          <motion.div className="skills-content" style={reduced ? undefined : { y: skillsY }}>
            <Shuffle
              tag="h2"
              text="SKILLS"
              className="skills-heading"
              textAlign="left"
              effect="blur"
              shuffleDirection="up"
              duration={1.5}
              animationMode="center"
              shuffleTimes={14}
              ease="expo.out"
              stagger={0.06}
              threshold={0.1}
              scroller=".portfolio-scroll"
              triggerOnce
              triggerOnHover
              hoverRadius={0}
              motionBlur={false}
              respectReducedMotion
              scrambleCharset="0123456789#%&*+=?"
            />
            <SkillsDropdown label="Full Stack Developer" skills={fullStackSkills} />
            <SkillsDropdown label="Competitive Coder" skills={competitiveSkills} links={competitiveLinks} />
            <SkillsDropdown label="AI" skills={aiSkills} />
            <SkillsDropdown label="Video Editor" skills={videoTools} />
          </motion.div>
          <div className="skills-logo-column">
            <LogoLoop
              logos={skillLogos}
              speed={100}
              direction="up"
              logoHeight={72}
              gap={40}
              hoverSpeed={0}
              scaleOnHover
              draggable={false}
              ariaLabel="Technology logos"
              className="skills-logo-loop"
            />
          </div>
        </motion.section>
        <div ref={projectsStack} className="projects-contact-stack">
          <ProjectsScene sectionRef={projectsSection} progress={swing} exitProgress={contactSwing} scrollContainer={scrollContainer} />
          <ContactScene sectionRef={contactSection} progress={contactSwing} onBackToTop={() => scrollToTop.current?.()} />
        </div>
        </div>
      </div>
    </>
  );
}

function Portfolio() {
  const [page, setPage] = useState(currentPage);
  const hasDived = useRef(page === 'karthik');
  const reduced = useReducedMotion();

  useEffect(() => {
    const syncLocation = () => {
      const next = currentPage();
      if (next === 'karthik') hasDived.current = true;
      setPage(next);
    };
    window.addEventListener('hashchange', syncLocation);
    window.addEventListener('popstate', syncLocation);
    return () => {
      window.removeEventListener('hashchange', syncLocation);
      window.removeEventListener('popstate', syncLocation);
    };
  }, []);

  useEffect(() => {
    document.title = 'Karthik Portfolio';
  }, [page]);

  function dive() {
    if (currentPage() === 'karthik') return;
    hasDived.current = true;
    window.history.pushState(null, '', aboutHash);
    setPage('karthik');
  }

  return (
    <div className="portfolio">
      <AnimatePresence initial={false}>
        {page === 'intro' && (
          <motion.div
            key="intro-background"
            className="intro-background"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.42 }}
          >
            <MagicRings
              color="#A855F7"
              colorTwo="#6366F1"
              motion="pulse"
              ringCount={6}
              speed={1}
              lineThickness={2}
              glow={1}
              hoverScale={1.2}
              clickBurst
            />
          </motion.div>
        )}
      </AnimatePresence>
      <GlowCursor
        className="portfolio-cursor"
        color="#1558c9"
        intensity={1.3}
        trailWidth={3}
        linger={1.4}
        glow={1.2}
        clickBurst
        theme="dark"
        aria-hidden="true"
      />
      <AnimatePresence initial={false}>
        {page === 'intro' ? (
          <PageScene key="intro" page="intro" focusOnEnter={hasDived.current}>
            <PortfolioIntro returning={hasDived.current} onDive={dive} />
          </PageScene>
        ) : (
          <PageScene key="karthik" page="karthik" focusOnEnter>
            <PortfolioPages />
          </PageScene>
        )}
      </AnimatePresence>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Portfolio />);
