import * as React from "react";

export interface HelloProps { url: string; }
export interface HelloState { data: string; }

class Hello extends React.Component<HelloProps, HelloState> {
    constructor(props: HelloProps){
        console.log("constructor");
        super(props);

        this.state = {
            data: "Waiting"
        }

        this.get = this.get.bind(this);
    }

    public componentWillMount() {
        console.log("mount");
        console.log(this);
        
        this.get(this.props.url)
        .then((response) => {
            /*
             Uncaught (in promise) TypeError: Cannot read property 'setState' of undefined
                at get.then.err.setState.data

             Solution: binding via arrow function!
            */
            this.setState({data : response as string}); 
        }, function(err) {
            this.setState({data : err as string});
        })
    }

    public get(url:string) {  
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onload = function() {
                if (req.status == 200) { 
                    resolve(req.response); 
                } else { 
                    reject(Error(req.statusText)); 
                }
            };

            req.onerror = function() { reject(Error("Network Error")); };
            req.send();
        });
    }

    public render() {
        console.log("constructor");
        return (<h1> Result : {this.state.data}</h1>);
    }

}

export default Hello;