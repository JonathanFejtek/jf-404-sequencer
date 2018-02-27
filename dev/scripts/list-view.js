import React from 'react';
import ReactDOM from 'react-dom';

export class ListView extends React.Component{
    constructor(props){
        super(props);
        this.updateFromChild = this.updateFromChild.bind(this);
    }

    render(){
        return (

        <div>
            <h2 className = "list-view-title">{this.props.title}</h2>
            <div className="list-view-container">          
            {this.props.items.map((item, i) => {
                return <ListViewItem key = {item} label = {item} notify = {this.updateFromChild}/>
            })} 
            </div>
        </div>
        )
    }

    updateFromChild(label){
        this.props.notify(label);
    }
}
  
export class ListViewItem extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render(){
        return (<div onClick = {this.handleClick} className="list-view-item">{this.props.label}</div>);
    }

    handleClick(){
        this.props.notify(this.props.label);
    }
}