import React from 'react';
import ReactDOM from 'react-dom';
import SequenceCell from './sequence-cell';
import SequenceTrack from './sequence-track';
import {BufferLoaderB,playSoundFromSource} from './sound-utils';
import {LabelledTextInput, LabelledTextArea} from './text-inputs';
import VariationManager from './variation-manager';
import {SequencePreset, TrackCollection, DrumTrack} from './model';
import {ListView, ListViewItem} from './list-view';
import {OrderManager, OrderSlider} from './order-manager';

let audioContext = new (window.AudioContext || window.webkitAudioContext)();

window.bl2 = new BufferLoaderB(audioContext,{
    "Kick" : "kick.wav",
    "Snare" : "snare.wav",
    "Clap" : "clap.wav",
    "Hat-closed" : "hat_closed.wav",
    "Hat-open" : "open_hat.wav"
});
  
window.bl2.load();

var config = {
    apiKey: "AIzaSyAhvYgzciQPPtAZgZX-70XqoRTprqDkjAs",
    authDomain: "allia-1.firebaseapp.com",
    databaseURL: "https://allia-1.firebaseio.com",
    projectId: "allia-1",
    storageBucket: "",
    messagingSenderId: "481370488135"
};
  
firebase.initializeApp(config);

/**
 * The main App Component.
 */
