import PropTypes from 'prop-types';

const overlaySlots = [1, 2, 3, 4];

const QuickActions = ({ programInput, previewInput, onTake, onAuto, onFade, onOverlayToggle }) => (
  <section className="panel quick-actions">
    <header className="panel-header">
      <h2>Live Control</h2>
    </header>
    <div className="panel-body">
      <div className="status-cards">
        <div className="status-card program">
          <span className="status-title">Program</span>
          <span className="status-value">{programInput ? programInput.shortTitle : '—'}</span>
        </div>
        <div className="status-card preview">
          <span className="status-title">Preview</span>
          <span className="status-value">{previewInput ? previewInput.shortTitle : '—'}</span>
        </div>
      </div>
      <div className="control-buttons">
        <button type="button" className="btn primary" onClick={onTake}>
          Take
        </button>
        <button type="button" className="btn" onClick={onAuto}>
          Auto
        </button>
        <button type="button" className="btn" onClick={onFade}>
          Fade
        </button>
      </div>
      <div className="overlay-grid">
        {overlaySlots.map((slot) => (
          <button
            type="button"
            className="btn ghost"
            key={slot}
            onClick={() => onOverlayToggle(slot)}
          >
            Overlay {slot}
          </button>
        ))}
      </div>
    </div>
  </section>
);

QuickActions.propTypes = {
  programInput: PropTypes.shape({
    shortTitle: PropTypes.string
  }),
  previewInput: PropTypes.shape({
    shortTitle: PropTypes.string
  }),
  onTake: PropTypes.func.isRequired,
  onAuto: PropTypes.func.isRequired,
  onFade: PropTypes.func.isRequired,
  onOverlayToggle: PropTypes.func.isRequired
};

QuickActions.defaultProps = {
  programInput: null,
  previewInput: null
};

export default QuickActions;
