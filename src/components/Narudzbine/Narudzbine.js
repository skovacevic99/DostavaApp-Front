import React, { Component } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import TestAxios from '../../apis/TestAxios';

class Narudzbine extends Component {

    constructor(props){
        super(props)

        let search = {
            dostavljacId: -1,
            mestoIsporuke: ""
        }

        this.state = {
            narudzbine: [],
            pageNo: 0,
            totalPages: 1,
            dostavljaci: [],
            search: search
        }
    }

    componentDidMount(){
        this.getNarudzbine(0);
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

    getNarudzbine(newPageNo){

        let config = {
            params : {
                pageNo: newPageNo
            }
        }

        if(this.state.search.mestoIsporuke != ""){
            config.params['mestoIsporuke'] = this.state.search.mestoIsporuke
        }
        if(this.state.search.dostavljacId != -1){
            config.params['dostavljacId'] = this.state.search.dostavljacId
        }

        TestAxios.get("/narudzbine", config)
            .then(res => {
                console.log(res.data)
                this.setState({
                    narudzbine: res.data,
                    pageNo: newPageNo,
                    totalPages: res.headers['total-pages']
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    renderTable(){
        return this.state.narudzbine.map(nar => {
            return(
                <tr key={nar.id}>
                    <td>{nar.brNarudzbe}</td>
                    <td>{nar.datum.replace("T", " ")}</td>
                    <td>{nar.mestoIsporuke}</td>
                    <td>{nar.cena}</td>
                    <td>{nar.opis}</td>
                    <td>{nar.dostavljacIme}</td>
                    <td>{this.dugmeRacun(nar)}</td>
                    <td><Button variant="danger" onClick={() => this.obrisiNarudzbu(nar.id)}>Obrisi</Button></td>
                </tr>
            )
        })
    }

    dugmeRacun(nar){
        if(nar.racunId == null){
            return <Button variant="success" onClick={() => this.dodajRacun(nar)}>Dodaj racun</Button>
        } else {
            return <Button variant="primary" onClick={() => this.vidiRacun(nar.racunId)}>Vidi racun</Button>
        }
    }

    vidiRacun(id){
        this.props.history.push("/narudzbine/racun/" + id)
    }

    dodajRacun(nar){
        let date = new Date().toISOString();
        let formatDate = date.substring(0, 16);

        let params = {
            brojRacuna: nar.brNarudzbe,
            ukupnaCena: nar.cena,
            datum: formatDate,
            narudzbaId: nar.id
        }
        console.log(params)
        
        TestAxios.post("/racuni", params)
            .then(res => {
                window.location.reload()
            })
            .catch(error => {
                console.log(error)
            })
    }

    obrisiNarudzbu(id){
        TestAxios.delete("/narudzbine/" + id)
            .then(res => {
                this.brisanjeNarudzbineState(id);
            })
            .catch(error => {
                console.log(error)
            })
    }

    brisanjeNarudzbineState(id){
        let nar = this.state.narudzbine

        for(var i in nar){
            if(nar[i].id == id){
                nar.splice(i, 1)
            }
        }
        this.setState({narudzbine: nar})
    }

    idiNaDodavanje(){
        this.props.history.push("/narudzbine/dodaj")
    }

    dodajDugme(){
        // if(window.localStorage['role'] == "ROLE_KORISNIK"){
        //     return null
        // } else {
            return <Button variant="success" onClick={() => this.idiNaDodavanje()} >Kreiraj Narudzbinu</Button>
        // }
    }

    onSearchChange(e){
        let name = e.target.name;
        let value = e.target.value;

        let search = this.state.search
        search[name] = value
        this.setState(search)

        this.getNarudzbine(0)
    }

    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Narudzbine</h1>

                <Row>
                    <Col md={8}>
                        <Form>
                            <Form.Group>
                                <Form.Label>Dostavljac</Form.Label>
                                <Form.Control
                                    as="select"
                                    name = "dostavljacId"
                                    onChange={(e) => this.onSearchChange(e)}>
                                       <option value={-1}></option>
                                       {this.state.dostavljaci.map(dos => {
                                           return(
                                               <option key={dos.id} value={dos.id}>{dos.imeIPrezime}</option>
                                           )
                                       })}     
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Mesto isporuke</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="mestoIsporuke"
                                    onChange={(e) => this.onSearchChange(e)}>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>

                <div style={{marginTop: '10px'}}>
                    {this.dodajDugme()}
                    <Button style={{float: 'right'}} disabled={this.state.pageNo == this.state.totalPages - 1} onClick={() => this.getNarudzbine(this.state.pageNo + 1)} variant="info">Sledeca</Button>
                    <Button style={{float: 'right'}} disabled={this.state.pageNo == 0} onClick={() => this.getNarudzbine(this.state.pageNo - 1)} variant="info">Prethodna</Button>
                </div>
                <Table striped bordered hover style={{marginTop: '5px'}}>
                    <thead style={{backgroundColor: '#343a40', color: 'white'}}>
                        <tr>
                            <th>Broj narudzbine</th>
                            <th>Datum</th>
                            <th>Mesto isporuke</th>
                            <th>Cena</th>
                            <th>Opis</th>
                            <th>Dostavljac</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTable()}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Narudzbine;