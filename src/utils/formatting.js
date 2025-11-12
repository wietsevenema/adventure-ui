export const formatRoomOutput = (roomName, description) => {
  const lines = [];
  if (roomName) {
    const roomLine = `Room: ${roomName}`;
    lines.push(roomLine);
    lines.push('-'.repeat(roomLine.length));
  }
  if (description) {
    lines.push(description);
  }
  return lines;
};
