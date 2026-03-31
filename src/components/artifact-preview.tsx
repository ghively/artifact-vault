"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ArtifactPreviewProps {
  content: string;
  type: string;
}

export function ArtifactPreview({ content, type }: ArtifactPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    if (type === "html" || type === "react") {
      let processedContent = content;

      if (type === "react") {
        processedContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <style>
              body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; background: #0a0a0f; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              ${content}
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(App || App));
            </script>
          </body>
          </html>
        `;
      }

      setHtmlContent(processedContent);
    }
  }, [content, type]);

  const renderPreview = () => {
    switch (type) {
      case "html":
      case "react":
        return (
          <iframe
            ref={iframeRef}
            srcDoc={htmlContent}
            sandbox="allow-scripts"
            className="w-full h-full border-0 rounded-xl bg-white/5"
            title="Preview"
          />
        );

      case "svg":
        return (
          <div className="flex items-center justify-center h-full glass-card rounded-xl p-6">
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="max-w-full max-h-full overflow-auto"
            />
          </div>
        );

      case "mermaid":
        return (
          <div className="flex items-center justify-center h-full glass-card rounded-xl p-6">
            <pre className="text-sm overflow-auto max-w-full text-white/70">
              <code>{content}</code>
            </pre>
          </div>
        );

      case "markdown":
        return (
          <div className="prose prose-invert prose-sm max-w-none p-6 glass-card rounded-xl h-full overflow-auto custom-scrollbar">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        );

      default:
        return (
          <div className="glass-card rounded-xl p-6 text-sm text-white/50 text-center">
            Preview not available for {type} type. View the Code tab to see the content.
          </div>
        );
    }
  };

  const getLanguage = () => {
    const langMap: Record<string, string> = {
      javascript: "javascript",
      typescript: "typescript",
      python: "python",
      shell: "bash",
      json: "json",
      css: "css",
      html: "html",
    };
    return langMap[type] || "text";
  };

  return (
    <Tabs defaultValue="preview" className="w-full h-full">
      <TabsList className="glass-card rounded-lg p-1 bg-white/5 border-white/10 w-fit">
        <TabsTrigger
          value="preview"
          className="rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white px-4"
        >
          Preview
        </TabsTrigger>
        <TabsTrigger
          value="code"
          className="rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white px-4"
        >
          Code
        </TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="mt-4 h-[500px]">
        {renderPreview()}
      </TabsContent>
      <TabsContent value="code" className="mt-4 h-[500px]">
        <div className="h-full glass-card rounded-xl overflow-auto custom-scrollbar">
          <SyntaxHighlighter
            language={getLanguage()}
            style={vscDarkPlus}
            customStyle={{ margin: 0, height: "100%", borderRadius: "12px", background: "transparent" }}
            showLineNumbers
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </TabsContent>
    </Tabs>
  );
}
