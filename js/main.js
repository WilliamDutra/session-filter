(function($){
	
	$.fn.SessionFilter = function(methods){
		
		var form_center = "#" + this[0].id;
		//var isRefresh = localStorage.getItem("isRefresh");
		
		var Configuracao = JSON.parse(getStorage("configuracao_filtro"));
		var isRefresh = Configuracao.isRefresh;
		
		if(methods == undefined){
			
			if(isRefresh){
				//var dados = eachForm(form_center);
				//console.log(getData(dados));
				//setDataForm(form_center);
				//clearStorage();
				// var dados = eachFormComplex(form_center);
				// setDataFormComplex(form_center);
				// clearStorage()
				
				//verifica se existe a chave filtro para poder colocar o valores no formulário
				if(getStorage("filtro"))
					colocaValorFormulario(`${form_center}`);
				
				//apaga os valores do filtro caso haja um refresh na página
				clearKeyStorage("filtro");
			}
			
			
			
		}
		
		
		$(form_center).submit(function(e){
			
			configuracaoPadraoPlugin();
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
	};
	
	function clearKeyStorage(key){
		localStorage.removeItem(key);
	};
	
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
	
	
	//popula os valores do filtro nos respectivos campos do formulário
	function colocaValorFormulario(formulario){
		
		var cacheFiltro = getStorage("filtro"); //obtêm os valor json dentro do localStorage
		var resultadoFiltro = JSON.parse(cacheFiltro);//converte a string JSON em objeto
		var chaveFiltro = Object.keys(resultadoFiltro);//obtêm todas as chaves do objeto JSON 
		
		$(`${formulario} :input`).each(function(index, val){
			
			var tipo = $(this).attr("type");
			var id = $(this).attr("id");
			
			if(id == chaveFiltro[index]){//verifica se o id do formulário é igual ao do campo do filtro
				
				var nomeCampo = chaveFiltro[index];
				$(`#${id}`).val(resultadoFiltro[nomeCampo]);
				
				
				if(tipo == "radio"){
					preencheRadioButton(nomeCampo, resultadoFiltro[nomeCampo]);
				}
				
				if(tipo == "checkbox"){
					preecheCheckBox(nomeCampo, resultadoFiltro[nomeCampo]);
				}
				
			}
			
			
			
		});
		
		//apenas combobox
		$(`${formulario} select`).each(function(index, val){
			
			var tipo = $(this).attr("type");
			var id = $(this).attr("id");
			
			preencheSelect(id, resultadoFiltro[id]);
			
		});
	};
	
	//percorre todos os campos do fomulário
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

			if(tipo == "radio"){
				var radio = id;
				filtro[nome] = retornaValorRadioButton(radio);
			}
			
			if(tipo == "checkbox"){
				var checkbox = id;
				filtro[nome] = retornaValorCheckBox(checkbox);
			}
			
			if(tipo == "select"){
				var select = id;
				filtro[nome] = retornaValorSelect(select);
			}
			
		});
		
		var filtroJSON = converteParaJSON(filtro);
		
		return filtroJSON;
		
	};
	
	//converte valores para um objeto JSON
	function converteParaJSON(dado){
		return JSON.stringify(dado);
	};
	
	//retorno o valor do radio button: true = "checado", false = "não checado" do radio button 
	function retornaValorRadioButton(radio){
		var valor = $(`#${radio}`).is(":checked") ? true : false;
		return valor;
	};
	
	//retorno o valor do radio button: true = "checado", false = "não checado" do checkbox
	function retornaValorCheckBox(checkbox){
		var valor = $(`#${checkbox}`).is(":checked") ? true : false;
		return valor;
	};
	
	function retornaValorSelect(select){
		return $(`#${select} option:selected`).val();
	};
	
	//preenche o valor "checado" ou não "checado" do radio button
	function preencheRadioButton(radio, valor){
		$(`#${radio}`).attr("checked", valor);
	};
	
	//preenche o valor "checado" ou não "checado" do checkbox
	function preecheCheckBox(checkbox, valor){
		$(`#${checkbox}`).attr("checked", valor);
	};
	
	//preenche a opção selecionado no select
	function preencheSelect(select, valor){
		$(`#${select}`).val(valor).change();
	};
	
	//verificar se existe un combo no determindado formulario
	function isComboBox(formulario){
		var isCombo = $(`${formulario} select`).length;
		if(isCombo >= 1)
			return true;
		return false;
	};
	
	//coloca as configurações padrões no localStorage, para a execução do plugin
	function configuracaoPadraoPlugin(configuracao){
		
		if(configuracao != undefined){
			
		}else{
			
			var defaultConfig = { "isRefresh": true };
			setStorage("configuracao_filtro", converteParaJSON(defaultConfig));
			
		}
		
	};
	
}(jQuery));