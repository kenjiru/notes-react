import * as keycode from "keycode";

function MarkHotkey(options) {
    const {type, key, isAltKey = false} = options;

    return {
        onKeyDown(event, data, state) {
            if (!event.metaKey || keycode(event.which) != key || event.altKey != isAltKey) {
                return;
            }

            event.preventDefault();

            return state
                .transform()
                .toggleMark(type)
                .apply();
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
