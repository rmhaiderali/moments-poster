<script setup>
import { ref, watch } from "vue"
import Header from "./Header.vue"
import Footer from "./Footer.vue"
import Alert from "./Alert.vue"
import "./App.scss"

const fileInput = ref(null)
const URLInput = ref(null)
const serverFileName = ref(null)
const fileList = ref(null)
const isFile = ref(true)
const alert = ref(null)
const progress = ref(null)
const step = ref(1)

const updateFileList = (value) => (fileList.value = value)

watch(fileInput, (current) => {
  if (fileList.value && current) current.files = fileList.value
})

async function fetchImg() {
  alert.value = null
  step.value = 2

  let response
  try {
    response = await fetch("/upload", {
      method: "POST",
      headers: { "Content-Type": "text/url" },
      body: URLInput.value
    })
    response = await response.json()
  } catch (error) {
    response = {
      error: "Something went wrong while communicating with server."
    }
  }
  checkResponse(response)
}

function uploadImg() {
  alert.value = null
  const file = fileInput.value.files[0]

  if (!file) return (alert.value = "Choose a file before attempting to upload.")

  const fileType = file.type.split("/")?.[1]

  if (!["jpeg", "png"].includes(fileType))
    return (alert.value = "Only JPEG and PNG files are allowed.")

  if (file.size > 5 * 1024 ** 2)
    return (alert.value = "Image file size should not exceed 5MB.")

  step.value = 2
  const xhr = new XMLHttpRequest()
  xhr.open("POST", "/upload")

  xhr.upload.onprogress = ({ loaded, total }) => {
    const value = Math.round((loaded / total) * 100)
    if (value === 100) progress.value.removeAttribute("value")
    else progress.value.value = value
  }

  xhr.onloadend = () => {
    let response
    try {
      response = JSON.parse(xhr.responseText)
    } catch (error) {
      response = {
        error: "Something went wrong while communicating with server."
      }
    }
    checkResponse(response)
  }

  xhr.send(file)
}

function checkResponse(response) {
  if (response.error) {
    step.value = 1
    return (alert.value = response.error)
  }
  serverFileName.value = response.file
  step.value = 3
}

function share() {
  const data = JSON.stringify({
    type: "share",
    title: "Glorious National Day",
    desc: "Glorious National Day",
    adjust_campaign: "h5_a20210917national",
    url: document.location.origin + BASE + "images/" + serverFileName.value
  })

  if (/android/i.test(userAgent)) {
    if (window.IMSDK) IMSDK.jsCallNative(data)
    else alert.value = "No IMSDK JS support."
  } else if (/iPad|iPhone|iPod|Macintosh/.test(userAgent) && !window.MSStream) {
    if (iOSBridge)
      iOSBridge.callHandler("jsCallNative", data, (res) => console.log(res))
    else alert.value = "No IMSDK JS support."
  } else {
    alert.value = "Current platform is not supported."
  }

  fileList.value = null
  URLInput.value = null
  step.value = 1
}
</script>

<template>
  <Header />
  <div class="main">
    <div class="container">
      <div class="p-3">
        <Alert v-if="alert" :message="alert" />
        <div class="py-3">
          <div class="row">
            <div>
              <h5 class="card-title text-accent text-center">
                Post Images to In-Game
              </h5>
              <p class="mt-2 mb-0 card-text text-accent text-center">
                PUBG MOBILE Moments
              </p>
              <div v-if="step === 1">
                <div class="app1 mt-3">
                  <input
                    class="accent cursor-pointer"
                    type="radio"
                    id="radio1"
                    :value="true"
                    v-model="isFile"
                  />
                  <label class="cursor-pointer" for="radio1">File</label>
                  <input
                    class="accent cursor-pointer"
                    type="radio"
                    id="radio2"
                    :value="false"
                    v-model="isFile"
                  />
                  <label class="cursor-pointer" for="radio2">URL</label>
                </div>
                <input
                  v-if="isFile"
                  ref="fileInput"
                  @change="({ target }) => updateFileList(target.files)"
                  id="file"
                  type="file"
                  class="mt-2 mb-0 form-control"
                />
                <input
                  v-else
                  v-model="URLInput"
                  @keydown="(event) => event.key === 'Enter' && fetchImg()"
                  placeholder="Image URL"
                  id="url"
                  type="text"
                  class="mt-2 mb-0 form-control"
                />
                <button
                  @click="() => (isFile ? uploadImg : fetchImg)()"
                  class="app2 d-grid gap-2 col-6 col-sm-5 mx-auto btn btn-outline-accent"
                >
                  {{ isFile ? "Upload" : "Fetch" }}
                </button>
              </div>
              <div v-if="step === 2">
                <div class="d-grid gap-2 col-md-5 mx-auto mt-4">
                  <span class="card-text text-accent text-center"
                    >{{ isFile ? "Uploading" : "Fetching" }} Image</span
                  >
                  <progress
                    ref="progress"
                    min="0"
                    max="100"
                    class="accent w-100"
                  />
                </div>
              </div>
              <div v-if="step === 3">
                <button
                  @click="share"
                  class="d-grid gap-2 col-6 col-sm-5 mx-auto btn btn-outline-accent mt-4"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.app1 {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.app2 {
  margin-top: 2rem;
}
.accent {
  accent-color: var(--theme);
}
label {
  padding-left: 6px;
  margin-right: 16px;
}
</style>
