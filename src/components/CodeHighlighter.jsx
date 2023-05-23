import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import hljs from "highlight.js";
import "highlight.js/styles/base16/dracula.css";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

export function CodeHighlighter({ code }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyCodeToClipboard = () => {
    if (codeRef.current) {
      const range = document.createRange();
      range.selectNode(codeRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand("copy");
      window.getSelection()?.removeAllRanges();

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const formatCode = (code) => {
    try {
      return prettier.format(code, {
        parser: "babel",
        plugins: [parserBabel],
      });
    } catch (error) {
      console.error("Erro ao formatar o código:", error);
      return code;
    }
  };

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <div className="relative">
      <pre>
        <code ref={codeRef} className="text-sm hljs">
          {formatCode(code)}
        </code>
      </pre>
      <button
        className={`mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${
          copied ? "bg-green-500" : ""
        }`}
        onClick={copyCodeToClipboard}
      >
        {copied ? "Copiado!" : "Copiar código"}
      </button>
    </div>
  );
}

CodeHighlighter.propTypes = {
  code: PropTypes.string.isRequired,
};
