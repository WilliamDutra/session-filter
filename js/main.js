(function($){
	
	$.fn.SessionFilter = function(methods){
		
		var form_center = "#" + this[0].id;
		var isRefresh = localStorage.getItem("isRefresh");
		
		if(methods == undefined){
			
			if(isRefresh == "true"){
				//var dados = eachForm(form_center);
				//console.log(getData(dados));
				//setDataForm(form_center);
				//clearStorage();
				// var dados = eachFormComplex(form_center);
				// setDataFormComplex(form_center);
				// clearStorage()
				
				
				
			}
			
		}
		
		
		$(form_center).submit(function(e){
			localStorage.setItem('isRefresh', true);
			//var dados = eachForm(form_center);
			//setData(dados);
			// var dados = eachFormComplex(form_center);
			// setData(dados);
			
			var retornoFiltro = percorreCampoFormulario("#frm");
			setStorage("filtro", retornoFiltro);
			
		});
	};
	
	function setStorage(index, value){
		localStorage.setItem(index, value);
	};
	
	function getStorage(index){
		var v = localStorage.getItem(index);
		return v;
	};
	
	function eachForm(forms){
		var arr = {};
		$(forms + " input[type='text']").each(function(){
			
			var keys = $(this).attr("id");
			var values = $(this).val();
			
			arr[keys] = values;
			
		});
		return arr;
	};
	
	function setData(data){
		$.each(data, function(index, value){
			console.log(value);
			setStorage(index, value);
		});
	};
	
	function clearStorage(){
		localStorage.clear();
	}
	
	/*function getData(data){
		var value = "";
		$.each(data, function(index, value){
			 value = getStorage(index);
		});
		return value;
	};*/
	
	function setDataForm(forms){
		$(forms + " input[type='text']").each(function(){
			var keys = $(this).attr("id");
			var value = getStorage(keys);
			$(this).val(value);
		});
	};
		
	function setDataFormComplex(forms){
		$(forms + " input").each(function(){
			var type = $(this).attr("type");
			var keys = $(this).attr("id");
			if(type != "submit"){
				var value = getStorage(keys);
				$(this).val(value);
			}
			
			if(type == "checkbox"){
				var v = getStorage(keys);
				if(v == "true"){
					$(this).prop("checked", true);
				}else{
					$(this).prop("checked", false);
				}
			}
			
		});
		
		$(forms + " select").each(function(){
			var type = $(this).attr("type");
			var keys = $(this).attr("id");
			if(type != "submit"){
				var value = getStorage(keys);
				$(this).val(value);
			}
			
		});
	};
	
	// function eachFormComplex(forms){
		// var arr = {};
		// $(forms + " :input").each(function(){
			// var type = $(this).attr("type");
			// var keys = $(this).attr("id");
			// var values = $(this).val();
			// if(type != "submit"){
				// arr[keys] = values;
			// }
			
			// if(type == "checkbox"){
				// var val = $(this).prop("checked");
				// arr[keys] = val;
			// }
			
		// });
		
		// $(forms + " select").each(function(){
			// var type = $(this).attr("type");
			// var keys = $(this).attr("id");
			// var values = $(this).val();
			// if(type != "submit"){
				// arr[keys] = values;
			// }
			
		// });
		
		// return arr;
	// };
	
	
	function percorreCampoFormulario(formulario){
		
		var filtro = {};
		
		//percorre os campos do formulário
		$(`${formulario} :input`).each(function(){
			
			var tipo = $(this).attr("type");
			var nome = $(this).attr("name");
			var valor = $(this).val();
			var id = $(this).attr("id");
			
			
			//exclui o input de submit
			if(tipo != "submit"){
				filtro[nome] = valor;
			}		
			
		});
		
		var filtroJSON = converteParaJSON(filtro);
		
		return filtroJSON;
		
	};
	
	function converteParaJSON(dado){
		return JSON.stringify(dado);
	};
	
}(jQuery));