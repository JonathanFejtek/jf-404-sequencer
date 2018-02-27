import React from 'react';
import ReactDOM from 'react-dom';

export class OrderManager extends React.Component{
    constructor(props){
        super(props);
        this.renderOrderSliders = this.renderOrderSliders.bind(this);
        
        this.updateOrder = this.updateOrder.bind(this);
        this.changeVals = this.changeVals.bind(this);
        this.orderForward = this.orderForward.bind(this);
        this.orderBackward = this.orderBackward.bind(this);
        this.orderRandom = this.orderRandom.bind(this);
    }

    render(){
        return (
            <div className="order-manager-container">
                <div className="order-manager-controls-container">
                    <button onClick = {() => this.changeVals("forward-order")} className = "order-control">
                        <i className="fas fa-angle-double-right"></i>
                    </button>
                    <button onClick = {() => this.changeVals("random-order")} className = "order-control">
                        <i className="fas fa-random"></i>
                    </button>
                    <button onClick = {() => this.changeVals("reverse-order")} className = "order-control">
                        <i className="fas fa-angle-double-left"></i>
                    </button>
                    <button 
                        onClick = {() => this.changeVals(0)} 
                        className = {`order-control ${this.props.currentOrdering == 0 ? 'order-control-toggled':null}`}>A
                    </button>
                    <button 
                        onClick = {() => this.changeVals(1)} 
                        className = {`order-control ${this.props.currentOrdering == 1 ? 'order-control-toggled':null}`}>B
                    </button>                
                </div>
                <div>
                    <div className="order-manager-slider-container">
                        {this.renderOrderSliders()}
                    </div>                
                </div>
            </div>
        );
    }

    changeVals(id){
        switch(id){
            case "forward-order":
                this.props.onChangeInOrdering(null);
                this.orderForward();   
            break;

            case "random-order":
                this.props.onChangeInOrdering(null);
                this.orderRandom();            
            break;

            case "reverse-order":
                this.props.onChangeInOrdering(null);
                this.orderBackward();            
            break;

            case 0:
                this.props.onChangeInOrdering(parseInt(id));
            break;

            case 1:
                this.props.onChangeInOrdering(parseInt(id));
            break;
        }
    }

    orderForward(){
        let newOrder = [];
        for(let i = 0; i < this.props.numCells; i++){
            newOrder.push(i);
        }
        this.props.onOrderChange(newOrder,null);
    }

    orderBackward(){
        let newOrder = [];
        for(let i = this.props.numCells-1; i >= 0; i--){
            newOrder.push(i);
        }
        this.props.onOrderChange(newOrder,null);
    }

    orderRandom(){
        let newOrder = [];
        for(let i = 0; i < this.props.numCells; i++){
            newOrder.push(Math.floor(Math.random()*32));
        }
        this.props.onOrderChange(newOrder,null);
    }

    renderOrderSliders(){
        let items = [];
        for(let i = 0; i < this.props.numCells; i++){
            items.push(<OrderSlider triggered = {i == this.props.iterator} value = {this.props.order[i]} onChange = {this.updateOrder} key = {`os${i}`} id = {i}/>);
        }
        return items;
    }

    updateOrder(e){
        let _order = this.props.order.slice();
        _order[e.target.id] = parseInt(e.target.value);      
        this.props.onOrderChange(_order,this.props.currentOrdering);
    }
}

export class OrderSlider extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className = {`oslider-container`}>
                <input
                    value = {this.props.value}
                    id = {this.props.id}  
                    type = "range" 
                    className = {`oslider ${this.props.triggered ? "oslider-triggered":null}`} 
                    min = "0" 
                    max = "31" 
                    step = "1"
                    onChange = {this.props.onChange}
                ></input>
            </div>
        )      
    }


}