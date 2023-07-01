import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Groups from "./components/Groups";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import GroupForm from "./components/GroupForm";
import GroupDetails from "./components/GroupDetails";
import LandingPage from "./components/LandingPage";
import EventsOfGroup from "./components/EventsOfGroup";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path='/creategroup'>
          <GroupForm />
        </Route>
        <Route exact path='/groupdetails/:groupId'>
          <GroupDetails />
        </Route>
        <Route exact path='/events/:groupId'>
          <EventsOfGroup />
        </Route>
        <Route exact path='/groups'>
          <Groups />
        </Route>
        <Route exact path='/'>
          <LandingPage />
        </Route>
      </Switch>}
    </>
  );
}

export default App;