class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            // the counter for the sequencer
            iterator : 0,
            // the current cell index in playback
            index : 0,
            // the order of cell playback
            order : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            // the tempo/playback rate
            tempo : 120,
            // whether the sequencer is playing
            play : false,
            // whether the sequencer is paused (nb!! : this is not equivalent to play : false)
            paused : false,
            // the public presets loaded into the sequencer
            publicPresets : {},
            // the private presets loaded into the sequencer
            privatePresets : {},
            // the title of the current pattern
            title : '',
            // the genre of the current pattern
            genre : '',
            // the author of the current pattern
            author : '',
            // the description of the current pattern
            description : '',
            // the tracks in the sequencer
            tracks : {},
            // the current variation for the current pattern
            currentVariation : 0,
            // the current ordering (preset) for the current pattern
            currentOrdering : null,
            // id of signed in user
            currentUserId : null,
            // user name of signed in user
            currentUserName : null,
            // whether or not to save to a private bank or the public bank
            saveToPrivate : false
        }
        //initial orderings presets are set to initial order (forward ordering)
        this.state["orderings"] = [this.state.order.slice(),this.state.order.slice()];

        //initialize tracks
        this.state["tracks"]["Kick"] = new TrackCollection(32,4);
        this.state["tracks"]["Snare"] = new TrackCollection(32,4);
        this.state["tracks"]["Clap"] = new TrackCollection(32,4);
        this.state["tracks"]["Hat-closed"] = new TrackCollection(32,4);
        this.state["tracks"]["Hat-open"] = new TrackCollection(32,4);


        this.setState = this.setState.bind(this);
        this.tick = this.tick.bind(this);

        this.setGate = this.setGate.bind(this);
        this.setPitch = this.setPitch.bind(this);
        this.setVolume = this.setVolume.bind(this);

        this.changeTempo = this.changeTempo.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.stop = this.stop.bind(this);

        this.savePattern = this.savePattern.bind(this);
        this.newPattern = this.newPattern.bind(this);
        this.loadPattern = this.loadPattern.bind(this);

        this.setPatternInfo = this.setPatternInfo.bind(this);
        this.changeVariation = this.changeVariation.bind(this);
        this.setOrder = this.setOrder.bind(this);
        this.createSequenceIterator = this.createSequenceIterator.bind(this);
        this.setCurrentOrdering = this.setCurrentOrdering.bind(this);
        this.renderTracks = this.renderTracks.bind(this);

        this.signInUser = this.signInUser.bind(this);
        this.signOutUser = this.signOutUser.bind(this);
        this.setBankMode = this.setBankMode.bind(this);
    }

    /**
     * Clears current pattern (without saving) and creates a new pattern.
     */
    newPattern(){
        // initialize empty track states
        for(let key in this.state.tracks){
            let newTracks = this.state["tracks"];
            let newTrack = newTracks[key];
            newTrack.clearAll();
            this.setState({tracks:newTracks});
        }

        // create forward ordering
        let newOrders = [];
        for(let i = 0; i < 32; i++){
            newOrders.push(i);
        }
        // the new orderings preset state
        let newOrderings = [newOrders.slice(),newOrders.slice()];
        
        // initialize default empty states
        this.setState(
            {title : '',
            author : '',
            genre : '', 
            description : '',
            orderings : newOrderings, 
            order : newOrders.slice(),
            currentOrdering : null}
        );
    }

    /**
     * Sets the current ordering to use as the sequencer playback order.
     * @param {number} i - (0,1) The index of the ordering to use for playback order.
     */
    setCurrentOrdering(i){
        // set current ordering
        this.setState({currentOrdering : i});
        // if i is a preset number (not null), set the current order to the specified orderings preset
        if(i !== null){
            this.setState({order : this.state.orderings[i].slice()});
        }
    }

    /**
     * Loads a pattern given a specified pattern name.
     * @param {string} patternName - Name of pattern to load into sequencer.
     */
    loadPattern(patternName){     
        let presetToLoad;
        // if we are in 'private mode', load pattern from private presets
        if(this.state.saveToPrivate){
            presetToLoad = this.state.privatePresets[patternName];
        }
        // else load pattern from public presets
        else{
            presetToLoad = this.state.publicPresets[patternName];
        }

        // initialize various pattern info from preset
        this.setState({
            title : presetToLoad["title"],
            author : presetToLoad["author"],
            genre : presetToLoad["genre"],
            description : presetToLoad["description"],
            orderings : presetToLoad["orderings"].slice(),
            currentOrdering : null,
            order : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
        });

        // setup new iterator with preset tempo information
        this.createSequenceIterator(presetToLoad["tempo"]);

        // initialize tracks according to preset
        for(let key in presetToLoad["drumTracks"]){
            let newTracks = this.state["tracks"];
            let trackCollection = newTracks[key];
            let presetCollection = presetToLoad["drumTracks"][key];

            for(let i = 0; i < 4; i++){
                trackCollection.getVariation(i).setGates(presetCollection["variations"][i].gates.slice());
                trackCollection.getVariation(i).setVolumes(presetCollection["variations"][i].volumes.slice());
                trackCollection.getVariation(i).setPitches(presetCollection["variations"][i].pitches.slice());
            }
            this.setState({tracks: newTracks});
        }
    }

    /**
     * Sets the playback order for the sequencer.
     * @param {*} newOrder - The new playback order.
     * @param {*} ordering - The ordering preset to set. // todo : deprecate, use setState callback
     */
    setOrder(newOrder,ordering){
        this.setState({order : newOrder});
        if(ordering !== null){
            let _orderings = this.state.orderings.slice();
            _orderings[ordering] = newOrder;
            this.setState({orderings : _orderings});
        }
    }

    /**
     * Sets some info about the current pattern
     * @param {Event} e - Event from which to derive pattern info change.
     */
    setPatternInfo(e){
        this.setState({[e.target.id] : e.target.value});
    }

    /**
     * Sets the current variation for the currently selected pattern.
     * @param {number} v - Variation index to set.
     */
    changeVariation(v){
        this.setState({currentVariation : v});
    }

    /**
     * Sets the bank mode for this App. 
     * @param {Event} e - Event from which to derive bank mode change.
     */
    setBankMode(e){
        switch(e.target.id){
            case "public-bank" : 
                this.setState({
                    saveToPrivate : false
                })
            break;

            case "private-bank" :
                if(this.state.currentUserId !== null){
                    this.setState({
                        saveToPrivate : true
                    })
                }
                else{
                    alert("You must sign in to use a private bank!");
                }

            break;
        }
    }

    /**
     * Renders this component to the screen.
     */
    render() {
        return (
            // enclosing div start
            <div>

                {/* user controls start */}
                <div className = "user-controls">
                    <div className="sign-in-state">
                        {this.state.currentUserName !== null ? this.state.currentUserName : "Guest User"}  
                    </div>
                    <h1 className = "title-header"> JF-404</h1>   
                    <div className="sign-in-controls">
                        <button 
                            className = "sign-in-button" 
                            onClick = {this.state.currentUserId === null ? this.signInUser : this.signOutUser}
                        >
                            {this.state.currentUserId !== null ? "Log out" : "Sign in"}
                        </button>
                    </div>
                </div>
                {/* user controls end */}

                {/* app controls top start */}
                <div className = "controls-top">   

                    {/* controls top left start  */}
                    <div className = "controls-top-left">
                        <div className="bank-mode-controls">
                            <div className="bank-mode-radio">
                                <input 
                                    checked = {!this.state.saveToPrivate} 
                                    onChange = {this.setBankMode} 
                                    name = "bank-radio" 
                                    id = "public-bank" 
                                    type="radio"
                                />
                                <label htmlFor="public-bank">Public</label>                
                            </div>
                            <div className="bank-mode-radio">
                                <input 
                                    checked = {this.state.saveToPrivate} 
                                    onChange = {this.setBankMode} 
                                    name = "bank-radio" 
                                    id = "private-bank" 
                                    type="radio"
                                />
                                <label htmlFor="private-bank">Private</label>                
                            </div>
                        </div>
                        <ListView 
                            notify = {this.loadPattern} 
                            title = {"Bank"} 
                            items = {this.state.saveToPrivate ? Object.keys(this.state.privatePresets) : Object.keys(this.state.publicPresets)}
                        />
                        <VariationManager onChange = {this.changeVariation} numVariations = {4} />
                    </div>
                    {/* controls top left end */}

                    {/* controls top middle start */}
                    <div className = "controls-top-middle">
                        <LabelledTextInput 
                            value = {this.state.title} 
                            id = "title" 
                            onChange = {this.setPatternInfo} 
                            label = "Title" 
                            className = {"title-input"}
                        />
                        <LabelledTextInput 
                            value = {this.state.author} 
                            id = "author" 
                            onChange = {this.setPatternInfo} 
                            label = "Author" 
                        />
                        <LabelledTextInput 
                            value = {this.state.genre} 
                            id = "genre" 
                            onChange = {this.setPatternInfo} 
                            label = "Style/Genre" 
                        />
                        <LabelledTextArea 
                            value = {this.state.description}
                            id = "description"
                            onChange = {this.setPatternInfo}
                            label = "Notes"
                        />

                        <div className="middle-button-controls">
                            <button className = "edit-button" onClick = {this.newPattern}>Create New</button>
                            <button className = "edit-button" onClick = {this.savePattern}>Store/Save</button>
                        </div>
                    </div>
                    {/* controls top middle end */}
                    
                    {/* controls top right start */}
                    <div className = "controls-top-right">
                        <div className="play-controls">
                            <div>
                                <button 
                                    className = {`playback-button ${this.state.play ? "playback-button-toggled":null}`} 
                                    onClick = {this.play}
                                >
                                    <i className ="fas fa-play"></i>
                                </button>
                                <button 
                                    className = {`playback-button ${this.state.paused ? "playback-button-toggled":null}`} 
                                    onClick = {this.pause}
                                >
                                    <i className="fas fa-pause"></i>
                                </button>
                                <button 
                                    className = "playback-button" 
                                    onClick = {this.stop}
                                >
                                    <i className="fas fa-stop"></i>
                                </button>  
                            </div>
                            <div>
                                <input 
                                    className = "bpm-input" 
                                    value = {this.state.tempo} 
                                    onChange = {this.changeTempo} 
                                    size= "3" 
                                    type="text"
                                />
                                <span className = "bpm-label">BPM</span>                  
                            </div>
                        </div>
                        <OrderManager 
                            iterator = {this.state.iterator} 
                            order = {this.state.order} 
                            onOrderChange = {this.setOrder} 
                            onChangeInOrdering = {this.setCurrentOrdering}
                            currentOrdering = {this.state.currentOrdering}
                            numCells = "32"
                        />
                    </div> 
                    {/* controls top right end */}       

                </div>
                {/* app controls top end */}

                {/* sequence container start */}
                <div className = "sequencer-container">
                    {this.renderTracks()}
                </div>
                {/* sequence container end */}

            </div>
            // enclosing div end       
        );
    }

    /**
     * {--Render helper--}
     * Renders the sequencer tracks to the screen.
     */
    renderTracks(){
        let tracks = [];
        for(let key in this.state["tracks"]){
            tracks.push(
                <SequenceTrack 
                    key = {key}
                    notifyGateChange = {this.setGate} 
                    notifyVolumeChange = {this.setVolume}
                    notifyPitchChange = {this.setPitch}
                    iterator = {this.state.index} 
                    trackName = {key} 
                    cellCount = {32}
                    pitches = {this.state["tracks"][key].getVariation(this.state.currentVariation).pitches}
                    volumes = {this.state["tracks"][key].getVariation(this.state.currentVariation).volumes}
                    gates = {this.state["tracks"][key].getVariation(this.state.currentVariation).gates}
                />
            );
        }

        return tracks;
    }

    /**
     * Signs in a user.
     */
    signInUser(){
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        let self = this;
        firebase.auth().signInWithPopup(provider).then(function(result) {
            const token = result.credential.accessToken;

            // Get the signed-in user info.
            const user = result.user;
            self.setState({
                currentUserId : user.uid, 
                currentUserName : user.displayName}
            );

            const dbRefP = firebase.database().ref(`/private/${user.uid}/patterns`);
            dbRefP.on('value', (response) => {
                if(response.val() !== null){
                    self.setState({privatePresets : response.val()});
                }
            });

        }).catch(function(error) {
            console.log(error)
        });      
    }

    /**
     * Signs out a user.
     */
    signOutUser(){
        let self = this;
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            self.setState({currentUserId : null, currentUserName : null, saveToPrivate : false});
            self.newPattern();
        }).catch(function(error) {
            // An error happened.
        });
    }
    
    /**
     * Sets up interval for this sequencer. Set up firebase for this App.
     */
    componentDidMount(){
        this.interval = setInterval(this.tick,30000/this.state.tempo);
        const dbRef = firebase.database().ref("/public/patterns");
        dbRef.on('value', (response) => {
            if(response.val() !== null){
                this.setState({publicPresets : response.val()});
            }
        });
    }

    /**
     * Saves current pattern to Firebase, depending on save mode (public or private)
     */
    savePattern(){
        if(this.state.title !== ''){

            let path = '';
            if(this.state.saveToPrivate){
                path = `/private/${this.state.currentUserId}/patterns/${this.state.title}`
            }
            else{
                path = `/public/patterns/${this.state.title}`
            }

            // const dbRef = firebase.database().ref(`/public/patterns/${this.state.title}`);
            const dbRef = firebase.database().ref(path);
            let sequencePreset = new SequencePreset();

            for(let key in this.state.tracks){
                sequencePreset.setDrumTrack(key,this.state["tracks"][key]);
            }

            sequencePreset.setAuthor(this.state.author);
            sequencePreset.setTitle(this.state.title);
            sequencePreset.setDescription(this.state.description);
            sequencePreset.setGenre(this.state.genre);
            sequencePreset.setTempo(this.state.tempo);
            sequencePreset.setOrderings(this.state.orderings);
            dbRef.set(sequencePreset);
        }
    }

    /**
     * Changes the tempo/playback rate.
     * @param {event} e - event object from which to derive tempo change
     */
    changeTempo(e){
        this.createSequenceIterator(e.target.value);
    }

    /**
     * Creates a new iterator for this app. Clears old interval, sets tempo and creats new interval.
     * @param {number} _tempo - New tempo to set for this App.
     */
    createSequenceIterator(_tempo){
        clearInterval(this.interval);
        this.setState({tempo : _tempo});
        this.interval = setInterval(this.tick,30000/_tempo);     
    }

    /**
     * Sets the Gate value for a given trackName and cell number
     * @param {*} trackName 
     * @param {*} cellNumber 
     * @param {*} bool 
     */
    setGate(trackName,cellNumber,bool){
        let d = this.state["tracks"][trackName];
        d.getVariation(this.state.currentVariation).setGateAtIndex(cellNumber,bool);
        this.setState({trackName: d});
    }

    /**
     * Sets the pitch value for a given track name and cell number
     * @param {*} trackName 
     * @param {*} cellNumber 
     * @param {*} val 
     */
    setPitch(trackName,cellNumber,val){
        let d = this.state["tracks"][trackName];
        d.getVariation(this.state.currentVariation).setPitchAtIndex(cellNumber,parseFloat(val));
        this.setState({trackName : d});
    }

    /**
     * Sets the volume for a given track name and cell number
     * @param {*} trackName 
     * @param {*} cellNumber 
     * @param {*} val 
     */
    setVolume(trackName,cellNumber,val){  
        let d = this.state["tracks"][trackName];
        d.getVariation(this.state.currentVariation).setVolumeAtIndex(cellNumber,parseFloat(val));
        this.setState({trackName : d});
    }

    /**
     * Pauses the sequencer.
     */
    pause(){
        this.setState({play : false, paused : true});
    }

    /**
     * Plays the sequencer.
     */
    play(){
        this.setState({play : true, paused : false});
    }

    /**
     * Stops the sequencer. (Set play to false, pasued to false, iterator to zero)
     */
    stop(){
        this.setState({play : false, paused : false, iterator : 0, index : this.state.order[0]});
    }

    /**
     * Causes the sequencer to take a step.
     */
    tick(){
        if(this.state.play){
            this.setState(function(prevState,props){
                return {iterator : (prevState.iterator + 1) % 32,
                        index : prevState.order[(prevState.iterator + 1) % 32]
                    }
            });

            for(let key in this.state["tracks"]){
                let trackState = this.state["tracks"][key].getVariation(this.state.currentVariation).getAllAtIndex(this.state.index);
                if(trackState[0]){
                    playSoundFromSource(window.bl2.sampleLookup[key],audioContext,trackState[1],trackState[2]);
                }
            }
        }
    }
}

ReactDOM.render(<App />, document.getElementById('app'));