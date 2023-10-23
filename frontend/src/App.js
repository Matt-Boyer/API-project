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
import AllEvents from "./components/AllEvents";
import EventDetails from "./components/EventDetails";
import EventForm from "./components/EventForm";
import GroupEditForm from "./components/GroupEditForm";
import EventDelete from "./components/EventDelete";
import GroupDelete from "./components/GroupDelete";
import EventEditForm from "./components/EventEditForm";

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
        <Route exact path='/delete/event/:eventId'>
          <EventDelete />
        </Route>
        <Route exact path='/delete/group/:groupId'>
          <GroupDelete />
        </Route>
        <Route exact path='/groups/:groupId/newevent'>
          <EventForm />
        </Route>
        <Route exact path='/groups/edit/:groupId'>
          <GroupEditForm />
        </Route>
        <Route exact path='/events/edit/:groupId/:eventId'>
          <EventEditForm />
        </Route>
        <Route exact path='/eventdetails/:eventId/:groupId'>
          <EventDetails />
        </Route>
        <Route exact path='/events'>
          <AllEvents />
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
