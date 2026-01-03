// Frontend/src/components/UI/editor/RichTextEditor
import React from "react";
import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {MdEditor} from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import MarkdownIt from "markdown-it";
import TurndownService from "turndown"; // Converts HTML to Markdown
import DOMPurify from "dompurify";
import { FiEdit, FiCode } from "react-icons/fi";

const mdParser = new MarkdownIt();
const turndownService = new TurndownService();

/* IMPORTANT: Image sync rule (TinyMCE → Markdown) */
turndownService.addRule("image", {
  filter: "img",
  replacement: function (content, node) {
    const src = node.getAttribute("src") || "";
    const alt = node.getAttribute("alt") || "image";
    const title = node.getAttribute("title");

    let markdown = `![${alt}](${src}`;
    if (title) markdown += ` "${title}"`;
    markdown += `)`;

    return markdown;
  },
});

const handlePasteImage = (event) => {
  const items = event.clipboardData?.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.indexOf("image") !== -1) {
      const file = item.getAsFile();
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const imageMarkdown = `![pasted-image](${reader.result})\n`;
        setMarkdown((prev) => prev + "\n" + imageMarkdown);
      };
      reader.readAsDataURL(file);

      event.preventDefault(); // ❗ stop default paste
    }
  }
};

export const RichTextEditor = () => {
     const [mode, setMode] = useState('visual');
     const [html, setHtml] = useState('');
     const [markdown, setMarkdown] = useState('');

     // Sync Visual (TinyMCE) → Markdown State
     const handleVisualChange = (content) => {
          setHtml(content);
          // Keep Markdown state in sync or update on mode switch
          const convertedMarkdown = turndownService.turndown(content);
           setMarkdown(convertedMarkdown);
     };

     // Sync Markdown (md-editor-rt) -> HTML
     // Note: md-editor-rt returns the string directly
     const handleMarkdownChange = (value) => {
          setMarkdown(value);
          const convertedHtml = mdParser.render(value);
          setHtml(convertedHtml);
     };

     // This function can convert File object to a datauri string
     const onUploadImg = async (files, callback) => {
          const file = files[0];
          const reader = new FileReader();
          
          reader.onload = () => {
               // md-editor expects array of image URLs
               callback([reader.result]);
          };
          reader.readAsDataURL(file);
     };
     

  return (
    <div className="space-y-4">
     {/* <textarea
        placeholder="Write your blog content here..."
        className="textarea textarea-lg w-full h-64"/> */}
     {/* Mode Switcher */}
     <div className="flex gap-2">
        <button
          onClick={() => setMode("visual")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white ${
            mode === "visual" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          <FiEdit /> Visual
        </button>

        <button
          onClick={() => setMode("markdown")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white ${
            mode === "markdown" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          <FiCode /> Markdown
        </button>
      </div>
     {/* Editor Container */}
     <div className="border border-gray-700 rounded-lg overflow-hidden">
     { mode === "visual" ? (
          <Editor
               apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
               value={html}
               onEditorChange={handleVisualChange}
               init={{
                    height: 500,
                    skin: "oxide-dark",
                    content_css: "dark",
                    menubar: false,
                    plugins: [
                         // Core editing features
                         'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                         // Your account includes a free trial of TinyMCE premium features
                         // Try the most popular premium features until Jan 14, 2026:
                         'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Nasim Reja',
                    mergetags_list: [
                         { value: 'First.Name', title: 'First Name' },
                         { value: 'Email', title: 'Email' },
                    ],
                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                    uploadcare_public_key: import.meta.env.VITE_TINYMCE_PUBLIC_KEY,
               }}
          />
     ):(
          <div onPaste={handlePasteImage}>
     <MdEditor
          modelValue={markdown}
          onChange={handleMarkdownChange}
          onUploadImg={onUploadImg}
          theme="dark"
          previewTheme="dark"
          codeTheme="github-dark"
          language="en-US"
          style={{ height: "500px" }}
          /* ALL FEATURES ENABLED */
          toolbarsExclude={[]}
          showCodeRowNumber
          autoDetectCode
          autoFoldThreshold={15}
          preview
          htmlPreview
          renderHTML={(text) =>
               DOMPurify.sanitize(mdParser.render(text))
          }
          /* Footer */
          footers={["markdownTotal", "scrollSwitch"]}
          /* Sticky toolbar */
          toolbarSticky={true}/>
          </div>
     )}
     </div>
    </div>
  );
};
