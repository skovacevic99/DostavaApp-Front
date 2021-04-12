import React, { Component } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import TestAxios from '../../apis/TestAxios';

class DodajNarudzbinu extends Component {

    state = {
        brojNarudzbe: "",
        datum: "",
        mestoIsporuke: "",
        cenaNarudzbe: "",
        Opis: "",
        dostavljacId: -1,
        dostavljaci: []
    }

    componentDidMount(){
        this.getDostavljaci();
    }

    getDostavljaci(){
        TestAxios.get("/dostavljaci")
            .then(res => {
                this.setState({dostavljaci: res.data})
            })
            .catch(error => {
                console.log(error)
            })
    }

    onInputChange(e){
        let name = e.target.name
        let value = e.target.value

        let change = {}
        change[name] = value
        this.setState(change)
    }

    kreiraj(){
        var params = {
            brNarudzbe: this.state.brojNarudzbe,
            datum: this.state.datum,
            mestoIsporuke: this.state.mestoIsporuke,
            cena: this.state.cenaNarudzbe,
            opis: this.state.opis,
            dostavljacId: this.state.dostavljacId,
        }
        console.log(params)

        TestAxios.post("/narudzbine", params)
            .then(res => {
                this.props.history.push("/narudzbine")
            })
            .catch(error => [
                console.log(error)
            ])
    }

    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Kreiraj Narudzbinu</h1>

                <Row>
                    <Col md={8}>
                        <Form>
                            <Form.Group>
                                <Form.Label>Broj narudzbe</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    placeholder="Broj narudzbe"
                                    name="brojNarudzbe"
                                    onChange={(e) => this.onInputChange(e)}>
                                </Form.Control>
                                <Form.Group>
                                <Form.Label>Datum</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="datetime-local"
                                    placeholder="Datum"
                                    name="datum"
                                    onChange={(e) => this.onInputChange(e)}>
                                </Form.Control>
                                <Form.Group>
                                <Form.Label>Mesto isporuke</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    placeholder="Mesto isporuke"
                                    name="mestoIsporuke"
                                    onChange={(e) => this.onInputChange(e)}>
                                </Form.Control>
                                </Form.Group>
                                <Form.Label>Cena narudzbe</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    placeholder="Cena narudzbe"
                                    name="cenaNarudzbe"
                                    onChange={(e) => this.onInputChange(e)}>
                                </Form.Control>
                                </Form.Group>
                                <Form.Label>Opis</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    placeholder="Opis"
                                    name="opis"
                                    onChange={(e) => this.onInputChange(e)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Dostavljac</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="dostavljacId"
                                    onChange={(e) => this.onInputChange(e)}>
                                        <option value={-1}></option>
                                        {this.state.dostavljaci.map(dos => {
                                            return(
                                                <option key={dos.id} value={dos.id}>{dos.imeIPrezime}</option>
                                            )
                                        })}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                        <Button variant="primary" onClick={() => this.kreiraj()}>Kreirak</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default DodajNarudzbinu;