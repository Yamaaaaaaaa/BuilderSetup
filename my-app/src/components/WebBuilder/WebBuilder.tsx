"use client"

import { useEffect, useRef, useState } from "react"
import grapesjs from "grapesjs"
import "grapesjs/dist/css/grapes.min.css"
import gjsPresetWebpage from "grapesjs-preset-webpage"
import gjsBlocksBasic from "grapesjs-blocks-basic"
import "./WebBuilder.css"
import JSZip from "jszip"
import { saveAs } from "file-saver"

interface WebBuilderProps {
  onSave?: (html: string, css: string) => void
}

const WebBuilder = ({ onSave }: WebBuilderProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const editor = useRef<any>(null)
  const [editorInstance, setEditorInstance] = useState<any>(null)

  // Function to export website as ZIP
  const exportAsZip = async (html: string, css: string, assets: any[] = []) => {
    const zip = new JSZip()

    // Add HTML file
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>My Website</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <link rel="stylesheet" href="styles.css">
        </head>
        <body>${html}</body>
      </html>
    `

    zip.file("index.html", fullHtml)

    // Add CSS file
    zip.file("styles.css", css)

    // Create assets folder
    const assetsFolder = zip.folder("assets")

    // Add assets (if any)
    for (const asset of assets) {
      if (asset.url && asset.filename) {
        try {
          const response = await fetch(asset.url)
          const blob = await response.blob()
          assetsFolder?.file(asset.filename, blob)
        } catch (error) {
          console.error(`Failed to fetch asset: ${asset.url}`, error)
        }
      }
    }

    // Generate and save the zip file
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "my-website.zip")
    })
  }

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

      // Add export as ZIP command
      editor.current.Commands.add("export-zip", {
        run: async (editor: any) => {
          const html = editor.getHtml()
          const css = editor.getCss()

          // Get all assets (images, etc.)
          const assets = []
          const components = editor.Components.getComponents()

          // Function to recursively extract assets from components
          const extractAssets = (components: any[]) => {
            components.forEach((component) => {
              // Check for images
              if (component.get("type") === "image") {
                const src = component.get("src")
                if (src && !src.startsWith("data:")) {
                  const filename = src.split("/").pop()
                  assets.push({ url: src, filename })
                }
              }

              // Check for background images in styles
              const style = component.getStyle()
              if (style && style["background-image"]) {
                const bgImage = style["background-image"]
                const urlMatch = bgImage.match(/url$$['"]?([^'"]+)['"]?$$/)
                if (urlMatch && urlMatch[1] && !urlMatch[1].startsWith("data:")) {
                  const filename = urlMatch[1].split("/").pop()
                  assets.push({ url: urlMatch[1], filename })
                }
              }

              // Process child components
              if (component.get("components")) {
                extractAssets(component.get("components").models)
              }
            })
          }

          extractAssets(components.models)

          // Export as ZIP
          await exportAsZip(html, css, assets)
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

  const handleExportZip = () => {
    if (editorInstance) {
      editorInstance.runCommand("export-zip")
    }
  }

  return (
    <div className="web-builder">
      <div className="custom-controls">
        <button className="download-btn" onClick={handleExportZip}>
          Download as ZIP
        </button>
      </div>
      <div ref={editorRef} className="editor-container"></div>
    </div>
  )
}

export default WebBuilder

