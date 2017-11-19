import * as React from "react";
import * as classNames from "classnames";

class HtmlChunk extends React.Component<IHtmlChunkProps, IHtmlChunkState> {
    public render(): React.ReactElement<any> {
        return (
            <div className={this.getClassName()} dangerouslySetInnerHTML={{__html: this.props.html}}></div>
        );
    }

    private getClassName(): string {
        return classNames("html-chunk", this.props.className);
    }
}

interface IHtmlChunkProps {
    className?: string;
    html: string;
}

interface IHtmlChunkState {}

export default HtmlChunk;
