import JSZip from "jszip"
import { saveAs } from "file-saver"

export const exportAsZip = async (html: string, css: string, assets: any[] = []) => {
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

