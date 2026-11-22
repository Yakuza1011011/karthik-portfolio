import { useId, useState } from 'react';
import { motion, useReducedMotion, useTransform } from 'motion/react';
import VaporText from './VaporText';
import darshanamArtwork from './darshanam-project-clean.png';
import worldTrackerArtwork from './world-tracker-project-clean.png';
import dineArtwork from './dine-project-matched-glow-v2.png';

function ProjectCard({ name, artwork, description, projectUrl, compactDescription = false }) {
  const [flipped, setFlipped] = useState(false);
  const descriptionId = useId();

  return (
    <figure className="projects-artwork" aria-label={`${name} project`}>
      <div className="project-card-shell">
        <button
          type="button"
          className="project-card"
          data-flipped={flipped}
          aria-label={flipped ? `Return to ${name} artwork` : `About ${name}`}
          aria-describedby={flipped && description ? descriptionId : undefined}
          aria-pressed={flipped}
          onClick={() => setFlipped(!flipped)}
          onKeyDown={event => {
            if (event.key === 'Escape') setFlipped(false);
          }}
        >
          <span className="project-card__inner">
            <span className="project-card__front" aria-hidden={flipped}>
              <img src={artwork} width="1086" height="1448" alt={`${name} project artwork in a glowing blue music-player frame`} draggable={false} />
            </span>
            <span className={`project-card__back${description ? ' project-card__back--detailed' : ''}`} aria-hidden={!flipped}>
              <span className="project-card__eyebrow">ABOUT</span>
              <span className="project-card__title">{name.toUpperCase()}</span>
              <span className="project-card__rule" aria-hidden="true" />
              {description && (
                <span
                  id={descriptionId}
                  className={`project-card__description${compactDescription ? ' project-card__description--compact' : ''}`}
                  onClick={event => event.stopPropagation()}
                >
                  {description}
                </span>
              )}
              <span className="project-card__return">Click to return</span>
            </span>
          </span>
        </button>
        {projectUrl && !flipped && (
          <a
            className="project-card__play"
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${name} website in a new tab`}
            title={`Open ${name} in a new tab`}
          />
        )}
      </div>
    </figure>
  );
}

export default function ProjectsScene({ sectionRef, progress, exitProgress, scrollContainer }) {
  const reduced = useReducedMotion();
  const rotate = useTransform(progress, [0, 1], [6, 0]);
  const rotateX = useTransform(progress, [0, 1], [5, 0]);
  const x = useTransform(progress, [0, 1], ['4%', '0%']);
  const scale = useTransform(progress, [0, 1], [0.92, 1]);
  const radius = useTransform(progress, [0, 1], [26, 0]);
  const rearRotate = useTransform(progress, [0, 1], [-5, 0]);
  const midRotate = useTransform(progress, [0, 1], [3, 0]);
  const layerOpacity = useTransform(progress, [0, 1], [0.62, 0]);
  const exitScale = useTransform(exitProgress, [0, 1], [1, 0.965]);
  const exitRotate = useTransform(exitProgress, [0, 1], [0, 1]);

  return (
    <motion.section ref={sectionRef} id="projects" className="projects-scene" aria-label="Projects"
      style={reduced ? undefined : { scale: exitScale, rotate: exitRotate }}>
      {!reduced && <>
        <motion.div className="projects-stack-sheet projects-stack-sheet--rear" aria-hidden="true"
          style={{ rotate: rearRotate, scale: 0.94, opacity: layerOpacity }} />
        <motion.div className="projects-stack-sheet projects-stack-sheet--middle" aria-hidden="true"
          style={{ rotate: midRotate, scale: 0.97, opacity: layerOpacity }} />
      </>}
      <motion.div className="projects-panel" style={reduced ? undefined : { rotate, rotateX, x, scale, borderRadius: radius }}>
        <VaporText text="PROJECTS" scrollContainer={scrollContainer} />
        <div className="projects-gallery" role="region" aria-label="Project cards">
          <ProjectCard
            name="Darshanam"
            artwork={darshanamArtwork}
            projectUrl="https://darshanam.aerodynamic1110.workers.dev"
            description="Darshanam is a temple discovery website where users sign in with Google, create a profile, and explore temples by location, ticket prices and seva details. Built with JavaScript, Cloudflare Workers and Neon PostgreSQL, it offers search, nearby temple recommendations and links to official booking websites."
          />
          <ProjectCard
            name="DINE"
            artwork={dineArtwork}
            projectUrl="https://dine.aerodynamic1110.workers.dev"
            compactDescription
            description="DINE is a restaurant management website with separate Admin, Cashier and Steward workspaces. It manages menus, staff, tables, reservations, orders, billing and payments, with automatic order updates. Users sign in, complete their profiles and access their assigned workspace. The website runs on Cloudflare, stores data in Neon PostgreSQL and deploys automatically from GitHub."
          />
          <ProjectCard
            name="World Tracker"
            artwork={worldTrackerArtwork}
            projectUrl="https://github.com/Yakuza1011011/World-Tracker.git"
            compactDescription
            description="World Tracker brings global exploration to life with an interactive world map. Add users and highlight any country with a simple click, creating an engaging visual experience that makes every selection stand out. Built with JavaScript, CSS, and Node.js, it combines an interactive interface with server-side functionality, while PostgreSQL provides reliable, structured data storage."
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
