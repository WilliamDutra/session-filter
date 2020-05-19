(function($){
	
	$.fn.SessionFilter = function(methods){
		
		var form_center = "#" + this[0].id;
		
		//seta o as configurações do plugin
		configuracaoPadraoPlugin();
		var Configuracao = JSON.parse(getStorage("configuracao_filtro"));
		var isRefresh = Configuracao.isRefresh;
		
		if(methods == undefined){
			
			if(isRefresh){
								
				//verifica se existe a chave filtro para poder colocar o valores no formulário
				if(getStorage("filtro"))
					colocaValorFormulario(`${form_center}`);
				
				//apaga os valores do filtro caso haja um refresh na página
				clearKeyStorage("filtro");
			}
			
			
			
		}else{
			
			console.log(methods);
			
		}
		
		//no submit do formulario são gravado os dados 
		$(`${form_center}`).submit(function(e){
			
			
			//configuracaoPadraoPlugin();
			var retornoFiltro = percorreCampoFormulario(`${form_center}`);//obtêm os valores do filtro
			setStorage("filtro", retornoFiltro);//armazena as informações do filtro
			
		});
	};
	
	function setStorage(index, value){
		localStorage.setItem(index, value);
	};
	
	function getStorage(index){
		var v = localStorage.getItem(index);
		return v;
	};
	
	function clearStorage(){
		localStorage.clear();
	};
	
	function clearKeyStorage(key){
		localStorage.removeItem(key);
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