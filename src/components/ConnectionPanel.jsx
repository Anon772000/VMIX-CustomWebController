import PropTypes from 'prop-types';

const ConnectionPanel = ({
  connection,
  autoRefresh,
  refreshRate,
  onChange,
  onToggleAutoRefresh,
  onRefreshNow,
  onRefreshRateChange,
  isFetching
}) => {
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      onChange({ [name]: checked });
      return;
    }
    onChange({ [name]: value });
  };

  return (
    <section className="panel connection-panel">
      <header className="panel-header">
        <h2>Connection</h2>
        <button type="button" className="btn ghost" onClick={onRefreshNow} disabled={isFetching}>
          {isFetching ? 'Refreshing…' : 'Refresh now'}
        </button>
      </header>
      <div className="panel-body">
        <div className="field-grid">
          <label className="field">
            <span className="field-label">Host</span>
            <input
              type="text"
              name="host"
              value={connection.host}
              onChange={handleInputChange}
              placeholder="localhost"
            />
          </label>
          <label className="field">
            <span className="field-label">Port</span>
            <input
              type="number"
              name="port"
              min="1"
              value={connection.port}
              onChange={handleInputChange}
              placeholder="8088"
            />
          </label>
          <label className="field checkbox">
            <input
              type="checkbox"
              name="secure"
              checked={connection.secure}
              onChange={handleInputChange}
            />
            <span>Use HTTPS</span>
          </label>
        </div>
        <div className="field-grid">
          <label className="field checkbox">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => onToggleAutoRefresh(event.target.checked)}
            />
            <span>Auto refresh status</span>
          </label>
          <label className="field">
            <span className="field-label">Refresh rate (ms)</span>
            <input
              type="number"
              min="500"
              step="250"
              value={refreshRate}
              onChange={(event) => onRefreshRateChange(Number(event.target.value))}
              disabled={!autoRefresh}
            />
          </label>
        </div>
      </div>
    </section>
  );
};

ConnectionPanel.propTypes = {
  connection: PropTypes.shape({
    host: PropTypes.string,
    port: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    secure: PropTypes.bool
  }).isRequired,
  autoRefresh: PropTypes.bool.isRequired,
  refreshRate: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onToggleAutoRefresh: PropTypes.func.isRequired,
  onRefreshNow: PropTypes.func.isRequired,
  onRefreshRateChange: PropTypes.func.isRequired,
  isFetching: PropTypes.bool
};

ConnectionPanel.defaultProps = {
  isFetching: false
};

export default ConnectionPanel;
