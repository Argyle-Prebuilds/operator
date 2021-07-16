import React from "react";
import { Editor } from "react-draft-wysiwyg";
import bold from "../../../icons/toolbar/Bold.svg";
import italic from "../../../icons/toolbar/Italic.svg";
import underline from "../../../icons/toolbar/Underline.svg";
import strike from "../../../icons/toolbar/Strike.svg";
import brackets from "../../../icons/toolbar/Brackets.svg";
import pen from "../../../icons/toolbar/Pen.svg";
import x2down from "../../../icons/toolbar/X2Down.svg";
import x2up from "../../../icons/toolbar/X2Up.svg";

const CustomEditor = (props) => {
  return (
    <div className="editor-box">
      <Editor
        placeholder={"Write homepage welcome text..."}
        toolbar={{
          inline: {
            bold: {
              icon: bold,
            },
            italic: {
              icon: italic,
            },
            underline: {
              icon: underline,
            },
            strikethrough: {
              icon: strike,
            },
            monospace: {
              icon: brackets,
            },
            superscript: {
              icon: x2up,
            },
            subscript: {
              icon: x2down,
            },
          },
          colorPicker: {
            icon: pen,
          },
          blockType: {
            icon: x2down,
          },

          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "colorPicker",
          ],
        }}
        {...props}
      />
    </div>
  );
};

export default CustomEditor;
