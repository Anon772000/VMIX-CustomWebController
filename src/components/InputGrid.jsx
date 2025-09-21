import PropTypes from 'prop-types';

const InputGrid = ({ inputs, programInput, previewInput, onSetPreview, onSetProgram }) => (
  <section className="panel input-grid">
    <header className="panel-header">
      <h2>Inputs</h2>
      <span className="panel-subtitle">Tap to send to Preview or cut straight to Program.</span>
    </header>
    <div className="panel-body">
      <div className="input-card-grid">
        {inputs.length === 0 && <p className="empty-state">No inputs detected. Connect to vMix and refresh.</p>}
        {inputs.map((input) => {
          const isProgram = programInput && programInput.key === input.key;
          const isPreview = previewInput && previewInput.key === input.key;

          return (
            <article
              key={input.key || input.number}
              className="input-card"
              data-program={isProgram}
              data-preview={isPreview}
            >
              <header>
                <span className="input-number">#{input.number}</span>
                <span className="input-type">{input.type}</span>
              </header>
              <h3 className="input-title">{input.shortTitle}</h3>
              <div className="input-meta">
                <span>{input.state}</span>
                <span>{Math.floor((input.position / Math.max(input.duration, 1)) * 100)}%</span>
              </div>
              <div className="input-actions">
                <button type="button" className="btn" onClick={() => onSetPreview(input)}>
                  Send to Preview
                </button>
                <button type="button" className="btn outline" onClick={() => onSetProgram(input)}>
                  Cut to Program
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

InputGrid.propTypes = {
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      number: PropTypes.number,
      shortTitle: PropTypes.string,
      type: PropTypes.string,
      state: PropTypes.string,
      duration: PropTypes.number,
      position: PropTypes.number
    })
  ).isRequired,
  programInput: PropTypes.shape({
    key: PropTypes.string
  }),
  previewInput: PropTypes.shape({
    key: PropTypes.string
  }),
  onSetPreview: PropTypes.func.isRequired,
  onSetProgram: PropTypes.func.isRequired
};

InputGrid.defaultProps = {
  programInput: null,
  previewInput: null
};

export default InputGrid;
