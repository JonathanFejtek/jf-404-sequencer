import React from 'react';
import ReactDOM from 'react-dom';


export class LabelledTextInput extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
       return( <div className = "middle-info-area"> 
            <h6>{this.props.label}</h6>
            <input 
                value = {this.props.value} 
                id = {this.props.id} 
                onChange = {this.props.onChange} 
                className = {`middle-text-input ${this.props.className}`} 
                type="text"/>
        </div>);
    }

}


export class LabelledTextArea extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(                
        <div className = "middle-info-area"> 
            <h6>{this.props.label}</h6>
            <textarea 
                value = {this.props.value} 
                className = "middle-text-input description-input" 
                id={this.props.id} 
                onChange = {this.props.onChange}
                cols="30" 
                rows="4">
            </textarea>
        </div>
        );
    }
}