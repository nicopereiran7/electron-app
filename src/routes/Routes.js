import React from "react";
import { Switch, Route } from "react-router-dom";

//pages
import Home from "../pages/Home";
import Search from "../pages/Search";
import Settings from "../pages/Settings";
import Artist from "../pages/Artist";
import Artists from "../pages/Artists";
import Albums from "../pages/Albums";
import Album from "../pages/Album";
import Library from "../pages/Library";

export default function Routes(props) {
  const { user, setReloadApp, result, input, playedSong } = props;
  //rutas de la app
  return (
    <Switch>
      <Route path="/" exact>
        <Home playedSong={playedSong} />
      </Route>
      <Route path="/search" exact>
        <Search result={result} setReloadApp={setReloadApp} input={input} />
      </Route>
      <Route path="/artists" exact>
        <Artists />
      </Route>
      <Route path="/albums" exact>
        <Albums />
      </Route>
      <Route path="/album/:id" exact>
        <Album playedSong={playedSong} />
      </Route>
      <Route path="/mymusic" exact>
        <Library />
      </Route>
      <Route path="/artist/:id" exact>
        <Artist />
      </Route>
      <Route path="/settings" exact>
        <Settings user={user} setReloadApp={setReloadApp} />
      </Route>
    </Switch>
  );
}
