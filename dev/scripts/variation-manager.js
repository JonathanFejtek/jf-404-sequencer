import React from 'react';
import ReactDOM from 'react-dom';


export default class VariationManager extends React.Component{
    constructor(props){
        super(props);

        this.renderVariations.bind(this);
        this.state = {
            selectedVariationIndex : 0
        }

        this.handleChild = this.handleChild.bind(this);
    }

    render(){
        return(
            <div className="variation-manager-container">
                {this.renderVariations()}
            </div>
        )
    }

    renderVariations(){
        let items = [];
        for(let i = 0; i < this.props.numVariations; i++){
            items.push(<VariationView selected = {this.state.selectedVariationIndex == i} onClick = {this.handleChild} key = {i} id = {i} label = {String.fromCharCode(97+i)} />)
        }
        return items;
    }

    handleChild(e){
        this.setState({selectedVariationIndex : e.target.id});
        this.props.onChange(e.target.id);
    }


}

export class VariationView extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
       return (<button onClick = {this.props.onClick} id = {this.props.id} className = {`variation-view ${this.props.selected ? "variation-view-toggled" : null}`}>{this.props.label}</button>);
    }
}