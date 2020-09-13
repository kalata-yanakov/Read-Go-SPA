import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SignUp from './components/SignUp/SignUp';
import Register from './components/Register/Register';
import UserContext, { getLoggedUser } from './components/Providers/UserContext';
import SidebarContext from './components/Providers/SidebarContext';
import AllBooks from './components/AllBooks/AllBooks';
import Home from './components/Home/Home';
import MenuAppBar from './components/MenuBar/MenuBar';
import Profile from './components/Profile/Profile';
import SingleBook from './components/SingleBook/SingleBook';

function App() {
  const [user, setUser] = useState(getLoggedUser());
  const [showSidebar, toggleSidebar] = useState(false);

  return (
    <BrowserRouter>
      <SidebarContext.Provider value={{ showSidebar, toggleSidebar }}>
        <UserContext.Provider value={{ user, setUser }}>
          {user ? <MenuAppBar /> : null}
          <Switch>
            <Route path='/' exact component={SignUp} />
            <Route path='/home' component={Home} />
            <Route path='/register' component={Register} />
            <Route path='/books' exact component={AllBooks} />
            <Route path='/book' exact component={SingleBook} />
            <Route path='/profile' exact component={Profile} />
          </Switch>
        </UserContext.Provider>
      </SidebarContext.Provider>
    </BrowserRouter>
  );
}

export default App;
