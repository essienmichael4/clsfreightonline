import {useEditor, EditorContent} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Toolbars from "./Toolbars"
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

interface Props {
    onChange: (richText: string)=> void,
    defaultValue?: string
}

const Tiptap = ({ onChange, defaultValue }: Props) => {
    const editor = useEditor({
        extensions: [StarterKit.configure(), Underline, TextAlign.configure({
            types: ['heading', 'paragraph'],
          })],
        content: defaultValue,
        editorProps: {
            attributes: {
                class: "prose prose-sm m-3 focus:outline-none"
            }
        }, onUpdate({editor}){
            onChange(editor.getHTML())
        }
    })

    return (
        <div className="flex flex-col justify-center gap-2">
            <Toolbars editor={editor} />
            <EditorContent editor={editor} className="min-h-36 border rounded-lg"/>
        </div>
    )
}

export default Tiptap
