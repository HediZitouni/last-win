export function connectWebsocket(url, idUser) {
  const defaultWs = new WebSocket(url);
  defaultWs.onopen = () => {
    console.log("open", idUser);
    defaultWs.send(JSON.stringify({ message: "setupUser", content: { idUser } }));
  };
  defaultWs.onclose = () => {
    console.log("closed");
    let retryCount = 0;
    retryCount++;
    setTimeout(() => {
      connectWebsocket(url, idUser);
    }, 1000 * Math.pow(2, retryCount));
  };
  defaultWs.onerror = (e) => {
    console.log("error", e);
  };

  return defaultWs;
}
