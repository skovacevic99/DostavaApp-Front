import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import TestAxios from '../../apis/TestAxios';

class Racun extends Component {

    state = {
        datum: "",
        brojRacuna: "",
        ukupnaCena: ""
    }

    componentDidMount(){
        this.getRacun();
    }

    getRacun(){
        let id = this.props.match.params.id;

        TestAxios.get("/racuni/" + id)
            .then(res => {
                this.setState({
                    datum: res.data.datum.replace("T", " "),
                    ukupnaCena: res.data.ukupnaCena,
                    brojRacuna: res.data.brojRacuna
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <div>
                <Container>
                    <h3>Broj racuna: {this.state.brojRacuna}</h3>
                    <h3>Datum: {this.state.datum}</h3>
                    <h2>Ukupna cena: {this.state.ukupnaCena}</h2>
                </Container>
            </div>
        );
    }
}

export default Racun;