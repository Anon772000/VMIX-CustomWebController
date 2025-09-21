import PropTypes from 'prop-types';

const BrandHeader = ({ isConnected }) => (
  <header className="brand-header">
    <div className="brand-identity">
      <div className="brand-mark">
        <span className="brand-word primary">Audio</span>
        <span className="brand-word accent">Plus</span>
        <span className="brand-domain">.com.au</span>
      </div>
      <p className="brand-tagline">Professional vMix control tailored for AudioPlus broadcast workflows.</p>
    </div>
    <div className="connection-indicator" data-status={isConnected ? 'online' : 'offline'}>
      <span className="indicator-dot" />
      <span className="indicator-label">{isConnected ? 'Live with vMix' : 'Not connected'}</span>
    </div>
  </header>
);

BrandHeader.propTypes = {
  isConnected: PropTypes.bool
};

BrandHeader.defaultProps = {
  isConnected: false
};

export default BrandHeader;
