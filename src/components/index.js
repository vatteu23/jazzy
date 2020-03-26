import React, { Component } from "react";
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import ReactAudioPlayer from 'react-audio-player';
import Loading from '../loading.gif';


class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            isLoading: false,
            error: false,
            showResult: false,
            errorMesssage: '',
            hostAddress: 'http://127.0.0.1:5000'

        }
    }

    componentDidMount = () => {
        axios.get(this.state.hostAddress + '/Brav/getdirectories')
            .then(res => {
                this.setState({ turbinelist: res.data["directories"] });
            }).catch(err => {
                alert('unable to get turbine list please try again');
            })

    }
    updateState = (e) => {
        this.setState({ [e.target.id]: e.target.value })

    }
    updateStart = (val) => {
        this.setState({ start: val })
    }

    getData = (e) => {

        let turbinename = this.state.turbinename;
        let sd = new Date(this.state.start);
        let ed = new Date(this.state.end);
        let start = sd.toLocaleDateString('fr-CA').replace('-', '').replace('-', '').
            toString() + sd.toTimeString().split(' ')[0].replace(':', '').replace(':', '').toString();
        let end = ed.toLocaleDateString('fr-CA').replace('-', '').replace('-', '')
            .toString() + ed.toTimeString().split(' ')[0].replace(':', '').replace(':', '').toString();
        this.setState({ showResult: false, isLoading: true });
        if (start === "Invalid DateInvalid" || end === "Invalid DateInvalid") {
            this.setState({ showResult: false, isLoading: false, error: true, errorMesssage: 'Invalid Date' });
        }
        else if (sd >= ed) {
            this.setState({ showResult: false, isLoading: false, error: true, errorMesssage: 'Invalid time period.' });
        }
        else {
            if (turbinename !== "empty" && turbinename) {
                axios.get(this.state.hostAddress + '/Brav/getfiles/' + turbinename + '/' + start + '/' + end)
                    .then(res => {
                        if (res.data["Output"]) {
                            this.setState({ showResult: false, isLoading: false, error: true, errorMesssage: 'No files found in given time period and selected turbine.' })

                        } else {
                            this.setState({ showResult: true, isLoading: false, error: false, audiosrc: this.state.hostAddress + '/Brav/getfiles/' + turbinename + '/' + start + '/' + end })

                        }
                    }).catch(err=>{
                        console.log(err);
                        this.setState({showResult:false,isLoading:false,error:true,errorMesssage:"Unable to get data, Please try again"});
                    })
            }
            else {
                this.setState({ showResult: false, isLoading: false, error: true, errorMesssage: 'Please select a turbine from the dropdown.' })
            }
        }





    }

    updateEnd = (val) => {

        this.setState({ end: val })
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <h2>Data Filter</h2>

                    <div className="row">
                        <div className="col-12 mt-5 mb-3">
                            <select className="form-control" id="turbinename"
                                onChange={this.updateState} value={this.state.turbinename}>
                                <option value="empty">SELECT TURBINE</option>
                                {this.state.turbinelist ? this.state.turbinelist.map(val => {
                                    return (
                                        <option key={val} value={val}>{val}</option>
                                    )
                                }) : <option></option>}

                            </select>
                        </div>
                        <div className="col-6">
                            <h6 className="d-block mr-3">Start Time:</h6>
                            <DateTimePicker
                                id="start"
                                onChange={this.updateStart}
                                value={this.state.start}
                                className="d-block"
                                format="y-MM-dd HH:mm:ss"
                                hourAriaLabel="Hour"
                                disableClock="true"
                                hourPlaceHolder="hh"
                                amPmAriaLabel=""
                            />
                        </div>
                        <div className="col-6">
                            <h6 className="d-block mr-3">End Time:</h6>
                            <DateTimePicker
                                id="end"
                                onChange={this.updateEnd}
                                value={this.state.end}
                                className="d-block"
                                format="y-MM-dd HH:mm:ss"
                                hourAriaLabel="Hour"
                                disableClock="true"
                                hourPlaceHolder="hh"
                                amPmAriaLabel=""
                            />
                        </div>
                        <div className="col-12 my-4">
                            <div className="btn btn-primary" onClick={this.getData}>GET DATA</div>
                        </div>
                        <div className="col-12">
                            {
                                this.state.isLoading ?
                                    <img style={{ height: '50px' }} src={Loading}></img>
                                    : null
                            }
                            {

                                this.state.showResult ?
                                    <div>


                                        <ReactAudioPlayer
                                            src={this.state.audiosrc}
                                            autoPlay
                                            controls
                                        />
                                    </div> :
                                    <div></div>
                            }

                        </div>
                        <div className="col-12">
                            {
                                this.state.error ?
                                    <div className="mt-5">
                                        <h6 style={{ color: 'red' }}>{this.state.errorMesssage}</h6>
                                    </div> :
                                    <div>

                                    </div>

                            }

                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
};

export default Index;