function valideKey(evt){
			
    // code is the decimal ASCII representation of the pressed key.
    var code = (evt.which) ? evt.which : evt.keyCode;
    
    if(code==8) { // backspace.
      return true;
    } else if(code>=48 && code<=57) { // is a number.
      return true;
    } else{ // other keys.
      return false;
    }
}


// conenction
let socket = io();

// DOM elements
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');

btn.addEventListener('click', function() {
    output.innerHTML += `<p>
    <strong>${username.value}(Mensaje descifrado)</strong>: ${message.value}
  </p>`;
  //comienza el cifrado
  var tamprimo = 3; //2, 3, 4 etc
   var p = new BigInt;
   var q = new BigInt;
   var n = new BigInt;
   var fi = new BigInt;
   var e = new BigInt;
   var d = new BigInt;

  p = new BigInt(tamprimo, 10, new Random());
  
  do q = new BigInt(tamprimo, 10, new Random());
   while(q.compareTo(p)==0); 

   //return p, q;

   n = p.multiply(q);

   console.log(p);
   console.log(q);
   console.log(n);
  
   //(p-1)
   fi = p.subtract(BigInt.valueOf(1));
   
   fi = fi.multiply(q.subtract(BigInt.valueOf(1)));

   do e = new BigInt(2*tamprimo, new Random());
   while((e.compareTo(fi) != -1) || (e.gcd(fi).compareTo(BigInteger.valueOf(1)) != 0));

   
   d = e.modInverse(fi);
        
  var i = new int;
  var temp = new byte(1);
  var digitos = mensaje.getBytes();
  
  var bigdigitos = new BigInt(digitos.length);
  
  for(i = 0; i < bigdigitos.length; i++){
      temp(0) = digitos(i);
      bigdigitos(i) = new BigInt(temp);
  }
  
  var cifrado = new BigInt(bigdigitos.length);
  
  for(i = 0; i < bigdigitos.length; i++){
      //formula
      // c = M ^ e mod n
      cifrado(i) = bigdigitos(i).modPow(e, n);
  }

  console.log(cifrado);


  socket.emit('chat:message', {
    message: cifrado.value,
    username: username.value,
    d: d.value, 
    n: n.value
  });
  
});

message.addEventListener('keypress', function () {
  socket.emit('chat:typing', username.value);
});

socket.on('chat:message', function(data) {
  actions.innerHTML = '';
  output.innerHTML += `<p>
    <strong>${data.username}(Mensaje cifrado)</strong>: ${data.message}
  </p>
  <p><strong>${data.d}</strong></p>
  <p><strong>${data.n}</strong></p>`
});

socket.on('chat:typing', function(data) {
  actions.innerHTML =  `<p><em>${data} está escribiendo un mensaje...</em></p>`
});

function generarPrimos(){
  var tamprimo = 3; //2, 3, 4 etc
  p = new BigInt(tamprimo, 10, new Random());
  
  do q = new BigInt(tamprimo, 10, new Random());
   while(q.compareTo(p)==0); 

   return p, q;

}

function generarClaves(){
  /*
  Recordar que n = p*q
  fi = (p-1)*(q-1)
  */
  
  n = p.multiply(q);
  
  //(p-1)
  fi = p.subtract(BigInt.valueOf(1));
  
  fi = fi.multiply(q.subtract(BigInt.valueOf(1)));
  
  /*
  como calculabamos a e
  
  e debe de ser un coprimo de n de tal que
  1<e<fi(n)
  */
  
  do e = new BigInt(2*tamprimo, new Random());
  while((e.compareTo(fi) != -1) || (e.gcd(fi).compareTo(BigInteger.valueOf(1)) != 0));
  
  //calcular a d = e ^ 1 mod fi   inverso multiplicativo de e
  
  d = e.modInverse(fi);

  
}

function cifrar(mensaje){

  var tamprimo = 3; //2, 3, 4 etc
  p = new BigInt(tamprimo, 10, new Random());
  
  do q = new BigInt(tamprimo, 10, new Random());
   while(q.compareTo(p)==0); 

   //return p, q;

   n = p.multiply(q);
  
   //(p-1)
   fi = p.subtract(BigInt.valueOf(1));
   
   fi = fi.multiply(q.subtract(BigInt.valueOf(1)));

   do e = new BigInt(2*tamprimo, new Random());
   while((e.compareTo(fi) != -1) || (e.gcd(fi).compareTo(BigInteger.valueOf(1)) != 0));

   
   d = e.modInverse(fi);
        
  var i = new int;
  var temp = new byte[1];
  var digitos = mensaje.getBytes();
  
  var bigdigitos = new BigInt[digitos.length];
  
  for(i = 0; i < bigdigitos.length; i++){
      temp[0] = digitos[i];
      bigdigitos[i] = new BigInt(temp);
  }
  
  var cifrado = new BigInt[bigdigitos.length];
  
  for(i = 0; i < bigdigitos.length; i++){
      //formula
      // c = M ^ e mod n
      cifrado[i] = bigdigitos[i].modPow(e, n);
  }
  
  return cifrado, d , n;
}

//desciframos con clave privada
// d n

function descifrar(cifrado){
  
  var descifrado = new BigInt[cifrado.length];
  
  //vamos a descifrar con la formula
  // Md = C ^d mod n
  
  for( var j = 0; j < descifrado.length; j++){
      descifrado[j] = cifrado[j].modPow(d, n);
  }
  
  var charArray = new char[descifrado.length];
  
  for( var i = 0; i < charArray.length; i++){
      charArray[j] = (char)(descifrado[j].intValue());
  }
  
  return (new String(charArray));
}
