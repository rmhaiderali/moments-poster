import crypto from "crypto"
import got from "got"
import express from "express"
import ViteExpress from "vite-express"
import bodyParser from "body-parser"
import sharp from "sharp"
import { fileTypeFromBuffer } from "file-type"
import validUrl from "valid-url"

class CustomError extends Error {
  constructor(message = "Unable to process your request.", code = 500) {
    super(message)
    this.code = code
  }
}

const app = express()
app.use(bodyParser.text({ type: ["text/url"] }))

app.post("/upload", async (req, res, next) => {
  const isURL = req.get("content-type") === "text/url"

  if (isURL && !validUrl.isWebUri(req.body))
    return next(new CustomError("Provided URL is not vaild.", 400))

  const stream = isURL ? got.stream(req.body) : req

  const chunks = []
  const maxSize = 5 * 1024 ** 2
  let size = 0

  stream.on("data", (chunk) => {
    size += chunk.length

    if (size > maxSize) {
      if (isURL) stream.destroy?.()
      return next(new CustomError("File size should not exceed 5MB.", 413))
    } else {
      chunks.push(chunk)
    }
  })

  stream.on("end", async () => {
    if (size > maxSize) return

    const fileBuffer = Buffer.concat(chunks)
    const fileType = await fileTypeFromBuffer(fileBuffer)

    if (!fileType || !["jpg", "png", "webp"].includes(fileType.ext))
      return next(
        new CustomError("Only JPEG PNG and WEBP files are allowed.", 400)
      )

    const fileName =
      Date.now() + "_" + crypto.randomBytes(2).toString("hex") + ".png"

    try {
      await sharp(fileBuffer)
        .png()
        .resize({
          width: 1050,
          height: 589,
          fit: "contain",
          background: "#222"
        })
        .toFile("dist/images/" + fileName)
      return res.status(200).send({ file: fileName })
    } catch (e) {
      return next(new CustomError("Failed to process Image."))
    }
  })

  stream.on("error", (e) => {
    return next(
      new CustomError(
        isURL
          ? "Failed to fetch Image from URL."
          : "Failed to process your request."
      )
    )
  })
})

app.use((err, req, res, next) => {
  if (err.status === 413)
    res.status(413).send({ error: "Data exceeds size limit." })
  else if (err instanceof CustomError)
    res.status(err.code).send({ error: err.message })
})

const PORT = process.env.PORT || 3002

const server = app.listen(PORT, () => console.log("listening on port " + PORT))

ViteExpress.config({ mode: process.env.NODE_ENV, ignoreBase: false })

ViteExpress.bind(app, server)
