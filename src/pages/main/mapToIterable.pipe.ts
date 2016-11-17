import {Pipe,PipeTransform} from '@angular/core';

@Pipe({
  name: 'mapToIterable'
})
export class MapToIterable implements PipeTransform {
  /*
  transform(dict: Object): Array<string> {
    var a = [];
    console.log("GETS TO PIPE");
    console.log(dict)

    for (var key in dict) {
      console.log("key"+key);
      if (dict.hasOwnProperty(key)) {
        a.push({key: key, val: dict[key]});
      }
    }
    console.log("after for loop" + a);
    return a;
  }
  */
  transform(value: any, args: any[] = null): any {
        console.log("GETS TO PIPE");
        console.log(value);
        console.log(Object.keys(value).map(function(key) {
            let pair = {};
            let k = 'key';
            let v = 'value'


            pair[k] = key;
            pair[v] = value[key];
        }))
        return Object.keys(value).map(function(key) {
            console.log("GETS TO OBJECT MAPP"+value)
            let pair = {};
            let k = 'key';
            let v = 'value'


            pair[k] = key;
            pair[v] = value[key];
            console.log("pair"+pair);
            return pair;
        });
  }
}