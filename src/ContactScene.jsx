import { motion, useReducedMotion, useTransform } from 'motion/react';
import { FaRegEnvelope, FaLinkedin, FaInstagram, FaArrowUp } from 'react-icons/fa';
import ContactText from './ContactText';

const CONTACT_METHODS = [
  { label: 'Email', Icon: FaRegEnvelope, href: 'mailto:karthik031011@gmail.com' },
  {
    label: 'LinkedIn', Icon: FaLinkedin, newTab: true,
    href: 'https://www.linkedin.com/in/karthik-sreenivasan-558655332',
  },
  {
    label: 'Instagram', Icon: FaInstagram, newTab: true,
    href: 'https://www.instagram.com/kar.raw3?fqnt=MWNuajVpYmxjNDkxdA==',
  },
];

export default function ContactScene({ sectionRef, progress, onBackToTop }) {
  const reduced = useReducedMotion();
  const rotate = useTransform(progress, [0, 1], [-4, 0]);
  const rotateX = useTransform(progress, [0, 1], [4, 0]);
  const x = useTransform(progress, [0, 1], ['-3%', '0%']);
  const scale = useTransform(progress, [0, 1], [0.94, 1]);
  const radius = useTransform(progress, [0, 1], [28, 0]);
  const rearRotate = useTransform(progress, [0, 1], [4, 0]);
  const midRotate = useTransform(progress, [0, 1], [-2.5, 0]);
  const layerOpacity = useTransform(progress, [0, 1], [0.55, 0]);
  const headingY = useTransform(progress, [0.15, 1], [32, 0]);
  const headingOpacity = useTransform(progress, [0.15, 0.85], [0, 1]);

  return (
    <section ref={sectionRef} id="contact" className="contact-scene" aria-labelledby="contact-heading">
      {!reduced && <>
        <motion.div className="contact-stack-sheet contact-stack-sheet--rear" aria-hidden="true"
          style={{ rotate: rearRotate, scale: 0.95, opacity: layerOpacity }} />
        <motion.div className="contact-stack-sheet contact-stack-sheet--middle" aria-hidden="true"
          style={{ rotate: midRotate, scale: 0.98, opacity: layerOpacity }} />
      </>}
      <motion.div className="contact-panel" style={reduced ? undefined : { rotate, rotateX, x, scale, borderRadius: radius }}>
        <motion.h2 id="contact-heading" className="contact-heading" aria-label="Wanna Contact?"
          style={reduced ? undefined : { y: headingY, opacity: headingOpacity }}>
          <ContactText progress={progress} />
        </motion.h2>
        <motion.ul className="contact-boxes" aria-label="Contact methods"
          style={reduced ? undefined : { y: headingY, opacity: headingOpacity }}>
          {CONTACT_METHODS.map(({ label, Icon, href, newTab }) => (
            <li key={label}>
              <a className="skills-role-box contact-box" href={href}
                target={newTab ? '_blank' : undefined}
                rel={newTab ? 'noopener noreferrer' : undefined}
                aria-label={newTab ? `${label} profile (opens in a new tab)` : 'Email karthik031011@gmail.com'}>
                <span>{label}</span>
                <Icon className="contact-box-icon" aria-hidden="true" focusable="false" />
              </a>
            </li>
          ))}
        </motion.ul>
        <button className="back-to-top" type="button" onClick={onBackToTop}
          aria-label="Back to top" title="Back to page 2 — Karthik">
          <FaArrowUp aria-hidden="true" focusable="false" />
        </button>
      </motion.div>
    </section>
  );
}
