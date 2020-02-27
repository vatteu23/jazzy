import React, { Component } from "react";
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import ReactAudioPlayer from 'react-audio-player';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            isLoading: true,
            error: false,
            errorMesssage: ''
        }
    }

    componentDidMount = () => {
       

    }  
    updateState = (e) => {
        this.setState({ [e.target.id] : e.target.value  })
        
    }
    updateStart = (val) =>{
        this.setState({start: val})
    }

    getData = (e) =>{

        let turbinename = this.state.turbinename;
        let sd = new Date(this.state.start)
        let ed = new Date(this.state.end)
        
        
        let start = sd.toLocaleDateString('fr-CA').replace('-','').replace('-','').toString() + sd.toTimeString().split(' ')[0].replace(':','').replace(':','').toString();
        let end = ed.toLocaleDateString('fr-CA').replace('-','').replace('-','').toString() + ed.toTimeString().split(' ')[0].replace(':','').replace(':','').toString();
        this.setState({isLoading: true})
        // console.log(turbinename)
        if(sd >= ed)
        {
            this.setState({isLoading: true, error:true, errorMesssage:'Invalid time period.'})
        }
        else{
            if(turbinename !== "empty" && turbinename)
            {
                axios.get('http://127.0.0.1:5000/Brav/getfiles/'+turbinename+'/'+start+'/'+end)
                .then(res=>{
                    if(res.data["Output"])
                    {
                        this.setState({isLoading: true, error:true, errorMesssage:'No files found in given time period and selected turbine.'})
                        
                    }else{
                        this.setState({isLoading: false, error:false, audiosrc:'http://127.0.0.1:5000/Brav/getfiles/'+turbinename+'/'+start+'/'+end})
                       
                    }
                })
            }
            else{
                this.setState({isLoading: true, error:true, errorMesssage:'Please select a turbine from the dropdown.'})
            }
        }

        
        
       
       
    }

    updateEnd = (val) =>{
        
        this.setState({end: val})
    }
    render() {
        console.log(this.state)
        console.log(this.state.date)
        return (
            <React.Fragment>
                <div className="container">
                    <h2>Data Filter</h2>

                    <div className="row">
                        <div className="col-12 mt-5 mb-3">
                            <select className="form-control" id="turbinename" 
                                onChange={this.updateState} value={this.state.turbinename}>
                                  <option value="empty">SELECT TURBINE</option>
                                  <option value="Turbine 50 Gearbox">Turbine 50 Gearbox</option>
                                {/* {this.state.tglist &&
                                    Object.keys(this.state.tglist.val()).map(id => {
                                        let tg = this.state.tglist.val();
                                        return (
                                            <option key={id} value={id}>{tg[id]["tripgroup_name"]}</option>
                                        )
                                    })
                                } */}
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
                             
                                !this.state.isLoading ? 
                                <div>
                                        <ReactAudioPlayer
                                            src={this.state.audiosrc}
                                            autoPlay
                                            controls
                                        />
                                </div>:
                                <div></div>
                            }
                       
                        </div>
                        <div className="col-12">
                            {
                                this.state.error ? 
                                <div className="mt-5">
                                    <h6>{this.state.errorMesssage}</h6>
                                </div>:
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