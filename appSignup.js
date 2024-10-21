const btnRegis=document.getElementById('registrarse');
btnRegis.addEventListener('click',()=>{
    let username=document.getElementById('username').value;
    let password=document.getElementById('password').value;
    let repeatP=document.getElementById('repeat_password').value;

    let info={
        username:username,
        password:password,
        repeat_password:repeatP
    }
    console.log(info);

    fetch('http://localhost:3002/api/sign-up',{
        method:'POST',
        body:JSON.stringify(info),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(res=>res.json())
    .then(data=>{
        console.log(data);
        window.location.assign('http://127.0.0.1:5500/proyectoFinal/Front/login.html')
    });
});