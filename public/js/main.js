function salvarCliente(){

	      var formularioCliente = document.getElementById('formularioCliente');           
	      var divMessage = document.getElementById('divMessage');
	      
	      if(formularioCliente.elements.id != undefined && formularioCliente.elements.id != null){
				  fetch('/atualizar-cliente', {
				  method: 'put',
				  headers: {'Content-Type': 'application/json'},
				  body: JSON.stringify({
				  	'_id': formularioCliente.elements.id.value,
				  	'name': formularioCliente.elements.name.value,
				    'cpf': formularioCliente.elements.cpf.value,
				    'idade': formularioCliente.elements.idade.value
				  })
				}).then(res => {
	  				if (res.ok) 
	  					divMessage.innerHTML = 'Dados salvos com sucesso.';
	  				else
	  					divMessage.innerHTML = 'Erro ao salvar os dados.';
				});

		  }else
		  		formularioCliente.submit();
}

function deletarCliente(id){
	fetch('/deletar-cliente', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      '_id': id
    })
  })
  .then(res => {
    if (res.ok) 
    	alert("Registro removido com sucesso.");
    else
    	alert("Ocorreu uma falha ao remover o registro.");

      window.location.reload(true);
  });  
}