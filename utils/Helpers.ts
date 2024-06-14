export const onClickOutside = (element: Element, callback: () => void) => {
    document.addEventListener('click', (e: MouseEvent) => {
      if (!element.contains(e.target as Node)) {
        callback()
      }
    })
  }