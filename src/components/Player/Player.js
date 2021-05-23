import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Grid, Progress, Icon, Input, Image } from "semantic-ui-react";

import "./Player.scss";

export default function Player(props) {
  const { songData } = props;
  const [playing, setPlaying] = useState(true);
  const [playedSeconds, setPlayerSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(120);
  const [volume, setVolume] = useState(0.3);
  const [muted, setMuted] = useState(false);
  const [repeatSong, setRepeatSong] = useState(false);

  useEffect(() => {
    if (songData?.url) {
      onPlay();
    }
  }, []);

  const onPlay = () => {
    setPlaying(true);
  };

  const onPause = () => {
    setPlaying(false);
  };

  const onProgress = (data) => {
    setPlayerSeconds(data.playedSeconds);
    setTotalSeconds(data.loadedSeconds);
  };

  const onMuted = () => {
    setMuted(!muted);
  };

  const repeat = () => {
    setRepeatSong(!repeatSong);
  };

  return (
    <div className="player">
      <Grid>
        <Grid.Column width={4} className="left">
          <Image src={songData?.image} />
          <p>{songData?.name}</p>
        </Grid.Column>
        <Grid.Column width={8} className="center">
          <div className="controls">
            <Icon name="random" />
            <Icon name="angle left" />
            {playing ? (
              <Icon name="pause circle" onClick={onPause} />
            ) : (
              <Icon name="play circle" onClick={onPlay} />
            )}
            <Icon name="angle right" />
            <Icon
              name="exchange"
              onClick={repeat}
              color={repeatSong ? "green" : "grey"}
            />
          </div>
          <Progress
            progress="value"
            value={playedSeconds}
            total={totalSeconds}
            size="tiny"
          />
        </Grid.Column>
        <Grid.Column width={4} className="right">
          <Input
            label={
              <Icon
                name={!muted ? "volume up" : "volume off"}
                onClick={onMuted}
              />
            }
            size="mini"
            type="range"
            min={0}
            max={1}
            step={0.01}
            name="volume"
            onChange={(e, data) => setVolume(Number(data.value))}
            value={volume}
          />
        </Grid.Column>
      </Grid>

      <ReactPlayer
        className="react-player"
        url={songData?.url}
        playing={playing}
        height="0"
        width="0"
        volume={volume}
        onProgress={(e) => onProgress(e)}
        muted={muted}
        loop={repeatSong}
      />
    </div>
  );
}
