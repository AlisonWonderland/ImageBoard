import Navbar from './components/Navbar'
import ThreadsCatalog from './components/ThreadsCatalog'
import Home from './components/Home'
import FullThread from './components/FullThread'
import NotFound from './components/NotFound'

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import './App.css';

function App() {
    return (
        <>
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path="/Catalog">
                        <ThreadsCatalog />
                    </Route>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/thread/:threadID">
                        <FullThread />
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

export default App;