import * as React from 'react';
import OptionTab from "./optiontab"



class ScanInterface extends React.Component<any, any> {
    constructor(props: any){
        super(props);
    }

    public render() {
        let words: string[] = ["Example2", "Example1"];
        return (
            <form>
                {[1, 2, 3, 4].map((value) => <OptionTab label = {"Hello" + value.toString()} options = {words} />)}
                {[1, 2, 3].map((value) => <div><input type="range"/></div>)}
                {[1, 2, 3].map((value) => <div><input type="checkbox"/> Test </div>)}
                <button>Scan</button>
            </form>    
        );
    }
}

export default ScanInterface