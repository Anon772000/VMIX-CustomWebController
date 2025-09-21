import PropTypes from 'prop-types';

const AudioMixer = ({
  audioChannels,
  onToggleChannel,
  onChannelVolumeChange,
  onMasterMuteToggle,
  onMasterVolumeChange
}) => {
  if (!audioChannels) {
    return null;
  }

  const { inputs, masterVolume, masterMute, buses } = audioChannels;

  return (
    <section className="panel audio-mixer">
      <header className="panel-header">
        <h2>Audio</h2>
      </header>
      <div className="panel-body">
        <div className="master-audio">
          <div className="master-info">
            <span className="field-label">Master volume</span>
            <span className="master-value">{masterVolume}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={(event) => onMasterVolumeChange(Number(event.target.value))}
          />
          <button type="button" className="btn outline" onClick={onMasterMuteToggle}>
            {masterMute ? 'Unmute' : 'Mute'} master
          </button>
        </div>
        <div className="audio-channel-grid">
          {inputs.map((channel) => (
            <article className="audio-channel" key={channel.key}>
              <header>
                <h3>{channel.title}</h3>
                <button type="button" className="btn ghost" onClick={() => onToggleChannel(channel)}>
                  {channel.muted ? 'Audio On' : 'Audio Off'}
                </button>
              </header>
              <div className="slider-row">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(channel.volume)}
                  onChange={(event) => onChannelVolumeChange(channel, Number(event.target.value))}
                />
                <span className="slider-value">{Math.round(channel.volume)}</span>
              </div>
            </article>
          ))}
        </div>
        {buses.length > 0 && (
          <div className="bus-panel">
            <h3>Buses</h3>
            <div className="bus-list">
              {buses.map((bus) => (
                <div className="bus" key={bus.id}>
                  <span className="bus-id">Bus {bus.id}</span>
                  <span className="bus-volume">{bus.volume}</span>
                  <span className="bus-state">{bus.enabled ? 'On' : 'Muted'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

AudioMixer.propTypes = {
  audioChannels: PropTypes.shape({
    inputs: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        title: PropTypes.string,
        muted: PropTypes.bool,
        volume: PropTypes.number
      })
    ),
    masterVolume: PropTypes.number,
    masterMute: PropTypes.bool,
    buses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        volume: PropTypes.number,
        enabled: PropTypes.bool
      })
    )
  }),
  onToggleChannel: PropTypes.func.isRequired,
  onChannelVolumeChange: PropTypes.func.isRequired,
  onMasterMuteToggle: PropTypes.func.isRequired,
  onMasterVolumeChange: PropTypes.func.isRequired
};

AudioMixer.defaultProps = {
  audioChannels: null
};

export default AudioMixer;
