import { EventData, Observable } from 'data/observable';
import { Page } from 'ui/page';
import { HelloWorldModel } from './main-view-model';
import {ObservableArray} from "data/observable-array";
import {Cache} from"ui/image-cache";
import {ImageSource, fromFile} from"image-source";


// Event handler for Page "navigatingTo" event attached in main-page.xml
export function navigatingTo(args: EventData) {
  // Get the event sender
  let page = <Page>args.object;

  var array:ObservableArray<any> = new ObservableArray();

  for(var i= 0; i<50;i++){
    if(i%2==0){
      array.push({title:"Sample item "+i, imageSrc:"https://httpbin.org/image/jpeg"});
    }
    else{
      array.push({title:"Sample item "+i, imageSrc:"https://httpbin.org/image/png"});
    }
    
  }

  page.bindingContext = {source:array};
}


var cache = new Cache();
cache.maxRequests = 10;
cache.placeholder = fromFile("res://icon");

export class ImageItem extends Observable
{
    private _imageSrc: string
    get imageSrc(): ImageSource
    {
        var image = cache.get(this._imageSrc);

        if (image)
        {
            return image;
        }

        cache.push(
            {
                key: this._imageSrc
                , url: this._imageSrc
                , completed:
                (image) =>
                {
                    this.notify(
                        {
                            object: this
                            , eventName: Observable.propertyChangeEvent
                            , propertyName: "imageSrc"
                            , value: image
                        }); 
                }
            });

        return cache.placeholder;
    }

    constructor(imageSrc : string)
    {
        super();
        this._imageSrc = imageSrc;
    }
}