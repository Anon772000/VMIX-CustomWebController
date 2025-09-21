import PropTypes from 'prop-types';

const StatusCard = ({ isConnected, lastError, lastUpdated }) => (
  <section className="panel status-panel">
    <header className="panel-header">
      <h2>Status</h2>
    </header>
    <div className="panel-body">
      <div className="status-line">
        <span className="status-label">Connection</span>
        <span className={isConnected ? 'status-ok' : 'status-warn'}>
          {isConnected ? 'Connected to vMix' : 'Disconnected'}
        </span>
      </div>
      <div className="status-line">
        <span className="status-label">Last updated</span>
        <span>{lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}</span>
      </div>
      {lastError && (
        <div className="status-error" role="alert">
          <strong>Warning:</strong>
          <span>{lastError}</span>
        </div>
      )}
      <p className="status-help">
        Need help? Call the AudioPlus engineering team or visit
        <a href="https://www.audioplus.com.au" target="_blank" rel="noreferrer">
          {' '}
          AudioPlus.com.au
        </a>
        .
      </p>
    </div>
  </section>
);

StatusCard.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  lastError: PropTypes.string,
  lastUpdated: PropTypes.instanceOf(Date)
};

StatusCard.defaultProps = {
  lastError: '',
  lastUpdated: null
};

export default StatusCard;
