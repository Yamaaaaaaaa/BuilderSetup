"use client"

import { useEffect, useRef, useState } from "react"
import grapesjs from "grapesjs"
import "grapesjs/dist/css/grapes.min.css"
import gjsPresetWebpage from "grapesjs-preset-webpage"
import gjsBlocksBasic from "grapesjs-blocks-basic"
import "./WebBuilder.css"

interface WebBuilderProps {
  onSave?: (html: string, css: string) => void
}

const WebBuilder = ({ onSave }: WebBuilderProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const editor = useRef<any>(null)
  const [editorInstance, setEditorInstance] = useState<any>(null)

  useEffect(() => {
    if (editorRef.current && !editor.current) {
      editor.current = grapesjs.init({
        container: editorRef.current,
        height: "100vh",
        width: "auto",
        storageManager: {
          type: "local",
          autosave: true,
          autoload: true,
          stepsBeforeSave: 1,
          id: "gjs-",
        },
        deviceManager: {
          devices: [
            {
              name: "Desktop",
              width: "",
            },
            {
              name: "Tablet",
              width: "768px",
              widthMedia: "992px",
            },
            {
              name: "Mobile",
              width: "320px",
              widthMedia: "480px",
            },
          ],
        },
        plugins: [gjsPresetWebpage, gjsBlocksBasic],
        pluginsOpts: {
          gjsPresetWebpage: {},
          gjsBlocksBasic: {},
        },
        canvas: {
          styles: ["https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"],
        },
        panels: {
          defaults: [
            {
              id: "panel-devices",
              el: ".panel__devices",
              buttons: [
                {
                  id: "device-desktop",
                  label: "Desktop",
                  command: "set-device-desktop",
                  active: true,
                  togglable: false,
                },
                {
                  id: "device-tablet",
                  label: "Tablet",
                  command: "set-device-tablet",
                  togglable: false,
                },
                {
                  id: "device-mobile",
                  label: "Mobile",
                  command: "set-device-mobile",
                  togglable: false,
                },
              ],
            },
            {
              id: "panel-switcher",
              el: ".panel__switcher",
              buttons: [
                {
                  id: "show-blocks",
                  active: true,
                  label: "Blocks",
                  command: "show-blocks",
                  togglable: false,
                },
                {
                  id: "show-style",
                  label: "Style",
                  command: "show-styles",
                  togglable: false,
                },
                {
                  id: "show-traits",
                  label: "Traits",
                  command: "show-traits",
                  togglable: false,
                },
                {
                  id: "show-layers",
                  label: "Layers",
                  command: "show-layers",
                  togglable: false,
                },
              ],
            },
            {
              id: "panel-basic-actions",
              el: ".panel__basic-actions",
              buttons: [
                {
                  id: "save-btn",
                  label: "Save",
                  className: "btn-save",
                  command: "save-page",
                },
                {
                  id: "preview-btn",
                  label: "Preview",
                  className: "btn-preview",
                  command: "preview",
                },
                {
                  id: "download-btn",
                  label: "Download",
                  className: "btn-download",
                  command: "download-page",
                },
                {
                  id: "export-zip-btn",
                  label: "Export ZIP",
                  className: "btn-export-zip",
                  command: "export-zip",
                },
              ],
            },
          ],
        },
      })

      // Add custom save command
      editor.current.Commands.add("save-page", {
        run: (editor: any) => {
          const html = editor.getHtml()
          const css = editor.getCss()

          if (onSave) {
            onSave(html, css)
          }

          console.log("HTML:", html)
          console.log("CSS:", css)
        },
      })

      // Add preview command
      editor.current.Commands.add("preview", {
        run: (editor: any) => {
          const html = editor.getHtml()
          const css = editor.getCss()
          const win = window.open("", "_blank")

          if (win) {
            win.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Preview</title>
                  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                  <style>${css}</style>
                </head>
                <body>${html}</body>
              </html>
            `)
            win.document.close()
          }
        },
      })

      // Add download command
      editor.current.Commands.add("download-page", {
        run: (editor: any) => {
          const html = editor.getHtml()
          const css = editor.getCss()

          // Create a complete HTML document
          const fullHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>My Website</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <style>${css}</style>
              </head>
              <body>${html}</body>
            </html>
          `

          // Create a Blob with the HTML content
          const blob = new Blob([fullHtml], { type: "text/html" })

          // Create a download link
          const link = document.createElement("a")
          link.href = URL.createObjectURL(blob)
          link.download = "my-website.html"

          // Trigger the download
          document.body.appendChild(link)
          link.click()

          // Clean up
          document.body.removeChild(link)
          URL.revokeObjectURL(link.href)
        },
      })

      setEditorInstance(editor.current)
    }

    return () => {
      if (editor.current) {
        editor.current.destroy()
        editor.current = null
      }
    }
  }, [onSave])

  const handleDownload = () => {
    if (editorInstance) {
      editorInstance.runCommand("download-page")
    }
  }

  return (
    <div className="web-builder">
      <div className="custom-controls">
        <button className="download-btn" onClick={handleDownload}>
          Download Website
        </button>
      </div>
      <div ref={editorRef} className="editor-container"></div>
    </div>
  )
}

export default WebBuilder

