import * as React from "react";

const NotFound = (props?: any, context?: any): React.ReactElement<any> => (
    <div className="not-found">
        <h1>Route not found</h1>
        <p>Could not find the specified route!</p>
    </div>
);

export default NotFound;
