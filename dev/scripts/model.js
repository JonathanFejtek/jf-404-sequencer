export class SequencePreset{
    constructor(){
        // info stuff
        this.title;
        this.author;
        this.style;
        this.description;

        // musical elements
        this.tempo;
        this.drumTracks = {};
        this.orderings = [];
    }

    setTitle(title){
        this.title = title;
    }

    setOrderings(orderings){
        this.orderings = orderings;
    }

    setAuthor(author){
        this.author = author;
    }

    setGenre(genre){
        this.genre = genre;
    }

    setDescription(description){
        this.description = description;
    }

    setDrumTrack(trackName,track){
        this.drumTracks[trackName] = track;
    }

    getDrumTrack(trackName){
        return this.drumTracks[trackName];
    }

    setTempo(tempo){
        this.tempo = tempo;
    }

}
  
export class TrackCollection{
    constructor(trackLength,numVariations){
        this.variations = [];
        this.numVariations = numVariations;

        for(let i = 0; i < numVariations; i++){
            this.variations[i] = new DrumTrack(trackLength);
        }
    }

    getVariation(i){
        return this.variations[i];
    }

    clearAll(){
        for(let i = 0; i < this.numVariations; i++){
            this.variations[i].clearAll();
        }
    }

}
  
export class DrumTrack{
    constructor(len){
        this.gates = [];
        this.volumes = [];
        this.pitches = [];
        this.length = len;
        for(let i = 0; i < len; i++){
        this.gates[i] = false;
        this.volumes[i] = 0.5;
        this.pitches[i] = 1;
        }
    }

    getAllAtIndex(index){
        return [this.gates[index],this.volumes[index],this.pitches[index]];
    }

    setGateAtIndex(index,b){
        // let newGates = this.gates.slice();
        // newGates[index] = b;
        // this.gates = newGates;
        this.gates[index] = b;
    }

    setPitchAtIndex(index,val){
        // let newPitches = this.pitches.slice();
        // newPitches[index] = val;
        // this.pitches = newPitches;
        this.pitches[index] = val;
    }

    setVolumeAtIndex(index,val){
        // let newVolumes = this.volumes.slice();
        // newVolumes[index] = val;
        // this.volumes = newVolumes;
        this.volumes[index] = val;
    }

    setGates(gates){
        this.gates = gates;
    }

    setVolumes(volumes){
        this.volumes = volumes;
    }

    setPitches(pitches){
        this.pitches = pitches;
    }

    clearAll(){
        for(let i = 0; i < this.length; i++){
            this.gates[i] = false;
            this.volumes[i] = 0.5;
            this.pitches[i] = 1;
        }    
    }
}