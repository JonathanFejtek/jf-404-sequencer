import React from 'react';
import ReactDOM from 'react-dom';

document.mousedown = false;

document.addEventListener("mousedown",function(){
    document.mousedown = true;
})

document.addEventListener("mouseup",function(){
    document.mousedown = false;
})


export default class SequenceCell extends React.Component{
    constructor(props){
        super(props)
        
        this.state = {
            mousedOver : false
        };

        this.setState = this.setState.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handlePitchChange = this.handlePitchChange.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.renderCellToggle = this.renderCellToggle.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let toggledEquals = !(this.props.toggled === nextProps.toggled);
        let volumeEquals = !(this.props.volume === nextProps.volume);
        let pitchEquals = !(this.props.pitch === nextProps.pitch);
        let showEqualsPitch = !(this.props.showPitchSliders === nextProps.showPitchSliders);
        let showEqualsVolume = !(this.props.showVolumeSliders === nextProps.showVolumeSliders);
        let triggeredEquals = !(this.props.triggered === nextProps.triggered);

        return toggledEquals || volumeEquals || pitchEquals || showEqualsPitch || showEqualsVolume || triggeredEquals;
    }

    render(){
        return(        
        <div className = {`sequence-cell-container ${this.props.ind%4 == 0 ? "fourthCell" : ''}`}>
            <h2 className = {`cell-header`}>{this.props.ind+1}</h2>
            {this.renderCellToggle()}
            <div className = {`pslider-container ${!this.props.showPitchSliders ? "slider-hidden" : ""}`}>
                <input onChange = {this.handlePitchChange} type = "range" className = "pslider" 
                value = {this.props.pitch} min = "0.5" max = "8" step = "0.5"></input>
            </div>
            <div className = {`pslider-container ${!this.props.showVolumeSliders ? "slider-hidden" : ""}`}>
                <input onChange = {this.handleVolumeChange} type = "range" className = "vslider" 
                value = {this.props.volume} min = "0" max = "1" step = "0.1"></input>
            </div>
        </div>
        );

    }

    renderCellToggle(){
        let toggleClass = '';
        let lightClass = '';

        if(this.props.toggled && this.props.triggered){
            toggleClass = "testCtt";
            lightClass = "sequence-button-light-toggled-triggered";
        }

        else if(this.props.toggled){
            toggleClass = "testCto";
            lightClass = "sequence-button-light-toggled";
        }

        else if(this.props.triggered){
            toggleClass = "testCt";
            lightClass = "sequence-button-light-triggered";
        }

        return(
            <div className = {`testC ${toggleClass}`}
                onMouseDown = {this.handleClick}
                onMouseEnter = {this.handleMouseEnter}
                onMouseLeave = {this.handleMouseLeave}
            >
                <div className={`sequence-button-light ${lightClass}`}></div>
            </div>
        )
    }

    handleClick(){
        this.toggle();
    }

    handlePitchChange(e){
        this.props.onPitchChange(this.props.ind,e.target.value);
    }

    handleVolumeChange(e){
        this.props.onVolumeChange(this.props.ind,e.target.value);
    }

    toggle(){
        this.props.onToggle(this.props.ind,!this.props.toggled);        
    }

    handleMouseEnter(){
        this.setState(function(){
            return {mousedOver : true};
        })

        if(document.mousedown){
            this.toggle();
        }
    }

    handleMouseLeave(){
        this.setState(function(){
            return {mousedOver : false};
        });
    }
}