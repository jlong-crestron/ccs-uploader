require('electron').ipcRenderer.on('upload-successful', (event, args) => {
    document.querySelector('#upload-status').innerHTML = 'upload complete';
});

function getFormData() {
    let ip = document.getElementById("ip").value
    let slot = document.getElementById("slot").value
    let user = document.getElementById("user").value 
    let pass = document.getElementById("pass").value
    let uri = document.querySelector('#uri').innerHTML;
    let ipc = require('electron').ipcRenderer

   ipc.send('upload-file', [ip, slot, user, pass, uri]);
}

(function () {
    var holder = document.getElementById('drag-file');

    holder.ondragover = () => {
        return false;
    };

    holder.ondragleave = () => {
        return false;
    };

    holder.ondragend = () => {
        return false;
    };

    holder.ondrop = (e) => {
        e.preventDefault();
        let uri = '';
        for (let f of e.dataTransfer.files) {
            console.log('File(s) you dragged here: ', f);
            uri = f.path;
        }
        document.querySelector('#uri').innerHTML = uri;
        return false;
    };
})();