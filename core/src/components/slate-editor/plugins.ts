import * as keycode from "keycode";

function MarkHotkey(options) {
    const {type, key, isAltKey = false} = options;

    return {
        onKeyDown(event, change) {
            if (!event.metaKey || keycode(event.which) != key || event.altKey != isAltKey) {
                return;
            }

            event.preventDefault();

            change.toggleMark(type);

            return true;
        }
    }
}

const plugins = [
    MarkHotkey({key: "b", type: "bold"}),
    MarkHotkey({key: "c", type: "code", isAltKey: true}),
    MarkHotkey({key: "i", type: "italic"}),
    MarkHotkey({key: "d", type: "strikethrough"})
];

export default plugins;
