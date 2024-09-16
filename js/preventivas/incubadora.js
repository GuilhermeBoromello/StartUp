$(document).ready(function () {
    function adicionarLinha(setor, tipoEquipamento, modelo, data, patrimonio, numeroSerie) {
        // Obtém o corpo da tabela
        var tabelaBody = document.querySelector('#tabelaRegistros tbody');
        var novaLinha = document.createElement('tr');

        novaLinha.innerHTML = `
            <td>${setor}</td>
            <td>${tipoEquipamento}</td>
            <td>${modelo}</td>
            <td>${data}</td>
            <td>${patrimonio}</td>
            <td>${numeroSerie}</td>
        `;

        tabelaBody.appendChild(novaLinha);
        atualizarTotalRegistros();
    }

    function limparGrid() {
        var tabelaBody = document.querySelector('#tabelaRegistros tbody');
        tabelaBody.innerHTML = '';  // Remove todas as linhas existentes
    }

    function atualizarTotalRegistros() {
        var totalRegistros = document.querySelectorAll('#tabelaRegistros tbody tr').length;

        document.querySelector('#txtTotalRegistros').innerText = 'Total de Registros: ' + totalRegistros;
    }

    function carregarRegistros() {
        // Recuperar os registros do localStorage
        var registrosJSON = localStorage.getItem('preventivas');
        // Verificar se há registros;
        if (registrosJSON) {
            var registros = JSON.parse(registrosJSON);
            // Iterar sobre cada registro e chamar a função adicionarLinha
            registros.forEach(function (registro) {
                adicionarLinha(
                    registro.Setor,
                    registro.Equipamento,
                    registro.Modelo,
                    registro.Data,
                    registro.Patrimonio,
                    registro.SerialNumber
                );
            });
        }
    }

    function limparCamposModal() {
        // Limpar todos os inputs de texto
        $('#staticBackdrop input[type="text"]').val('');
        $('#staticBackdrop input[type="number"]').val('');
        // Limpar selects (setar para o valor padrão)
        $('#staticBackdrop select').val('');
        // Limpar textareas
        $('#staticBackdrop textarea').val('');
    }

    function buscarRegistros(opcao, valorBusca) {
        var registrosJSON = localStorage.getItem('preventivas');
        var registros = [];

        if (registrosJSON) {
            registros = JSON.parse(registrosJSON);
        }
        
        var registrosFiltrados = registros.filter(function (registro) {
            switch (opcao) {
                case 'MO':
                    return registro.Modelo.toUpperCase().includes(valorBusca.toUpperCase());
                case 'NS':
                    return registro.SerialNumber.toLowerCase().includes(valorBusca.toUpperCase());
                default:
                    return false;
            }
        });

        return registrosFiltrados;
    }

    function atualizarGridComResultados(resultados) {
        // Primeiro, limpa a grid atual
        limparGrid();

        // Adiciona os resultados encontrados na tabela
        resultados.forEach(function (registro) {
            adicionarLinha(
                registro.Setor,
                registro.Equipamento,
                registro.Modelo,
                registro.Data,
                registro.Patrimonio,
                registro.SerialNumber
            );
        });
    }

    function limparFiltro() {
        $('#txtSearch').val('')
        limparGrid()
        carregarRegistros()
    }

    $('#btnPesquisar').click(function () {
        var resultadosPesquisa = buscarRegistros($('#selectPesquisa').val(), $('#txtSearch').val());
        atualizarGridComResultados(resultadosPesquisa)
    })

    $('#btnLimpar').click(function() {
        limparFiltro()  
    })

    var opcoes = [
        'C - CONFORME',
        'N/C - NÃO CONFORME',
        'N/A - NÃO APLICÁVEL',
        'N/L - NÃO LOCALIZADO',
        'P/P - PENDENTE DE PEÇA',
        'ECP - COM PACIENTE'];

    opcoes.forEach(function (item) {
        $('.legendas').append('<option>' + item + '</option>');
    });
    //
    var params;
    function queryString() {
        var loc = location.search.substring(1, location.search.length);
        params = loc.split("?");
    }

    queryString()

    var params_ = {
        "_id": params[0]
    }
    // var jqxhr = $.get("https://webhooks.mongodb-realm.com/api/client/v2.0/app/hosptrade-hgcc-bwoyf/service/HospTrade-HGCC/incoming_webhook/registro-GetById", params_, function (data) {
    //     $(data).each(function (i) {
    //         $('#txtSetor').val(`${data[i].Setor}`)
    //         $('#txtEquipamento').val(`${data[i].Equipamento}`)
    //         $('#txtModelo').val(`${data[i].Modelo}`)
    //         $('#txtPatrimonio').val(`${data[i].Patrimonio}`)
    //         $('#txtNs').val(`${data[i].Ns}`)
    //     });
    // }).done(function () {

    // });
    //
    moment.locale('pt-BR');
    data = moment(new Date()).format("DD/MM/YYYY")
    $('#txtData').val(`${moment(new Date()).format("YYYY-MM-DD")}`)
    $("#btnSalvar").click(function () {
        var parametros = {
            "EquipamentoId": params[0],
            "Data": moment($('#txtData').val()).format(),
            "Setor": $('#txtSetor').val(),
            "Equipamento": $('#txtEquipamento').val(),
            "Modelo": $('#txtModelo').val(),
            "Patrimonio": $('#txtPatrimonio').val(),
            "SerialNumber": $('#txtNs').val(),
            "Obs": $('#txtObs').val(),
            "AbafadoresdeAr": $('#selectAbafadoresdeAr').val(),
            "Bandeja": $('#selectBandeja').val(),
            "CabodeForca": $('#selectCabodeForca').val(),
            "CapadoColchao": $('#selectCapadoColchao').val(),
            "ChaveLigaDesliga": $('#selectChaveLigaDesliga').val(),
            "Colchao": $('#selectColchao').val(),
            "ConjuntodoTrinco": $('#selectConjuntodoTrinco').val(),
            "Filtro": $('#selectFiltro').val(),
            "GuarnicaodaBase": $('#selectGuarnicaodaBase').val(),
            "GuarnicaodaPortinhola": $('#selectGuarnicaodaPortinhola').val(),
            "HastesVerticais": $('#selectHastesVerticais').val(),
            "MangaIris": $('#selectMangaIris').val(),
            "MotorSincrono": $('#selectMotorSincrono').val(),
            "Portinholas": $('#selectPortinholas').val(),
            "RodizioscomFreio": $('#selectRodizioscomFreio').val(),
            "SensorArSeguranca": $('#selectSensorArSeguranca').val(),
            "SensorFaltaVentilacao": $('#selectSensorFaltaVentilacao').val(),
            "TecladoMembrana": $('#selectTecladoMembrana').val(),
            "Ventoinha": $('#selectVentoinha').val(),
            "VerificacaoAlarmes": $('#selectVerificacaoAlarmes').val()
        }

        var registrosJSON = localStorage.getItem('preventivas');
        var registros = [];

        // Se já houver registros, transformar o JSON em array
        if (registrosJSON) {
            registros = JSON.parse(registrosJSON);
        }

        // Adicionar o novo 'parametros' à lista de registros
        registros.push(parametros);

        // Salvar a lista atualizada no localStorage
        localStorage.setItem('preventivas', JSON.stringify(registros));


        alert('Preventiva salva com sucesso')
        var btnSalvar = document.getElementById('btnSalvar');
        limparCamposModal();
        btnSalvar.setAttribute('data-dismiss', 'modal');
        // window.location.href = "../index.html"
        adicionarLinha(parametros.Setor, parametros.Equipamento, parametros.Modelo, parametros.Data, parametros.Patrimonio, parametros.SerialNumber)

        // var jqxhr = $.post("https://webhooks.mongodb-realm.com/api/client/v2.0/app/hosptrade-hgcc-bwoyf/service/HospTrade-HGCC/incoming_webhook/preventivaIncubadora-Save", parametros, function (data) {

        // }).done(function () {
        //     alert('Preventiva salva com sucesso')
        //     var btnSalvar = document.getElementById('btnSalvar');
        //     btnSalvar.setAttribute('data-dismiss', 'modal');
        //     // window.location.href = "../index.html"
        //     adicionarLinha(parametros.Setor, parametros.Equipamento, parametros.Modelo, parametros.Data, parametros.Patrimonio, parametros.SerialNumber)
        // });
    });

    carregarRegistros();
});