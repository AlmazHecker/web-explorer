1. Create API to load plugins only when needed
   Currently all plugins load at the start and insert html, attach their listeners (WIP)
   This is partially done. Need to analyze existing plugins and cleanup potential memory leaks(event listeners, etc.)
2. Create reusable dialog API (A lot of repeating code on onClose and onOpen)
