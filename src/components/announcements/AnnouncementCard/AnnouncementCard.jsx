import styles from './AnnouncementCard.module.css';

/**
 * Renders a single announcement card with title, body, audience, and timestamp.
 * @param {Object} data - Announcement data object.
 */
export default function AnnouncementCard({ data }) {
  if (!data) return null;

  const {
    title = 'Untitled',
    body = 'No content available.',
    audience = 'all',
    createdAt,
  } = data;

  return (
    <div className={styles.card}>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.body}>{body}</p>
      <div className={styles.meta}>
        <span>Audience: {audience}</span>
        <span>{createdAt ? new Date(createdAt).toLocaleString() : 'Unknown date'}</span>
      </div>
    </div>
  );
}