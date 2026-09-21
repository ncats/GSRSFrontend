import Quill from "quill";

const Italic = Quill.import("formats/italic") as any;
Italic.tagName = "I";

Quill.register(Italic, true);