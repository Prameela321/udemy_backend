function Throttle(fn, delay) {
  let lastCall = 0;

  return function (...args) {
    let now = Date.now();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}

function sendMessage(message) {
  console.log(`send message ${message}`);
}

const sendChatMessage = Throttle(sendMessage, 2 * 1000);

sendChatMessage("Hi");
sendChatMessage("Hello");
