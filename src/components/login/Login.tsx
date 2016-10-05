import * as React from "react";
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class Login extends React.Component<ILoginProps, ILoginState> {
    public render(): React.ReactElement<any> {
        return (
            <Card>
                <CardTitle title="Login required"/>
                <CardText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                </CardText>
                <CardActions>
                    <FlatButton label="Cancel"/>
                </CardActions>
            </Card>
        );
    }
}

interface ILoginProps {}

interface ILoginState {}

export default Login;
