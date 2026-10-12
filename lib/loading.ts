/** Run before paint; the deadline also works if the application JS fails. */
export const loadingBootScript = `(function(){var r=document.documentElement;r.dataset.loading='true';window.setTimeout(function(){if(r.dataset.loading==='true'){delete r.dataset.loading;window.dispatchEvent(new Event('vigil-ready'))}},6000)})()`

export function finishLoading() {
  if (document.documentElement.dataset.loading !== 'true') return
  delete document.documentElement.dataset.loading
  window.dispatchEvent(new Event('vigil-ready'))
}
