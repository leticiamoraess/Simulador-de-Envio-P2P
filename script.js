const peer = new Peer();

let conn;
let fileToSend;

peer.on('open', (id) => {
  document.getElementById('my-id').value = id;
});

function connect() {
  const remoteId = document.getElementById('remote-id').value;
  conn = peer.connect(remoteId);

  conn.on('open', () => {
    document.getElementById('status').textContent = 'Conectado ao peer!';
  });

  conn.on('data', (data) => {
    const blob = new Blob([data.file], { type: data.type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = data.name;
    a.textContent = 'Clique aqui para baixar o arquivo recebido';
    document.body.appendChild(a);
  });
}

function sendFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file && conn && conn.open) {
    const reader = new FileReader();

    reader.onload = () => {
      conn.send({
        name: file.name,
        type: file.type,
        file: reader.result
      });

      document.getElementById('status').textContent = 'Arquivo enviado com sucesso!';
    };

    reader.readAsArrayBuffer(file);
  } else {
    document.getElementById('status').textContent = 'Conexão não estabelecida ou nenhum arquivo selecionado.';
  }
}

peer.on('connection', (incomingConn) => {
  conn = incomingConn;

  conn.on('open', () => {
    document.getElementById('status').textContent = 'Conexão recebida!';
  });

  conn.on('data', (data) => {
    const blob = new Blob([data.file], { type: data.type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = data.name;
    a.textContent = 'Clique aqui para baixar o arquivo recebido';
    document.body.appendChild(a);
  });
});

document.getElementById('copy-id').addEventListener('click', function () {
  const peerIdInput = document.getElementById('my-id'); 
  if (peerIdInput.value.trim() !== '') {
    navigator.clipboard.writeText(peerIdInput.value).then(() => {
      const btn = document.getElementById('copy-id');
      const originalText = btn.innerText;
      btn.innerText = '✅ Copiado!';
      setTimeout(() => {
        btn.innerText = originalText;
      }, 2000);
    });
  }
});

