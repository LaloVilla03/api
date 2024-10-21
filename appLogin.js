const btnSesion = document.getElementById('login');
btnSesion.addEventListener('click',()=>{

    let username=document.getElementById('nomUser').value;
    let password=document.getElementById('contra').value;

    let info={
        username:username,
        contraseña:password
    }
    console.log(info);

    fetch('http://localhost:3002/api/login',{
        method:'POST',
        body:JSON.stringify(info),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(res=>res.json())
    .then(data=>{
        console.log(data);
        window.location.assign('http://127.0.0.1:5500/proyectoFinal/Front/menu.html')
    });
});