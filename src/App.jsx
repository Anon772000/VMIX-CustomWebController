import { useCallback, useEffect, useMemo, useState } from 'react';
import BrandHeader from './components/BrandHeader.jsx';
import ConnectionPanel from './components/ConnectionPanel.jsx';
import QuickActions from './components/QuickActions.jsx';
import InputGrid from './components/InputGrid.jsx';
import AudioMixer from './components/AudioMixer.jsx';
import StatusCard from './components/StatusCard.jsx';
import './styles/app.css';

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseInputs = (xmlDoc) => {
  const inputNodes = Array.from(xmlDoc.querySelectorAll('inputs > input'));
  return inputNodes.map((node) => ({
    key: node.getAttribute('key'),
    number: parseNumber(node.getAttribute('number')),
    title: node.getAttribute('title'),
    shortTitle: node.getAttribute('shortTitle') || node.getAttribute('title'),
    type: node.getAttribute('type'),
    state: node.getAttribute('state'),
    duration: parseNumber(node.getAttribute('duration')),
    position: parseNumber(node.getAttribute('position')),
    muted: node.getAttribute('muted') === 'True',
    solo: node.getAttribute('solo') === 'True',
    volume: parseNumber(node.getAttribute('volume'), 0),
    selected: node.getAttribute('selected') === 'True',
    preview: node.getAttribute('preview') === 'True'
  }));
};

const parseAudio = (xmlDoc) => {
  const master = xmlDoc.querySelector('audio');
  const buses = Array.from(xmlDoc.querySelectorAll('audio > bus')).map((bus) => ({
    id: bus.getAttribute('id'),
    enabled: bus.getAttribute('mute') !== 'True',
    volume: parseNumber(bus.getAttribute('volume'), 0),
    solo: bus.getAttribute('solo') === 'True'
  }));

  return {
    masterVolume: master ? parseNumber(master.getAttribute('masterVolume'), 100) : 100,
    masterMute: master ? master.getAttribute('masterMute') === 'True' : false,
    buses
  };
};

const defaultConnection = {
  host: 'localhost',
  port: '8088',
  secure: false
};

function App() {
  const [connection, setConnection] = useState(defaultConnection);
  const [isConnected, setIsConnected] = useState(false);
  const [inputs, setInputs] = useState([]);
  const [programInput, setProgramInput] = useState(null);
  const [previewInput, setPreviewInput] = useState(null);
  const [audioChannels, setAudioChannels] = useState({
    inputs: [],
    buses: [],
    masterVolume: 100,
    masterMute: false
  });
  const [lastError, setLastError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshRate, setRefreshRate] = useState(2000);

  const baseUrl = useMemo(() => {
    const protocol = connection.secure ? 'https' : 'http';
    const host = connection.host || 'localhost';
    const port = connection.port || '8088';
    return `${protocol}://${host}:${port}`;
  }, [connection]);

  const updateFromXml = useCallback((xmlDoc) => {
    const parsedInputs = parseInputs(xmlDoc);
    setInputs(parsedInputs);
    setProgramInput(parsedInputs.find((input) => input.selected) || null);
    setPreviewInput(parsedInputs.find((input) => input.preview) || null);

    const audio = parseAudio(xmlDoc);
    const channels = parsedInputs.map((input) => ({
      key: input.key,
      title: input.shortTitle,
      muted: input.muted,
      volume: input.volume
    }));

    setAudioChannels({
      inputs: channels,
      buses: audio.buses,
      masterVolume: audio.masterVolume,
      masterMute: audio.masterMute
    });
  }, []);

  const fetchStatus = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`${baseUrl}/api/`);
      if (!response.ok) {
        throw new Error(`vMix responded with status ${response.status}`);
      }
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
      if (xmlDoc.querySelector('parsererror')) {
        throw new Error('Unable to parse vMix response.');
      }
      updateFromXml(xmlDoc);
      setIsConnected(true);
      setLastError('');
      setLastUpdated(new Date());
    } catch (error) {
      setIsConnected(false);
      setLastError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsFetching(false);
    }
  }, [baseUrl, updateFromXml]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (!autoRefresh) {
      return undefined;
    }

    const interval = setInterval(() => {
      fetchStatus();
    }, refreshRate);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchStatus, refreshRate]);

  const sendFunction = useCallback(
    async (functionName, params = {}) => {
      const url = new URL(`${baseUrl}/api/`);
      url.searchParams.set('Function', functionName);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, value);
        }
      });

      try {
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`vMix responded with status ${response.status}`);
        }
        await fetchStatus();
      } catch (error) {
        setLastError(error instanceof Error ? error.message : String(error));
      }
    },
    [baseUrl, fetchStatus]
  );

  const handleConnectionUpdate = (changes) => {
    setConnection((prev) => ({ ...prev, ...changes }));
  };

  const handleRefreshNow = () => {
    fetchStatus();
  };

  const handleTake = () => {
    sendFunction('Cut');
  };

  const handleAuto = () => {
    sendFunction('Auto');
  };

  const handleFade = () => {
    sendFunction('Fade');
  };

  const handleSetPreview = (input) => {
    sendFunction('PreviewInput', { Input: input.key || input.number });
  };

  const handleSetProgram = (input) => {
    sendFunction('CutDirect', { Input: input.key || input.number });
  };

  const handleOverlayToggle = (index) => {
    sendFunction('OverlayInput' + index);
  };

  const handleAudioToggle = (channel) => {
    if (channel.muted) {
      sendFunction('AudioOn', { Input: channel.key });
    } else {
      sendFunction('AudioOff', { Input: channel.key });
    }
  };

  const handleVolumeChange = (channel, volume) => {
    sendFunction('SetVolume', { Input: channel.key, Value: volume });
  };

  const handleMasterMuteToggle = () => {
    const functionName = audioChannels.masterMute ? 'MasterAudioOn' : 'MasterAudioOff';
    sendFunction(functionName);
  };

  const handleMasterVolumeChange = (volume) => {
    sendFunction('SetMasterVolume', { Value: volume });
  };

  return (
    <div className="app-shell">
      <BrandHeader isConnected={isConnected} />
      <main className="layout-grid">
        <section className="layout-column">
          <ConnectionPanel
            connection={connection}
            autoRefresh={autoRefresh}
            refreshRate={refreshRate}
            onChange={handleConnectionUpdate}
            onToggleAutoRefresh={setAutoRefresh}
            onRefreshNow={handleRefreshNow}
            onRefreshRateChange={setRefreshRate}
            isFetching={isFetching}
          />
          <QuickActions
            programInput={programInput}
            previewInput={previewInput}
            onTake={handleTake}
            onAuto={handleAuto}
            onFade={handleFade}
            onOverlayToggle={handleOverlayToggle}
          />
          <StatusCard
            isConnected={isConnected}
            lastError={lastError}
            lastUpdated={lastUpdated}
          />
        </section>
        <section className="layout-column">
          <InputGrid
            inputs={inputs}
            programInput={programInput}
            previewInput={previewInput}
            onSetPreview={handleSetPreview}
            onSetProgram={handleSetProgram}
          />
        </section>
        <section className="layout-column">
          <AudioMixer
            audioChannels={audioChannels}
            onToggleChannel={handleAudioToggle}
            onChannelVolumeChange={handleVolumeChange}
            onMasterMuteToggle={handleMasterMuteToggle}
            onMasterVolumeChange={handleMasterVolumeChange}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
