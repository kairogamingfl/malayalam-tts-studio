"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState(
    "നമസ്കാരം! ഇന്ന് നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്? മലയാളം ശബ്ദത്തിലേക്ക് മാറ്റാൻ ഇവിടെ എഴുതുക."
  );

  const [speaker, setSpeaker] = useState("shubh");
  const [pace, setPace] = useState(1);
  const [temperature, setTemperature] = useState(0.7);
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function generateSpeech() {
    setError("");

    if (!text.trim()) {
      setError("ദയവായി മലയാളം ടെക്സ്റ്റ് നൽകുക.");
      return;
    }

    setLoading(true);

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          speaker,
          pace,
          temperature
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Speech generation failed.");
      }

      const binary = atob(data.audio);
      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([bytes], {
        type: "audio/mpeg"
      });

      setAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadAudio() {
    if (!audioUrl) return;

    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "malayalam-speech.mp3";
    link.click();
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          മലയാളം<span>AI</span>
        </a>
        <span className="top-pill">● SPEECH STUDIO</span>
      </header>

      <section className="hero">
        <p className="eyebrow">MALAYALAM TEXT TO SPEECH</p>

        <h1>
          Your words.
          <br />
          <span>A natural voice.</span>
        </h1>

        <p className="hero-copy">
          Turn your Malayalam text into natural AI speech.
          Choose a voice, adjust the delivery and download
          your audio.
        </p>
      </section>

      <section className="studio-card">
        <div className="card-heading">
          <div>
            <h2>Speech Studio</h2>
            <p>Configure your Malayalam voice</p>
          </div>

          <span className="model-pill">BULBUL V3</span>
        </div>

        <label htmlFor="script">Your Malayalam text</label>

        <textarea
          id="script"
          value={text}
          maxLength={2500}
          onChange={(event) => setText(event.target.value)}
          placeholder="ഇവിടെ മലയാളത്തിൽ എഴുതുക..."
        />

        <div className="count">
          {text.length} / 2,500 characters
        </div>

        <div className="settings-grid">
          <div className="field">
            <label htmlFor="voice">Voice</label>

            <select
              id="voice"
              value={speaker}
              onChange={(event) => setSpeaker(event.target.value)}
            >
              <option value="shubh">Shubh — Male voice</option>
              <option value="pooja">Pooja — Female voice</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="pace">
              Speaking speed <strong>{pace.toFixed(1)}×</strong>
            </label>

            <input
              id="pace"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pace}
              onChange={(event) =>
                setPace(Number(event.target.value))
              }
            />

            <div className="range-hints">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          <div className="field full-width">
            <label htmlFor="temperature">
              Voice expressiveness{" "}
              <strong>{temperature.toFixed(2)}</strong>
            </label>

            <input
              id="temperature"
              type="range"
              min="0.3"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(event) =>
                setTemperature(Number(event.target.value))
              }
            />

            <div className="range-hints">
              <span>Steady</span>
              <span>More expressive</span>
            </div>
          </div>
        </div>

        <button
          className="generate-button"
          onClick={generateSpeech}
          disabled={loading || !text.trim()}
        >
          {loading
            ? "Generating audio..."
            : "Generate Malayalam Speech →"}
        </button>

        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}

        {audioUrl && (
          <section className="result-panel">
            <div>
              <h3>Your audio is ready!</h3>
              <p>Listen to your generated Malayalam speech.</p>
            </div>

            <audio controls src={audioUrl}>
              Your browser does not support audio playback.
            </audio>

            <button
              className="download-button"
              onClick={downloadAudio}
            >
              Download MP3 ↓
            </button>
          </section>
        )}
      </section>

      <footer>
        Built for Malayalam creators · Powered by Sarvam AI
      </footer>
    </main>
  );
          }
