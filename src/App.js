import polyfill from 'babel-polyfill';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
    render() {
        return (
            <p>"Hello world"</p>
        )
    }
}


const entry = document.getElementById('app');

if(entry !== undefined && entry !== null) {
    ReactDOM.render(
        <App/>, entry);
}
