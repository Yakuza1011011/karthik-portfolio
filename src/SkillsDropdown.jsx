import { useEffect, useId, useRef, useState } from 'react';

export default function SkillsDropdown({ label, skills, links = {} }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const trigger = useRef(null);
  const options = useRef([]);
  const wasOpen = useRef(false);
  const listId = useId();
  const hasLinks = Object.keys(links).length > 0;

  useEffect(() => {
    // Keep opening from jumping the page; arrow-key navigation still follows focus.
    if (open) options.current[active]?.focus({ preventScroll: !wasOpen.current });
    wasOpen.current = open;
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = event => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  const expand = (fromEnd = false) => {
    const selectedIndex = skills.indexOf(selected);
    setActive(selectedIndex >= 0 ? selectedIndex : fromEnd ? skills.length - 1 : 0);
    setOpen(true);
  };
  const closeAndFocus = () => {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };

  const onKeyDown = event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      closeAndFocus();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      if (!open) expand(event.key === 'ArrowUp' || event.key === 'End');
      else setActive(index => event.key === 'Home' ? 0 : event.key === 'End' ? skills.length - 1 :
        (index + (event.key === 'ArrowDown' ? 1 : -1) + skills.length) % skills.length);
    }
  };

  return (
    <div ref={root} className="skills-dropdown" onKeyDown={onKeyDown} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button ref={trigger} type="button" className="skills-dropdown-trigger"
        aria-label={selected ? `${label} skills: ${selected}` : `${label} skills`}
        aria-haspopup={hasLinks ? 'menu' : 'listbox'} aria-expanded={open} aria-controls={listId}
        onClick={() => open ? setOpen(false) : expand()}>
        <span className="skills-dropdown-label">{selected || label}</span>
        <svg className="skills-dropdown-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
          <path className="skills-dropdown-icon-vertical" d="M12 5v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
        </svg>
      </button>
      <div className="skills-dropdown-panel" data-open={open} aria-hidden={!open} inert={!open}>
        <div id={listId} className="skills-dropdown-menu" role={hasLinks ? 'menu' : 'listbox'} aria-label={`${label} skills`}>
          {skills.map((skill, index) => {
            const href = links[skill];
            const Item = href ? 'a' : 'button';
            return (
            <Item key={skill} ref={node => { options.current[index] = node; }}
              href={href} type={href ? undefined : 'button'} role={hasLinks ? 'menuitem' : 'option'}
              aria-selected={hasLinks ? undefined : selected === skill} tabIndex={open && index === active ? 0 : -1}
              className="skills-dropdown-option" onFocus={() => setActive(index)} onClick={() => {
                if (href) return;
                setSelected(skill);
                closeAndFocus();
              }}>
              {skill}
            </Item>
            );
          })}
        </div>
      </div>
    </div>
  );
}
