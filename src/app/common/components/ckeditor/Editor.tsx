import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { FC, useEffect, useState } from "react";
import Editor from "ckeditor5-custom-build/build/ckeditor";

interface CKEditorProps {
  data: string;
  disabled: boolean;
  onChange: (event: any, editor: any) => any;
}

export const TextEditor: FC<CKEditorProps> = ({ data, onChange, disabled }) => {
  const [editorData, setEditorData] = useState(data);

  useEffect(() => {
    setEditorData(data);
  }, [data]);

  return (
    <CKEditor
      editor={Editor}
      data={editorData}
      onChange={onChange}
      disabled={disabled}
      config={{
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "outdent",
            "indent",
            "|",
            "imageUpload",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "undo",
            "redo",
            "sourceEditing",
          ],
        },
        language: "en",
        image: {
          toolbar: [
            "imageTextAlternative",
            "toggleImageCaption",
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
          ],
        },
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
      }}
    />
  );
};
