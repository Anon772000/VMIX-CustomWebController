import PropTypes from 'prop-types';

import audioPlusLogo from '../assets/audioplus-logo.svg';



const BrandHeader = ({ isConnected }) => (
  <header className="brand-header">
    <div className="brand-identity">

      <img className="brand-logo" src={audioPlusLogo} alt="AudioPlus logo" />
      <div className="brand-meta">
        <h1 className="brand-title">
          <span className="brand-word primary">Audio</span>
          <span className="brand-word accent">Plus</span>
          <span className="brand-domain">.com.au</span>
        </h1>
        <p className="brand-tagline">Broadcast-ready vMix control surface built for the AudioPlus workflow.</p>
      </div>

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
