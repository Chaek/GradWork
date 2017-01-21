import * as React from 'react';

 class OptionTab extends React.Component<IOptiontabProps, any> {
    constructor(props: IOptiontabProps){
        super(props);
    }

    public render() {
        return (
            <form>
                <div> {this.props.label}         
                    <select>
                        {this.props.options.map((message) => <option>{message}</option>)}
                    </select>
                </div>
            </form>    
        );
    }
}

export default OptionTab