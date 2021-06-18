const socket = io.connect("https://disbotlist.xyz");

socket.on('userCount', userCount => {
        document.getElementById('connectionCount').innerHTML = userCount;
  })