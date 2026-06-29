// backend/src/routes/events.js
router.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Emitir eventos cada X segundos (solo para prueba)
  const interval = setInterval(() => {
    const data = {
      type: "ACCESS_CREATED",
      payload: { accessLogId: 1, residentId: 2, entryDatetime: new Date() },
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 5000);

  req.on("close", () => clearInterval(interval));
});
