import React from 'react';
import ReactDOM from 'react-dom';
import SequenceCell from './sequence-cell';

/**
 * A SequenceTrack Component. Comprises an array of SequenceCells.
 */
export default class SequenceTrack extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            showVolumeSliders : false,
            showPitchSliders : false,
        }

        this.handleToggleView = this.handleToggleView.bind(this);
        this.handleChildToggle = this.handleChildToggle.bind(this);
        this.handleChildPitchChange = this.handleChildPitchChange.bind(this);
        this.handleChildVolumeChange = this.handleChildVolumeChange.bind(this);
        this.renderCells = this.renderCells.bind(this);
    }

    /**
     * Renders this SequenceTrack.
     */
    render(){
        return (
            <div className = "sequence-track-container">
                <div className = "sequence-track-label">
                    <div className="sequence-track-label-header">
                        {this.props.trackName}
                    </div>  
                    <div className = "sequence-track-controls">
                        <ToggleButton 
                            toggled = {this.state.showVolumeSliders} 
                            onToggle = {this.handleToggleView} 
                            id = "volume-toggle" 
                            label = "Volume"
                            toggleClass = "show-volume-toggled"
                        />
                        <ToggleButton 
                            toggled = {this.state.showPitchSliders} 
                            onToggle = {this.handleToggleView} 
                            id = "pitch-toggle" 
                            label = "Pitch"
                            toggleClass = "show-pitch-toggled"
                        />
                    </div>
                </div>
                {this.renderCells()}
            </div>
            
        )
    }

    renderCells(){
        let cells = [];
        for(let i = 0; i < this.props.cellCount; i++){
            cells.push(
            <SequenceCell 
                triggered = {this.props.iterator == i} 
                ind = {i}
                key = {`seqC${i}`}
                onToggle = {this.handleChildToggle} 
                onPitchChange = {this.handleChildPitchChange}
                onVolumeChange = {this.handleChildVolumeChange}
                showPitchSliders = {this.state.showPitchSliders}
                showVolumeSliders = {this.state.showVolumeSliders}
                toggled = {this.props.gates[i]}
                pitch = {this.props.pitches[i]}
                volume = {this.props.volumes[i]}
            />
            );
        }
        return cells;
    }

    /**
     * 'Sets' the gate value for a given key and boolean value in this SequenceTrack.
     * @param {int} key 
     * @param {bool} b 
     */
    handleChildToggle(key,b){
       this.props.notifyGateChange(this.props.trackName,key,b);
    }

    /**
     * 'Sets' the pitch value for a given index and value in this SequenceTrack.
     * @param {*} ind 
     * @param {*} val 
     */
    handleChildPitchChange(ind,val){
        this.props.notifyPitchChange(this.props.trackName,ind,val);
    }

    /**
     * 
     * @param {*} ind 
     * @param {*} val 
     */
    handleChildVolumeChange(ind,val){
        this.props.notifyVolumeChange(this.props.trackName,ind,val);
    }

    /**
     * 
     * @param {*} toggleId 
     * @param {*} state 
     */
    handleToggleView(toggleId,state){
        switch(toggleId){
            case "pitch-toggle":
                this.setState({showPitchSliders : state});
            break;

            case "volume-toggle":
                this.setState({showVolumeSliders : state});
            break;
        }
    }
}

class ToggleButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            toggled : false,
        };
        this.setState = this.setState.bind(this);
        this.handleClick = this.handleClick.bind(this);       
    }

    render(){
        return (<button className = {`toggle-button ${this.props.toggled ? this.props.toggleClass : null}`} 
        onClick = {this.handleClick}>{this.props.label}</button>)
    }

    handleClick(){
        this.toggle();
    }

    componentDidMount(){
       // this.toggle();
    }

    toggle(){
        this.props.onToggle(this.props.id,!this.props.toggled);        
    }
}