interface KeyValues{
    key:string;
    value:Message;
}
export interface Location{
    lat:any;
    long:any;
}
export interface Message{
    downloadURL:string;
    location:Location;
    distance:any;
    isLeft:boolean;
    isBottom:boolean;
}
export class Map {
    public items: { [index: string]: Message } = {};
    private count: number;
    constructor(){
    	this.count=0;
    }

    public containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    public length(): number {
        return this.count;
    }

    public add(key: string, value: Message) {
        this.items[key] = value;
        this.count++;
    }
    public update(key: string, value: Message) {
        this.items[key] = value;
    }
    public remove(key: string): Message {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    }

    public item(key: string): Message {
        return this.items[key];
    }

    public keys(): string[] {
        var keySet: string[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }

    public keyValues(): any {
        var keyValues: KeyValues[] = [];
        keyValues = Object.keys(this.items)
            .map((key) => ({ 'key': key, 'value': this.items[key] }));
        /*for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keyValues.push({'key':prop,'value':this.items[prop]});
            }
        }*/
        return keyValues;
    }
}
