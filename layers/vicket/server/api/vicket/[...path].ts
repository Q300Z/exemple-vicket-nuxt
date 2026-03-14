import { defineEventHandler, getQuery, readBody, readMultipartFormData, getMethod } from 'h3'
import { vicketGet, vicketRequest } from '../../utils/http'

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || ''
  const method = getMethod(event)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = getQuery(event) as Record<string, any>

  // Determine content type
  const contentType = event.node.req.headers['content-type'] || ''
  const isMultipart = contentType.includes('multipart/form-data')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any

  if (method === 'GET' || method === 'HEAD') {
    return vicketGet(path, query)
  } else if (isMultipart) {
    const parts = await readMultipartFormData(event)
    const formData = new FormData()

    if (parts) {
      for (const part of parts) {
        if (part.name) {
          if (part.filename) {
            const blob = new Blob([part.data], { type: part.type || 'application/octet-stream' })
            formData.append(part.name, blob, part.filename)
          } else {
            formData.append(part.name, part.data.toString('utf-8'))
          }
        }
      }
    }
    payload = formData
  } else {
    payload = await readBody(event)
  }

  // Delegate to HttpClient (SOLID)
  return vicketRequest(path, {
    method,
    body: payload instanceof FormData ? payload : JSON.stringify(payload)
  })
})
